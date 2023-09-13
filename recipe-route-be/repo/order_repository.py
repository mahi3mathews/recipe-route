from db import order_collection


class OrderRepository:
    def __init__(self):
        self.orders = order_collection

    def add_order(self, order):
        return self.orders.insert_one(order)

    def get_user_orders(self, user_id):
        return self.orders.find({"user_id": user_id})

    def get_all(self):
        return self.orders.find({})

    def get_store_orders(self, store_id):
        return self.orders.find({"store_id": store_id})

    def update_order(self, query, data ):
        return self.orders.update_one(query, {"$set": data})
