from flask import Flask, request, jsonify
from pathlib import Path
import sys

sys.path.append(str(Path(__file__).resolve().parents[0]))

from utils.logger import setup_logger
logger = setup_logger('Main_Application')

from utils.db import init_db
from models.user import User, UserRole
from utils.db import db
from config import Config

def create_app(config_class=Config):
    """Application factory function"""
    logger.info("Creating Flask application")
    
    # Create Flask app instance
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config_class)
    
    # IMPORTANT: Disable automatic slash behavior
    app.url_map.strict_slashes = False
    
    # Initialize database connection
    init_db(app)
    
    # Import blueprints
    from api.auth import auth_bp
    from api.patients import patients_bp
    from api.diagnostics import diagnostics_bp
    from api.admin import admin_bp
    
    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(patients_bp)
    app.register_blueprint(diagnostics_bp)
    app.register_blueprint(admin_bp)
    
    @app.route('/', methods=['GET'])
    def home():
        return jsonify({'message': 'Healthcare AI Diagnostic System API'})

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({'status': 'healthy'})
    
    # Single CORS handler - no Flask-CORS dependency
    @app.after_request
    def add_cors_headers(response):
        response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        response.headers.set('Access-Control-Allow-Credentials', 'true')
        
        # Handle preflight requests
        if request.method == 'OPTIONS':
            return response
            
        return response
    
    # Debug middleware to log requests
    @app.before_request
    def log_request():
        logger.info(f"Request: {request.method} {request.path} {dict(request.args)}")
        logger.info(f"Headers: {dict(request.headers)}")
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({'message': 'Endpoint not found'}), 404
    
    @app.errorhandler(500)
    def server_error(e):
        return jsonify({'message': 'Internal server error'}), 500
    
    return app

def create_default_user(app):
    """Create a default admin user if no users exist"""
    with app.app_context():
        if User.query.count() == 0:
            logger.info("Creating default admin user")
            try:
                default_user = User(
                    username="admin",
                    email="admin@example.com",
                    password="password123",
                    first_name="Admin",
                    last_name="User",
                    role=UserRole.ADMIN
                )
                db.session.add(default_user)
                db.session.commit()
                logger.info(f"Default user created: {default_user.id}")
            except Exception as e:
                logger.error(f"Failed to create default user: {str(e)}")
                db.session.rollback()

# Create app instance
app = create_app()

# Create default user
create_default_user(app)

if __name__ == '__main__':
    app.run(debug=True, port=8000, host='0.0.0.0')