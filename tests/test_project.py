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

    def test_create_project_with_valid_link(self):
        pass

    def test_create_project_with_invalid_link(self):
        pass

    def test_create_project_with_files(self):
        pass

    def test_create_project_with_duplicated_name(self):
        pass

    def test_access_all_by_anonymous(self):
        pass

    def test_access_by_id_by_anonymous(self):
        pass

    def test_access_all_by_owner(self):
        pass

    def test_access_by_id_by_owner(self):
        pass

    def test_access_by_id_by_other_user(self):
        pass

    def test_view_a_folder_in_project(self):
        pass

    def test_view_a_file_in_project(self):
        pass

    def test_update_project_with_valid_name(self):
        pass

    def test_update_project_link(self):
        pass

    def test_update_project_with_invalid_link(self):
        pass

    def test_change_algoritm_in_file(self):
        pass

    def test_delet_file(self):
        pass