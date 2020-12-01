import sys
import os

import json

from app.models.role import Role
from app.models.user import User

def find_or_create_role(role_name):
    # create user role and admin role
    model = Role()

    role = model.find_one({"name": role_name})

    if role is None:
        roleId = model.create({"name": role_name}).inserted_id
        role = model.find_one({"_id": roleId})


    return role
    
def create_users(username, email, password, firstname, lastname, role_name):
    user_model = User()

    role = find_or_create_role(role_name)
    
    user = user_model.find_one({"username": username})
    if user is None:
        userId = user_model.create({
            "username": username,
            "email": email,
            "firstname": firstname,
            "lastname": lastname,
            "password": password,
            "roleId": str(role["_id"])    
        }).inserted_id

        user = user_model.find_one({"_id": userId})

    return user