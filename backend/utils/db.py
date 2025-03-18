from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

# Initialize DB instance without importing models
db = SQLAlchemy()

def init_db(app):
    from utils.logger import setup_logger
    logger = setup_logger("utils_db")
    
    try:
        db.init_app(app)
        
        from models.patient import Patient
        from models.user import User
        
        migrate = Migrate(app, db)
        
        with app.app_context():
            # db.drop_all()
            db.create_all()
            db.session.commit()
            
        logger.info("Database initialized successfully")
        return db
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        raise e