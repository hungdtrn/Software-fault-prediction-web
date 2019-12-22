import json
import unittest

from flask import current_app

from app import create_app, mongo
import utils

class UserTestCase(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.app = create_app('testing')
        self.app_context = self.app.app_context()
        self.app_context.push()

        # create users
        utils.create_users("test", "test", "user")

        # get api client for testing
        self.client = self.app.test_client()

    @classmethod
    def tearDownClass(self):
        mongo.cx.drop_database(mongo.cx.get_default_database())
        mongo.cx.close()
        self.app_context.pop()
        
    def test_app_exists(self):
        self.assertFalse(current_app is False)

    def test_app_is_testing(self):
        self.assertTrue(current_app.config['TESTING'])


    def get_api_headers(self):
        return {
            'Content-Type': 'application/json'
        }

    def test_login_with_wrong_username(self):
        response = self.client.post('/api/login',
                         data={'username': 'fail',
                                          'password': 'test'})

        self.assertEqual(response.status_code, 400)
        
        response_msg = response.get_json()

        # response must have error message
        self.assertTrue(response_msg['err'] is not None)
        
        # response must not have credential data
        self.assertTrue(response_msg['result'] is None)

    def test_login_with_wrong_password(self):
        response = self.client.post('/api/login',
                        data={'username': 'test',
                               'password': 'fail'})

        self.assertEqual(response.status_code, 400)
        
        response_msg = response.get_json()

        # response must have error message
        self.assertTrue(response_msg['err'] is not None)
        
        # response must not have credential data
        self.assertTrue(response_msg['result'] is None)


    def test_login_success(self):
        response = self.client.post('/api/login',
                         data={'username': 'test',
                                'password': 'test'})

        self.assertEqual(response.status_code, 200)
        
        response_msg = response.get_json()

        # response must have some data
        self.assertTrue(response_msg['result'] is not None)

    def test_access_token(self):
        pass

    def test_register_with_duplicated_username(self):
        pass

    def test_register_with_duplicated_email(self):
        pass

    def test_register_success(self):
        pass

