import unittest
from unittest.mock import MagicMock
from flask import Flask, make_response, request
from service.store_service import StoreService
from service.user_service import UserService
from utils.authenticate_user import authenticate
import jwt
from dotenv import load_dotenv
from pathlib import Path
import os
import io
import base64

env_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(dotenv_path=env_path)
secret_key = os.getenv("JWT_SECRET_KEY")


class TestAPIs(unittest.TestCase):

    def setUp(self):
        self.app = Flask(__name__)
        self.app.config['TESTING'] = True
        self.client = self.app.test_client()
        self.store_service = StoreService()
        self.user_service = UserService()
        self.user_service.get_user_details = MagicMock()
        self.user_service.get_user_details.return_value = {"response": {"data": {}}, "code": 200}
        self.store_service._StoreService__store_inventory_service.update_inventory_item = MagicMock()
        self.store_service._StoreService__store_inventory_service.update_inventory_item.return_value = \
            {"store_id": "64b31bc89662c42a02c39972", "inventory": {}}
        self.store_service._StoreService__store_inventory_service.update_store_inventory = MagicMock()
        self.store_service._StoreService__store_inventory_service.update_store_inventory.return_value = \
            {"response": {"message": "Successfully updated inventory item.", "status": "success"}, "code": 200}
        self.store_service.update_store_details = MagicMock()
        self.store_service.update_store_details.return_value = \
            {"response": {"message": "Successfully update store details", "status": 'success'}, 'code': 200}

        @self.app.route('/api/v1/user', methods=["GET"])
        @authenticate('USER')
        def test_get_user_details():
            page_no = 1
            output = self.user_service.get_user_details()
            return make_response(output["response"], output['code'])

        @self.app.route('/api/v1/stores', methods=["GET"])
        @authenticate('STORE')
        def test_get_all_stores():
            page_no = 1
            output = self.store_service.get_all_stores(page_no, False)
            return make_response(output["response"], output['code'])

        @self.app.route('/api/v1/store-inventory', methods=["PUT"])
        @authenticate('STORE')
        def test_update_store_inventory_item():
            output = self.store_service.update_store_inventory_item('64ccae4380657f29b10fe78e', {"item_id": ""})
            return make_response(output["response"], output['code'])

        @self.app.route('/api/v1/store-upload', methods=["POST"])
        @authenticate("STORE")
        def test_upload_store_inventory():
            file = request.form.get("csvFile")
            store_image = request.form.get("store_image")
            output = self.store_service.update_store_onboarding('64ccae4380657f29b10fe78e', store_image=store_image,
                                                                store_inventory_file=file)
            if output["code"] == 200:
                user_service = UserService()
                user_service.update_preferences({"is_onboarding_complete": True}, '64ccae4380657f29b10fe78e')
            return make_response(output["response"], output["code"])

    def test_get_all_stores_unauthenticated(self):
        response = self.client.get('/api/v1/stores?page=1')
        self.assertEqual(response.status_code, 403)
        self.assertIn("Unauthorized token", str(response.data))

    def test_get_all_stores_authenticated(self):
        user_details = {
            "email": "user@gmail.com",
            "id": "64ccae4380657f29b10fe78e",
            "role": "STORE"
        }
        token = jwt.encode({
            "user": user_details,
        }, secret_key)
        self.client.set_cookie(key="jwt_token", value=token, httponly=True, samesite="None", secure=True)

        response = self.client.get('/api/v1/stores?page=1')
        self.assertEqual(response.status_code, 200)
        self.assertIn("data", str(response.data))

    def test_get_user_details_unauthenticated(self):
        response = self.client.get('/api/v1/user')
        print(response, "RESPONSE", response.data)
        self.assertEqual(response.status_code, 403)
        self.assertIn("Unauthorized token", str(response.data))

    def test_get_user_details_authenticated(self):
        user_details = {
            "email": "user@gmail.com",
            "id": "64ccae4380657f29b10fe78e",
            "role": "USER"
        }
        token = jwt.encode({
            "user": user_details,
        }, secret_key)
        self.client.set_cookie(key="jwt_token", value=token, httponly=True, samesite="None", secure=True)

        response = self.client.get('/api/v1/user')
        self.assertEqual(response.status_code, 200)
        self.assertIn("data", str(response.data))
        self.user_service.get_user_details.assert_called_once()

    def test_update_store_inventory_item_unauthenticated(self):
        response = self.client.put('/api/v1/store-inventory')
        print(response, "RESPONSE", response.data)
        self.assertEqual(response.status_code, 403)
        self.assertIn("Unauthorized token", str(response.data))

    def test_update_store_inventory_item_authenticated(self):
        user_details = {
            "email": "user@gmail.com",
            "id": "64ccae4380657f29b10fe78e",
            "role": "STORE"
        }
        token = jwt.encode({
            "user": user_details,
        }, secret_key)
        self.client.set_cookie(key="jwt_token", value=token, httponly=True, samesite="None", secure=True)
        response = self.client.put('/api/v1/store-inventory')

        self.assertEqual(response.status_code, 200)
        self.assertIn("data", str(response.data))
        self.store_service._StoreService__store_inventory_service.update_inventory_item.assert_called_once()

    def test_upload_store_inventory_unauthenticated(self):
        response = self.client.post('/api/v1/store-upload')
        print(response, "RESPONSE", response.data)
        self.assertEqual(response.status_code, 403)
        self.assertIn("Unauthorized token", str(response.data))

    def test_upload_store_inventory_authenticated_empty_data(self):
        user_details = {
            "email": "user@gmail.com",
            "id": "64ccae4380657f29b10fe78e",
            "role": "STORE"
        }
        token = jwt.encode({
            "user": user_details,
        }, secret_key)

        csv_data = "item_name,quantity,price\napple,10,1.2\norange,5,0.75"
        csv_file = io.StringIO(csv_data)
        store_image = None
        store_inventory_file = None
        # (csv_file, "inventory.csv")

        self.client.set_cookie(key="jwt_token", value=token, httponly=True, samesite="None", secure=True)

        response = self.client.post('/api/v1/store-upload', data={"store_image": store_image,
                                                                  "store_inventory_file": store_inventory_file})
        print(response, "RESPONSE", response.data)
        self.assertEqual(response.status_code, 400)
        self.assertIn("No data is provided.", str(response.data))
        self.store_service._StoreService__store_inventory_service.update_store_inventory.assert_not_called()

    def test_upload_store_inventory_authenticated_empty_image(self):
        user_details = {
            "email": "user@gmail.com",
            "id": "64ccae4380657f29b10fe78e",
            "role": "STORE"
        }
        token = jwt.encode({
            "user": user_details,
        }, secret_key)

        csv_data = "item_name,quantity,price\napple,10,1.2\norange,5,0.75"
        csv_data_base64 = base64.b64encode(csv_data.encode()).decode()
        data = {
            "csvFile": csv_data_base64,   # Provide a filename for the file
        }
        self.client.set_cookie(key="jwt_token", value=token, httponly=True, samesite="None", secure=True)
        response = self.client.post('/api/v1/store-upload', data=data, content_type='multipart/form-data')
        self.assertEqual(response.status_code, 200)
        self.assertIn("Successfully updated inventory, but failed to upload store image.", str(response.data))
        self.store_service._StoreService__store_inventory_service.update_store_inventory.assert_called_once()
        self.store_service.update_store_details.assert_not_called()

    def test_upload_store_inventory_authenticated(self):
        user_details = {
            "email": "user@gmail.com",
            "id": "64ccae4380657f29b10fe78e",
            "role": "STORE"
        }
        token = jwt.encode({
            "user": user_details,
        }, secret_key)

        csv_data = "item_name,quantity,price\napple,10,1.2\norange,5,0.75"
        csv_data_base64 = base64.b64encode(csv_data.encode()).decode()
        data = {
            "csvFile": csv_data_base64,
            "store_image": "image"
        }
        self.client.set_cookie(key="jwt_token", value=token, httponly=True, samesite="None", secure=True)
        response = self.client.post('/api/v1/store-upload', data=data, content_type='multipart/form-data')
        self.assertEqual(response.status_code, 200)
        self.assertIn("Successfully updated store image and inventory", str(response.data))
        self.store_service._StoreService__store_inventory_service.update_store_inventory.assert_called_once()
        self.store_service.update_store_details.assert_called_once()


if __name__ == '__main__':
    unittest.main()
