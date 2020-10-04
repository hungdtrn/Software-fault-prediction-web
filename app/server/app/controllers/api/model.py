import os
import time

import pickle
from flask import request, jsonify, current_app

from app.models import MLModel
from . import api
from ..decorators import authorization_required, admin_required


ml = MLModel()

@api.route("/models", methods=["POST"])
@authorization_required
@admin_required
def create_model():
    request_form = request.form

    if request_form is None or len(request_form) == 0:
        request_form = request.get_json()

    if ml.find_one({"name": request_form["name"]}) is not None:
        return jsonify({
            "msg": "Model exist.",
            "result": None
        }), 400

    if request.files is None:
        return jsonify({
            "msg": "File empty.",
            "result": None
        }), 400

    model_file = request.files["file"]
    try:
        model = pickle.load(model_file)
        is_valid = ml.validate_model(model)

        if not is_valid:
            return jsonify({
                "msg": "Model file is not valid.",
                "result": None
            }), 400

        # Save model
        model_name = str(time.time()) + "_" + model_file.filename 
        with open(os.path.join(current_app.config["SKLEARN_FOLDER"], model_name), "wb") as f:
            pickle.dump(model, f)

        created_id = ml.create({
            "name": request_form["name"],
            "url": model_name
        }).inserted_id

        return  jsonify({
            "msg": "Model created",
            "result": {
                "_id": created_id,
                "name": request_form["name"],
            }
        }), 201

    except Exception as e:
        return jsonify({
            "msg": "Model file is not valid.",
            "result": None
        }), 400

@api.route("/models", methods=["PUT"])
@authorization_required
@admin_required
def edit_model():
    request_form = request.form

    if request_form is None or len(request_form) == 0:
        request_form = request.get_json()

    try:
        if request.files is not None:
            model_file = request.files["file"]
            model = pickle.load(model_file)
            is_valid = ml.validate_model(model)

            if not is_valid:
                return jsonify({
                    "msg": "Model file is not valid.",
                    "result": None
                }), 400

            # Save model
            model_name = str(time.time()) + "_" + model_file.filename 
            with open(os.path.join(current_app.config["SKLEARN_FOLDER"], model_name), "wb") as f:
                pickle.dump(model, f)

            request_form["url"] = model_name

        result = ml.update({
            request_form
        }), 200

        return jsonify({
            "msg": "Model updated",
            "result": request_form
        })

    except Exception as e:
        return jsonify({
            "msg": "Model file is not valid.",
            "result": None
        }), 400
    
@api.route("/models", methods=["GET"])
@authorization_required
def find_model():
    try:
        return jsonify({
            "msg": None,
            "result": ml.find({})
        }), 200
    except Exception as e:
        return jsonify({
            "msg": str(e),
            "result": None
        })


        