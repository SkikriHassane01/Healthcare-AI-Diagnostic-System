from flask import Flask, request, jsonify
from flask_cors import CORS
from pathlib import Path
import sys

sys.path.append(str(Path(__file__).resolve().parents[0]))

from utils.logger import setup_logger
logger = setup_logger('Main_Application')

from utils.db import init_db
from config import Config
from api.auth import auth_bp
from api.patients import patients_bp

def create_app(config_class=Config):
    """
    Application factory function
    
    Creates and configures the Flask application
    """
    logger.info("Creating Flask application")
    
    # Create Flask app instance
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config_class)
    logger.info(f"Application configured with {config_class.__name__}")

    # Initialize CORS (Cross-Origin Resource Sharing)
    # This allows the frontend to communicate with the API
    CORS(app)
    logger.info("CORS initialized")
    
    # Initialize database connection
    init_db(app)
    
    app.register_blueprint(auth_bp)
    logger.info("Authentication routes registered")
        
    app.register_blueprint(patients_bp)
    logger.info("Patient routes registered")

    @app.route('/', methods=['GET'])
    def home():
        return jsonify({'message': 'Welcome to Healthcare AI Diagnostic System API'})

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify(
            {
                'status': 'healthy',
                'message': 'The Healthcare AI Diagnostic System API is up and running!'
            }
        )
    # Error handlers
    @app.errorhandler(404)
    def not_found(e):
        logger.warning(f"404 error: {request.path}")
        return jsonify({'message': 'Endpoint not found'}), 404
    
    @app.errorhandler(500)
    def server_error(e):
        logger.error(f"500 error: {str(e)}")
        return jsonify({'message': 'Internal server error'}), 500
    
    logger.info("Application created successfully")
    return app

app = create_app()
if __name__ == '__main__':
    app.run(debug=True,port=8000,host='0.0.0.0')