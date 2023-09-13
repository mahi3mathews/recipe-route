from datetime import datetime


class User:
    def __init__(self, name, email, password, role):
        self.__name = name
        self.__email = email
        self.__password = password
        self.__role = role
        self.__preferences = {"allergens_and_not_preferred": [], "is_onboarding_complete": False, "favorites": []}
        self.__created_on = datetime.now()
        self.__updated_on = datetime.now()
        self.__address = {"country": "UK", "street": "", "city": "", "post_code": ""}
        self.__phone_number = None

    def set_allergens(self, allergens):
        self.__preferences.update({"allergens_and_not_preferred": allergens})

    def get_user_details(self):
        return {
            "name": self.__name,
            "email": self.__email,
            "password": self.__password,
            "role": self.__role,
            "preferences": self.__preferences,
            "created_on": self.__created_on,
            "updated_on": self.__updated_on,
            "phone_number": self.__phone_number,
            "address": self.__address
        }

    def get_user_login(self):
        return {
            "email": self.__email,
            "password": self.__password,
        }

    def update_ph_number(self, p_number):
        self.__phone_number = p_number
