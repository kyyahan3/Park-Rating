''' Mongodb Connection'''
from django.conf import settings
from pymongo import MongoClient

client = MongoClient(
    host=settings.DATABASES["MongoDB"]['HOST'],
    port=int(settings.DATABASES["MongoDB"]['PORT']),
)

MongoDB = client[settings.DATABASES['MongoDB']['NAME']] # db name
MongoDB.command('ping') # test connectivity
print("connect mongo success!")