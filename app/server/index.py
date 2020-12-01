import os

from app import create_app, mongo

import utils

mode = os.getenv('FLASK_CONFIG') or 'default'

app = create_app(mode)

# create default user and admin
if mode != 'production':
    utils.create_users(username="admin", email="admin@admin.com", 
                       password="admin", firstname="admin", 
                       lastname="admin", role_name="admin")
    utils.create_users(username="user", email="user@user.com", 
                       password="user", firstname="user", 
                       lastname="user", role_name="user")


@app.shell_context_processor
def create_context():
    return dict(app=app, db=mongo.db)


@app.cli.command()
def test():
    """"run the unittest"""
    import unittest
    tests = unittest.TestLoader().discover('tests')

    unittest.TextTestRunner(verbosity=2).run(tests)