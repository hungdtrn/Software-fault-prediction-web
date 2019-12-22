from .basemodel import BaseModel


class MLModel(BaseModel):
    def __init__(self):
        super(MLModel, self).__init__()

    @property
    def schema(self):
        return {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string"
                },
                "fileUrl": {
                    "type": "string"
                },
            },
            "required": ["fileUrl", "name"],
            "additionalProperties": False
        }