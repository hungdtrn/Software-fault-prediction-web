import os
import io
import json
import unittest

from bson import ObjectId
from flask import current_app

from app import create_app, mongo
from app.models import User, MLModel
import utils

test_files_folder = os.path.join(os.getcwd(), "tests", "files")
user_model = User()
ml_model = MLModel()
class ProjectTestCase(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.app = create_app('testing')
        self.app_context = self.app.app_context()
        self.app_context.push()

        # create users
        self.user1 = utils.create_users("user1", "test", "user")
        self.user2 = utils.create_users("user2", "test", "user")

        # create admin
        self.admin = utils.create_users("admin", "admin", "admin")

        # get api client for testing
        self.client = self.app.test_client()
        
    @classmethod
    def tearDownClass(self):
        # remove upload files
        for f in os.listdir(self.app.config["SKLEARN_FOLDER"]):
            if os.path.isdir(os.path.join(self.app.config["SKLEARN_FOLDER"], f)):
                continue
            
            if not f.endswith(".pkl"):
                continue

            if f == "preprocessor.pkl":
                continue

            os.remove(os.path.join(self.app.config["SKLEARN_FOLDER"], f))
        mongo.cx.drop_database(mongo.cx.get_default_database())
        mongo.cx.close()
        self.app_context.pop()

    def get_api_headers(self, has_file=False, access_token=None):
        if not has_file:
            headers = {
                'Content-Type': 'application/json'
            }
        else:
            headers = {
                'Content-Type': 'multipart/form-data'
            }

        if access_token is not None:
            headers["Authorization"] = 'Bearer ' + access_token

        return headers


    def test_create_model_by_anonymous(self):
        response = self.client.post("/api/models", 
                                    data={"name": "tree",
                                          "file": (open(os.path.join(test_files_folder, "model_tree.pkl"), "rb"), "model_tree.pkl")},
                                    content_type='multipart/form-data')

        self.assertEqual(response.status_code, 400)
        response_msg = response.get_json()

        self.assertTrue(response_msg["msg"] == "Authorization token is required.")
        self.assertTrue(response_msg["result"] is None)

    def test_create_model_by_user(self):
        response = self.client.post("/api/models", 
                                    data={"name": "tree",
                                          "file": (open(os.path.join(test_files_folder, "model_tree.pkl"), "rb"), "model_tree.pkl")},
                                    content_type='multipart/form-data',
                                    headers=self.get_api_headers(access_token=user_model.encode_auth_token(self.user1).decode()))

        self.assertEqual(response.status_code, 400)
        response_msg = response.get_json()

        self.assertTrue(response_msg["msg"] == "Not allowed.")
        self.assertTrue(response_msg["result"] is None)

    def test_create_model_by_admin(self):
        response = self.client.post("/api/models", 
                                    data={"name": "tree",
                                          "file": (open(os.path.join(test_files_folder, "model_tree.pkl"), "rb"), "model_tree.pkl")},
                                    content_type='multipart/form-data',
                                    headers=self.get_api_headers(access_token=user_model.encode_auth_token(self.admin).decode()))
        self.assertEqual(response.status_code, 201)
        response_msg = response.get_json()

        created_model = ml_model.find_one({"_id":  ObjectId(response_msg["result"])})

        self.assertTrue(os.path.isfile(os.path.join(os.getcwd(), "files", created_model["url"])))

    def test_create_model_with_duplicated_name(self):
        response = self.client.post("/api/models", 
                                    data={"name": "tree",
                                          "file": (open(os.path.join(test_files_folder, "model_tree.pkl"), "rb"), "model_tree.pkl")},
                                    content_type='multipart/form-data',
                                    headers=self.get_api_headers(access_token=user_model.encode_auth_token(self.admin).decode()))
        self.assertEqual(response.status_code, 400)
        response_msg = response.get_json()
        self.assertTrue(response_msg["msg"] == "Model exist.")

    def test_create_model_with_empty_file(self):
        response = self.client.post("/api/models", 
                                    data={"name": "tree1"},
                                    content_type='multipart/form-data',
                                    headers=self.get_api_headers(access_token=user_model.encode_auth_token(self.admin).decode()))
        self.assertEqual(response.status_code, 400)

    def test_create_model_with_wrong_file_format(self):
        response = self.client.post("/api/models", 
                                    data={"name": "tree3",
                                          "file": (open(os.path.join(test_files_folder, "tmp"), "rb"), "model_tree.pkl")},
                                    content_type='multipart/form-data',
                                    headers=self.get_api_headers(access_token=user_model.encode_auth_token(self.admin).decode()))
        self.assertEqual(response.status_code, 400)
        response_msg = response.get_json()

        self.assertTrue(response_msg["msg"] == "Model file is not valid.")

    # def test_update_model_with_valid_file(self):
    #     pass

    # def test_delete_model(self):
    #     pass
