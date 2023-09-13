import unittest
from service.meal_planner_service import MealPlannerService
from unittest.mock import MagicMock, patch
from datetime import datetime


class TestMealPlannerService(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.meal_planner_service = MealPlannerService()

    def test_setup_user_meal_plan_add(self):
        user_id = "user123"
        year = 2023
        month = 8

        # Mock the repo method to simulate successful insertion of meal plan
        mock_repo = MagicMock()
        mock_repo.add_meal_plan.return_value = MagicMock(acknowledged=True)
        with patch.object(self.meal_planner_service, "_MealPlannerService__repo", new=mock_repo):
            result = self.meal_planner_service.setup_user_meal_plan(user_id, year, month)
            self.assertEqual(result["code"], 200)
            self.assertEqual(result["response"]["status"], "success")

    def test_get_meal_plan(self):
        user_id = "user123"
        date_query = {"from": '2023-08-01', "to": '2023-08-07'}

        # Mock the repo method to return a mock meal plan for the specified date range
        mock_repo = MagicMock()
        mock_repo.get_meal_plan.return_value = {
            "AUGUST_2023": {
                "2023-08-01": {
                    "meal_day": "Mon",
                    "meal_date": datetime(2023, 8, 29, 0, 0),
                    "meals": {
                        "Breakfast": {"is_ingredients_added": False, "is_prepped": False},
                        "Lunch": {"is_ingredients_added": False, "is_prepped": False},
                        "Dinner": {"is_ingredients_added": False, "is_prepped": False}
                    }
                },
                "2023-08-02": {
                    "meal_day": "Tue",
                    "meal_date": datetime(2023, 8, 30, 0, 0),
                    "meals": {
                        "Breakfast": {"is_ingredients_added": False, "is_prepped": False},
                        "Lunch": {"is_ingredients_added": False, "is_prepped": False},
                        "Dinner": {"is_ingredients_added": False, "is_prepped": False}
                    }
                },
                # Add more meal plan data for the month
            }
        }
        with patch.object(self.meal_planner_service, "_MealPlannerService__repo", new=mock_repo):
            result = self.meal_planner_service.get_meal_plan(user_id, date_query)
            self.assertEqual(result["code"], 200)
            self.assertEqual(result["response"]["status"], "success")
            # Add more assertions to check the returned data

    # Add more test cases for the remaining methods in MealPlannerService class


if __name__ == '__main__':
    unittest.main()
