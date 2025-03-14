from flask import Blueprint, request, jsonify
import sys
from pathlib import Path
from sqlalchemy.exc import IntegrityError
import re

sys.path.append(str(Path(__file__).parents[1]))

from utils.db import db
from models.user import User, UserRole
from utils.security import generate_token, token_required
from utils.logger import setup_logger

logger = setup_logger("auth_api")

# create a blueprint for the auth routes
auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

EMAIL_PATTERN = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user (healthcare professional)"""
    logger.info("Registration request received")
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['username', 'email', 'password', 'first_name', 'last_name']
    for field in required_fields:
        if field not in data or not data[field]:
            logger.warning(f"Registration failed: missing {field}")
            return jsonify({'message': f'{field} is required'}), 400
    
    # Validate email format
    if not EMAIL_PATTERN.match(data['email']):
        logger.warning(f"Registration failed: invalid email format - {data['email']}")
        return jsonify({'message': 'Invalid email format'}), 400
    
    # Validate password length
    if len(data['password']) < 8:
        logger.warning("Registration failed: password too short")
        return jsonify({'message': 'Password must be at least 8 characters long'}), 400

    # Check if user already exists
    existing_user = User.query.filter(
        (User.username == data['username']) | (User.email == data['email'])
    ).first()
    
    if existing_user:
        if existing_user.username == data['username']:
            logger.warning(f"Registration failed: username already exists - {data['username']}")
            return jsonify({'message': 'Username already exists'}), 409
        else:
            logger.warning(f"Registration failed: email already exists - {data['email']}")
            return jsonify({'message': 'Email already exists'}), 409
    
    try:
        # Create new user
        new_user = User(
            username=data['username'],
            email=data['email'],
            password=data['password'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            role=data.get('role', UserRole.DOCTOR)  # Default to doctor role
        )
        
        # Add to database
        db.session.add(new_user)
        db.session.commit()
        
        logger.info(f"User registered successfully: {new_user.username}")
        
        # Generate token
        token = generate_token(new_user.id)
        
        return jsonify({
            'message': 'User registered successfully',
            'token': token,
            'user': new_user.to_dict()
        }), 201
        
    except IntegrityError:
        db.session.rollback()
        logger.warning(f"Registration failed: username or email already exists - {data['username']}")
        return jsonify({'message': 'Username or email already exists'}), 409
    except Exception as e:
        db.session.rollback()
        logger.error(f"Registration error: {str(e)}")
        return jsonify({'message': 'Registration failed. Please try again.'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Authenticate a user and return a token"""
    logger.info("Login request received")
    data = request.get_json()
    
    # Check if username/email and password are provided
    if not data or not data.get('username') or not data.get('password'):
        logger.warning("Login failed: missing username or password")
        return jsonify({'message': 'Username/email and password are required'}), 400
    
    # Check if user exists
    user = None
    login_id = data.get('username')
    
    # Try to find user by username or email
    if '@' in login_id:
        user = User.query.filter_by(email=login_id).first()
    else:
        user = User.query.filter_by(username=login_id).first()
    
    if not user:
        logger.warning(f"Login failed: user not found - {login_id}")
        return jsonify({'message': 'User not found'}), 404
    
    # Check if account is active
    if not user.is_active:
        logger.warning(f"Login failed: account is disabled - {login_id}")
        return jsonify({'message': 'Account is disabled'}), 403
    
    # Check password
    if not user.check_password(data.get('password')):
        logger.warning(f"Login failed: invalid password for user - {login_id}")
        return jsonify({'message': 'Invalid password'}), 401
    
    # Generate auth token
    token = generate_token(user.id)
    
    logger.info(f"User logged in successfully: {user.username}")
    
    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    """Get the profile of the currently authenticated user"""
    logger.info(f"Profile request for user: {current_user.username}")
    return jsonify({'user': current_user.to_dict()}), 200

@auth_bp.route('/profile', methods=['PUT'])
@token_required
def update_profile(current_user):
    """Update the profile of the currently authenticated user"""
    logger.info(f"Profile update request for user: {current_user.username}")
    data = request.get_json()
    
    # Fields that can be updated
    updatable_fields = ['first_name', 'last_name', 'email']
    
    # Update fields
    for field in updatable_fields:
        if field in data and data[field]:
            # Validate email format if updating email
            if field == 'email' and not EMAIL_PATTERN.match(data['email']):
                logger.warning(f"Profile update failed: invalid email format - {data['email']}")
                return jsonify({'message': 'Invalid email format'}), 400
            
            setattr(current_user, field, data[field])
    
    # Update password if provided
    if 'password' in data and data['password']:
        if len(data['password']) < 8:
            logger.warning("Profile update failed: password too short")
            return jsonify({'message': 'Password must be at least 8 characters long'}), 400
        current_user.set_password(data['password'])
    
    try:
        db.session.commit()
        logger.info(f"Profile updated successfully: {current_user.username}")
        return jsonify({
            'message': 'Profile updated successfully',
            'user': current_user.to_dict()
        }), 200
    except IntegrityError:
        db.session.rollback()
        logger.warning(f"Profile update failed: email already in use - {current_user.username}")
        return jsonify({'message': 'Email already in use'}), 409
    except Exception as e:
        db.session.rollback()
        logger.error(f"Profile update error: {str(e)}")
        return jsonify({'message': 'Profile update failed. Please try again.'}), 500
    
    
"""
Test the script 

# test the registration endpoint
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuserapi",
    "email": "testuser@example.com",
    "password": "password123",
    "first_name": "Test",
    "last_name": "User"
  }'
  
#  test the login endpoint:
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuserapi",
    "password": "password123"
  }'

test the profile endpoint
curl -X GET http://localhost:8000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
"""