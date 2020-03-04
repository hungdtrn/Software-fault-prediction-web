import os
from multiprocessing import Process

from flask import request, jsonify, g, current_app
from flask_pymongo import PyMongo

from app.models import Project, File
from app.ml import MachineLearning
from . import api
from ..decorators import authorization_required


project_model = Project()
file_model = File()

def create_file(projectId, f, file_model):
    if f["childs"] is None:
        # if f is a file
        # extract metrics from jar file

        model_to_be_saved = {}
        if f["name"].endswith(".jar"):
            extracted_metrics = MachineLearning.extract_metrics(os.path.dirname(f["path"]), f["name"])
            
            if extracted_metrics is not None:
                proccessed_metrics = []
                for m in extracted_metrics:
                    metric_data = {}
                    c_name = m["name"]
                    for i, value in enumerate(m["metrics"]):
                        metric_data[MachineLearning.METRIC_ORDERS[i]] = value
                    
                    metric_data["name"] = c_name
                    proccessed_metrics.append(metric_data)

                model_to_be_saved["metrics"] = proccessed_metrics

        model_to_be_saved["projectId"] = projectId
        model_to_be_saved["name"] = f["name"]

        file_id = file_model.create(model_to_be_saved).inserted_id
    else:
        childs = []
        for c in f["childs"]:
            childs.append(create_file(projectId, c, file_model))
        
        file_id = file_model.create({
            "projectId": projectId,
            "name": f["name"],
            "childs": childs
        }).inserted_id

    return file_id

def new_process_analyze_project(projectId, github):
    # Since the function will be running in another process
    # We have to create another Pymongo connection to prevent conflicts
    # More detail visit https://flask-pymongo.readthedocs.io/en/latest/ and 
    # https://api.mongodb.com/python/current/faq.html#is-pymongo-fork-safe
    new_mongo = PyMongo(current_app)
    new_file_model = File()
    new_project_model = Project()

    # use created connection to perform queries in process
    new_file_model.adapter = new_mongo.db.files
    new_project_model.adapter = new_mongo.db.projects

    project_folder, project_path = project_model.analyze_git_link(github)

    files = []
    for f in project_folder:
        files.append(create_file(projectId, f, new_file_model))

    new_project_model.update({"_id": projectId}, {"files": files, "status": Project.DONE_STATUS})

    # remove tmp git folder
    project_model.remove_git_folder(project_path)

    # End connnection in process
    new_mongo.cx.close()

@api.route("/projects", methods=["POST"])
@authorization_required
def create_project():
    # get request body
    request_form = request.get_json()

    # validate github link
    if project_model.validate_github_link(request_form["github"]):
        try:
            projectId = project_model.create({
                "userId": g.current_user["_id"],
                "name": request_form["name"],
                "github": request_form["github"],
                "files": [],
                "status": Project.UPDATE_STATUS,
            }).inserted_id

            analyzing_process = Process(target=new_process_analyze_project, args=(projectId, 
                                                                      request_form["github"],))
            analyzing_process.start()

            return jsonify({
                "msg": "Project created",
                "result": {
                    "_id": projectId,
                    "userId": g.current_user["_id"],
                    "name": request_form["name"],
                    "github": request_form["github"],
                    "files": [],
                    "status": Project.UPDATE_STATUS,
                }
            }), 201
        except Exception as e:
            print(e)
            return jsonify({
                "msg": "Error occur: " + str(e),
                "result": None
            }), 400

    else:
        return jsonify({
            "msg": "Github project link is not valid.",
            "result": None
        }), 400

@api.route("/projects", methods=["GET"])
@authorization_required
def find_project():
    return jsonify({
        "msg": None,
        "result": project_model.find({"userId": g.current_user["_id"]})
    })

@api.route("/projects/<ObjectId:id>", methods=["GET"])
@authorization_required
def find_project_by_id(id):
    try:
        selected_project = project_model.find_one({"_id": id, "userId": g.current_user["_id"]})
        files = []

        for fid in selected_project["files"]:
            files.append(file_model.find_one({"_id": fid}))
        
        selected_project["files"] = files

        return jsonify({
            "msg": None,
            "result": selected_project
        }), 200
    except Exception as e:
        return jsonify({
            "msg": str(e),
            "result": None,
        }), 400
