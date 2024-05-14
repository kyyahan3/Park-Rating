from django.conf import settings
import redis, json

conn_pool = redis.ConnectionPool(
    host=settings.DATABASES['Redis']['HOST'], # 127.0.0.1'
    port=int(settings.DATABASES['Redis']['PORT']),
    decode_responses=True,
)

RedisCache = redis.Redis(connection_pool=conn_pool, decode_responses=True)
# check connetion
RedisCache.ping()
print("connect redis success")


##########################
# For The Main collection
##########################
def setParkList(park_list):
    value = json.dumps(park_list)
    RedisCache.set("park_list", value, ex=15)  # valid for 10 mins: 600

# get info in cache
def getParkList():
    park_list = RedisCache.get("park_list")
    if park_list is not None:
        return json.loads(park_list)
    return None
def deleteParkList():
    RedisCache.delete("park_list")


##########################
# For The Temp collection
##########################
# cache for the user input new park data
def setTmpParkList(park_list):
    value = json.dumps(park_list)
    RedisCache.set("tmp_park_list", value, ex=15) 

def getTmpParkList():
    park_list = RedisCache.get("tmp_park_list")
    if park_list is not None:
        return json.loads(park_list)
    return None
def deleteTmpParkList():
    RedisCache.delete("tmp_park_list")


##########################
# Get info in cache
##########################
# define a key
def parkDetailKey(id, tmp=False):
    prefix = "tmp_park_detail_" if tmp else "park_detail_"
    return "%s%s" % (prefix, str(id))

def setParkDetail(id, detail, tmp=False):
    value = json.dumps(detail)
    RedisCache.set(parkDetailKey(id, tmp), value, ex=60)  # valid for 10 mins 600

# get info in cache
def getParkDetail(id, tmp=False):
    key = parkDetailKey(id, tmp)
    detail = RedisCache.get(key)
    if detail is not None:
        return json.loads(detail)
    return None

# delete data from redis
def deleteParkDetail(id, tmp=False):
    key = parkDetailKey(id, tmp)
    RedisCache.delete(key)




