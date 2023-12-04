''' Mongodb Connection'''

from pymongo import MongoClient

client = MongoClient(host="localhost", port=27017)

MongoDB = client['npdatabase'] # db name
MongoDB.command('ping') # test connectivity
print("connect mongo success!")