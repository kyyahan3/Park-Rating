from django.http import HttpResponse
from django.views.decorators.http import require_http_methods
import json, hashlib, time
from datetime import datetime, timezone
from bson import binary
from bson.objectid import ObjectId
from . import pymongo, pyredis
from .help_functions import format_opening_hours

# format the response
def response(code: int, message: str, data: any = None):
    body = {"code": code, "message": message, "data": {}}
    if data is not None:
        if hasattr(data, '__dict__'):
            body['data'] = data.__dict__
        else:
            body['data'] = data

    return HttpResponse(json.dumps(body, sort_keys=True, ensure_ascii=False))


# add a new park
@require_http_methods('POST')
def add_park(request):
    param = json.loads(request.body.decode('utf-8'))

    if str(param) == '':
        return response(1, "parameters cannot be null.")

    park = {
        "id": "", "fullName": "", "description": "", "states": "", "latitude": "", "longitude": "",
        "images": [], "addtime": int(time.time())
    }

    # required parameters
    if 'fullName' not in param or 'description' not in param or 'state' not in param or "rating" not in param:
        return response(1, "fullName, state, rating and description are required.")
    park['id'], park['fullName'], park['states'] = param['id'], param['fullName'], param['state']
    park['description'], park['rating'] = param['description'], param['rating']

    # optional parameters
    if 'latitude' in param and 'longitude' in param:
        park['latitude'], park['longitude'] = param['latitude'], param['longitude']

    if 'images' in param:
        park['images'] = param['images']

    ret = pymongo.MongoDB.ca_np.insert_one(park)
    # delete in cache
    pyredis.deleteParkList()

    return response(0, "ok", {"id": str(ret.inserted_id)})


# uplaod a image
@require_http_methods('POST')
def upload_image(request):
    f = request.FILES['image']
    body = f.read()
    md5 = hashlib.md5(body).hexdigest()
    filetype = f.content_type
    # avoid duplicates by checking hash
    img = pymongo.MongoDB.images.find_one({"md5": md5})
    if img is not None:
        print("image exists!")
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


# get park list
@require_http_methods('GET')
def get_park_list(request):
    parks = []
    # check in redis first
    data = pyredis.getParkList()
    if data is not None:
        print("park_list find by redis.")
        return response(0, "ok", data)

    data = pymongo.MongoDB.ca_np.find({}, {"id": 1, "fullName": 1, "rating": 1, "description": 1, "states": 1, "images": 1})
    print("park_list find by mongo.")

    for x in data:
        # print(x)
        parks.append({
            "id": x['id'], "fullName": x['fullName'],
            "rating": x['rating'], "state": x['states'],
            "description": x['description'],
            "imageUrl": [img['url'] for img in x['images']]
        })
    pyredis.setParkList(parks)
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
    data = pymongo.MongoDB.ca_np.find_one({"id": id})

    # count the number of comments in the park
    entrance_fee = data['entranceFees'] if "entranceFees" in data else []
    if len(entrance_fee) > 0:
        entrance_fee = entrance_fee[0]['cost']
    else:
        entrance_fee = "FREE"

    if "comments" in data:
        comments_num = len(pymongo.MongoDB.comments.find_one({"parkId": id}, {"comments": 1})['comments'])
    else:
        comments_num = 0

    park = {"id": data['id'], "fullName": data['fullName'],
            "rating": data['rating'], "comments": comments_num,
            "description": data['description'], "state": data['states'],
            "address": data['directionsInfo'] if 'directionsInfo' in data else "",
            "activities": ', '.join(data['activities']) if 'activities' in data else "",
            "entrance_fee": entrance_fee,
            "opening_hours": format_opening_hours(data['operatingHours'][-1]['standardHours']) if "operatingHours" in data else "",
            "latitude": data['latitude'], "longitude": data['longitude'],
            "images": [img['url'] for img in data['images']] if data['images'] else [''],
            }
    pyredis.setParkDetail(id, park)
    print("find by mongo.")
    return response(0, "ok", park)


@require_http_methods("GET")
def get_comments(request):
    parkID = request.GET.get("parkID", "")
    comments = []
    data = pymongo.MongoDB.comments.find_one({"parkId": parkID})
    if not data or 'comments' not in data:
        return response(0, "ok", comments)

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
    print(request)
    if str(request.body, 'utf-8') == "":
        return response(1, "parameters cannot be null")

    comment = {
        "author_name": "", "rating": 0,
        "time": int(time.time()),
        "text": "",
    }

    param = json.loads(request.body)['data']
    # print(param)

    if "parkId" not in param or param["parkId"] == "":
        return response(1, "parkId is required")
    park = pymongo.MongoDB.ca_np.find_one({"id": param['parkId']})

    if park is None:
        return response(1, "The parkId is invalid")

    if "user" not in param or param["user"] == "":
        return response(1, "user is required")
    comment['author_name'] = param['user']

    if "rating" not in param or param["rating"] == "":
        return response(1, "rating is required")
    comment['rating'] = param['rating']

    if "text" not in param or param["text"] == "":
        return response(1, "description is required")
    comment['text'] = param['text']

    # pymongo.MongoDB.comments.insert_one(comment)
    pymongo.MongoDB.comments.update_one({"parkId": param['parkId']}, {"$push": {"comments": comment}})
    print(type(park['rating']), type(park['comments']))
    avg_rating = round(float(((float(park['rating']) * park['comments']) + comment['rating'])/(park['comments']+1)), 1)
    print(avg_rating)

    pymongo.MongoDB.ca_np.update_one({"id": param['parkId']}, {'$inc':{"comments":1}, "$set":{"rating":avg_rating}})

    # If any comment is updated, delete the cache
    pyredis.deleteParkDetail(param['parkId'])
    return response(0, "ok")

# get park opening hours
@require_http_methods('GET')
def search_park_opening_hours(request):
    id = request.GET.get("id", "")
    park = {}
    # check in redis first. return if exists
    detail = pyredis.getParkDetail(id)
    # print(detail)
    if detail is not None:
        print("find by redis.")
        return response(0, "ok", detail)

    # else, read from mongo. If found, updates in the cache and return the content
    data = pymongo.MongoDB.ca_np.find_one({"id": id})

    park = {"fullName": data['fullName'], "opening_hours": data['operatingHours'][-1]['standardHours']}
    # print("find by mongo.")
    return response(0, "ok", park)

# get park entrance fee
@require_http_methods('GET')
def search_park_entrance_fee(request):
    id = request.GET.get("id", "")
    park = {}
    # check in redis first. return if exists
    detail = pyredis.getParkDetail(id)
    if detail is not None:
        print("find by redis.")
        return response(0, "ok", detail)

    # else, read from mongo. If found, updates in the cache and return the content
    data = pymongo.MongoDB.ca_np.find_one({"id": id})

    entrance_fee = data['entranceFees']
    if len(entrance_fee)>0:
        entrance_fee = entrance_fee[0]['cost']
    else:
        entrance_fee = "FREE"

    park = {"fullName": data['fullName'], "entrance_fee": entrance_fee}
    print("find by mongo.")
    return response(0, "ok", park)

# search direction info
@require_http_methods('GET')
def search_park_directions(request):
    id = request.GET.get("id", "")
    park = {}
    # check in redis first. return if exists
    detail = pyredis.getParkDetail(id)
    if detail is not None:
        print("find by redis.")
        return response(0, "ok", detail)

    # else, read from mongo. If found, updates in the cache and return the content
    data = pymongo.MongoDB.ca_np.find_one({"id": id})

    park = {"fullName": data['fullName'], "direction_info": data['directionsInfo']}
    print("find by mongo.")
    return response(0, "ok", park)

# get the activities of a park
@require_http_methods('GET')
def search_park_activities(request):
    id = request.GET.get("id", "")
    park = {}
    # check in redis first. return if exists
    detail = pyredis.getParkDetail(id)
    if detail is not None:
        print("find by redis.")
        return response(0, "ok", detail)

    # else, read from mongo. If found, updates in the cache and return the content
    data = pymongo.MongoDB.ca_np.find_one({"id": id})

    park = {"fullName": data['fullName'], "activities": data['activities']}
    print("find by mongo.")
    return response(0, "ok", park)

# get park recent released news
@require_http_methods('GET')
def search_park_news(request):
    parkID = request.GET.get("parkID", "")
    park = []

    park_code = pymongo.MongoDB.ca_np.find_one({"id": parkID}, {'parkCode':1})
    if "parkCode" not in park_code or park_code is None:
        return response(0, "ok", park)

    data = pymongo.MongoDB.newsreleases.find({"relatedParks":{"$elemMatch": {'parkCode':park_code['parkCode']}}})
    # print("news", data)
    if not data:
        return response(1, "no new released", [{"fullName":"", "title":"", "abstract":"", "time":""}])

    for x in data:
        park.append({
            "parkId": parkID,
            "title": x['title'],
            "abstract": x['abstract'],
            "time": x["releaseDate"][:16]
        })

    print("find by mongo.")
    return response(0, "ok", park)

# get park-recommended things to-do
@require_http_methods('GET')
def search_park_thingstodo(request):
    id = request.GET.get("id", "")

    park_code = pymongo.MongoDB.ca_np.find_one({"id": id}, {'parkCode': 1})
    data = pymongo.MongoDB.thingstodo.find_one({"relatedParks": {"$elemMatch": {'parkCode': park_code['parkCode']}}})
    # print("thingstodo", data)

    if not data:
        return response(1, "no things listed", {})

    park = {"fullName": data['relatedParks'][0]['fullName'],
            "title": data['title'],
            "shortDescription": data['shortDescription']
            }

    print("find by mongo.")
    return response(0, "ok", park)

# get park visit center information
@require_http_methods('GET')
def search_visitcenter(request):
    id = request.GET.get("id", "")
    park = {}

    park_code = pymongo.MongoDB.ca_np.find_one({"id": id}, {'parkCode': 1})
    data = pymongo.MongoDB.visitcenter.find_one({'parkCode': park_code['parkCode']})
    # print("visitcenter", data)

    park = {"fullName": data['operatingHours'][0]['name'],
            "direction": data['directionsInfo'],
            "opening_hours": data['operatingHours'][-1]['standardHours'],
            }

    return response(0, "ok", park)
