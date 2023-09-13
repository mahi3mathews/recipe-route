from enums.order_type import OrderType
from enums.order_status import OrderStatus
from enums.payment_status import PaymentStatus
from repo.order_repository import OrderRepository
from service.cart_service import CartService
from service.store_service import StoreService
from schemas.orders import order_list_user_entity, order_list_store_entity
from flask_pymongo import ObjectId


class OrderService:
    def __init__(self):
        self.__repo = OrderRepository()
        self.__cart_service = CartService()
        self.__store_service = StoreService()

    def add_user_order(self, user_id, payment_id, order_type):
        # set payment id as key in the orders
        new_cart_details = {}
        required_order_details = {"user_id": user_id, "payment_id": payment_id}
        total_price = 0
        cart_items = self.__cart_service.get_user_cart_items(user_id, True)
        store_id = None
        required_order_details['order_type'] = OrderType.PICKUP.value  # OrderType[
        # order_type].value
        required_order_details['payment_status'] = PaymentStatus.PAID.value
        required_order_details['status'] = OrderStatus.WAITING.value
        if "store_id" in cart_items:
            required_order_details["store_id"] = cart_items['store_id']
            store_id = cart_items['store_id']
            inventory_cart_items = {}
        if "cartList" in cart_items:
            required_order_details["order_items"] = cart_items['cartList']
            for item in cart_items['cartList']:
                total_price += round(float(cart_items['cartList'][item]['total_price']), 2)
                inventory_cart_items.update({item: cart_items['cartList'][item]['qty']})
            required_order_details['total_price'] = round(total_price, 2)
        if 'shoppingList' in cart_items:
            cart_list_ids = [key_id for key_id in cart_items['cartList']]
            new_shopping_list = {}
            for item in cart_items['shoppingList']:
                if item not in cart_list_ids:
                    new_shopping_list.update({item: cart_items["shoppingList"][item]})
            new_cart_details.update({"shopping_list": new_shopping_list, "cart_list": {}, "store_id": ''})

        result = self.__repo.add_order(required_order_details)
        is_success = result.inserted_id
        result_cart_order = self.__cart_service.update_cart_order(user_id=user_id, cart_order=new_cart_details)
        if is_success:
            self.__store_service.update_store_inventory_order(store_id, inventory_cart_items)
        if result_cart_order['code'] != 200 and is_success:
            return {"response": {"message": "Successfully placed an order, but failed to update cart.", "status":
                    'success', "data": str(result)}, "code": 200}
        if result:
            return {"response": {"message": "Successfully placed an order.", "status": 'success',
                                 "data": str(result)}, "code": 200}
        else:
            return {"response": {"message": "Failed to place an order.", "status": 'fail'}, "code": 500}

    def get_user_orders(self, user_id, is_raw_data):
        output = {"response": {"message": "", 'status': 'success'}, 'code': 200}
        res_data = self.__repo.get_user_orders(user_id)
        if is_raw_data:
            return res_data;
        res = order_list_user_entity(res_data, self.__store_service.get_all_stores(0, True))
        if len(res) <= 0:
            output['response']['message'] = 'No orders placed.'
        else:
            output['response']['message'] = 'Successfully fetched all orders of user'
            output['response']['data'] = res
        return output

    def get_store_orders(self, store_id, user_list):
        all_orders = list(self.__repo.get_store_orders(store_id))
        output = {"response": {"message": 'No orders found for the store', "status": 'success', 'data': []}, "code": 200
                  }

        if len(all_orders) >= 0:
            output['response']['message'] = 'Successfully fetched all orders for the store.'
            output['response']['data'] = order_list_store_entity(all_orders, user_list)

        return output

    def update_order_status(self, store_id, order_id, status):
        res = self.__repo.update_order({"_id": ObjectId(order_id), "store_id": store_id}, {"status": status})
        if res.raw_result.get("ok") > 0 and res.raw_result.get("updatedExisting"):
            return {"response": {"message": "Successfully updated the order status.", "status": 'success'}, "code": 200}
        else:
            return {"response": {"message": "Failed to update the order status.", "status": 'fail'}, "code": 500}
