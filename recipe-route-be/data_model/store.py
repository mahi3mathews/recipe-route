class Store:
    def __init__(self, store_name, business_email, business_phonenumber, address, FSA_id, user_id):
        self.__store_name = store_name
        self.__business_email = business_email
        self.__business_phonenumber = business_phonenumber
        self.__address = address
        self.__FSA_id = FSA_id
        self.__user_id = user_id
        self.__created_on = None
        self.__updated_on = None

    def get_store(self):
        return {
            "store_name": self.__store_name,
            "business_email": self.__business_email,
            "business_phonenumber": self.__business_phonenumber,
            "address": self.__address,
            "FSA_id": self.__FSA_id,
            "user_id": self.__user_id,
            "created_on": self.__created_on,
            "updated_on": self.__updated_on
        }

    def update_created_updated_date(self, created_on, updated_on):
        self.__created_on = created_on
        self.__updated_on = updated_on

