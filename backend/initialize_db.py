import sys
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).resolve().parent))

from utils.db import db
from utils.logger import setup_logger
from models.user import User
from models.patient import Patient
from models.diagnostic import DiabetesPrediction, BrainTumorPrediction
from app import app

logger = setup_logger("db_init")

def initialize_database():
    """
    Initialize the database by creating all tables defined in models.
    """
    try:
        with app.app_context():
            logger.info("Creating database tables...")
            db.create_all()
            logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Error creating database tables: {str(e)}")
        raise

if __name__ == "__main__":
    initialize_database()
