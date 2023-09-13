class Cart:
    def __init__(self, user_id, shopping_list: [], cart_list: [], store_id: ''):
        self.__user_id = user_id
        self.__shopping_list = shopping_list
        self.__cart_list = cart_list
        self.__store_id = store_id

    def get_cart(self):
        return {
            "user_id": self.__user_id,
            "shopping_list": self.__shopping_list,
            "cart_list": self.__cart_list,
            "store_id": self.__store_id
        }

    def update_cart(self, cart_data):
        self.__cart_list = cart_data
