import subprocess
import re
from os.path import dirname, abspath
import os
import pickle

import pandas as pd
import numpy as np
import sklearn
from sklearn.preprocessing import MinMaxScaler, LabelBinarizer
from sklearn.base import BaseEstimator, TransformerMixin

class Preprocessor(BaseEstimator, TransformerMixin):
    def __init__(self, pos_label="Y"):
        self.pos_label = pos_label
        self.columns = []
        self.label_encoder = LabelBinarizer()
        self.scaler = MinMaxScaler()
    
    def fill_na(self, data):
        return data.fillna(data.mean(axi=1))
    
    def transfrom_to_pandas(self, data):
        return pd.DataFrame(data, columns=self.columns)
        
    def fit(self, pandas_data):
        self.columns = pandas_data.columns
        np_data = pandas_data.to_numpy()

        X, y = np_data[:, 0:-1], np_data[:, -1]
        
        self.label_encoder.fit(y)
        self.scaler.fit(X)
    
    def transform(self, data):
        if isinstance(data, np.ndarray):
            pandas_data = self.transfrom_to_pandas(data)
        elif isinstance (data, pd.DataFrame):
            pandas_data = data
        else:
            raise Exception("Data must be either np.ndarray or pd.DataFrame")
            
        # Replace missing values
        pandas_data = pandas_data.fillna(pandas_data.mean(axis=1))

        # Remove duplicate
        pandas_data = pandas_data.drop_duplicates()
                
        # change to ndarray
        np_data = pandas_data.to_numpy()
        X, y = np_data[:, 0:-1], np_data[:, -1]
        
        # normalize X
        X = self.scaler.transform(X)
        y = self.label_encoder.transform(y)
        
        return X, y
    
    def transform_x(self, X):
        return self.scaler.transform(X)
    
    def transform_y(self, y):
        return self.label_encoder.transform(y)
    
    def decode_label(self, y):
        return self.label_encoder.inverse_transform(y)
        

class PreprocessorUnpickler(pickle.Unpickler):

    def find_class(self, module, name):
        if name == 'Preprocessor':
            return Preprocessor
        return super().find_class(module, name)


class MachineLearning(object):
    PREPROCESSOR = None
    DATASET = None
    CKJM_PATH = None
    METRIC_ORDERS = ["wmc", "dit", "noc", "cbo", "rfc", "lcom", "ca", "ce", "npm",
                     "lcom3", "lco", "dam", "moa", "mfa", "cam", "ic", "cbm", "amc",
                     "max_cc", "avg_cc"]

    @staticmethod
    def intialize(config):
        MachineLearning.PREPROCESSOR = PreprocessorUnpickler(open(os.path.join(config["SKLEARN_FOLDER"], "preprocessor.pkl"), "rb")).load()
        MachineLearning.DATASET = pd.read_csv(config["DATASET_PATH"])
        MachineLearning.CKJM_PATH = config["CKJM_PATH"]

    @staticmethod
    def test_model(model):
        X, _ = MachineLearning.PREPROCESSOR.transform(MachineLearning.DATASET)
        pred_label = MachineLearning.PREPROCESSOR.decode_label(model.predict(X))
        return pred_label is not None

    @staticmethod
    def extract_metrics(jar_location, jar_name):
        data = []

        command = ["java", "-classpath", jar_location, "-jar", MachineLearning.CKJM_PATH,
                   os.path.join(jar_location, jar_name)]

        p = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)

        output_string = p.communicate()[0].decode("utf-8")

        classes_string = output_string.strip().split("\n\n")
        extract_regex = r'(?P<class>(?P<name>.+)(?P<metrics>(?:\s\d+\.*\d*){18})(?P<funcs>(?:\s*~.+\d+)*))'
        extract_cc_regex = r'\s~.+:\s(?P<cc>\d+)'

        if not output_string:
            return None

        for class_string in classes_string:
            class_data = {}

            class_info = re.search(extract_regex, class_string)
            class_data['name'] = class_info.group('name')
            metrics_string = class_info.group('metrics')
            funcs_string = class_info.group('funcs')

            metrics = metrics_string.strip().split(" ")
            metrics = [float(m) for m in metrics]

            ccs = re.findall(extract_cc_regex, funcs_string)
            ccs = [float(cc) for cc in ccs]

            max_cc = 0
            avg_cc = 0

            if len(ccs) != 0:
                max_cc = np.max(ccs)
                avg_cc = np.average(ccs)

            metrics.append(max_cc)
            metrics.append(avg_cc)

            class_data['metrics'] = metrics

            data.append(class_data)

        return data