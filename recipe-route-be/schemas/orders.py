from flask_pymongo import ObjectId
from schemas.stores import store_entity
from schemas.users import user_store_entity
from enums.order_type import OrderType


def order_user_entity(order_item):
    entity = {
        "id": str(ObjectId(order_item["_id"])),
        "payment_id": order_item['payment_id'],
        'order_items': order_item['order_items'],
        'total_price': order_item['total_price'],
    }
    if order_item.get('payment_status'):
        entity.update({'payment_status': order_item['payment_status']})
    if order_item.get('status'):
        entity.update({'status': order_item['status']})
    if order_item.get('order_type'):
        entity.update({'order_type': order_item['order_type']})
    if 'store_details' in order_item:
        entity.update({"store_details": order_item['store_details']})
    if 'user_details' in order_item:
        entity.update({'user_details': order_item['user_details']})
    return entity


def order_list_user_entity(order_list, store_list):
    new_list = []
    for item in list(order_list):
        store = [store_item for store_item in store_list if str(ObjectId(store_item["_id"])) in item['store_id']]
        store_details = {}
        if len(store) > 0:
            store_details = store_entity(store[0])

        new_item = {"store_details": store_details}
        new_item.update(item)
        new_list.append(order_user_entity(new_item))
    return new_list


def order_list_store_entity(order_list, user_list):
    new_list = []
    for item in list(order_list):
        user = [user_item for user_item in user_list if str(ObjectId(user_item["_id"])) in item['user_id']]
        user_details = {}

        if len(user) > 0:
            user_details = user_store_entity(user[0], item.get("order_type") is OrderType.PICKUP.value)
        new_item = {"user_details": user_details}
        new_item.update(item)
        new_list.append(order_user_entity(new_item))
    return new_list
