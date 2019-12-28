from functools import wraps
from flask import request, jsonify, g

from ..models import User, Role

user_model = User()
role_model = Role()

def authorization_required(f):
    @wraps(f)
    def has_authorization(*args, **kwargs):
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].replace("Bearer ", "")
            try:
                decoded_token = user_model.decode_auth_token(token)
                g.current_user = {
                    "_id": decoded_token["_id"],
                    "roleId": decoded_token["roleId"]
                }
                return f(*args, **kwargs)
            except Exception as e:
                return jsonify({
                    "msg": "Token invalid: " + str(e),
                    "result": None
                }), 400
        else:
            return jsonify({
                "msg": "Authorization token is required.",
                "result": None
            }), 400
        
    return has_authorization

def admin_required(f):
    @wraps(f)
    def is_admin(*args, **kwargs):
        if not g.current_user:
            return jsonify({
                "msg": "Authorization token is required.",
                "result": None
            }), 400
        else:
            role = role_model.find_one({"_id": g.current_user["roleId"]})
            if role is None or role["name"] != "admin":
                return jsonify({
                    "msg": "Not allowed.",
                    "result": None
                }), 400 
            else:
                return f(*args, **kwargs)
    
    return is_admin
    
