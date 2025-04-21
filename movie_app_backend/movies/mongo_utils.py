import pymongo
from django.conf import settings

def get_mongo_client():
    client = pymongo.MongoClient(settings.MONGO_URI)
    db = client[settings.MONGO_DB_NAME]
    return client, db

def get_movies_collection():
    _, db = get_mongo_client()
    return db.movies

def get_user_movie_data_collection():
    _, db = get_mongo_client()
    return db.user_movie_data