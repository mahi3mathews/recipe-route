import unittest
from unittest.mock import patch, MagicMock
from service.recommendation_service import RecommendationService
import pandas as pd
from flask_pymongo import ObjectId


class TestRecommendationService(unittest.TestCase):

    def setUp(self):
        self.mock_ingredients = {
            "soy sauce": "64cc0d590b089494d30111d0",
            "water": "64cc0e8ad5b0a20fd40101d1",
            "chilli powder": "64cc0e92849431bb9f1f6e7b",
            "sugar": "64cc0e999abf42b6ae5fd6c5",
            "cucumber": "64cc1983da014172ef6b7852",
            "tomato": "64cc1995a77576259979157a",
            "onion": "64cc1995a77576259979153l",
            "paprika": "64cc1995a77576259979153a"
        }

        self.recipes = [
            {
                "_id": ObjectId("64cbfd31c7812a6675bdd052"),
                "title": "Recipe 1",
                "ingredients": ["1 cup of sugar", "1 cup of water"],
                "directions": ["step1", "step2"],
                "desc": "Description of recipe 1",
                "formatted_ingredients": [{"ingredient": 'sugar', "qty": 1, "measurement": "cup",
                                           "id": "64cc0e999abf42b6ae5fd6c5"},
                                          {"ingredient": 'water', "qty": 1, "measurement": "cup",
                                           "id": "64cc0e8ad5b0a20fd40101d1"}],
                "categories": ["category1"],
                "all_ingredients": 'sugar, water',
                "calories": 300
            },
            {
                "_id": ObjectId("64cbffeb9526faa1acf0dec4"),
                "title": "Recipe 2",
                "ingredients": ["1 cup of chilli powder", "1 cup of soy sauce"],
                "directions": ["step3", "step4"],
                "formatted_ingredients": [{"ingredient": 'chilli powder', "qty": 1, "measurement": "cup",
                                           "id": "64cc0d590b089494d30111d0"},
                                          {"ingredient": 'soy sauce', "qty": 1, "measurement": "cup",
                                           "id": "64cc0e92849431bb9f1f6e7b"}],
                "desc": "Description of recipe 2",
                "all_ingredients": 'chilli powder, soy sauce',
                "categories": ["category2"],
                "calories": 500
            },
            {
                "_id": ObjectId("64cbffeb9526faa1acf0dea8"),
                "title": "Recipe 3",
                "ingredients": ["1 cup of cucumber", "1 cup of tomato"],
                "directions": ["step3", "step4"],
                "formatted_ingredients": [{"ingredient": 'cucumber', "qty": 1, "measurement": "cup",
                                           "id": "64cc1983da014172ef6b7852"},
                                          {"ingredient": 'tomato', "qty": 1, "measurement": "cup",
                                           "id": "64cc1995a77576259979157a"}],
                "desc": "Description of recipe 3",
                "all_ingredients": 'cucumber, tomato',
                "categories": ["category2"],
                "calories": 500
            },
            {
                "_id": ObjectId("64cc2cfda45a1bd66d363ef7"),
                "title": "Recipe 4",
                "ingredients": ["1 cup of onion", "1 cup of paprika"],
                "directions": ["step3", "step4"],
                "formatted_ingredients": [{"ingredient": 'onion', "qty": 1, "measurement": "cup",
                                           "id": "64cc1983da014172ef6b7852"},
                                          {"ingredient": 'paprika', "qty": 1, "measurement": "cup",
                                           "id": "64cc1995a77576259979153a"}],
                "desc": "Description of recipe 3",
                "all_ingredients": 'onion, paprika',
                "categories": ["category2"],
                "calories": 500
            },

        ]
        self.mock_cache_service = MagicMock()
        self.mock_cache_service.get_cache.return_value = True
        self.mock_recipe_service = MagicMock()
        self.mock_ingredient_service = MagicMock()
        self.mock_user_service = MagicMock()
        self.mock_ingredient_service.get_ingredient_id = lambda ingredient_name: self.mock_ingredients.get(
            ingredient_name)

        self.mock_recipe_service.get_all_recipes.return_value = self.recipes
        self.recommendation_service = RecommendationService(cache_service=self.mock_cache_service,
                                                            recipe_service=self.mock_recipe_service,
                                                            ingredient_service=self.mock_ingredient_service,
                                                            user_service=self.mock_user_service,
                                                            is_service_provided=True
                                                            )

    def test_content_based_filtering(self):
        user_data = {
            "allergens_and_not_preferred": ["64cc0e8ad5b0a20fd40101d1", "64cc14932e23c7bb458ac65e"],
            "favorites": ["64cbffeb9526faa1acf0dec4"]
        }

        # Call the content_based_filtering method
        result_df = self.recommendation_service._RecommendationService__content_based_filtering(user_data)



        self.assertIsInstance(result_df, pd.DataFrame)
        # Ensure that Recipe 1 is not in the filtered results as it is in the user's favorites
        self.assertNotIn(ObjectId("64cbfd31c7812a6675bdd052"), result_df["_id"].values)
        self.assertIn(ObjectId("64cbffeb9526faa1acf0dea8"), result_df['_id'].values)
        # Ensure that Recipe 2 is in the filtered results as it does not contain allergens_and_not_preferred ingredients
        self.assertIn(ObjectId("64cbffeb9526faa1acf0dec4"), result_df["_id"].values)

        # Ensure that the filtered results are sorted by similarity_score in descending order
        self.assertTrue(all(result_df.iloc[i]["similarity_score"] >= result_df.iloc[i + 1]["similarity_score"]
                            for i in range(len(result_df) - 1)))

    def test_collaborative_filtering(self):
        # Define mock user data
        current_user = {
            "id": "64cc28ca219a2cca4e3d87aa",
            "favorites": ["64cbfd31c7812a6675bdd052", "64cbffeb9526faa1acf0dec4"],
            "allergens_and_not_preferred": ["64cc1995a77576259979153a", "64cc1995a77576259979153l"]
        }

        result = self.recommendation_service._RecommendationService__collaborative_filtering([
            {
                "id": ObjectId("64cc28d5616e5921c40dbe68"),
                "favorites": ["64cbfd31c7812a6675bdd052", "64cbffeb9526faa1acf0dea8"],
                "allergens_and_not_preferred": ["64cc1995a77576259979153a"]
            },
            {
                "id": ObjectId("64cc28da1c5236ab484f0627"),
                "favorites": ["64cbffeb9526faa1acf0dec4", "64cbffeb9526faa1acf0dea8"],
                "allergens_and_not_preferred": ["64cc1995a77576259979153a"]
            },
            {
                "id": ObjectId("64cc28e0dcf066a5e81f914f"),
                "favorites": ["64cc2cfda45a1bd66d363ef7"],
                "allergens_and_not_preferred": ["64cc0e8ad5b0a20fd40101d1"]
            }
        ], current_user)

        self.assertIn('64cbffeb9526faa1acf0dea8', result)

    def test_recommendation_system(self):
        other_users = [
            {
                "id": ObjectId("64cc28d5616e5921c40dbe68"),
                "favorites": ["64cbfd31c7812a6675bdd052", "64cbffeb9526faa1acf0dea8"],
                "allergens_and_not_preferred": ["64cc1995a77576259979153a"]
            },
            {
                "id": ObjectId("64cc28da1c5236ab484f0627"),
                "favorites": ["64cbffeb9526faa1acf0dec4", "64cbffeb9526faa1acf0dea8"],
                "allergens_and_not_preferred": ["64cc1995a77576259979153a"]
            },
            {
                "id": ObjectId("64cc28e0dcf066a5e81f914f"),
                "favorites": ["64cc2cfda45a1bd66d363ef7"],
                "allergens_and_not_preferred": ["64cc0e8ad5b0a20fd40101d1"]
            }
        ]

        current_user = {
            "id": "64cc28ca219a2cca4e3d87aa",
            "favorites": ["64cbfd31c7812a6675bdd052", "64cbffeb9526faa1acf0dec4"],
            "allergens_and_not_preferred": ["64cc1995a77576259979153a", "64cc1995a77576259979153l"]
        }

        result = self.recommendation_service._RecommendationService__recommendation_system(other_users, current_user)

        actual_recommendation_list = result.to_dict(orient="records")
        e_recipe_list = [self.recipes[0], self.recipes[1], self.recipes[2]]
        for e_recipe in e_recipe_list:
            self.assertTrue(any(str(recipe["_id"]) == str(e_recipe["_id"]) for recipe in actual_recommendation_list))


if __name__ == '__main__':
    unittest.main()
