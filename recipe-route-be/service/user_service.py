from repo.user_repository import UserRepository
from service.meal_planner_service import MealPlannerService
from service.cart_service import CartService
from service.store_service import StoreService
from service.order_service import OrderService

from flask_bcrypt import Bcrypt
import logging
from datetime import timedelta, datetime
import jwt
from schemas.users import user_entity
from enums.roles import Roles


bcrypt = Bcrypt()

failed_attempts = {}
lockout_time = 60 * 30


class UserService:
    def __init__(self):
        self.repo = UserRepository()
        self.__meal_service = MealPlannerService()
        self.__cart_service = CartService()
        self.__store_service = StoreService()
        self.__order_service = OrderService()

    def register_user(self, user):
        existing_user = self.repo.get_user(user["email"])
        res = {}
        if existing_user:
            res.update({"message": 'User already exists.',
                        "status": 'fail',
                        })
            code = 401
        else:
            user['password'] = bcrypt.generate_password_hash(user["password"]).decode('utf-8')
            user["created_on"] = datetime.now()
            user["updated_on"] = datetime.now()
            result = self.repo.add_user(user)
            cart_res = self.__cart_service.setup_user_cart(str(result.inserted_id))
            if result.acknowledged:
                res.update(
                    {"data": str(result.inserted_id), "message": "User successfully registered", "status": "success"})
                code = 200
                self.__meal_service.setup_user_meal_plan(str(result.inserted_id))
            else:
                res.update(
                    {"message": "Failed to register user.", "status": "fail"})
                code = 500

        return {"response": res, "code": code}

    def __format_cart_store_data(self, cart_details):
        if "store_id" in cart_details and len(cart_details['store_id']) != 0:
            cart_store = self.__store_service.get_store_details(store_id=cart_details['store_id'], raw_data=True)
            cart_details.update({"storeDetails": cart_store})
            del cart_details['store_id']
        return cart_details

    def login_user(self, user, secret_key, login_role):
        retrieved_user = self.repo.get_user(user["email"])
        is_store = retrieved_user["role"] in Roles.STORE.value
        u_id = str(retrieved_user["_id"])
        store_details = {}
        if not is_store:
            user_cart = self.__format_cart_store_data(self.__cart_service.get_user_cart_items(u_id, True))

        if is_store:
            store_details = self.__store_service.get_store(u_id)

        token = None

        if not retrieved_user:
            res = {
                "message": f"Invalid credentials",
                "status": 'fail'}
            code = 401
        elif (is_store and login_role != Roles.STORE.value) or (
                not is_store and login_role == Roles.STORE.value):
            res = {
                "message": f"Incorrect login",
                "status": 'fail'}
            code = 401
        elif user and bcrypt.check_password_hash(retrieved_user['password'], user['password']):
            time = datetime.utcnow() + timedelta(hours=5)
            user_details = {
                    "email": f"{retrieved_user['email']}",
                    "id": f"{retrieved_user['_id']}",
                    "role": f"{retrieved_user['role']}"
                }
            if is_store:
                user_details.update({'store_id': store_details["id"]})
            token = jwt.encode({
                "user": user_details,
                "exp": time
            }, secret_key)

            if not is_store:
                retrieved_user.update({"cart": user_cart})
            del retrieved_user['password']
            user_details = user_entity(retrieved_user)

            if is_store:
                final_result = {"store_user": user_details, "store_details": store_details}
            else:
                final_result = user_details
            res = {
                "message": f"User Authenticated",
                "data": final_result,
                "status": "successful"}
            code = 200
            logging.info(f"User {retrieved_user['email']} successfully logged in")
        else:
            res = {
                "message": f"Invalid credentials",
                "status": 'fail'}
            code = 401
            logging.warning(f"User {user['email']} send login request with incorrect credentials")

        response = {"response": res, "code": code}
        if token:
            response.update({"token": token})
        return response

    def get_all_users(self):
        result = self.repo.get_all({"role": Roles.USER.value})
        return list(result)

    def get_user_details(self, user_id, is_raw_data):
        retrieved_user = self.repo.get_user_by_id(user_id)

        if retrieved_user:
            is_store = retrieved_user["role"] in Roles.STORE.value
            if is_store:
                store_details = self.__store_service.get_store(user_id)
            if not is_store and retrieved_user:
                user_cart = self.__format_cart_store_data(self.__cart_service.get_user_cart_items(user_id, True))
                retrieved_user.update({"cart": user_cart})
            if is_raw_data:
                return retrieved_user
            final_data = {"user_details": user_entity(retrieved_user)}
            if is_store:
                final_data.update({"store_details": store_details})
            res = {"message": "Successfully fetched user", "status": 'success', 'data': final_data}
            code = 200
        else:
            res = {"message": "User does not exist", "status": "fail"}
            code = 404
        return {"response": res, "code": code}

    def update_preferences(self, data, user_id):
        existing_user = self.repo.get_user_by_id(user_id)
        res = {}
        if existing_user:
            user_preferences = existing_user["preferences"]
            user_preferences.update(data)
            self.repo.update_user_details(user_id, {"preferences": user_preferences})
            res.update({"message": "Successfully updated user preferences", "status": "success"})
            code = 200
        else:
            res.update({"message": "User not found", "status": "fail"})
            code = 404

        return {"response": res, "code": code}

    def update_favorites(self, recipe_id, user_id):
        existing_user = self.repo.get_user_by_id(user_id)
        res = {}
        if existing_user:
            favorites = list(existing_user['preferences']["favorites"])
            if recipe_id in favorites:
                favorites.remove(recipe_id)
            else:
                favorites.append(recipe_id)
            self.repo.update_user_details(user_id, {"preferences.favorites": favorites})
            res.update({"message": "Successfully updated user preferences", "status": "success"})
            code = 200
        else:
            res.update({"message": "User not found", "status": "fail"})
            code = 404
        return {"response": res, "code": code}

    def get_user_cart_details(self, user_id):
        result = self.__cart_service.get_user_cart_items(user_id, True)

        cart_item_ids = [key for key in result['cartList']]

        cart_details = {}
        if "cartList" in result and "store_id" in result:
            store_details = self.__store_service.get_store_details(result['store_id'], raw_data=True)
            inventory = store_details['inventory']
            cart_details.update({key: value for key, value in inventory.items() if key in cart_item_ids})

        return {"response": {}, 'code': 200}

    def update_user_details(self, user_id, data):
        existing_user = self.repo.get_user_by_id(user_id)
        res = {}
        if existing_user:
            self.repo.update_user_details(user_id, data)
            res.update({"message": "Successfully updated user preferences", "status": "success"})
            code = 200
        else:
            res.update({"message": "User not found", "status": "fail"})
            code = 404

        return {"response": res, "code": code}

