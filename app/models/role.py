from .basemodel import BaseModel

class Role(BaseModel):
    dbadapter = None

    def __init__(self, ):
        super(Role, self).__init__()
        assert Role.dbadapter is not None, "Database adapter is not intialized"

    @property
    def schema(self):
        return {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string"
                },
            },
            "required": ["name"],
            "additionalProperties": False
        }

    @property
    def adapter(self):
        return Role.dbadapter

    @staticmethod
    def init_db(adapter):
        Role.dbadapter = adapter

    @staticmethod
    def ensure_unique_properties():
        # Ensure unique properties
        try:
            Role.dbadapter.create_index("name", unique=True)
        except Exception as e:
            print("Warning in ensuring unique user properties: ", str(e))
