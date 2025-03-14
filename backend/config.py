from dotenv import load_dotenv
import os 

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY','my_production_secret_key')
    DEBUG = True
    
    # Database
    SQLALCHEMY_DATABASE_URI = 'postgresql://{}:{}@{}:{}/{}'.format(
        os.environ.get("DB_USERNAME", 'postgres'),
        os.environ.get("DB_PASSWORD", 'postgres'),
        os.environ.get("DB_HOST", 'db'),
        os.environ.get("DB_PORT", '5432'),
        os.environ.get("DB_NAME", 'healthcare_ai')
    )
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False # Turn off update messages from sqlalchemy