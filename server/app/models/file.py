from .basemodel import BaseModel

class File(BaseModel):
    dbadapter = None

    def __init__(self):
        super(File, self).__init__()
        assert File.dbadapter is not None, "Database adapter is not intialized"
        self.__dbadapter = None

    @property
    def schema(self):
        return {
            "type": "object",
            "properties": {
                "projectId": {
                    "type": "string"
                },
                "name": {
                    "type": "string"
                },
                "childs": {
                    "type": "array"
                },
                "metrics": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "name": {
                                "type": "string"
                            },
                            "wmc": {
                                "type": "number"
                            },
                            "dit": {
                                "type": "number"
                            },
                            "noc": {
                                "type": "number"
                            },
                            "cbo": {
                                "type": "number"
                            },
                            "rfc": {
                                "type": "number"
                            },
                            "lcom": {
                                "type": "number"
                            },
                            "ca": {
                                "type": "number"
                            },
                            "ce": {
                                "type": "number"
                            },
                            "npm": {
                                "type": "number"
                            },
                            "lcom3": {
                                "type": "number"
                            },
                            "lco": {
                                "type": "number"
                            },
                            "dam": {
                                "type": "number"
                            },
                            "moa": {
                                "type": "number"
                            },
                            "mfa": {
                                "type": "number"
                            },
                            "cam": {
                                "type": "number"
                            },
                            "ic": {
                                "type": "number"
                            },
                            "cbm": {
                                "type": "number"
                            },
                            "amc": {
                                "type": "number"
                            },
                            "max_cc": {
                                "type": "number"
                            },
                            "avg_cc": {
                                "type": "number"
                            },
                            "bug": {
                                "type": "number"
                            },
                        },
                        "additionalProperties": False
                    }
                },
                "mlmodel": {
                    "type": "string"
                },
            },
            "required": ["projectId", "name"],
            "additionalProperties": False
        }

    @property
    def adapter(self):
        if self.__dbadapter is None: 
            return File.dbadapter
        else:
            return self.__dbadapter

    @adapter.setter
    def adapter(self, adapter):
        self.__dbadapter = adapter

    @staticmethod
    def init_db(adapter):
        File.dbadapter = adapter

    @staticmethod
    def ensure_unique_properties():
        return
