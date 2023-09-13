class Order:
    def __init__(self, data):
        self.__user_id = data['user_id']
        self.__payment_id = data['payment_id']
        self.__total_price = data['total_price']
        self.__order_items = data['cart_items']
        self.__store_id = data['store_id']
        self.__order_type = data['order_type']
        self.__status = data['status']
        self.__payment_status = data['payment_status']

    def get_order_details(self):
        return {
            "user_id": self.__user_id,
            "payment_id": self.__payment_id,
            'total_amount': self.__total_price,
            'order_items': self.__order_items,
            'store_id': self.__store_id,
            "order_type": self.__order_type,
            "status": self.__status,
            "payment_status": self.__payment_status
        }

    def update_order_details(self, data):
        self.__user_id = data['user_id']
        self.__payment_id = data['payment_id']
        self.__total_price = data['total_price']
        self.__order_items = data['cart_items']
        self.__store_id = data['store_id']
        self.__order_type = data['order_type']
        self.__status = data['status']
        self.__payment_status = data['payment_status']





