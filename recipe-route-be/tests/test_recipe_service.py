import unittest
from unittest.mock import MagicMock
from service.recipe_service import RecipeService


class TestRecipeService(unittest.TestCase):

    def setUp(self):
        self.recipe_service = RecipeService()
        self.mock_recipe_data = {
            "_id": "64cbfcd25d7a7a77b7fd475e",
            "title": "Test Recipe",
            "desc": "This is a test recipe",
            "calories": 500,
            "directions": "Step 1, Step 2",
            "ingredients": ["ingredient1", "ingredient2"],
            "formatted_ingredients": [{"ingredient": "ingredient1", "amount": "1 cup"}, {"ingredient": "ingredient2",
                                                                                         "amount": "2 cups"}],
        }

    def test_get_all_recipes_success(self):
        # Mock RecipeRepository's get_all() method
        self.recipe_service._RecipeService__repo.get_all = MagicMock(return_value=[self.mock_recipe_data])

        result = self.recipe_service.get_all_recipes(is_raw_data=False)

        self.recipe_service._RecipeService__repo.get_all.assert_called_once()
        self.assertEqual(result["code"], 200)
        self.assertEqual(result["response"]["message"], "Successfully fetched all recipes")
        self.assertEqual(result["response"]["data"], [{
            "id": "64cbfcd25d7a7a77b7fd475e",
            "directions": "Step 1, Step 2",
            "ingredients": [{"ingredient": "ingredient1", "amount": "1 cup"}, {"ingredient": "ingredient2", "amount": "2 cups"}],
            "ingredientsList": ["ingredient1", "ingredient2"],
            "title": "Test Recipe",
            "calories": 500,
            "description": "This is a test recipe",
        }])

    def test_get_all_recipes_empty(self):
        # Mock RecipeRepository's get_all() method to return an empty list
        self.recipe_service._RecipeService__repo.get_all = MagicMock(return_value=[])

        result = self.recipe_service.get_all_recipes(is_raw_data=False)

        self.recipe_service._RecipeService__repo.get_all.assert_called_once()
        self.assertEqual(result["code"], 500)
        self.assertEqual(result["response"]["message"], "Something went wrong. Please try again.")
        self.assertEqual(result["response"]["status"], "fail")

    def test_update_all_recipes_success(self):
        # Mock RecipeRepository's update_all() method
        self.recipe_service._RecipeService__repo.update_all = MagicMock()

        data = [{"_id": "64cbfcd25d7a7a77b7fd475e", "title": "Updated Recipe"}]

        result = self.recipe_service.update_all_recipes(data)

        self.recipe_service._RecipeService__repo.update_all.assert_called_once_with(data)
        self.assertEqual(result["code"], 200)
        self.assertEqual(result["response"]["message"], "Successfully updated all recipes")
        self.assertEqual(result["response"]["status"], "success")

    def test_update_all_recipes_failure(self):
        # Mock RecipeRepository's update_all() method to raise an exception
        self.recipe_service._RecipeService__repo.update_all = MagicMock(side_effect=Exception("Test exception"))

        data = [{"_id": "64cbfcd25d7a7a77b7fd475e", "title": "Updated Recipe"}]

        result = self.recipe_service.update_all_recipes(data)

        self.recipe_service._RecipeService__repo.update_all.assert_called_once_with(data)
        self.assertEqual(result["code"], 500)
        self.assertEqual(result["response"]["message"], "Failed to update all recipes")
        self.assertEqual(result["response"]["status"], "fail")

    def test_get_recipe_formatted(self):
        recipe_id = "64cbfcd25d7a7a77b7fd475e"
        # Mock RecipeRepository's get_recipe() method
        self.recipe_service._RecipeService__repo.get_recipe = MagicMock(return_value=self.mock_recipe_data)

        result = self.recipe_service.get_recipe(recipe_id, is_formatted=True)

        self.recipe_service._RecipeService__repo.get_recipe.assert_called_once_with(recipe_id)
        self.assertEqual(result["code"], 200)
        self.assertEqual(result["response"]["data"], {
            "id": "64cbfcd25d7a7a77b7fd475e",
            "directions": "Step 1, Step 2",
            "ingredients": [{"ingredient": "ingredient1", "amount": "1 cup"}, {"ingredient": "ingredient2", "amount": "2 cups"}],
            "ingredientsList": ["ingredient1", "ingredient2"],
            "title": "Test Recipe",
            "calories": 500,
            "description": "This is a test recipe",
        })

    def test_get_recipe_raw(self):
        recipe_id = "64cbfcd25d7a7a77b7fd475e"
        # Mock RecipeRepository's get_recipe() method
        self.recipe_service._RecipeService__repo.get_recipe = MagicMock(return_value=self.mock_recipe_data)

        result = self.recipe_service.get_recipe(recipe_id, is_formatted=False)

        self.recipe_service._RecipeService__repo.get_recipe.assert_called_once_with(recipe_id)
        self.assertEqual(result, self.mock_recipe_data)

    def test_add_recipe_success(self):
        user_id = "64cbfd31c7812a6675bdd052"
        recipe_data = {
            "title": "New Recipe",
            "desc": "This is a new recipe",
            "calories": 300,
            "directions": "Step 1, Step 2",
            "ingredients": ["ingredient3", "ingredient4"],
            "formatted_ingredients": [{"ingredient": "ingredient3", "amount": "1 cup"}, {"ingredient": "ingredient4",
                                                                                         "amount": "2 cups"}],
        }
        # Mock RecipeRepository's add_recipe() method
        self.recipe_service._RecipeService__repo.add_recipe = MagicMock(return_value=MagicMock(
            inserted_id="64cbfcd25d7a7a77b7fd475e"))

        result = self.recipe_service.add_recipe(user_id, recipe_data)

        self.recipe_service._RecipeService__repo.add_recipe.assert_called_once()
        self.assertEqual(result["code"], 200)
        self.assertEqual(result["response"]["message"], "Successfully added your recipe.")
        self.assertEqual(result["response"]["data"], "64cbfcd25d7a7a77b7fd475e")

    def test_add_recipe_failure(self):
        user_id = "user123"
        recipe_data = {
            "title": "New Recipe",
            "desc": "This is a new recipe",
            "calories": 300,
            "directions": "Step 1, Step 2",
            "ingredients": ["ingredient3", "ingredient4"],
            "formatted_ingredients": [{"ingredient": "ingredient3", "amount": "1 cup"}, {"ingredient": "ingredient4",
                                                                                         "amount": "2 cups"}],
        }
        # Mock RecipeRepository's add_recipe() method to return without inserted_id
        self.recipe_service._RecipeService__repo.add_recipe = MagicMock(return_value=MagicMock(inserted_id=None))

        result = self.recipe_service.add_recipe(user_id, recipe_data)

        self.recipe_service._RecipeService__repo.add_recipe.assert_called_once()
        self.assertEqual(result["code"], 500)
        self.assertEqual(result["response"]["message"], "Failed to add your recipe.")
        self.assertEqual(result["response"]["status"], "success")


if __name__ == "__main__":
    unittest.main()
