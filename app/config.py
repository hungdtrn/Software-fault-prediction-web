import os

from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))

# Load env variables
load_dotenv()

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY") or 'this is a secrettttt'

    @staticmethod
    def init_app(app):
        pass

class DevelopmentConfig(Config):
    DEBUG = True
    MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017/devlearnflask")

class TestingConfig(Config):
    TESTING = True
    MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017/testlearnflask")

class ProductionConfig(Config):
    MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017/prolearnflask")

config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}