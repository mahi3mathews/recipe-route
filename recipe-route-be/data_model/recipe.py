class Recipe:
    def __init__(self, directions: [], categories: [], calories: 0, protein: 0, title: '', ingredients: []):
        self.__directions = directions
        self.__categories = categories
        self.__calories = calories
        self.__protein = protein
        self.__ingredients = ingredients
        self.__title = title

    def get_recipe(self):
        return {
            "title": self.__title,
            "calories": self.__calories,
            "protein": self.__protein,
            "ingredients": self.__ingredients,
            "categories": self.__categories,
            "directions": self.__directions
        }

    def update_recipe(self, recipe_data):
        self.__categories = recipe_data['categories']
        self.__calories = recipe_data['calories']
        self.__protein = recipe_data['protein']
        self.__ingredients = recipe_data['ingredients']
        self.__title = recipe_data['title']
        self.__directions = recipe_data['directions']
