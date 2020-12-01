import os
from flask import request, jsonify

from app.models.role import Role
from . import api

model = Role()

@api.route("/roles", methods=["GET"])
def find_roles():
    result = model.find()
    
    return jsonify({
        'status': 200,
        'msg': 'request ok',
        'result': result
    })


@api.route("/roles/<ObjectId:id>", methods=["GET"])
def find_role_by_id(id):
    role = model.find_one({"_id": id})

    return jsonify({
        'status': 200,
        'msg': 'request ok',
        'result': role
    })

