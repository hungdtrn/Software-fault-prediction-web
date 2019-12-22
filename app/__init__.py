import os
import json
import datetime
from bson.objectid import ObjectId

from flask import Flask
from flask_pymongo import PyMongo
from flask import Blueprint

from .config import config
from .models import User, Role

mongo = PyMongo()

class JSONEncoder(json.JSONEncoder):
    ''' extend json-encoder class'''

    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        if isinstance(o, set):
            return list(o)
        if isinstance(o, datetime.datetime):
            return str(o)
        return super(JSONEncoder, self).default(o)


def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)

    # init mongodb connection
    mongo.init_app(app, uri=config[config_name].MONGO_URI)

    # attach mongo collections to models
    User.init_db(mongo.db.users)
    Role.init_db(mongo.db.roles)

    from .controllers import api
    app.register_blueprint(api)

    app.json_encoder = JSONEncoder
    return app