from flask_pymongo import ObjectId


def store_entity(store):
    store_details = {
        "id": str(ObjectId(store["_id"])),
        "storeName": store["store_name"],
        "address": store["address"],
        "businessPhonenumber": store["business_phonenumber"],

    }
    if "store_image" in store:
        store_details.update({"brandImg": store["store_image"]})
    return store_details


def store_list_entity(stores):
    store_list = []
    for store in stores:
        store_list.append(store_entity(store))

    return store_list


def inventory_entity(inventory, show_stock):
    inventory_item = {"item_name": inventory["item_name"], "item_type": inventory["item_type"],
                      "qty_measurement": inventory["qty_measurement"], "unit_price": inventory["unit_price"],
                      "stock_supplier": inventory["stock_supplier"]}
    if "img" in inventory:
        inventory_item.update({"img": inventory["item_img"]})
    if "stock_qty" in inventory and show_stock:
        inventory_item.update({"stock_qty": inventory["stock_qty"]})

    return inventory_item


def inventory_list_entity(inventory_list):
    new_list = []
    for item in inventory_list:
        entity_item = inventory_entity(inventory_list[item], True)
        entity_item.update({'item_id': item})
        new_list.append(entity_item)
    return new_list


def store_inventory_entity(store, inventory):
    store_details = store_entity(store)
    inventory_list = {}
    for inventory_item_id in inventory["inventory"]:
        inventory_list.update({inventory_item_id: inventory_entity(inventory['inventory'][inventory_item_id], False)})
    store_details.update({
        "inventory": inventory_list
    })
    return store_details
