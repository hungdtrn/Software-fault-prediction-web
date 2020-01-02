import os
from flask import request, jsonify, current_app
from bson import ObjectId
import pickle

from app.models.file import File
from app.models.mlmodel import MLModel

from . import api
from ..decorators import authorization_required

file_model = File()
ml_model = MLModel()

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
    file = file_model.find_one({"_id": id, "projectId": ObjectId(request.args.get("projectId"))})
    childs = []

    if "childs" in file:
        for sf in file["childs"]:
            childs.append(file_model.find_one({"_id": sf}))

        file["childs"] = childs

    return jsonify({
        'msg': 'request ok',
        'result': file
    }), 200


@api.route("/files/<ObjectId:id>/predict", methods=["POST"])
@authorization_required
def predict_file(id):
    # get request body
    request_form = request.get_json()

    # get the file
    file_json = file_model.find_one({"_id": id})

    # get model json
    mlmodel_json = ml_model.find_one({"_id": request_form["modelId"]})
    print(os.path.join(current_app.config["SKLEARN_FOLDER"], mlmodel_json["url"]))
    try:
        # load ml model
        with open(os.path.join(current_app.config["SKLEARN_FOLDER"], mlmodel_json["url"]), 'rb') as f:
            ml_model_file = pickle.load(f)

        result = ml_model.predict(file_json["metrics"], ml_model_file)
        
        file_json["metrics"] = result
    
        file_model.update({"_id": file_json["_id"]}, file_json)
        
        return jsonify({
            'msg': 'predicted',
            'result': id
        }), 200
    except Exception as e:
        return jsonify({
            'msg': str(e),
            'result': None
        }), 200
