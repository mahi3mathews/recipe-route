import unittest
from service.store_inventory_service import StoreInventoryService
from unittest.mock import MagicMock
from pymongo.results import UpdateResult, InsertOneResult


class TestStoreInventoryService(unittest.TestCase):

    def setUp(self):
        self.store_inventory_service = StoreInventoryService()
        self.store_inventory_service._StoreInventoryService__repo = MagicMock()

    def test_add_store_inventory(self):
        store_id = "64cc28da1c5236ab484f0627"
        self.store_inventory_service._StoreInventoryService__repo.add_inventory.return_value = InsertOneResult('ABC',
                                                                                                               True)
        inserted_id = self.store_inventory_service.add_store_inventory(store_id)
        self.assertIsNotNone(inserted_id)

    def test_update_store_inventory(self):
        store_id = "64cc28da1c5236ab484f0627"
        sample_csv_data = "base64_encoded_csv_data_here,"
        self.store_inventory_service._StoreInventoryService__repo.update_inventory.return_value = UpdateResult(
            raw_result=None, acknowledged=True)
        result = self.store_inventory_service.update_store_inventory(store_id, sample_csv_data)

        self.assertEqual(result["code"], 200)

    def test_update_inventory_item(self):
        # Test updating inventory item
        store_id = "64cc28da1c5236ab484f0627"
        item_id = "item_id_here"
        inventory_data = {
            "item_name": "Sample Item",
            "qty_measurement": "1 kg",
            "stock_qty": 100,
            "item_type": "Grocery",
            "unit_price": 10.0,
            "stock_supplier": "Supplier1"
        }
        self.store_inventory_service._StoreInventoryService__repo.update_inventory.return_value = UpdateResult(None, True)
        result = self.store_inventory_service.update_inventory_item(store_id, item_id, inventory_data)
        self.assertEqual(result["code"], 200)

    def test_get_inventory(self):
        # Test getting inventory for a given store ID
        store_id = "64cc28da1c5236ab484f0627"

        self.store_inventory_service._StoreInventoryService__repo.get_inventory.return_value = {"_id": "ABC"}

        result = self.store_inventory_service.get_inventory(store_id)
        self.assertIsNotNone(result)
        self.assertEqual('ABC', result.get('_id'))

    def test_add_existing_inventory_item(self):
        # Test adding an inventory item
        store_id = "64cc28da1c5236ab484f0627"
        inventory_item = {
            "item_name": "New Item",
            "qty_measurement": "1 unit",
            "stock_qty": 50,
            "item_type": "Other",
            "unit_price": 5.0,
            "stock_supplier": "Supplier2"
        }
        self.store_inventory_service._StoreInventoryService__repo.is_exist.return_value = 1

        result = self.store_inventory_service.add_inventory_item(store_id, inventory_item)

        self.assertEqual(400, result["code"])
        self.assertEqual('Item already exists.', result.get('response').get('message'))
        self.store_inventory_service._StoreInventoryService__repo.update_inventory.assert_not_called()

    def test_add_inventory_item(self):
        # Test adding an inventory item
        store_id = "64cc28da1c5236ab484f0627"
        inventory_item = {
            "item_name": "New Item",
            "qty_measurement": "1 unit",
            "stock_qty": 50,
            "item_type": "Other",
            "unit_price": 5.0,
            "stock_supplier": "Supplier2"
        }
        self.store_inventory_service._StoreInventoryService__repo.is_exist.return_value = 0
        self.store_inventory_service._StoreInventoryService__repo.update_inventory.return_value = UpdateResult(
            {"ok": 1, "updatedExisting": True}, True)
        result = self.store_inventory_service.add_inventory_item(store_id, inventory_item)
        self.assertEqual(result["code"], 200)
        self.store_inventory_service._StoreInventoryService__repo.update_inventory.assert_called_once()


if __name__ == "__main__":
    unittest.main()
