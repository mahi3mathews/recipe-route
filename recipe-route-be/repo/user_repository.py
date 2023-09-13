from db import user_collection
from flask_pymongo import ObjectId


class UserRepository:
    def __init__(self):
        self.users = user_collection

    def add_user(self, user):
        result = self.users.insert_one(user)
        return result

    def get_user(self, user_email):
        result = self.users.find_one({"email": user_email})
        return result

    def get_all(self, query):
        result = self.users.find(query)
        return result

    def get_user_by_id(self, user_id):
        result = self.users.find_one({"_id": ObjectId(user_id)})
        return result

    def update_user_details(self, user_id, data):
        result = self.users.update_one({"_id": ObjectId(user_id)}, {"$set": data})
        return result
