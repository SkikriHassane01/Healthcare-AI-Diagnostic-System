from flask import Flask, request, jsonify
from flask_cors import CORS
from pathlib import Path
import sys
import traceback

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

    # Configure CORS properly - update with more comprehensive settings
    CORS(app, 
         resources={r"/api/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"]}}, 
         supports_credentials=True,
         allow_headers=["Content-Type", "Authorization", "X-Requested-With", "Accept"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         expose_headers=["Content-Length", "X-Total-Count"],
         max_age=600)
    logger.info("CORS initialized with proper settings")
    
    
    # Initialize database connection
    init_db(app)
    
    app.register_blueprint(auth_bp)
    logger.info("Authentication routes registered")
        
    app.register_blueprint(patients_bp)
    logger.info("Patient routes registered")

    # Ensure trailing slashes are handled correctly
    app.url_map.strict_slashes = False

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
    
    @app.after_request
    def after_request(response):
        """Ensure CORS headers are set correctly for all responses"""
        # Add CORS headers for cases where Flask-CORS might miss
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        
        # Don't redirect OPTIONS requests
        if request.method == 'OPTIONS':
            return response
            
        return response

    # Add an explicit route for OPTIONS requests
    @app.route('/api/patients', methods=['OPTIONS'])
    @app.route('/api/patients/', methods=['OPTIONS'])
    def options_patients():
        response = app.make_default_options_response()
        return response

    # Create a general OPTIONS handler for all routes
    @app.route('/<path:path>', methods=['OPTIONS'])
    def catch_all_options(path):
        """Handle OPTIONS requests for all routes"""
        response = app.make_default_options_response()
        return response

    # Error handlers
    @app.errorhandler(404)
    def not_found(e):
        logger.warning(f"404 error: {request.path}")
        return jsonify({'message': 'Endpoint not found'}), 404
    
    @app.errorhandler(500)
    def server_error(e):
        # Get the traceback info for better debugging
        tb = traceback.format_exc()
        logger.error(f"500 error: {str(e)}\nTraceback: {tb}")
        logger.error(f"Request data: {request.data}")
        logger.error(f"Request form: {request.form}")
        logger.error(f"Request JSON: {request.get_json(silent=True)}")
        
        # Return a more helpful error message
        return jsonify({
            'message': 'Internal server error',
            'error': str(e),
            'status': 'error'
        }), 500
    
    # Add global exception handler
    @app.errorhandler(Exception)
    def handle_exception(e):
        tb = traceback.format_exc()
        logger.error(f"Unhandled exception: {str(e)}\nTraceback: {tb}")
        
        return jsonify({
            'message': 'An unexpected error occurred',
            'error': str(e),
            'status': 'error'
        }), 500
    
    logger.info("Application created successfully")
    return app

app = create_app()
if __name__ == '__main__':
    app.run(debug=True,port=8000,host='0.0.0.0')