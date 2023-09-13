from flask import Flask, request, jsonify, make_response
import os
from pathlib import Path
from dotenv import load_dotenv

from data_model.store import Store
from data_model.user import User
from datetime import timedelta, datetime
from flask_cors import CORS

from enums.roles import Roles
from service.ingredient_service import IngredientService
from service.meal_planner_service import MealPlannerService
from service.user_service import UserService
from service.store_service import StoreService
from service.recipe_service import RecipeService
from service.payment_service import PaymentService
from service.order_service import OrderService
from service.recommendation_service_singleton import RecommendationServiceSingleton
from service.cart_service import CartService

from utils.get_userid_token import get_userid_token
from utils.authenticate_user import authenticate

env_path = Path(__file__).resolve().parent.parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

secret_key = os.getenv("JWT_SECRET_KEY")
origin_url = os.getenv("REACT_APP_URL")

app = Flask(__name__)
CORS(app, supports_credentials=True, resources={r'/*': {"origins": origin_url}})

RecommendationServiceSingleton.get_instance()


@app.route('/api/v1/register-user', methods=['POST'])
def register_user():
    user_details = request.get_json()
    user = User(user_details["name"], user_details["email"], user_details["password"], Roles.USER.value)
    user_service = UserService()

    output = user_service.register_user(user.get_user_details())

    return make_response(jsonify(output["response"]), output["code"])


@app.route('/api/v1/register-store', methods=['POST'])
def register_store():
    payload = request.get_json()
    user_details = payload["user_data"]
    store_details = payload['store_data']
    user = User(user_details["name"], user_details["email"], user_details["password"], Roles.STORE.value)
    user_service = UserService()
    output = user_service.register_user(user.get_user_details())
    doc_res = output["response"]["data"]
    u_id = str(doc_res)
    if output["code"] == 200:
        store = Store(store_details["store_name"], store_details["business_email"],
                      store_details["business_phonenumber"], store_details["address"],
                      store_details["FSA_id"], u_id)
        store_service = StoreService()
        store_output = store_service.register_store(store.get_store())
        return make_response(jsonify(store_output["response"]), store_output["code"])
    else:
        return make_response(jsonify(output["response"]), output["code"])


# USER MANAGEMENT

@app.route('/api/v1/login', methods=["POST"])
def login():
    user_details = request.get_json()
    user = User('', user_details["email"], user_details["password"], "")
    user_service = UserService()

    output = user_service.login_user(user.get_user_login(), secret_key=secret_key, login_role=Roles.USER.value)
    response = make_response(jsonify(output["response"]), output["code"])
    if output["code"] == 200:
        response.set_cookie(key="jwt_token", value=output['token'], expires=datetime.utcnow() + timedelta(hours=10),
                            httponly=True, samesite="None", secure=True)

    return response


@app.route('/api/v1/store-login', methods=["POST"])
def store_login():
    user_details = request.get_json()
    user = User('', user_details["email"], user_details["password"], "")
    user_service = UserService()

    output = user_service.login_user(user.get_user_login(), secret_key=secret_key, login_role=Roles.STORE.value)
    response = make_response(jsonify(output["response"]), output["code"])
    if output["code"] == 200:
        response.set_cookie(key="jwt_token", value=output['token'], expires=datetime.utcnow() + timedelta(hours=20),
                            httponly=True, samesite="None", secure=True)

    return response


@app.route('/api/v1/logout', methods=["POST"])
def logout():
    try:
        response = make_response(jsonify({'message': 'Successfully logged out'}), 200)
        response.set_cookie('jwt_token', secure=True, httponly=True, samesite='None', expires=0)
        return response
    except Exception as ex:
        message = f"{ex}"
        code = 500
        status = 'fail'
        response_entity = make_response(jsonify({"status": status, "message": message}), code)
        return response_entity


@app.route('/api/v1/user', methods=['GET'])
@authenticate("")
def get_user_details():
    user_id = get_userid_token(None)
    if user_id:
        user_service = UserService()
        output = user_service.get_user_details(user_id, False)
        return make_response(jsonify(output["response"]), output["code"])
    else:
        return make_response({"message": "Invalid user token", "status": "fail"}, 401)


@app.route('/api/v1/user/preferences', methods=["PUT"])
@authenticate(Roles.USER.value)
def update_user_preferences():
    request_data = request.get_json()
    user_id = get_userid_token(None)
    if user_id:
        user_service = UserService()
        output = user_service.update_preferences(request_data, user_id=user_id)
        return make_response(jsonify(output["response"]), output["code"])
    else:
        return make_response({"message": "Invalid user token", "status": "fail"}, 401)


@app.route('/api/v1/user/preferences/favorite', methods=["PUT"])
@authenticate(Roles.USER.value)
def update_user_favorites():
    request_data = request.get_json()
    user_id = get_userid_token(None)
    if user_id:
        user_service = UserService()
        output = user_service.update_favorites(request_data["recipe_id"], user_id=user_id)
        return make_response(jsonify(output["response"]), output["code"])
    else:
        return make_response({"message": "Invalid user token", "status": "fail"}, 401)


@app.route('/api/v1/user', methods=['PUT'])
@authenticate('')
def update_user_details_call():
    user_id = get_userid_token(None)
    payload = request.json
    if user_id:
        user_service = UserService()
        output = user_service.update_user_details(user_id, payload)
        return make_response(jsonify(output["response"]), output["code"])
    else:
        return make_response({"message": "Invalid user token", "status": "fail"}, 401)


# STORE MANAGEMENT
@app.route('/api/v1/stores', methods=["GET"])
@authenticate(Roles.USER.value)
def get_all_stores():
    page_no = request.args.get("page")
    store_service = StoreService()
    output = store_service.get_all_stores(page_no, False)
    return make_response(output["response"], output['code'])


@app.route('/api/v1/store/<store_id>', methods=['GET'])
@authenticate('')
def get_store_details(store_id):
    store_service = StoreService()
    output = store_service.get_store_details(store_id, None)
    return make_response(output['response'], output['code'])


@app.route('/api/v1/store', methods=['GET'])
@authenticate(Roles.STORE.value)
def get_store_user_details():
    store_id = get_userid_token('store_id')
    store_service = StoreService()
    output = store_service.get_store_details(store_id, None)
    return make_response(output['response'], output['code'])


@app.route('/api/v1/store-inventory', methods=['GET'])
@authenticate(Roles.STORE.value)
def get_store_inventory():
    page = request.args.get("page")
    store_id = get_userid_token('store_id')
    store_service = StoreService()
    output = store_service.get_store_inventory(store_id, page)
    return make_response(output['response'], output['code'])


@app.route('/api/v1/store-inventory', methods=['PUT'])
@authenticate(Roles.STORE.value)
def update_store_inventory_item():
    store_id = get_userid_token('store_id')
    store_service = StoreService()
    payload = request.json
    output = store_service.update_store_inventory_item(store_id, payload)
    return make_response(output['response'], output['code'])


@app.route('/api/v1/store-inventory', methods=['POST'])
@authenticate(Roles.STORE.value)
def add_store_inventory_item():
    store_id = get_userid_token('store_id')
    store_service = StoreService()
    payload = request.json
    output = store_service.add_store_inventory_item(store_id, payload)
    return make_response(output['response'], output['code'])


# INGREDIENTS MANAGEMENT
@app.route('/api/v1/ingredient-list', methods=["GET"])
@authenticate("")
def get_ingredients():
    i_type = request.args.get("type")
    i_service = IngredientService()
    if i_type:
        output = i_service.get_ingredients_by_type(i_type)
    else:
        output = i_service.get_all_ingredients()

    return make_response(jsonify(output["response"]), output["code"])


@app.route('/api/v1/store-upload', methods=["POST"])
@authenticate(Roles.STORE.value)
def upload_store_inventory():
    file = request.form.get("csvFile")
    store_id = get_userid_token('store_id')
    user_id = get_userid_token(None)
    store_image = request.form.get("store_image")
    store_service = StoreService()
    output = store_service.update_store_onboarding(store_id, store_image=store_image, store_inventory_file=file)
    if output["code"] == 200:
        user_service = UserService()
        user_service.update_preferences({"is_onboarding_complete": True}, user_id)
    return make_response(output["response"], output["code"])


# RECIPE MANAGEMENT
@app.route('/api/v1/recipes', methods=["GET"])
@authenticate(Roles.USER.value)
def get_personalized_recipes():
    rs_service = RecommendationServiceSingleton.get_instance()
    user_id = get_userid_token(None)
    recipe_service = RecipeService()

    page_number = request.args.get("page")
    is_fetch_all = request.args.get("all")

    if is_fetch_all:
        output = recipe_service.get_all_recipes(False)
    else:
        output = rs_service.get_user_recommendations(user_id, page_no=page_number)
    return make_response(jsonify(output["response"]), output["code"])


@app.route('/api/v1/recipe/<recipe_id>', methods=["GET"])
@authenticate(Roles.USER.value)
def get_recipe_details(recipe_id):
    recipe_service = RecipeService()
    output = recipe_service.get_recipe(recipe_id, True)
    return make_response(jsonify(output["response"]), output["code"])


@app.route('/api/v1/recipe', methods=["POST"])
@authenticate(Roles.USER.value)
def add_recipe():
    recipe_service = RecipeService()
    payload = request.get_json()
    user_id = get_userid_token(None)
    output = recipe_service.add_user_recipe(user_id, payload)
    return make_response(output["response"], output["code"])


# @app.route('/api/v1/recipes-remove', methods=["GET"])
# def remove_recipes_random():
#
#     recipe_service = RecipeService()
#     recipe_service.remove_random_recipes()
#
#     return make_response('Successful')

# CART MANAGEMENT

@app.route('/api/v1/user/shopping-list', methods=['PUT'])
@authenticate(Roles.USER.value)
def update_user_sl():
    user_id = get_userid_token(None)
    cart_service = CartService()
    output = cart_service.update_user_shopping_list(user_id, sl_list=request.json.get("list"))
    return make_response(output['response'], output['code'])


@app.route('/api/v1/user-cart', methods=["PUT"])
@authenticate(Roles.USER.value)
def update_user_cart_list():
    user_id = get_userid_token(None)
    cart_service = CartService()
    payload = request.json
    store_id = payload['store_id']
    cart_data = payload['cart_data']
    output = cart_service.update_cart_list(user_id, store_id=store_id, cart_data=cart_data)
    return make_response(output["response"], output["code"])


@app.route('/api/v1/user-cart-details', methods=['GET'])
# @authenticate(Roles.USER.value)
def get_user_cart_details_list():
    user_id = get_userid_token(None)
    user_service = UserService()
    output = user_service.get_user_cart_details('649f31fed49df87065a1102c')
    return make_response(output['response'], output['code'])


# @app.route("/api/v1/add-user-cart", methods=["POST"])
# def add_user_cart():
#     cart_service = CartService()
#     cart_service.setup_user_cart('649f31fed49df87065a1102c')
#     return make_response("COMPLETEDD")


# MEAL PLANNER MANAGEMENT

# @app.route('/api/v1/meal-planner', methods=["POST"])
# def add_meal_plans():
#     meal_plan_service = MealPlannerService()
#     output = meal_plan_service.setup_user_meal_plan("649f31fed49df87065a1102c")
#     return make_response(output["response"], output["code"])


@app.route('/api/v1/meal-plan', methods=["GET"])
@authenticate(Roles.USER.value)
def get_meal_plans_for_user():
    meal_plan_service = MealPlannerService()
    user_id = get_userid_token(None)
    output = meal_plan_service.get_meal_plan(user_id=user_id, date_query={"from": request.args.get("from_date"),
                                                                          "to": request.args.get("to_date")})
    return make_response(output["response"], output["code"])


@app.route('/api/v1/meal-plan/add-recipe', methods=["POST"])
@authenticate(Roles.USER.value)
def add_recipe_to_meal_plan():
    user_id = get_userid_token(None)
    meal_plan_service = MealPlannerService()
    output = meal_plan_service.update_meal_plan_recipe(user_id, data=request.get_json())
    return make_response(output["response"], output["code"])


# ORDER MANAGEMENT

@app.route('/api/v1/orders/set-order', methods=['POST'])
@authenticate(Roles.USER.value)
def place_user_order():
    u_id = get_userid_token(None)
    order_service = OrderService()
    payment_id = request.json.get("paymentId")
    output = order_service.add_user_order(user_id=u_id, payment_id=payment_id, order_type='Pickup')
    return make_response(output['response'], output['code'])


@app.route('/api/v1/user/orders', methods=['GET'])
@authenticate(Roles.USER.value)
def get_user_orders():
    user_id = get_userid_token(None)
    order_service = OrderService()
    output = order_service.get_user_orders(user_id, False)
    return make_response(output['response'], output['code'])


@app.route('/api/v1/store/orders', methods=['GET'])
@authenticate(Roles.STORE.value)
def get_store_orders():
    store_id = get_userid_token('store_id')
    order_service = OrderService()
    user_service = UserService()
    output = order_service.get_store_orders(store_id, user_service.get_all_users())
    return make_response(output['response'], output['code'])


@app.route('/api/v1/store/orders', methods=['PUT'])
@authenticate(Roles.STORE.value)
def update_store_order_status():
    payload = request.json
    store_id = get_userid_token('store_id')
    order_service = OrderService()
    output = order_service.update_order_status(store_id=store_id, order_id=payload.get('id'), status=payload.get('status'))
    return make_response(output['response'], output['code'])


# PAYMENT MANAGEMENT

@app.route('/api/v1/stripe-setup', methods=["POST"])
@authenticate(Roles.USER.value)
def order_payment():
    user_email = get_userid_token('email')
    amount = request.json.get("amount")
    payment_service = PaymentService(amount, email=user_email)
    output = payment_service.setup_stripe()
    return make_response(output['response'], output['code'])


if __name__ == '__main__':
    app.run(debug=True)
