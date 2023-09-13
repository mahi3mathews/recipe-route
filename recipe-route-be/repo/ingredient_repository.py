from db import ingredients_collection


class IngredientRepository:
    def __init__(self):
        self.ingredients = ingredients_collection

    def add_ingredient(self, ingredient):
        result = self.ingredients.insert_one(ingredient)
        return result

    def get_ingredient(self, name):
        result = self.ingredients.find({"name": {"$regex": name, "$options": "i"}})
        return result

    def get_by_id_list(self, id_list):
        result = self.ingredients.find({"_id": {"$in": id_list}})
        return result

    def get_by_type(self, i_type):
        result = self.ingredients.find({"type": i_type})
        return result

    def get_all(self):
        result = self.ingredients.find()
        return result
