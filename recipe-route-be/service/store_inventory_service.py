from repo.store_inventory_repository import StoreInventoryRepository
from data_model.store_inventory import StoreInventory
from service.ingredient_service import IngredientService
import base64
import csv
import io


class StoreInventoryService:
    def __init__(self):
        self.__repo = StoreInventoryRepository()
        self.__ingredient_service = IngredientService()

    def add_store_inventory(self, store_id):
        store_inventory = StoreInventory(store_id)
        result = self.__repo.add_inventory(store_inventory.get_inventory())
        return result.inserted_id

    def __fetch_ingredient_id(self, item_name, item_type):
        existing_ingredient = self.__ingredient_service.get_ingredient_id(item_name)
        if not existing_ingredient:
            i_res = self.__ingredient_service.add_ingredient(item_name, item_type)
            existing_ingredient_id = str(i_res.inserted_id)
        else:
            existing_ingredient_id = str(existing_ingredient)
        return existing_ingredient_id

    def update_store_inventory(self, store_id, inventory_file):
        items = {}
        is_header_row = True

        base64_data = inventory_file.split(",")[1]

        decoded_csv = base64.b64decode(base64_data)
        csv_file = io.StringIO(decoded_csv.decode())
        csv_reader = csv.reader(csv_file)

        for line in csv_reader:
            if is_header_row:
                is_header_row = False
                continue
            if len(line) < 6:
                continue

            item_name = line[0].strip()
            qty_measurement = line[1].strip()
            stock_qty = int(line[2].strip())
            price = float(line[3].strip())
            item_type = line[4].strip()
            stock_supplier = line[5].strip()

            existing_ingredient_id = self.__fetch_ingredient_id(item_name, item_type)
            # Create an item object with the extracted attributes
            item = {existing_ingredient_id: {
                'item_name': item_name,
                'qty_measurement': qty_measurement,
                'stock_qty': stock_qty,
                "item_type": item_type,
                'unit_price': price,
                "stock_supplier": stock_supplier
            }}
            items.update(item)
        if self.__repo.is_exist({"store_id": store_id}):
            result = self.__repo.update_inventory(store_id, {"inventory": items})
        else:
            result = self.__repo.add_inventory({"store_id": str(store_id), "inventory": items})
        if result.acknowledged:
            return {"response": {"message": "Successfully updated inventory.", "status": "success"}, "code": 200}
        return {"response": {"message": "Failed to update inventory.", "status": "fail"}, "code": 500}

    def update_inventory_item(self, store_id, item_id, inventory_data):
        result = self.__repo.update_inventory(store_id, {f"inventory.{item_id}": inventory_data})
        if result.acknowledged:
            return {"response": {"message": "Successfully updated inventory item.", "status": "success"}, "code": 200}
        else:
            return {"response": {"message": "Failed to update inventory item.", "status": "fail"}, "code": 500}

    def get_inventory(self, store_id):
        result = self.__repo.get_inventory(store_id=store_id)
        return result

    def update_store_inventory_stock(self, store_id, inventory_stock):
        result = self.__repo.replace_store_inventory({"store_id": store_id}, inventory_stock)
        return result

    def add_inventory_item(self, store_id, inventory_item):
        item_id = self.__fetch_ingredient_id(inventory_item['item_name'], inventory_item['item_type'])
        is_item_existing = self.__repo.is_exist({f"inventory.{item_id}": {"$exists": True}})
        if int(is_item_existing) > 0:
            return {"response": {"message": "Item already exists.", 'status': 'fail'}, 'code': 400}
        result = self.__repo.update_inventory(store_id, {f"inventory.{item_id}": inventory_item})
        if result.raw_result.get('ok') > 0 and result.raw_result.get('updatedExisting'):
            return {'response': {'message': 'Item added to inventory successfully', 'status': 'success'}, 'code': 200}
        return {'response': {'message': 'Failed to add item in inventory', 'status': 'fail'}, 'code': 500}
