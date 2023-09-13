import datetime
import unittest
from unittest.mock import MagicMock, patch
from service.user_service import UserService
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()


class TestUserService(unittest.TestCase):
    def setUp(self):
        # Create a mock for the user_repository to isolate the UserService tests from the database
        self.user_repository_mock = MagicMock()
        self.user_service = UserService()
        self.user_service.repo = self.user_repository_mock
        self.store_service_mock = MagicMock()

        self.user_service._UserService__store_service = self.store_service_mock
        self.user_service._UserService__format_cart_store_data

    def test_register_user(self):
        # Test the register_user method when the user does not exist
        test_user = {"email": "test@example.com", "password": "test_password", "role": "user"}
        self.user_repository_mock.get_user.return_value = None
        self.user_repository_mock.add_user.return_value = MagicMock(inserted_id="user_id")

        result = self.user_service.register_user(test_user)

        self.assertEqual(result["response"]["message"], "User successfully registered")
        self.assertEqual(result["code"], 200)
        self.user_repository_mock.get_user.assert_called_once_with(test_user["email"])
        self.user_repository_mock.add_user.assert_called_once()

    def test_register_user_existing(self):
        # Test the register_user method when the user already exists
        test_user = {"email": "test@example.com", "password": "test_password", "role": "user"}
        self.user_repository_mock.get_user.return_value = test_user

        result = self.user_service.register_user(test_user)

        self.assertEqual(result["response"]["message"], "User already exists.")
        self.assertEqual(result["code"], 401)
        self.user_repository_mock.get_user.assert_called_once_with(test_user["email"])
        self.user_repository_mock.add_user.assert_not_called()

    @patch('flask_bcrypt.Bcrypt.generate_password_hash')
    @patch('flask_bcrypt.Bcrypt.check_password_hash', return_value=True)
    def test_login_store_success(self, bcrypt_check_password_hash_mock, bcrypt_generate_password_hash_mock):
        # Test the login_user method with valid credentials
        test_user = {"email": "test@example.com", "password": "test_password"}
        hashed_password = bcrypt_generate_password_hash_mock.return_value
        self.user_repository_mock.get_user.return_value = {
            "_id": "64ccb7c4802f124e25eab5a0",
            "email": "test@example.com",
            "password": hashed_password,
            "role": "STORE",
            "name": "Store name",
            "created_on": datetime.datetime.now(),
            "updated_on": datetime.datetime.now(),
            "preferences": {}

        }
        secret_key = "secret_key"
        self.user_service._UserService__store_service.get_store.return_value = {
            "id": '64ccb7c4802f124e25eab5d3',
            "storeName": 'Store ABC',
            "address": {"street": "Street ABC", "city": "Coventry"},
            "businessPhonenumber": '0873948393287',
            "role": "STORE"
        }

        result = self.user_service.login_user(test_user, secret_key, "STORE")

        self.assertEqual("User Authenticated", result["response"]["message"])
        self.assertEqual(result["code"], 200)
        self.assertIn("token", result)
        bcrypt_generate_password_hash_mock.assert_not_called()
        bcrypt_check_password_hash_mock.assert_called_once_with(hashed_password, test_user["password"])
        self.user_repository_mock.get_user.assert_called_once_with(test_user["email"])

    @patch('flask_bcrypt.Bcrypt.generate_password_hash')
    @patch('flask_bcrypt.Bcrypt.check_password_hash', return_value=True)
    def test_login_user_success(self, bcrypt_check_password_hash_mock, bcrypt_generate_password_hash_mock):
        # Test the login_user method with valid credentials
        test_user = {"email": "test@example.com", "password": "test_password"}
        hashed_password = bcrypt_generate_password_hash_mock.return_value
        self.user_repository_mock.get_user.return_value = {
            "_id": "64ccb7c4802f124e25eab5a0",
            "email": "test@example.com",
            "password": hashed_password,
            "role": "USER",
            "name": "User name",
            "created_on": datetime.datetime.now(),
            "updated_on": datetime.datetime.now(),
            "preferences": {}

        }
        secret_key = "secret_key"
        self.user_service._UserService__store_service.get_store.return_value = None

        result = self.user_service.login_user(test_user, secret_key, "USER")

        self.assertEqual("User Authenticated", result["response"]["message"])
        self.assertEqual(result["code"], 200)
        self.assertIn("token", result)
        bcrypt_generate_password_hash_mock.assert_not_called()
        bcrypt_check_password_hash_mock.assert_called_once_with(hashed_password, test_user["password"])
        self.user_repository_mock.get_user.assert_called_once_with(test_user["email"])

    @patch('flask_bcrypt.Bcrypt.check_password_hash', return_value=False)
    def test_login_user_invalid_password(self, bcrypt_check_password_hash_mock):
        test_user = {"email": "test@example.com", "password": "test_password"}
        self.user_repository_mock.get_user.return_value = {
            "_id": "user_id",
            "email": "test@example.com",
            "role": "USER",
            "password": "hashed_password"
        }
        secret_key = "secret_key"

        result = self.user_service.login_user(test_user, secret_key, "user")
        self.assertEqual(result["response"]["message"], "Invalid credentials")
        self.assertEqual(result["code"], 401)
        bcrypt_check_password_hash_mock.assert_called_once_with("hashed_password", test_user["password"])

    def test_get_all_users(self):
        # Test the get_all_users method
        self.user_repository_mock.get_all.return_value = [
            {"email": "user1@example.com", "role": "user"},
            {"email": "user2@example.com", "role": "user"},
            {"email": "user3@example.com", "role": "user"},
        ]

        result = self.user_service.get_all_users()

        self.assertEqual(len(result), 3)
        self.user_repository_mock.get_all.assert_called_once()

    def test_get_user_details(self):
        # Test the get_user_details method with an existing user
        test_user_id = "64ccb7c4802f124e25eab5a0"
        test_user_data = {"_id": "64ccb7c4802f124e25eab5a0",
                          "email": "test@example.com",
                          "role": "USER",
                          "name": "User name",
                          "created_on": datetime.datetime.now(),
                          "updated_on": datetime.datetime.now(),
                          "preferences": {}}
        format_service_mock = MagicMock()
        self.user_repository_mock.get_user_by_id.return_value = test_user_data
        self.user_service._UserService__format_cart_store_data = format_service_mock

        result = self.user_service.get_user_details(test_user_id, False)

        self.assertEqual(result["response"]["message"], "Successfully fetched user")
        self.assertEqual(result["code"], 200)
        self.user_repository_mock.get_user_by_id.assert_called_once_with(test_user_id)
        format_service_mock.assert_called_once()

    def test_get_user_details_not_found(self):
        # Test the get_user_details method with a non-existing user
        test_user_id = "64ccb7c4802f124e25eab5a0"
        self.user_repository_mock.get_user_by_id.return_value = None

        result = self.user_service.get_user_details(test_user_id, False)

        self.assertEqual(result["response"]["message"], "User does not exist")
        self.assertEqual(result["code"], 404)
        self.user_repository_mock.get_user_by_id.assert_called_once_with(test_user_id)


if __name__ == '__main__':
    unittest.main()
