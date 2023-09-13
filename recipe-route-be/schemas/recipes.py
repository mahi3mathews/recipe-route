from flask_pymongo import ObjectId


def recipe_entity(recipe):
    entity = {
        "id": str(ObjectId(recipe["_id"])),
        "directions": recipe["directions"],
        "ingredients": recipe["formatted_ingredients"],
        "ingredientsList": recipe["ingredients"],
        "title": recipe["title"],
        "calories": recipe["calories"],
        "description": recipe["desc"]
    }
    if "similarity_score" in recipe:
        entity.update({"similarity_score": recipe["similarity_score"]})
    if "final_score" in recipe:
        entity.update({"similarity_score": recipe["final_score"]})
    return entity


def recipe_list_entity(recipes):
    new_list = []
    for recipe in recipes:
        new_list.append(recipe_entity(recipe))
    return new_list


def recipe_meal_plan_entity(recipe):
    if "is_ingredients_added" in recipe:
        is_ingredient_added = recipe["is_ingredients_added"]
    else:
        is_ingredient_added = False
    return {
        "id": str(ObjectId(recipe["_id"])),
        "ingredientsList": recipe["ingredients"],
        "title": recipe["title"],
        "calories": recipe["calories"],
        "description": recipe["desc"],
        "is_ingredients_added": is_ingredient_added
    }


def user_created_recipe_entity(recipe_details, user_id):
    ingredients_str = ' '.join([ingredient["ingredient"] for ingredient in recipe_details['formatted_ingredients']])
    return {
        "user_id": user_id,
        "directions": recipe_details["directions"],
        "ingredients": recipe_details["ingredients"],
        "formatted_ingredients": recipe_details["formatted_ingredients"],
        "title": recipe_details["title"],
        "calories": recipe_details["calories"],
        "description": recipe_details["desc"],
        "all_ingredients": ingredients_str
    }