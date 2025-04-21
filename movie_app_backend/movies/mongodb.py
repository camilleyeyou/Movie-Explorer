import pymongo
from django.conf import settings
import os

class MongoDBManager:
   
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MongoDBManager, cls).__new__(cls)
            
            mongo_uri = os.getenv('MONGO_URI')
            db_name = os.getenv('MONGO_DB_NAME', 'movie_app_db')
            
            print(f"Connecting to MongoDB: {db_name}")
            
            cls._instance.client = pymongo.MongoClient(mongo_uri)
            cls._instance.db = cls._instance.client[db_name]
            
            cls._instance.movies = cls._instance.db.movies
            cls._instance.user_movie_data = cls._instance.db.user_movie_data
            
            try:
                cls._instance.client.admin.command('ping')
                print("MongoDB connection successful!")
            except Exception as e:
                print(f"MongoDB connection error: {e}")
            
        return cls._instance

mongodb = MongoDBManager()