import unittest
from flask import current_app
from app import create_app, mongo

class UserTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app('testing')
        self.app_context = self.app.app_context()
        self.app_context.push()

    def tearDown(self):
        mongo.drop_database(mongo.get_default_database())

    