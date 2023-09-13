import unittest
from service.cart_service import CartService
from unittest.mock import MagicMock, patch
from pymongo.results import UpdateResult


class TestCartService(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.cart_service = CartService()

    def test_setup_user_cart(self):
        user_id = "user123"
        result = self.cart_service.setup_user_cart(user_id)
        self.assertIsNotNone(result)
        # Add additional assertions to check if the cart was created properly

    def test_get_user_cart_items_existing_cart(self):
        user_id = "user123"
        raw_data = False
        # Assuming a cart already exists for this user
        # Mock the repo method to return the expected cart data
        self.cart_service._CartService__repo.get_user_cart = MagicMock(
            return_value={"user_id": user_id, "cart_list": {}, "shopping_list": {}, "store_id": ""})
        result = self.cart_service.get_user_cart_items(user_id, raw_data)
        self.assertEqual(result["code"], 200)
        self.assertEqual(result["response"]["status"], "success")
        # Add additional assertions to check the cart data

    def test_get_user_cart_items_non_existing_cart(self):
        user_id = "user123"
        raw_data = False
        # Assuming a cart does not exist for this user
        # Mock the repo method to return None
        self.cart_service._CartService__repo.get_user_cart = MagicMock(return_value=None)
        result = self.cart_service.get_user_cart_items(user_id, raw_data)
        self.assertEqual(result["code"], 404)
        self.assertEqual(result["response"]["status"], "fail")

    def test_add_to_users_shopping_list(self):
        user_id = "user123"
        ingredient_list = [
            {"id": "64cbd0e4e4c9943e6b3ac354", "name": "Ingredient 1", "qty": 2, "measurement": "teaspoon"},
            {"id": "64cbd0ec0b54c8c7ed2b0949", "name": "Ingredient 2", "qty": 1, "measurement": "tablespoon"}
        ]
        self.cart_service._CartService__ingredient_service.get_ingredients_by_id_list = MagicMock(return_value=[
            {"_id": "64cbd0e4e4c9943e6b3ac354", "name": "Ingredient 1", "measurement": "teaspoon"},
            {"_id": "64cbd0ec0b54c8c7ed2b0949", "name": "Ingredient 2", "measurement": "tablespoon"}
        ])
        # Mock the repo method to return a successful update
        self.cart_service._CartService__repo.add_to_shopping_list = MagicMock()
        self.cart_service._CartService__repo.add_to_shopping_list.return_value = UpdateResult(
            {"ok": 1, 'updatedExisting': True}, acknowledged=True)
        result = self.cart_service.add_to_users_shopping_list(user_id, ingredient_list)
        self.assertEqual(result["code"], 200)
        self.assertEqual(result["response"]["status"], "success")

    def test_update_cart_list(self):
        user_id = "user123"
        store_id = "store123"
        cart_data = {
            "ingredient1": {"name": "Ingredient 1", "qty": 2, "measurement": "teaspoon"},
            "ingredient2": {"name": "Ingredient 2", "qty": 1, "measurement": "tablespoon"}
        }
        # Assuming the cart for this user already exists
        # Mock the repo method to return a successful update
        self.cart_service._CartService__repo.update_cart_list = MagicMock()
        self.cart_service._CartService__repo.update_cart_list.return_value = UpdateResult({
            "ok": 1, "updatedExisting": True, "matched_count": 1}, True)
        result = self.cart_service.update_cart_list(user_id, store_id, cart_data)
        self.assertEqual(result["code"], 200)
        self.assertEqual(result["response"]["status"], "success")
        # Add additional assertions to check if the cart was updated properly

    # Add more test cases for the remaining methods in CartService class


if __name__ == '__main__':
    unittest.main()
