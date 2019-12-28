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
        model_file.save(os.path.join(current_app.config["SKLEARN_FOLDER"], model_name))

        created_id = ml.create({
            "name": request_form["name"],
            "url": model_name
        }).inserted_id

        return  jsonify({
            "msg": "Modle created",
            "result": created_id
        }), 201

    except Exception:
        return jsonify({
            "msg": "Model file is not valid.",
            "result": None
        }), 400

