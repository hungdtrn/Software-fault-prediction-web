import os
from flask import request, jsonify

from app.models.file import File
from . import api

# model = File()

# @api.route("/files", methods=["GET"])
# def find_roles():
#     reque
#     result = model.find({"projectId": })
    
#     return jsonify({
#         'status': 200,
#         'msg': 'request ok',
#         'result': result
#     })


# @api.route("/roles/<ObjectId:id>", methods=["GET"])
# def find_role_by_id(id):
#     role = model.find_one({"_id": id})

#     return jsonify({
#         'status': 200,
#         'msg': 'request ok',
#         'result': role
#     })

