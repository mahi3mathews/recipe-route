import unittest
from service.ingredient_service import IngredientService
from unittest.mock import MagicMock, patch
from schemas.ingredients import ingredient_list_entity


class TestIngredientService(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.ingredient_service = IngredientService()

    def test_get_all_ingredients(self):
        # Mock the repo method to return a list of ingredients
        mock_ingredients = [
            {"_id": "64cbd6fa66d0e5fe2f4b1b90", "name": "Ingredient 1", "type": "VEGETABLE", "calorie": 50},
            {"_id": "64cbd701d9b42f2182a72c17", "name": "Ingredient 2", "type": "FRUIT", "calorie": 30},
            # Add more ingredients for testing
        ]
        self.ingredient_service.repo.get_all = MagicMock(return_value=mock_ingredients)
        result = self.ingredient_service.get_all_ingredients()
        self.assertEqual(result["code"], 200)
        self.assertEqual(result["response"]["status"], "success")
        self.assertEqual(len(result["response"]["data"]), len(ingredient_list_entity(mock_ingredients)))
        # Add more assertions to check the returned data

    def test_get_ingredients_by_type_existing_type(self):
        # Mock the repo method to return a list of ingredients of the specified type
        i_type = "Vegetable"
        mock_ingredients = [
            {"_id": "64cbd6fa66d0e5fe2f4b1b90", "name": "Ingredient 1", "type": "Vegetable", "calorie": 50},
            {"_id": "64cbd701d9b42f2182a72c17", "name": "Ingredient 3", "type": "Vegetable", "calorie": 40},
            # Add more ingredients of the same type for testing
        ]
        self.ingredient_service.repo.get_by_type = MagicMock(return_value=mock_ingredients)
        result = self.ingredient_service.get_ingredients_by_type(i_type)
        self.assertEqual(result["code"], 200)
        self.assertEqual(result["response"]["status"], "success")
        self.assertEqual(len(result["response"]["data"]), len(mock_ingredients))
        # Add more assertions to check the returned data

    def test_get_ingredients_by_type_non_existing_type(self):
        # Mock the repo method to return an empty list for the specified type
        i_type = "NonExistingType"
        self.ingredient_service.repo.get_by_type = MagicMock(return_value=[])
        result = self.ingredient_service.get_ingredients_by_type(i_type)
        self.assertEqual(result["code"], 404)
        self.assertEqual(result["response"]["status"], "fail")
        # Add more assertions to check the returned data

    # Add more test cases for the remaining methods in IngredientService class


if __name__ == '__main__':
    unittest.main()
