def cart_ingredient_entity(ingredient, qty):
    return {
        "name": ingredient["ingredient"],
        "qty": qty,
        "id": ingredient["id"]
    }


def user_cart_entity(cart):
    cart_entity = {}
    if cart:
        if cart.get("cart_list"):
            cart_entity.update({"cartList": cart["cart_list"]})
        if cart.get("shopping_list"):
            cart_entity.update({"shoppingList": cart["shopping_list"]})
        if cart.get("store_id"):
            cart_entity.update({"store_id": cart["store_id"]})
        return cart_entity
    else:
        return None
