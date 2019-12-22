from flask import Blueprint

api = Blueprint("routes", __name__)

from . import user, role, model, files, project