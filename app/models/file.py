from .basemodel import BaseModel

class File(BaseModel):
    dbadapter = None

    def __init__(self):
        super(File, self).__init__()
        assert File.dbadapter is not None, "Database adapter is not intialized"
        self.adapter = File.dbadapter

    @property
    def schema(self):
        return {
            "type": "object",
            "properties": {
                "projectId": {
                    "type": "string"
                },
                "parentId": {
                    "type": "string"
                },
                "name": {
                    "type": "string"
                },
                "isroot": {
                    "type": "boolean",
                    "default": False
                }
            },
            "required": ["projectId", "name"],
            "additionalProperties": False
        }

    @BaseModel.adapter.setter
    def adapter(self, adapter):
        self.adapter = adapter

    @staticmethod
    def init_db(adapter):
        File.dbadapter = adapter
