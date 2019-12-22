from app.models.role import Role
from app.models.user import User

def init_database():
    # create user role and admin role

    role = Role()
    user_role = role.find_one({
        "name": "user"
    })
    admin_role = role.find_one({
        "name": "admin"
    })

    if user_role is None or admin_role is None:
        user_role = role.create({
            "name": "user"
        })

        admin_role = role.create({
            "name": "admin"
        })

        admin_role_id = str(admin_role.inserted_id)
    else:
        admin_role_id = str(admin_role['_id'])

    user = User()
    admin = user.find_one({
        "username": "admin"
    })

    if admin is None:
        user.create({
            "username": "admin",
            "password": "admin",
            "roleId": admin_role_id
        })

    