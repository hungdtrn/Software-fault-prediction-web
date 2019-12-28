import os
import shutil
import time
import json
import unittest

from bson import ObjectId
from flask import current_app

from app import create_app, mongo
from app.models import Project, User, File
from app.ml import MachineLearning
import utils

project_model = Project()
file_model = File()
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
        for f in os.listdir(self.app.config["CLONE_FOLDER"]):
            shutil.rmtree(os.path.join(self.app.config["CLONE_FOLDER"], f))
        mongo.cx.drop_database(mongo.cx.get_default_database())
        mongo.cx.close()
        self.app_context.pop()

    def get_api_headers(self, access_token=None):
        headers = {
            'Content-Type': 'application/json'
        }
        
        if access_token is not None:
            headers["Authorization"] = 'Bearer ' + access_token

        return headers

    def test_1_validate_github_link(self):
        invalid_link_1 = "fasdfasfsf"
        invalid_link_2 = "https://www.facebook.com/"
        invalid_link_3 = "http://github.com/edenton/"
        invalid_link_4 = "https://github.com/user/project/file/abcdef.py"
        valid_link_4 = "https://github.com/user/project.git"

        self.assertTrue((project_model.validate_github_link(invalid_link_1) or
                         project_model.validate_github_link(invalid_link_2) or
                         project_model.validate_github_link(invalid_link_3) or
                         project_model.validate_github_link(invalid_link_4) == False))
        
        self.assertTrue(project_model.validate_github_link(valid_link_4))

    def test_2_clone_github_link(self):
        link = "https://github.com/DuyHung21/jar_files.git"
        folder_name = project_model.clone_github_link(link)

        self.assertTrue(folder_name in os.listdir(self.app.config["CLONE_FOLDER"]))
        shutil.rmtree(os.path.join(self.app.config["CLONE_FOLDER"], folder_name))

    def test_3_anaylize_github_folder(self):
        link = "https://github.com/DuyHung21/jar_files.git"
        files_in_root_folder, _ = project_model.analyze_git_link(link)

        self.assertEqual(len(files_in_root_folder), 5)

    def test_4_create_project_without_token(self):
        response = self.client.post("/api/projects",
                                    data=json.dumps(dict(name="TestProject",
                                                         github="https://github.com/user/project")),
                                    headers=self.get_api_headers())

        self.assertEqual(response.status_code, 400)
        response_msg = response.get_json()

        self.assertTrue(response_msg["msg"] == "Authorization token is required.")
        self.assertTrue(response_msg["result"] is None)

    def test_5_create_project_with_invalid_token(self):
        response = self.client.post("/api/projects",
                                    data=json.dumps(dict(name="TestProject",
                                                         github="https://github.com/user/project")),
                                    headers=self.get_api_headers("foofoobarbarfoobarbarfoofoo"))

        self.assertEqual(response.status_code, 400)
        response_msg = response.get_json()

        self.assertTrue(response_msg["result"] is None)

    def test_6_create_project_with_invalid_link(self):
        # Login first
        response = self.client.post('/auth/login',
                                    data=json.dumps(dict(username = 'user1',
                                                         password = 'test')),
                                    headers=self.get_api_headers()
                                    )

        self.assertEqual(response.status_code, 200)
        access_token = response.get_json()['result']

        response = self.client.post("/api/projects",
                                    data=json.dumps(dict(name="TestProject",
                                                         github="https://www.facebook.com/")),
                                    headers=self.get_api_headers(access_token))

        self.assertEqual(response.status_code, 400)
        response_msg = response.get_json()

        self.assertTrue(response_msg["msg"] == "Github project link is not valid.")
        self.assertTrue(response_msg["result"] is None)

    def test_7_create_project_with_valid_link(self):
        # Login first
        response = self.client.post('/auth/login',
                                    data=json.dumps(dict(username = 'user1',
                                                         password = 'test')),
                                    headers=self.get_api_headers()
                                    )

        self.assertEqual(response.status_code, 200)
        access_token = response.get_json()['result']

        response = self.client.post("/api/projects",
                                    data=json.dumps(dict(name="TestProject",
                                                         github="https://github.com/DuyHung21/jar_files.git")),
                                    headers=self.get_api_headers(access_token))
        created_id = response.get_json()['result']
        self.assertEqual(response.status_code, 201)
        # The status of created project must be updating and the files most be empty
        created_project = project_model.find_one({"_id": ObjectId(created_id)})
        self.assertTrue(created_project["status"] == Project.UPDATE_STATUS)
        self.assertTrue(created_project["files"] is None or len(created_project["files"]) == 0)

        # After a while, the status of the project should change to done
        timeout = time.time() + 60*0.5
        initilized = False
        while True:
            created_project = project_model.find_one({"_id": ObjectId(created_id)})
            if created_project["status"] == Project.DONE_STATUS:
                initilized = True
                break
            
            if time.time() > timeout:
                break

            time.sleep(1)

        self.assertTrue(initilized)
        self.assertEqual(len(created_project["files"]), 5)
        
        test_file = file_model.find_one({
            "name": "commons-codec-1.3.jar",
            "projectId": ObjectId(created_id)
        })

        result_metrics = [6,0,2,4,21,15,2,2,0,2.0000,183,0.0000,0,0.0000,0.5556,0,0,29.5000]
        for m in test_file["metrics"]:
            if m["name"] != "org.apache.commons.codec.net.RFC1522Codec":
                continue

            for i, value in enumerate(result_metrics):
                self.assertEqual(m[MachineLearning.METRIC_ORDERS[i]], value)

    def test_8_access_all_by_anonymous(self):
        response = self.client.get("/api/projects",
                                    headers=self.get_api_headers())

        self.assertEqual(response.status_code, 400)
        response_msg = response.get_json()
        self.assertTrue(response_msg["msg"] == "Authorization token is required.")
        self.assertTrue(response_msg["result"] is None)

    def test_9_access_all_by_owner(self):
        # Login first
        response = self.client.post('/auth/login',
                                    data=json.dumps(dict(username = 'user1',
                                                         password = 'test')),
                                    headers=self.get_api_headers()
                                    )

        self.assertEqual(response.status_code, 200)
        access_token = response.get_json()['result']

        response = self.client.get("/api/projects",
                                    headers=self.get_api_headers(access_token))

        found_projects = response.get_json()["result"]
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(found_projects), 1)

    # def test_access_by_id_by_anonymous(self):
    #     pass

    # def test_access_by_id_by_owner(self):
    #     pass

    # def test_access_by_id_by_other_user(self):
    #     pass

    # def test_view_a_folder_in_project(self):
    #     pass

    # def test_view_a_file_in_project(self):
    #     pass

    # def test_update_project_with_valid_name(self):
    #     pass

    # def test_update_project_link(self):
    #     pass

    # def test_update_project_with_invalid_link(self):
    #     pass

    # def test_change_algoritm_in_file(self):
    #     pass

    # def test_delet_file(self):
    #     pass