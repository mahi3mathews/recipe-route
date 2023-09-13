from flask_pymongo import ObjectId
from enums.ingredient_type import IngredientType


def ingredient_entity(data):
    return {
        "id": str(ObjectId(data["_id"])),
        "name": data["name"],
        "type": data["type"],
        "calorie": data["calorie"],
    }


def ingredient_type_list_entity(data):
    i_list = []
    for item in data:
        i_list.append(ingredient_entity(item))
    return i_list


def ingredient_list_entity(data):
    i_list = {
        IngredientType.GRAIN.value: [],
        IngredientType.MEAT.value: [],
        IngredientType.VEGETABLE.value: [],
        IngredientType.OIL.value: [],
        IngredientType.LEGUME.value: [],
        IngredientType.DAIRY.value: [],
        IngredientType.FRUIT.value: [],
        IngredientType.EGG.value: [],
        IngredientType.CRUSTACEAN.value: [],
        IngredientType.FISH.value: [],
        IngredientType.NUTS_SEEDS.value: [],
        IngredientType.MOLLUSK.value: [],
        IngredientType.CHOCOLATE.value: [],
        IngredientType.CONDIMENT.value: [],
        IngredientType.PANTRY_STAPLE.value: [],
        IngredientType.SPICE_HERBS.value: [],
        IngredientType.SWEETENER.value: [],
        IngredientType.BAKERY.value: []
    }

    for item in list(data):
        item_type = item["type"]
        if item_type in i_list:
            i_list[item_type].append(ingredient_entity(item))
    return i_list
