from flask_pymongo import ObjectId


def user_entity(user_data):
    user_details = {
        "id": str(ObjectId(user_data["_id"])),
        "name": user_data["name"],
        "email": user_data["email"],
        "role": user_data["role"],
        "created_on": user_data["created_on"],
        "preferences": user_data["preferences"],
    }
    if user_data.get('phone_number'):
        user_details.update({'phone_number': user_data['phone_number']})
    if "address" in user_data:
        user_details.update({"address": user_data['address']})
    if "selected_store" in user_data:
        user_details.update({"selectedStore": user_data["selected_store"]})
    if "cart" in user_data:
        user_details.update({"cart": user_data["cart"]})
    return user_details


def user_preferences_entity(user):
    user_preferences = user["preferences"]
    del user_preferences['is_onboarding_complete']
    user_preferences.update({"id": str(ObjectId(user["_id"]))})
    return user_preferences


def users_preferences_entity(user_list):
    new_list = []
    for user in user_list:
        new_list.append(user_preferences_entity(user))
    return new_list


def user_store_entity(user_details, is_address_required):
    user_data = {"id": str(ObjectId(user_details["_id"])),
                 "name": user_details["name"],
                 "email": user_details["email"]}

    if is_address_required and user_details.get('address'):
        user_data.update({"delivery_address": user_details["address"]})
    if user_details.get('phone_number'):
        user_data.update({'phone_number': user_details['phone_number']})
    return user_data
