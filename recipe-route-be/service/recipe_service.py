from repo.recipe_repository import RecipeRepository
from schemas.recipes import recipe_list_entity, recipe_entity, user_created_recipe_entity
import logging


class RecipeService:
    def __init__(self):
        self.__repo = RecipeRepository()

    def get_all_recipes(self, is_raw_data):
        response = {}
        all_recipes = list(self.__repo.get_all())
        if len(all_recipes) <= 0:
            if is_raw_data:
                return []
            response.update({"message": "Something went wrong. Please try again.", "status": "fail"})
            code = 500
        else:
            if is_raw_data:
                return all_recipes
            response.update({"message": "Successfully fetched all recipes", "status": "success",
                             "data": recipe_list_entity(all_recipes)})
            code = 200
        return {"response": response, "code": code}

    def update_all_recipes(self, data):
        try:
            self.__repo.update_all(data)
            return {"response": {"message": "Successfully updated all recipes", "status": 'success'}, "code": 200}
        except Exception as ex:
            logging.warning(f"{ex}")
            return {"response": {"message": "Failed to update all recipes", "status": "fail"}, "code": 500}

    def get_recipe(self, recipe_id, is_formatted):
        data = self.__repo.get_recipe(recipe_id)
        if is_formatted:
            return {"response": {"data": recipe_entity(data), "message": "Successfully fetched recipe details.",
                                 "status": 'success'},
                    "code": 200}
        return data

    def add_recipe(self, user_id, recipe_data):
        result = self.__repo.add_recipe(user_created_recipe_entity(recipe_data, user_id=user_id))
        if result.inserted_id:
            return {"response": {"message": "Successfully added your recipe.",
                                 "status": "success", "data": result.inserted_id}, "code": 200}
        else:
            return {"response": {"message": "Failed to add your recipe.", "status": "success"}, "code": 500}

    # def remove_random_recipes(self):
    #     document_ids = [doc['_id'] for doc in self.__repo.get_all()]
    #
    #     # Shuffle the document IDs
    #     random.shuffle(document_ids)
    #
    #     # Remove the first 500 documents from the shuffled list
    #     for doc_id in document_ids[:20160]:
    #         self.__repo.remove_one(doc_id)
    #     pass
