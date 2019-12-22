from .basemodel import BaseModel


class Project(BaseModel):
    def __init__(self):
        super(Project, self).__init__()
    
    @property
    def schema(self):
        return {
            "type": "object",
            "properties": {
                "userId": {
                    "type": "string"
                },
                "name": {
                    "type": "string"
                },
                "github": {
                    "type": "string"
                }
            },
            "required": ["name", "userId"],
            "additionalProperties": False
        }