from datetime import datetime, timedelta, date, time
import calendar

from enums.meal_types import MealTypes
from utils.date_utils import get_month, get_day_enum
from repo.meal_planner_repository import MealPlannerRepo
from service.cart_service import CartService
from service.recipe_service import RecipeService
from schemas.recipes import recipe_meal_plan_entity


class MealPlannerService:
    def __init__(self):
        self.__repo = MealPlannerRepo()
        self.__cart_service = CartService()
        self.__recipe_service = RecipeService()

    @staticmethod
    def __meal_plan_template(month, year):
        template_data = {}
        _, num_days = calendar.monthrange(month=month, year=year)
        first_day = date(year, month, 1)
        for i in range(num_days):
            meal_day = (first_day + timedelta(days=i)).strftime("%a")
            meal_date = datetime.combine(first_day + timedelta(days=i), time.min)
            meal_data = {
                'meal_day': get_day_enum(meal_day),
                'meal_date': meal_date,
                'meals': {MealTypes.BREAKFAST.value: {'is_ingredients_added': False, 'is_prepped': False},
                          MealTypes.LUNCH.value: {'is_ingredients_added': False, 'is_prepped': False},
                          MealTypes.DINNER.value: {'is_ingredients_added': False, 'is_prepped': False}},
            }
            template_data.update({str(meal_date.strftime("%Y-%m-%d")): meal_data})
        return template_data

    def setup_user_meal_plan(self, user_id, year=None, month=None, is_update=False):
        if year is None or month is None:
            current_date = date.today()
            month = current_date.month
            year = current_date.year

        current_month = get_month(month)
        meal_template = self.__meal_plan_template(month, year)
        if is_update:
            result = self.__repo.update_meal_plan({'user_id': user_id}, {f"{current_month}_{year}": meal_template})
        else:
            result = self.__repo.add_meal_plan({"user_id": user_id, f"{current_month}_{year}": meal_template})
        if result.acknowledged:
            return {"response": {"message": "Successfully added user's meal plan", "status": "success"}, "code": 200}
        else:
            return {"response": {"message": "Failed to add user's meal plan", "status": "fail"}, "code": 500}

    def get_meal_plan(self, user_id, date_query):
        from_date = datetime.strptime(date_query["from"], '%Y-%m-%d')
        to_date = datetime.strptime(date_query["to"], '%Y-%m-%d')

        from_date_key = f"{get_month(from_date.month)}_{from_date.year}"
        to_date_key = f"{get_month(to_date.month)}_{to_date.year}"

        user_meal_plans = self.__repo.get_meal_plan({"user_id": user_id})
        from_month_meal_plans = user_meal_plans[from_date_key]

        required_plan = []

        if to_date_key not in user_meal_plans:
            self.setup_user_meal_plan(user_id=user_id, month=to_date.month, year=to_date.year, is_update=True)
            user_meal_plans = self.__repo.get_meal_plan({'user_id': user_id})

        if from_date_key in to_date_key and from_date_key in user_meal_plans:
            required_plan = [from_month_meal_plans[meal_plan_date_key] for meal_plan_date_key in from_month_meal_plans
                             if from_date <= from_month_meal_plans[meal_plan_date_key]["meal_date"] <= to_date]

        elif from_date_key in user_meal_plans and to_date_key in user_meal_plans:
            required_plan = [from_month_meal_plans[meal_plan_date_key] for meal_plan_date_key in from_month_meal_plans
                             if from_date <= self.__formatted_date(from_month_meal_plans[meal_plan_date_key]["meal_date"]) <= to_date]
            to_month_meal_plans = user_meal_plans[to_date_key]
            required_plan.extend(to_month_meal_plans[to_meal_plan_date_key] for to_meal_plan_date_key in
                                 to_month_meal_plans if from_date <=
                                 to_month_meal_plans[to_meal_plan_date_key]["meal_date"] <= to_date)

        if len(required_plan) > 7:
            print(required_plan)

        return {"response": {"data": required_plan, "message": "Successfully fetched weekly meal plan",
                             "status": "success"}, "code": 200}

    def update_meal_plan_recipe(self, user_id, data):
        is_add_to_cart = data["is_add_to_cart"]
        meal_type = data["meal_type"]
        meal_date = datetime.strptime(data["meal_date"], '%Y-%m-%d')
        meal_specific_key = meal_date.strftime('%Y-%m-%d')
        meal_date_key = f"{get_month(meal_date.month)}_{meal_date.year}"

        overall_recipe_data = self.__recipe_service.get_recipe(data["recipe_id"], False)
        recipe_data = recipe_meal_plan_entity(overall_recipe_data)

        meal_plan_query = {"user_id": user_id}
        meal_data_payload = {f"{meal_date_key}.{str(meal_specific_key)}.meals.{MealTypes[meal_type].value}"
                             : recipe_data}
        if is_add_to_cart:
            res_two = self.__cart_service.add_to_users_shopping_list(user_id, ingredient_list=overall_recipe_data[
                "formatted_ingredients"])
            if res_two["code"] is 200:
                recipe_data.update({"is_ingredients_added": True})
        res_two = {"code": 'not_attempted'}
        res_one = self.__repo.update_meal_plan(query=meal_plan_query, data=meal_data_payload)

        if res_one.matched_count > 0:
            res = {"message": "Successfully added the recipe to meal plan", "status": "success", "data": recipe_data}
            code = 200
            if res_two["code"] is not 200 and res_two["code"] is not "not_attempted":
                res.update({"message": "Successfully added recipe to meal plan but failed to add items to cart."})
        else:
            res = {"message": "Failed to add recipe to meal plan. Try again after sometime.", "status": "fail"}
            code = 500

        return {"response": res, "code": code}
