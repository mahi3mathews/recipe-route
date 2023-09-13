from db import recipes_collection
from flask_pymongo import ObjectId


class RecipeRepository:
    def __init__(self):
        self.recipes = recipes_collection

    def add_recipe(self, recipe):
        result = self.recipes.insert_one(recipe)
        return result

    def get_recipe(self, r_id):
        result = self.recipes.find_one({"_id": ObjectId(r_id)})
        return result

    def get_all(self):
        result = self.recipes.find()
        return result

    def update_all(self, data_list):
        result = []
        for data in data_list:
            result.append(self.recipes.update_one({"_id": ObjectId(data["_id"])}, {"$set": data}))
        return result

    def remove_one(self, doc_id):
        self.recipes.delete_one({"_id": doc_id})

    def get_collection_size(self):
        return self.recipes.count_documents({})
