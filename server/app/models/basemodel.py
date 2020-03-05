from abc import ABC, abstractmethod

from bson import ObjectId
import jsonschema
from jsonschema import validators, Draft7Validator
from jsonschema.exceptions import ValidationError
from jsonschema.exceptions import SchemaError

def is_string_objectid(checker, instance):
    return (Draft7Validator.TYPE_CHECKER.is_type(instance, "string") or
            isinstance(instance, ObjectId))

type_checker = Draft7Validator.TYPE_CHECKER.redefine("string", is_string_objectid)
CustomValidator = validators.extend(Draft7Validator, type_checker=type_checker)

class BaseModel(ABC):
    @property
    @abstractmethod
    def schema(self):
        pass

    @property
    @abstractmethod
    def adapter(self):
        pass

    def validate(self, data):
        try:
            jsonschema.validate(data, self.schema, cls=CustomValidator)
        except ValidationError as e:
            return e, None
        except SchemaError as e:
            return e, None
        
        return None, data

    def find(self, query=None):
        mongo_result = self.adapter.find(query)
        result = []
        
        for rs in mongo_result:
            result.append(rs)

        return result       

    def find_one(self, query):
        if "_id" in query:
            if not isinstance(query["_id"], ObjectId):
                query["_id"] = ObjectId(query["_id"])
                
        return self.adapter.find_one(query)        

    def create(self, data):
        # validate data first
        err, data = self.validate(data)

        if err is not None:
            raise Exception("Data is not valid: {}".format(err))
        else:
            return self.adapter.insert_one(data)

    def update(self, selector, kudo):
        set_dict = {}
        for key, value in kudo.items():
            if key == "_id":
                continue
            
            set_dict[key] = value
        
        return self.adapter.update_one(selector, {
            "$set": set_dict
        }, upsert=False)

    def delete(self, selector):
        return self.adapter.delete_one(selector)