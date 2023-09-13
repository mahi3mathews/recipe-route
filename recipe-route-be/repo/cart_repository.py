from db import cart_collection


class CartRepository:
    def __init__(self):
        self.cart = cart_collection

    def add_user_cart(self, data):
        result = self.cart.insert_one(data)
        return result

    def add_to_shopping_list(self, query, data):
        update_data = {"$set": {}}
        for key, value in data.items():
            update_data["$set"]["shopping_list." + key] = value
        result = self.cart.update_one(query, update_data)
        return result

    def get_user_cart(self, user_id):
        result = self.cart.find_one({"user_id": user_id})
        return result

    def update_cart_list(self, query, cart_data):
        result = self.cart.update_one(query, {"$set": cart_data})
        return result


