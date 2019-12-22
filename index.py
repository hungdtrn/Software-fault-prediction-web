import os

from app import create_app, mongo
import utils

app = create_app(os.getenv('FLASK_CONFIG') or 'default')
utils.init_database()

@app.shell_context_processor
def create_context():
    return dict(app=app, db=mongo.db)