from django.http import HttpResponse
from django.views.decorators.http import require_http_methods
import json, hashlib, time
from bson import binary
from bson.objectid import ObjectId
from . import pymongo


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
    print(id)
    # find the park by id
    park = pymongo.MongoDB.ca_np.find_one({"id": id})   
    # count the number of comments in the park
    comments_num = len(pymongo.MongoDB.comments.find_one({"parkId": id}, {"comments": 1})['comments'])

    data = {"id": park['id'], "fullName": park['fullName'],
            "rating": park['rating'], "comments": comments_num,
            "description": park['description'], "state": park['states'],
            "address": park['addresses'][-1]["line1"],
            "latitude": park['latitude'], "longitude": park['longitude'],
            "images": [img['url'] for img in park['images']] if park['images'] else [''],
            }
    print(data)
    return response(0, "ok", data)

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

    if "user" not in param or param["user"] == "":
        return response(1, "user is required")
    comment['user'] = param['user']



