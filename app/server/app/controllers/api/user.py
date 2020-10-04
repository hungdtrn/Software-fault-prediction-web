import os
from flask import request, jsonify

from app.models.user import User
from app.models.role import Role
from . import api

user = User()
role = Role()

@api.route("/users", methods=["GET"])
def find_users():
    result = user.find()
    
    return jsonify({
        'msg': None,
        'result': result
    }), 200


@api.route("/users/<ObjectId:id>", methods=["GET"])
def find_user_by_id(id):
    result = user.find_one({"_id": id})
    
    return jsonify({
        'msg': None,
        'result': result
    }), 200




