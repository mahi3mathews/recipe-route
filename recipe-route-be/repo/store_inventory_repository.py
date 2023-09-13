from db import store_inventory_collection


class StoreInventoryRepository:
    def __init__(self):
        self.__store_inventory = store_inventory_collection

    def add_inventory(self, data):
        result = self.__store_inventory.insert_one(data)
        return result

    def get_inventory(self, store_id):
        result = self.__store_inventory.find_one({"store_id": store_id})
        return result

    def update_inventory(self, store_id, inventory_data):
        result = self.__store_inventory.update_one({"store_id": store_id}, {"$set": inventory_data})
        return result

    def replace_store_inventory(self, query, store_inventory):
        return self.__store_inventory.replace_one(query, store_inventory)

    def is_exist(self, query):
        return self.__store_inventory.count_documents(query)
