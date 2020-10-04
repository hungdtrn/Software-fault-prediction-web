import json
import unittest

from flask import current_app

from app import create_app, mongo
from app.models import User
import utils

class AuthTestCase(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.app = create_app('testing')
        self.app_context = self.app.app_context()
        self.app_context.push()

        # create users
        utils.create_users("user", "user", "user")

        # get api client for testing
        self.client = self.app.test_client()

        # get user model
        self.user_model = User()

    @classmethod
    def tearDownClass(self):
        mongo.cx.drop_database(mongo.cx.get_default_database())
        mongo.cx.close()
        self.app_context.pop()

    def get_api_headers(self):
        return {
            'Content-Type': 'application/json'
        }

    def test_encode_auth_token(self):
        user = self.user_model.find_one({"username": "user"})
        auth_token = self.user_model.encode_auth_token({"_id": user["_id"], "role": "user"})
        self.assertTrue(isinstance(auth_token, bytes))
        
        decoded_token = self.user_model.decode_auth_token(auth_token)
        self.assertTrue(decoded_token["_id"] is not None)

    def test_login_with_wrong_username(self):
        response = self.client.post('/api/auth/login',
                                    data=json.dumps(dict(username = 'fail',
                                                         password = 'fail')),
                                    headers=self.get_api_headers())

        self.assertEqual(response.status_code, 400)
        
        response_msg = response.get_json()
        
        # response must not have credential data
        self.assertTrue(response_msg['result'] is None)

    def test_login_with_wrong_password(self):
        response = self.client.post('/api/auth/login',
                                    data=json.dumps(dict(username = 'fail',
                                                         password = 'user')),
                                    headers=self.get_api_headers()
                                    )

        self.assertEqual(response.status_code, 400)
        
        response_msg = response.get_json()
        
        # response must not have credential data
        self.assertTrue(response_msg['result'] is None)


    def test_login_success(self):
        response = self.client.post('/api/auth/login',
                                    data=json.dumps(dict(username = 'user',
                                                         password = 'user')),
                                    headers=self.get_api_headers()
                                    )

        self.assertEqual(response.status_code, 200)
        
        response_msg = response.get_json()

        # response must have some data
        self.assertTrue(response_msg['result'] is not None)

        access_token = response_msg['result']
        decoded_token = self.user_model.decode_auth_token(access_token.encode())
        self.assertTrue("_id" in decoded_token)
        self.assertTrue("role" in decoded_token)

    # def test_access_token(self):
    #     pass

    def test_register_success(self):
        response = self.client.post("/api/auth/register",
                                    data=json.dumps(dict(
                                        username = "user1",
                                        password = "user",
                                    )),
                                    content_type= 'application/json',
                                    )
        
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data.decode())
        self.assertTrue(data["msg"] == "Successfully registered.")
        self.assertTrue(data["result"] is not None)
        
        decoded_token = self.user_model.decode_auth_token(data["result"].encode())
        self.assertTrue("_id" in decoded_token)
        self.assertTrue("role" in decoded_token)

    def test_register_with_duplicated_username(self):
        response = self.client.post("/api/auth/register",
                                    data=json.dumps(dict(
                                        username = "user1",
                                        password = "user",
                                    )),
                                    content_type= 'application/json',
                                    )
        
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data.decode())
        self.assertTrue(data["msg"] == "Username duplicated.")
        self.assertTrue(data["result"] is None)
        

    # def test_register_with_duplicated_email(self):
    #     pass


