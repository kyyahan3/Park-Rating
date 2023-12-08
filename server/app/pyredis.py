import redis, json

conn_pool = redis.ConnectionPool(
    host='127.0.0.1',
    port=6379,
    decode_responses=True,
)

RedisCache = redis.Redis(connection_pool=conn_pool, decode_responses=True)
# check connetion
RedisCache.ping()
print("connect redis success")


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


# define a key
def parkDetailKey(id):
    return "park_detail_%s" % str(id)
def setParkDetail(id, detail):
    value = json.dumps(detail)
    RedisCache.set(parkDetailKey(id), value, ex=60)  # valid for 10 mins 600

# get info in cache
def getParkDetail(id):
    key = parkDetailKey(id)
    detail = RedisCache.get(key)
    if detail is not None:
        return json.loads(detail)
    return None

# delete data from redis
def deleteParkDetail(id):
    key = parkDetailKey(id)
    RedisCache.delete(key)
