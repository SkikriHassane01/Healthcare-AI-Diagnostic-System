import jwt
from functools import wraps
from flask import request, jsonify, current_app
import uuid
from datetime import datetime, timedelta

from models.user import User, UserRole
from utils.logger import setup_logger

logger = setup_logger('security')

def generate_token(user_id, expiry_days=1):
    """
    Generate a JWT token for a user
    
    Args:
        user_id (str): User ID
        expiry_days (int): Token expiry in days
        
    Returns:
        str: JWT token
    """
    try:
        payload = {
            'exp': datetime.utcnow() + timedelta(days=expiry_days),
            'iat': datetime.utcnow(),
            'sub': user_id
        }
        
        # Create token
        token = jwt.encode(
            payload,
            current_app.config.get('SECRET_KEY'),
            algorithm='HS256'
        )
        
        return token
    except Exception as e:
        logger.error(f"Error generating token: {str(e)}")
        return None

def token_required(f):
    """Decorator to check for valid JWT token"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Check if token is in the header
        auth_header = request.headers.get('Authorization')
        if auth_header:
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
            else:
                token = auth_header
                
        if not token:
            logger.warning("Authentication token is missing")
            return jsonify({'message': 'Authentication token is missing'}), 401
        
        try:
            # Decode the token
            payload = jwt.decode(
                token,
                current_app.config.get('SECRET_KEY'),
                algorithms=['HS256']
            )
            
            # Get the user
            current_user = User.query.filter_by(id=payload['sub']).first()
            
            if not current_user:
                logger.warning(f"User not found for token with sub: {payload['sub']}")
                return jsonify({'message': 'User not found'}), 404
            
            if not current_user.is_active:
                logger.warning(f"Attempted login with inactive account: {current_user.username}")
                return jsonify({'message': 'Account is disabled'}), 403
            
        except jwt.ExpiredSignatureError:
            logger.warning("Token has expired")
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            logger.warning("Invalid token")
            return jsonify({'message': 'Invalid token'}), 401
        except Exception as e:
            logger.error(f"Error decoding token: {str(e)}")
            return jsonify({'message': 'Error processing token'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

def admin_required(f):
    """Decorator to check if user has admin role"""
    @wraps(f)
    def decorated(current_user, *args, **kwargs):
        if not current_user.role == UserRole.ADMIN:
            logger.warning(f"Attempted admin action by non-admin user: {current_user.username}")
            return jsonify({'message': 'Admin privileges required'}), 403
        
        return f(current_user, *args, **kwargs)
    
    return decorated