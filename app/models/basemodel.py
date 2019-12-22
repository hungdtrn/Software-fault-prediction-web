from abc import ABC, abstractmethod

import jsonschema
from jsonschema.exceptions import ValidationError
from jsonschema.exceptions import SchemaError


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
            jsonschema.validate(data, self.schema)
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
        return self.adapter.find_one(query)        

    def create(self, data):
        # validate data first
        err, data = self.validate(data)

        if err is not None:
            raise Exception("Data is not valid: {}".format(err))
        else:
            return self.adapter.insert_one(data)

    def update(self, selector, kudo):
        return self.adapter.update(selector, kudo)

    def delete(self, selector):
        return self.adapter.delete(selector)