import json
import unittest

from flask import current_app

from app import create_app, mongo
from app.models import File, Project, User
import utils

user_model = User()
project_model = Project()
file_model = File()

class AuthTestCase(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.app = create_app('testing')
        self.app_context = self.app.app_context()
        self.app_context.push()

        # create users
        self.user1 = utils.create_users("user1", "test", "user")
        self.user2 = utils.create_users("user2", "test", "user")

        # get api client for testing
        self.client = self.app.test_client()

        # create some projects for user1
        self.client.post("/api/projects",
                        data=json.dumps(dict(name="TestProject1",
                                             github="https://github.com/user/project")),
                        headers=self.get_api_headers(user_model.encode_auth_token(self.user1)))
        self.client.post("/api/projects",
                        data=json.dumps(dict(name="TestProject2",
                                             github="https://github.com/user/project")),
                        headers=self.get_api_headers(user_model.encode_auth_token(self.user1)))

        # create some projects for user2
        self.client.post("/api/projects",
                        data=json.dumps(dict(name="TestProject1",
                                             github="https://github.com/user/project")),
                        headers=self.get_api_headers(user_model.encode_auth_token(self.user2)))

    def get_api_headers(self, access_token=None):
        headers = {
            'Content-Type': 'application/json'
        }
        
        if access_token is not None:
            headers["Authorization"] = 'Bearer ' + access_token

        return headers


    @classmethod
    def tearDownClass(self):
        mongo.cx.drop_database(mongo.cx.get_default_database())
        mongo.cx.close()
        self.app_context.pop()

