import os
from flask import request, jsonify

from app.models import User
from app.models import Role
from . import api

user = User()
role = Role()

@api.route("/auth/login", methods=["POST"])
def login():
    status = 200
    err = None,
    result = None

    request_form = request.get_json()
    
    try:
        login_user = user.validate_user(request_form['username'], request_form['password'])
        user_role = role.find_one({"_id": login_user["roleId"]})
        result = user.encode_auth_token({"_id": login_user["_id"], "role": user_role["name"]}).decode()
    except Exception as e:
        status = 400
        err = str(e)

    return jsonify({
        "msg": err,
        "result": result
    }), status


@api.route("/auth/register", methods=["POST"])
def register():
    # get request body
    request_form = request.get_json()

    # check if username exist
    user_exist = user.find_one({"username": request_form["username"]}) is not None

    if user_exist:
        return jsonify({
            "msg": "Username duplicated.",
            "result": None
        }), 400

    # Find user role
    user_role = role.find_one({
        "name": "user"
    })

    try:
        createdId = user.create({
            "username": request_form["username"],
            "password": request_form["password"],
            "firstname": request_form["firstname"],
            "lastname": request_form["lastname"],
            "email": request_form["email"],
            "roleId": str(user_role["_id"]),
        }).inserted_id

        access_token = user.encode_auth_token({'_id': createdId, 
                                               'role': "user"
                                              })

        return jsonify({
            "msg": "Successfully registered.",
            "result": access_token.decode()
        }), 201

    except Exception as e:
        print(e)
        return jsonify({
            "msg": str(e),
            "result": None
        }), 400