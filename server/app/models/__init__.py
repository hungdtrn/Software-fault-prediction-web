from .user import User
from .role import Role
from .project import Project
from .file import File
from .mlmodel import MLModel

def init_db(db):
    User.init_db(db.users)
    Role.init_db(db.roles)
    Project.init_db(db.projects)
    File.init_db(db.files)
    MLModel.init_db(db.models)

def ensure_unique():
    User.ensure_unique_properties()
    Role.ensure_unique_properties()
    Project.ensure_unique_properties()
    File.ensure_unique_properties()
    MLModel.ensure_unique_properties()