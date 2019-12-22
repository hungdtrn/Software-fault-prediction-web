import json
import unittest

from flask import current_app

from app import create_app, mongo
import utils

class ProjectTestCase(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.app = create_app('testing')
        self.app_context = self.app.app_context()
        self.app_context.push()

        # create users
        utils.create_users("user1", "test", "user")
        utils.create_users("user2", "test", "user")

        # create admin
        utils.create_users("admin", "admin", "admin")

        # get api client for testing
        self.client = self.app.test_client()
        
    @classmethod
    def tearDownClass(self):
        mongo.cx.drop_database(mongo.cx.get_default_database())
        mongo.cx.close()
        self.app_context.pop()

    def test_create_model_by_anonymous(self):
        pass

    def test_create_model_by_user(self):
        pass

    def test_create_model_by_admin(self):
        pass

    def test_create_model_sucess(self):
        pass

    def test_create_model_with_duplicated_name(self):
        pass

    def test_create_model_with_empty_file(self):
        pass

    def test_create_model_with_wrong_file_format(self):
        pass

    def test_update_model_with_wrong_file_format(self):
        pass

    def test_update_model_with_valid_file(self):
        pass

    def test_delete_model(self):
        pass
