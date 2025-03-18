from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

# Initialize DB instance without importing models
db = SQLAlchemy()

def init_db(app):
    from utils.logger import setup_logger
    logger = setup_logger("utils_db")
    
    try:
        logger.info(f"Initializing database with URI: {app.config.get('SQLALCHEMY_DATABASE_URI')}")
        db.init_app(app)
        
        from models.patient import Patient
        from models.user import User
        
        migrate = Migrate(app, db)
        
        with app.app_context():
            # Check connection
            try:
                db.engine.connect()
                logger.info("Database connection successful")
            except Exception as e:
                logger.error(f"Database connection failed: {str(e)}")
                raise e
                
            # Create tables if they don't exist
            db.create_all()
            db.session.commit()
            
            # Log existing tables
            inspector = db.inspect(db.engine)
            tables = inspector.get_table_names()
            logger.info(f"Database tables: {tables}")
            
        logger.info("Database initialized successfully")
        return db
    except Exception as e:
        logger.error(f"Database initialization failed: {str(e)}")
        raise e