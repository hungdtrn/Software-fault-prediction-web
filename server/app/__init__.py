import os
import json
import datetime
from bson.objectid import ObjectId

from flask import Flask
from flask_pymongo import PyMongo
from flask import Blueprint

from .models import init_db, ensure_unique
from .config import config
from .ml import MachineLearning

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
    init_db(mongo.db)

    # setup machine learning environments
    MachineLearning.intialize(app.config)

    # add unique constrains to properties
    ensure_unique()

    from .controllers import api_blueprint , auth_blueprint
    app.register_blueprint(auth_blueprint, url_prefix="/auth")
    app.register_blueprint(api_blueprint, url_prefix="/api")

    app.json_encoder = JSONEncoder
    return app