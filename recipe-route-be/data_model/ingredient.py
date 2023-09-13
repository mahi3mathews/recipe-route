class Ingredient:
    def __init__(self, name, i_type):
        self.__name = name
        self.__type = i_type
        self.__calorie = 0

    def update_calories(self, calorie):
        self.__calorie = calorie

    def get_ingredient(self):
        return {
            "name": self.__name,
            "type": self.__type,
            "calorie": self.__calorie
        }
