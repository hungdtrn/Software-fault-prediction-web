import bcrypt
from bson import ObjectId

from .basemodel import BaseModel

def remove_sensitive_property(user):
    if user is None:
        return

    del user['hash']
    del user['salt']

class User(BaseModel):
    dbadapter = None

    def __init__(self):
        super(User, self).__init__()
        assert User.dbadapter is not None, "Database adapter is not intialized"

    @property
    def schema(self):
        return {
            "type": "object",
            "properties": {
                "username": {
                    "type": "string"
                },
                "email": {
                    "type": "string"
                },
                "roleId": {
                    "type": "string"
                },
                "salt": {
                    "type": "string"
                },
                "hash": {
                    "type": "string"
                }
            },
            "required": ["username", "salt", "hash", "roleId"],
            "additionalProperties": False
        }

    @property
    def adapter(self):
        return User.dbadapter

    @staticmethod
    def init_db(adapter):
        User.dbadapter = adapter

    def find(self, query=None):
        users = super().find(query)
        for u in users:
            remove_sensitive_property(u)
        
        return users

    def find_one(self, query):
        user = super().find_one(query)
        remove_sensitive_property(user)

        return user
    
    def validate_user(self, username, password):
        user = super().find_one({'username': username})

        if user is None:
            raise Exception("Username not found")

        if not bcrypt.checkpw(password.encode(), user['hash'].encode()):
            raise Exception("Password is incorrect")
        
        remove_sensitive_property(user)

        return user

    def create(self, data):
        salt = bcrypt.gensalt()
        hash_ = bcrypt.hashpw(data['password'].encode(), salt)

        user = {
            'username': data['username'],
            'roleId': ObjectId(data['roleId']),
            'hash': hash_.decode(),
            'salt': salt.decode()
        }

        return super(User, self).create(user).inserted_id