from repo.store_repository import StoreRepository
from schemas.stores import store_list_entity, store_entity, store_inventory_entity, inventory_list_entity
from service.store_inventory_service import StoreInventoryService
from enums.record_count import RecordCount
from flask_pymongo import ObjectId

from datetime import datetime


class StoreService:
    def __init__(self):
        self.repo = StoreRepository()
        self.__store_inventory_service = StoreInventoryService()

    def register_store(self, store):
        existing_store = self.repo.get_store({'user_id': store["user_id"]})
        res = {}
        if existing_store:
            res.update({"message": 'Store already registered.',
                        "status": 'fail',
                        })
            code = 401
        else:
            store["created_on"] = datetime.now()
            store["updated_on"] = datetime.now()
            result = self.repo.add_store(store)
            self.__store_inventory_service.add_store_inventory(str(result.inserted_id))
            res.update({"data": str(result.inserted_id), "message": "Store successfully registered",
                        "status": "success"})
            code = 200

        return {"response": res, "code": code}

    def update_store_details(self, store_id, store_details):
        result = self.repo.update_store(store_id, store_details)
        if result.acknowledged:
            return {"response": {"message": "Successfully update store details", "status": 'success'}, 'code': 200}
        return {"response": {"message": "Failed to update store details", "status": 'fail'}, 'code': 500}

    def get_store(self, u_id):
        result = self.repo.get_store({"user_id": u_id})
        return store_entity(result)

    def get_store_details(self, store_id, raw_data):
        result = self.repo.get_store({"_id": ObjectId(store_id)})
        inventory_details = self.__store_inventory_service.get_inventory(store_id)
        res = store_inventory_entity(result, inventory_details)
        if raw_data:
            return res
        if result:
            return {"response": {"message": "Successfully fetched the store.", 'status': 'success', 'data': res},
                    "code": 200}
        else:
            return {"response": {"message": "Failed to fetch the store.", 'status': 'fail'}, "code": 500}

    def get_all_stores(self, page_no, is_raw_data):

        stores = list(self.repo.get_all())

        if is_raw_data:
            return stores

        if not page_no:
            page_number = 1
        else:
            page_number = int(page_no)

        record_count = RecordCount.RECIPES.value
        start_index = (page_number - 1) * record_count
        end_index = start_index + record_count

        return {"response": {"message": "Successfully fetched all stores", "data": {
            "list": list(store_list_entity(stores))[start_index: end_index], "total_records": len(stores)}, "status":
                                 "success"}, "code": 200}

    def update_store_onboarding(self, store_id, store_image, store_inventory_file):
        result_img = {}
        result_file = {}
        res = {'status': 'success'}

        if store_image:
            result_img = self.update_store_details(store_id, {"store_image": store_image})

        if store_inventory_file:
            result_file = self.__store_inventory_service.update_store_inventory(store_id=store_id,
                                                                                inventory_file=store_inventory_file)

        if result_img.get('code') == 200 and result_file.get('code') == 200:
            res.update({"message": 'Successfully updated store image and inventory'})
            code = 200
        elif result_img.get("code") != 200 and result_file.get('code') == 200:
            res.update({"message": 'Successfully updated inventory, but failed to upload store image. Try again'})
            code = 200
        elif result_img.get('code') == 200 and result_file.get("code") != 200:
            res.update(
                {"message": 'Successfully uploaded store image, but failed to update store inventory. Try again'})
            code = 200
        elif result_img.get("code") != 200 and result_file.get('code') != 200 and store_image and store_inventory_file:
            res.update({"message": 'Failed to upload store image and store inventory. Try again after sometime.',
                        "status": 'fail'})
            code = 500
        else:
            res.update({"message": 'No data is provided.', "status": 'fail'})
            code = 400

        return {'response': res, 'code': code}

    def update_store_inventory_order(self, store_id, inventory_stock_list):
        store_details = self.__store_inventory_service.get_inventory(store_id)
        for item_id, purchased_qty in inventory_stock_list.items():
            if item_id in store_details["inventory"]:
                current_stock_qty = store_details["inventory"][item_id]["stock_qty"]
                new_stock_qty = current_stock_qty - purchased_qty
                if new_stock_qty >= 0:
                    store_details["inventory"][item_id]["stock_qty"] = new_stock_qty
                else:
                    print(f"Insufficient stock for item {item_id}")
                    # Handle stock_qty check and inform user not available and return amount

        self.__store_inventory_service.update_store_inventory_stock(store_details["_id"], store_details)

    def get_store_inventory(self, store_id, page):
        stores = self.__store_inventory_service.get_inventory(store_id)
        inventory_list = inventory_list_entity(stores['inventory'])
        if not page:
            page_number = 1
        else:
            page_number = int(page)

        record_count = RecordCount.INVENTORY.value
        start_index = (page_number - 1) * record_count
        end_index = start_index + record_count

        return {"response": {"message": "Successfully fetched store inventory", "data": {
            "list": list(inventory_list)[start_index: end_index], "total_records": len(inventory_list)}, "status":
                                 "success"}, "code": 200}

    def update_store_inventory_item(self, store_id, inventory_item):
        item_id = inventory_item.get('item_id')
        del inventory_item['item_id']
        result = self.__store_inventory_service.update_inventory_item(store_id, item_id=item_id,
                                                                      inventory_data=inventory_item)
        return {"response": {"data": result, "message": "Successfully updated inventory item"}, "code": 200}

    def add_store_inventory_item(self, store_id, inventory_item):
        return self.__store_inventory_service.add_inventory_item(store_id, inventory_item)



