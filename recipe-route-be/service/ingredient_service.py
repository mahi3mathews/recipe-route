from repo.ingredient_repository import IngredientRepository
from data_model.ingredient import Ingredient
from schemas.ingredients import ingredient_entity, ingredient_type_list_entity, ingredient_list_entity

from fuzzywuzzy import process
from flask_pymongo import ObjectId


class IngredientService:
    def __init__(self):
        self.repo = IngredientRepository()
        self.__ingredient_dict = {}

    def add_ingredient(self, name, i_type):
        ingredient = Ingredient(name, i_type)
        return self.repo.add_ingredient(ingredient.get_ingredient())

    def get_ingredients_by_id_list(self, id_list):
        return self.repo.get_by_id_list(id_list)

    def get_all_ingredients(self):
        all_ingredients_cursor = self.repo.get_all()
        all_ingredients = list(all_ingredients_cursor)
        res = {}
        if len(all_ingredients) <= 0:
            res.update({"message": 'No ingredients found.',
                        "status": 'fail',
                        })
            code = 404
        else:
            result = ingredient_list_entity(all_ingredients)
            res.update({"data": result, "message": "All ingredients fetched successfully", "status": "success"})
            code = 200

        return {"response": res, "code": code}

    def get_ingredients_by_type(self, i_type):
        all_ingredients = self.repo.get_by_type(i_type)
        res = {}
        if len(list(all_ingredients)) <= 0:
            res.update({"message": 'No ingredients found.',
                        "status": 'fail',
                        })
            code = 404
        else:
            result = ingredient_type_list_entity(all_ingredients)
            res.update(
                {"data": result, "message": f"All {i_type} ingredients fetched successfully", "status": "success"})
            code = 200

        return {"response": res, "code": code}

    def get_ingredient_by_name(self, name):
        ingredient = self.repo.get_ingredient(name)
        res = {}
        if not ingredient:
            res.update({"message": 'Ingredient not found.',
                        "status": 'fail',
                        })
            code = 404
        else:
            result = ingredient_entity(ingredient)
            res.update(
                {"data": result, "message": f"{name} ingredient fetched successfully", "status": "success"})
            code = 200

        return {"response": res, "code": code}

    def get_ingredient_id(self, name_str):
        if len(self.__ingredient_dict) <= 0:
            ingredient_list = list(self.repo.get_all())
            self.__ingredient_dict = {str(ingredient["name"]).lower(): str(ObjectId(ingredient["_id"]))
                                      for ingredient in ingredient_list}

        matched_ingredient, confidence = process.extractOne(str(name_str).lower(),
                                                            [str(x).lower() for x in self.__ingredient_dict.keys()])

        # Confidence threshold is 86, below which ingredient is not considered
        if confidence > 86:
            ingredient_id = self.__ingredient_dict.get(matched_ingredient)
            return ingredient_id
        return None
