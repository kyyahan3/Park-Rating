from django.http import HttpResponse
from django.views.decorators.http import require_http_methods
import json, hashlib, time
from datetime import datetime, timezone
from bson import binary
from bson.objectid import ObjectId
from . import pymongo, pyredis

def response(code: int, message: str, data: any = None):
    body = {"code": code, "message": message, "data": {}}
    if data is not None:
        if hasattr(data, '__dict__'):
            body['data'] = data.__dict__
        else:
            body['data'] = data

    # convert to JSON
    return HttpResponse(json.dumps(body, sort_keys=True, ensure_ascii=False))


# add park
@require_http_methods('POST')
def add_park(request):
    param = json.loads(request.body.decode('utf-8'))

    if str(param) == '':
        return response(1, "parameters cannot be null.")

    park = {
        "id": "", "fullName": "", "description": "", "state": "", "latitude": "", "longitude": "",
        "images": [], "addtime": int(time.time())
    }

    # required parameters
    if 'fullName' not in param or 'description' not in param or 'state' not in param:
        return response(1, "fullName, state and description cannot be null.")
    park['fullName'], park['state'], park['description'] = param['fullName'], param['state'], param['description']

    # optional parameters
    if 'latitude' in param and 'longitude' in param:
        park['latitude'], park['longitude'] = param['latitude'], param['longitude']

    if 'images' in param:
        park['images'] = param['images']

    ret = pymongo.MongoDB.ca_np.insert_one(park)

    return response(0, "ok", {"id": str(ret.inserted_id)})


# uplaod image
@require_http_methods('POST')
def upload_image(request):
    f = request.FILES['file']
    body = f.read()
    md5 = hashlib.md5(body).hexdigest()
    filetype = f.content_type
    # avoid duplicates
    img = pymongo.MongoDB.images.find_one({"md5": md5})
    if img is not None:
        return response(0, "ok", {"id": str(img["_id"])})

    ret = pymongo.MongoDB.images.insert_one({"md5": md5, "type": filetype, "body": binary.Binary(body)})
    return response(0, "ok", {"id": str(ret.inserted_id)})


# get image
@require_http_methods('GET')
def get_image(request):
    id = request.GET.get('id', "")
    img = pymongo.MongoDB.images.find_one({"_id": ObjectId(id)})
    if img is None:
        return response(100, "image not exists.")

    return HttpResponse(img['body'], img['type'])


# get camp list
@require_http_methods('GET')
def get_park_list(request):
    parks = []
    data = pymongo.MongoDB.ca_np.find({}, {"id": 1, "fullName": 1, "rating": 1, "description": 1, "states": 1,
                                           "images": 1}).limit(12)
    print(data)
    for x in data:
        print(x)
        parks.append({
            "id": x['id'], "fullName": x['fullName'],
            "rating": x['rating'], "state": x['states'],
            "description": x['description'],
            "imageUrl": [img['url'] for img in x['images']]
        })
    return response(0, "ok", parks)


@require_http_methods('GET')
def get_park_detail(request):
    id = request.GET.get("id", "")
    park = {}
    # check in redis first. return if exists
    detail = pyredis.getParkDetail(id)
    if detail is not None:
        print("find by redis.")
        return response(0, "ok", detail)

    # else, read from mongo. If found, updates in the cache and return the content
    # find the park by id
    data = pymongo.MongoDB.ca_np.find_one({"id": id})
    # count the number of comments in the park
    comments_num = len(pymongo.MongoDB.comments.find_one({"parkId": id}, {"comments": 1})['comments'])

    park = {"id": data['id'], "fullName": data['fullName'],
            "rating": data['rating'], "comments": comments_num,
            "description": data['description'], "state": data['states'],
            "address": data['addresses'][-1]["line1"],
            "latitude": data['latitude'], "longitude": data['longitude'],
            "images": [img['url'] for img in data['images']] if data['images'] else [''],
            }
    pyredis.setParkDetail(id, park)
    print("find by mongo.")
    return response(0, "ok", park)

def findCommentByID(id):
    coms = []
    for com in comments_data:
        if com['parkId'] == id:
            coms.append(com)
    return coms
@require_http_methods("GET")
def get_comments(request):
    parkID = request.GET.get("parkID", "")
    comments = []
    data = pymongo.MongoDB.comments.find_one({"parkId": parkID})

    sorted_data = sorted(data['comments'], key=lambda x: x["time"], reverse=True)

    for com in sorted_data:
        human_time = datetime.fromtimestamp(int(com['time']), timezone.utc)

        comments.append({
            "parkId": parkID,
            "author_name": com['author_name'],
            "rating": float(com['rating']),
            "time": human_time.strftime('%Y-%m-%d %H:%M'),
            "text": com['text'],
        })

    return response(0, "ok", comments)
@require_http_methods('POST')
def add_comment(request):
    if str(request.body, 'utf-8') == "":
        return response(1, "parameters cannot be null")

    comment = {
        "parkId": "", "user": "", "rating": 0,
        "time": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()),
        "text": "",
    }

    param = json.loads(request.body)

    if "parkId" not in param or param["parkId"] == "":
        return response(1, "parkId is required")
    comment['parkId'] = param['parkId']

    park = pymongo.MongoDB.ca_np.find_one({"id": param['parkId']})

    if park is None:
        return response(1, "The parkId is invalid")

    if "user" not in param or param["user"] == "":
        return response(1, "user is required")
    comment['user'] = param['user']

    if "rating" not in param or param["rating"] == "":
        return response(1, "rating is required")
    comment['rating'] = param['rating']

    if "text" not in param or param["text"] == "":
        return response(1, "description is required")
    comment['text'] = param['text']

    pymongo.MongoDB.comments.insert_one(comment)

    avgRating = int(((park['rating'] * park['comments']) + comment['rating'])/(park['comments']+1))
    pymongo.MongoDB.ca_np.update_one({"id": param['parkId']}, {'$inc':{"comments":1}, "$set":{"rating":avgRating}})

    # If any comment is updated, delete the cache
    pyredis.setParkDetail(param['parkId'])
    return response(0, "ok")


