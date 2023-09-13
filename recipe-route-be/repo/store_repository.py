from db import stores_collection
from flask_pymongo import ObjectId


class StoreRepository:
    def __init__(self):
        self.stores = stores_collection

    def add_store(self, store):
        result = self.stores.insert_one(store)
        return result

    def get_store(self, query):
        result = self.stores.find_one(query)
        return result

    def get_all(self):
        result = self.stores.find()
        return result

    def update_store(self, store_id, store_details):
        result = self.stores.update_one({"_id": ObjectId(store_id)}, {"$set": store_details})
        return result
