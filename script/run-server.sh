#!/bin/sh

pip install -r requirements.txt
export FLASK_APP=index.py
python -m flask run