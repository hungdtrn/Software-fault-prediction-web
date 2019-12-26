import pickle
import numpy as np
import pandas
import sklearn

from .basemodel import BaseModel
from ..ml import MachineLearning

class MLModel(BaseModel):
    def __init__(self):
        super(MLModel, self).__init__()
        assert MLModel.dbadapter is not None, "Database adapter is not intializzed"
        self.__dbadapter = None

    @property
    def schema(self):
        return {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string"
                },
                "description": {
                    "type": "string"
                },
                "url": {
                    "type": "string"
                }
            },
            "required": ["name", "url"],
            "additionalProperties": False
        }

    @property
    def adapter(self):
        if self.__dbadapter is None: 
            return MLModel.dbadapter
        else:
            return self.__dbadapter

    @adapter.setter
    def adapter(self, adapter):
        self.__dbadapter = adapter

    @staticmethod
    def init_db(adapter):
        MLModel.dbadapter = adapter

    @staticmethod
    def ensure_unique_properties():
        # Ensure unique properties
        try:
            MLModel.dbadapter.create_index("name", unique=True)
        except Exception as e:
            print("Warning in ensuring unique mlmodel properties: ", str(e))

    def validate_model(self, model):
        try:
            return MachineLearning.test_model(model)
        except Exception:
            return False