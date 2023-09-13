from db import meal_plans_collection


class MealPlannerRepo:
    def __init__(self):
        self.meal_plans = meal_plans_collection

    def add_meal_plan(self, data):
        result = self.meal_plans.insert_one(data)
        return result

    def get_meal_plan(self, query):
        result = self.meal_plans.find_one(query)
        return result

    def update_meal_plan(self, query, data):
        result = self.meal_plans.update_one(query, {"$set": data})
        return result
