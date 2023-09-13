class StoreInventory:
    def __init__(self, store_id):
        self.__store_id = store_id
        self.__inventory = {}

    def set_inventory(self, inventory):
        self.__inventory = inventory

    def update_inventory(self, inventory_data):
        self.__inventory.update(inventory_data)

    def get_inventory(self):
        return {
            "store_id": self.__store_id,
            "inventory": self.__inventory
        }
