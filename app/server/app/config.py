import os

from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))

# Load env variables
load_dotenv()

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY") or 'this is a secrettttt'
    TOKEN_EXP = os.environ.get("TOKEN_EXP") or 2592000
    CLONE_FOLDER = os.path.join(os.getcwd(), "tmp")
    SKLEARN_FOLDER = os.path.join(os.getcwd(), "files")
    DATASET_PATH = os.path.join(os.getcwd(), "files", "dataset", "class.csv")
    CKJM_PATH = os.path.join(os.getcwd(), "files", "ckjm_ext.jar")

    @staticmethod
    def init_app(app):
        pass

class DevelopmentConfig(Config):
    DEBUG = True
    MONGO_URI = os.environ.get("MONGO_URI", os.environ.get("MONGO_URI"))

class TestingConfig(Config):
    TESTING = True
    MONGO_URI = os.environ.get("MONGO_URI", os.environ.get("MONGO_URI"))

class ProductionConfig(Config):
    MONGO_URI = os.environ.get("MONGO_URI", os.environ.get("MONGO_URI"))

config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}