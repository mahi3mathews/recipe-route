class MealPlan:
    def __init__(self, data):
        self.__user_id = data['user_id']
        self.__plans = data['plans']

    def get_meal_plan(self, month_year):
        return {
            "user_id": self.__user_id,
            f"{month_year}": self.__plans[month_year],
        }

    def update_meal_plans(self, data):
        self.__plans = data





