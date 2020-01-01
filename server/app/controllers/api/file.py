import os
from flask import request, jsonify
from bson import ObjectId

from app.models.file import File
from . import api
from ..decorators import authorization_required

model = File()

# @api.route("/files", methods=["GET"])
# def find_roles():
#     reque
#     result = model.find({"projectId": })
    
#     return jsonify({
#         'status': 200,
#         'msg': 'request ok',
#         'result': result
#     })


@api.route("/files/<ObjectId:id>", methods=["GET"])
@authorization_required
def find_file_by_id(id):
    file = model.find_one({"_id": id, "projectId": ObjectId(request.args.get("projectId"))})
    childs = []

    if "childs" in file:
        for sf in file["childs"]:
            childs.append(model.find_one({"_id": sf}))

        file["childs"] = childs

    return jsonify({
        'msg': 'request ok',
        'result': file
    }), 200

