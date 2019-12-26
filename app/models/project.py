import os
import re
import time
import shutil

from flask import current_app as app
from git import Repo

from .basemodel import BaseModel
from ..ml import MachineLearning

def explore(p):
    result = {
        "name": os.path.basename(p),
        "path": p,
        "childs": None,
    }

    if os.path.isdir(p):
        childs = []
        for c in os.listdir(p):
            childs.append(explore(os.path.join(p, c)))
    
        result["childs"] = childs

    return result

class Project(BaseModel):
    UPDATE_STATUS = "updating"
    DONE_STATUS = "done"
    
    def __init__(self):
        super(Project, self).__init__()
        assert Project.dbadapter is not None, "Database adapter is not intializzed"
        self.__dbadapter = None

    @property
    def schema(self):
        return {
            "type": "object",
            "properties": {
                "userId": {
                    "type": "string"
                },
                "name": {
                    "type": "string"
                },
                "github": {
                    "type": "string"
                },
                "status": {
                    "type": "string"
                },
                "files": {
                    "type": "array"
                }
            },
            "required": ["name", "userId", "github"],
            "additionalProperties": False
        }

    @property
    def adapter(self):
        if self.__dbadapter is None: 
            return Project.dbadapter
        else:
            return self.__dbadapter

    @adapter.setter
    def adapter(self, adapter):
        self.__dbadapter = adapter

    @staticmethod
    def init_db(adapter):
        Project.dbadapter = adapter

    @staticmethod
    def ensure_unique_properties():
        return

    def validate_github_link(self, link):
        pattern = re.compile(r"^https\:\/\/github\.com\/[^\/]+\/[^\/]+\.git$")
        return re.match(pattern, link) is not None

    def clone_github_link(self, link):
        git_folder_name = link.split("/")[-1].replace(".git", "_" + str(time.time()))
        clone_git_to = os.path.join(app.config["CLONE_FOLDER"], git_folder_name)
        Repo.clone_from(link, clone_git_to)

        return git_folder_name

    def analyze_git_link(self, link):
        # clone github project to temp folder
        folder_name = self.clone_github_link(link)
        folder_path = os.path.join(app.config["CLONE_FOLDER"], folder_name)
        assert  os.path.isdir(folder_path), "Some think went wrong when cloning git project"

        # analyze project folder
        root_folder = []
        for d in os.listdir(folder_path):
            if d == ".git":
                continue
            root_folder.append(explore(os.path.join(folder_path, d)))

        return root_folder, folder_path

    def remove_git_folder(self, folder_path):
        # remove tmp folder
        shutil.rmtree(folder_path)
