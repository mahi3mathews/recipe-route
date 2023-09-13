import logging

from repo.cart_repository import CartRepository
from service.ingredient_service import IngredientService
from utils.conversion_rates import conversion_rates_in_gram
from schemas.cart import user_cart_entity

from flask_pymongo import ObjectId


class CartService:
    def __init__(self):
        self.__repo = CartRepository()
        self.__ingredient_service = IngredientService()

    def setup_user_cart(self, user_id):
        return self.__repo.add_user_cart({"user_id": user_id, "cart_list": {}, "shopping_list": {}, 'store_id': ''})

    def get_user_cart_items(self, user_id, raw_data):
        result = user_cart_entity(self.__repo.get_user_cart(user_id))
        if result is not None:
            if raw_data:
                return result
            return {"response": {"message": "Successfully fetched user cart details", "data": result, "status":
                "success"}, "code": 200}
        else:
            return {"response": {"message": "Failed to fetch user cart", "status": "fail"}, "code": 404}

    def add_to_users_shopping_list(self, user_id, ingredient_list):
        cart_data = {}
        existing_cart = self.__repo.get_user_cart(user_id)
        existing_cart_items = existing_cart["shopping_list"]
        ingredient_ids = [ObjectId(ingredient["id"]) for ingredient in ingredient_list if ingredient["id"] is not None]
        ingredient_docs = list(self.__ingredient_service.get_ingredients_by_id_list(ingredient_ids))
        try:
            for ingredient in ingredient_list:
                existing_item = None
                if ingredient["id"] is not None:
                    if ingredient["id"] in existing_cart_items:
                        existing_item = existing_cart_items[ingredient["id"]]
                        ingredient_name = existing_item["name"]
                    if existing_item is None:
                        ingredient_name = [ingredient_doc_item["name"] for ingredient_doc_item in ingredient_docs if
                                           str(ingredient_doc_item["_id"]) in ingredient["id"]]

                        cart_data.update({ingredient["id"]: {
                            "name": ingredient_name[0], "qty": ingredient["qty"], "price": "",
                            "total_price": "", "measurement": ingredient["measurement"]}})
                    elif ingredient["measurement"] in existing_item["measurement"] or \
                            existing_item["measurement"] in ingredient["measurement"]:
                        cart_data.update({ingredient["id"]: {
                            "name": ingredient_name,
                            "qty": float(ingredient["qty"]) + float(existing_item['qty']),
                            "price": '',
                            "total_price": "",
                            "measurement": existing_item["measurement"]
                        }})
                    else:
                        qty_gram = conversion_rates_in_gram(ingredient["measurement"], existing_item["measurement"],
                                                            ingredient["qty"], existing_item["qty"])
                        cart_data.update({existing_item["id"]: {
                            "name": ingredient_name, "qty": qty_gram, "measurement": "grams",
                            "price": existing_item["price"],
                            "total_price": existing_item["price"]}})

            result = self.__repo.add_to_shopping_list({"user_id": user_id}, data=cart_data)
            if result.raw_result.get('ok') > 0 and result.raw_result.get('updatedExisting'):
                return {"response": {"message": 'Successfully added items to cart.', "status": 'success'}, "code": 200}
            else:
                return {"response": {"message": "Failed to add items in cart.", "status": "fail"}, "code": 400}
        except Exception as ex:
            logging.warning(f"{ex}")
            return {"response": {"message": "Failed to add items in cart.", "status": "fail"}, "code": 500}

    @staticmethod
    def __remove_value_pair(dict_obj, value):
        return {key: val for key, val in dict_obj.items() if int(val["qty"]) != value}

    def update_cart_list(self, user_id, store_id, cart_data):
        cart_list = self.__remove_value_pair(cart_data, 0)
        result = self.__repo.update_cart_list({"user_id": user_id}, {"store_id": store_id, "cart_list": cart_list})
        if result.raw_result.get('ok') > 0 and result.raw_result.get('updatedExisting'):
            return {"response": {"message": "Successfully updated the cart list.", "status": 'success'}, 'code': 200}
        return {"response": {"message": "Failed to update the cart list.", "status": 'fail'}, 'code': 500}

    def update_cart_order(self, user_id, cart_order):
        result = self.__repo.update_cart_list({"user_id": user_id}, cart_order)
        if result.raw_result.get('ok') > 0 and result.raw_result.get('updatedExisting'):
            return {"response": {"message": "Successfully updated user's cart.", "status": 'success'}, 'code': 200}
        return {"response": {"message": "Failed to update the cart.", "status": 'fail'}, 'code': 500}

    def update_user_shopping_list(self, user_id, sl_list):
        result = self.__repo.update_cart_list({"user_id": user_id}, {"shopping_list": sl_list})
        if result.raw_result.get('ok') > 0 and result.raw_result.get('updatedExisting'):
            return {"response": {"message": "Successfully updated the cart list.", "status": 'success'}, 'code': 200}
        return {"response": {"message": "Failed to update the cart list.", "status": 'fail'}, 'code': 500}
