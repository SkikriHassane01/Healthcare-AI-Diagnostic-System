from flask import request, jsonify, current_app
from functools import wraps
import jwt
from datetime import datetime, timedelta
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parents[1]))
from models.user import User
from utils.logger import setup_logger

logger = setup_logger("security_utils")

def generate_token(user_id):
    """
    Generate a JWT token for user authentication
    
    Args:
        user_id (int): the user id
    
    Returns:
        str: the JWT token
    """
    try:
        # create token payload with expiration time
        payload = {
            'exp': datetime.utcnow() + timedelta(days=1),
            'iat': datetime.utcnow(), # issued at time
            'sub': user_id # which user this token belongs to
        }
        
        # create the actual token with the app's secret key
        token = jwt.encode(
            payload,
            current_app.config.get('SECRET_KEY'),
            algorithm='HS256'
        )
        if isinstance(token, bytes):
            token = token.decode('utf-8')
        logger.info(f"Generated token for user ID: {user_id}")
        return token
    except Exception as e:
        logger.error(f"Error generating token: {str(e)}")
        return None

def token_required(f):
    """
    Decorator for routes that need authentication
    
    This wrapper checks if a valid JWT token is in the request headers.
    If valid, it passes the current user to the route function.
    
    Args:
        f (function): the route function
    
    Returns:
        decorated function that adds authentication before executing the original route
    
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Token Extraction from headers 
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1] # Get token from "Bearer <token>"
                logger.info(f"Token extracted from header: {token[:10]}...")
            except IndexError:
                logger.warning("Invalid Authorization header format")
                return jsonify({'message': 'Invalid token format'}), 401
        
        # Return error if no token found
        if not token:
            logger.warning("Missing authentication token")
            return jsonify({'message': 'Authentication token is missing'}), 401
        
        try:
            # Decode and verify the token
            payload = jwt.decode(
                token,
                current_app.config.get('SECRET_KEY'),
                algorithms=['HS256']
            )
            
            logger.info(f"Token payload: {payload}")
            
            # Get user from database
            current_user = User.query.filter_by(id=payload['sub']).first()
            
            if not current_user:
                logger.warning(f"User ID from token not found: {payload['sub']}")
                return jsonify({'message': 'User not found'}), 401
                
            # Check if account is active
            if not current_user.is_active:
                logger.warning(f"Attempt to access with inactive account: {current_user.username}")
                return jsonify({'message': 'Account is disabled'}), 403
                
            logger.info(f"Authenticated request from: {current_user.username}")
            
        except jwt.ExpiredSignatureError:
            logger.warning("Expired token used for authentication")
            return jsonify({'message': 'Token has expired. Please log in again.'}), 401
        except jwt.InvalidTokenError:
            logger.warning("Invalid token used for authentication")
            return jsonify({'message': 'Invalid token. Please log in again.'}), 401
        except Exception as e:
            logger.error(f"Error processing token: {str(e)}")
            return jsonify({'message': 'Error processing token'}), 500
            
        # If authentication successful, pass the user object to the route function
        return f(current_user, *args, **kwargs)
        
    return decorated

def admin_required(f):
    """
    Decorator for routes that need admin privileges
    
    This should be used after the token_required decorator.
    """
    @wraps(f)
    def decorated(current_user, *args, **kwargs):
        if not current_user.is_admin():
            logger.warning(f"User {current_user.username} attempted to access admin resource")
            return jsonify({'message': 'Admin privileges required'}), 403
        return f(current_user, *args, **kwargs)
    return decorated


# if __name__ == "__main__":
#     from app import app
#     with app.app_context():
#         test_user_id = '1'
#         token = generate_token(test_user_id)
#         print(f"Generated token: {token}")
        
#         # decode the token to verify it
#         decoded = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
#         print(f"Decoded token: {decoded}")
        
#         # Verify the user ID is in the token
#         print(f"User ID in token (should be {test_user_id}): {decoded['sub']}")