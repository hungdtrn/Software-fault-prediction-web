from flask import Blueprint

api = Blueprint("api", __name__)

from . import user, role, model, file, project