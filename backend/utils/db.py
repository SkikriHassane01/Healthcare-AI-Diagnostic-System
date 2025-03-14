from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from pathlib import Path
import sys

# add the models directory to the path 
backend_dir = Path(__file__).resolve().parents[1]
sys.path.append(str(backend_dir))


from models import *

from utils.logger import setup_logger
logger = setup_logger("Utils_DB")

db = SQLAlchemy()

def init_db(app):
    
    logger.info("Initializing database with the app")
    try:
        db.init_app(app)
        migrate = Migrate(app, db)
        
        with app.app_context():
            db.create_all()
            db.session.commit()
        logger.info("Database initialized successfully")
        return db
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        raise e