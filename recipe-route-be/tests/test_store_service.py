import unittest
from service.store_service import StoreService
from unittest.mock import MagicMock
from pymongo.results import InsertOneResult


class TestStoreService(unittest.TestCase):

    def setUp(self):
        self.store_service = StoreService()

    def test_register_store(self):
        self.store_service.repo = MagicMock()
        store = {
            "user_id": "user1",
            "store_name": "My Store",
            "address": "123 Main St",
            "business_phonenumber": "555-1234"
        }
        self.store_service.repo.get_store.return_value = None
        self.store_service.repo.add_store.return_value = InsertOneResult('ABC', True)
        self.store_service._StoreService__store_inventory_service = MagicMock()
        self.store_service._StoreService__store_inventory_service.add_store_inventory.return_value = 'I_ABC'

        result = self.store_service.register_store(store)
        self.assertEqual(result["code"], 200)
        self.assertEqual(result["response"]["status"], "success")
        self.assertEqual('ABC', result['response']['data'])

    def test_update_store_details(self):
        # Mock the StoreRepository class
        self.store_service.repo = MagicMock()

        # Set up test data
        store_id = "64cc28da1c5236ab484f0627"
        store_details = {
            "store_name": "Updated Store",
            "address": "456 New St",
            "business_phonenumber": "555-5678"
        }

        # Mock the update_store method of the StoreRepository class
        self.store_service.repo.update_store.return_value = MagicMock(acknowledged=True)

        # Call the method to be tested
        result = self.store_service.update_store_details(store_id, store_details)

        # Assertions
        self.assertEqual(result["code"], 200)
        self.assertEqual(result["response"]["status"], "success")
        self.store_service.repo.update_store.assert_called_once_with(store_id, store_details)

    def test_update_store_details_failure(self):
        # Mock the StoreRepository class
        self.store_service.repo = MagicMock()
        # Set up test data
        store_id = "64cc28da1c5236ab484f0627"
        store_details = {
            "store_name": "Updated Store",
            "address": "456 New St",
            "business_phonenumber": "555-5678"
        }

        # Mock the update_store method of the StoreRepository class to return failure
        self.store_service.repo.update_store.return_value = MagicMock(acknowledged=False)

        # Call the method to be tested
        result = self.store_service.update_store_details(store_id, store_details)

        # Assertions
        self.assertEqual(result["code"], 500)
        self.assertEqual(result["response"]["status"], "fail")
        self.store_service.repo.update_store.assert_called_once_with(store_id, store_details)


if __name__ == '__main__':
    unittest.main()
