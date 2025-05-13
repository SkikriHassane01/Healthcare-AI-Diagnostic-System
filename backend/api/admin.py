from flask import Blueprint, request, jsonify
import sys
from pathlib import Path
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime, timedelta

sys.path.append(str(Path(__file__).resolve().parents[1]))

from utils.logger import setup_logger
from utils.db import db
from utils.security import token_required, admin_required
from models.user import User, UserRole
from models.patient import Patient
from models.diagnostic import DiabetesPrediction, BrainTumorPrediction, AlzheimerPrediction, BreastCancerPrediction

logger = setup_logger("admin_api")

# Create a blueprint for admin routes
admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

@admin_bp.route('/stats', methods=['GET'])
@token_required
@admin_required
def get_admin_stats(current_user):
    """Get dashboard statistics for admin"""
    logger.info(f"Admin stats request from user: {current_user.username}")
    
    try:
        # Get counts
        user_count = User.query.count()
        patient_count = Patient.query.count()
        
        # Count total diagnostics
        diabetes_count = DiabetesPrediction.query.count()
        brain_tumor_count = BrainTumorPrediction.query.count()
        alzheimer_count = AlzheimerPrediction.query.count()
        breast_cancer_count = BreastCancerPrediction.query.count()
        
        total_diagnostics = diabetes_count + brain_tumor_count + alzheimer_count + breast_cancer_count
        
        # Get last month's diagnostics
        one_month_ago = datetime.utcnow() - timedelta(days=30)
        
        last_month_diabetes = DiabetesPrediction.query.filter(DiabetesPrediction.created_at >= one_month_ago).count()
        last_month_brain_tumor = BrainTumorPrediction.query.filter(BrainTumorPrediction.created_at >= one_month_ago).count()
        last_month_alzheimer = AlzheimerPrediction.query.filter(AlzheimerPrediction.created_at >= one_month_ago).count()
        last_month_breast_cancer = BreastCancerPrediction.query.filter(BreastCancerPrediction.created_at >= one_month_ago).count()
        
        last_month_diagnostics = last_month_diabetes + last_month_brain_tumor + last_month_alzheimer + last_month_breast_cancer
        
        return jsonify({
            'userCount': user_count,
            'patientCount': patient_count,
            'totalDiagnostics': total_diagnostics,
            'lastMonthDiagnostics': last_month_diagnostics,
            'diagnosticsByType': {
                'diabetes': diabetes_count,
                'brainTumor': brain_tumor_count,
                'alzheimer': alzheimer_count,
                'breastCancer': breast_cancer_count
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Error getting admin stats: {str(e)}")
        return jsonify({'message': 'Failed to retrieve admin statistics'}), 500

@admin_bp.route('/users', methods=['GET'])
@token_required
@admin_required
def get_users(current_user):
    """Get users with pagination and filtering"""
    logger.info(f"Get users request from admin: {current_user.username}")
    
    try:
        # Get query parameters
        search = request.args.get('search', '')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        role = request.args.get('role', '')
        include_inactive = request.args.get('include_inactive', 'false').lower() == 'true'
        
        # Base query
        query = User.query
        
        # Add search filter if provided
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                (User.username.ilike(search_term)) |
                (User.email.ilike(search_term)) |
                (User.first_name.ilike(search_term)) |
                (User.last_name.ilike(search_term))
            )
        
        # Filter by role if provided
        if role and role in UserRole.ROLES:
            query = query.filter_by(role=role)
        
        # Filter active/inactive users
        if not include_inactive:
            query = query.filter_by(is_active=True)
        
        # Get total count for pagination
        total = query.count()
        
        # Add pagination
        users = query.order_by(User.created_at.desc()).paginate(page=page, per_page=per_page)
        
        # Convert to dict
        users_data = [user.to_dict() for user in users.items]
        
        return jsonify({
            'users': users_data,
            'pagination': {
                'total': total,
                'page': page,
                'per_page': per_page,
                'pages': (total + per_page - 1) // per_page  # Ceiling division
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Error getting users: {str(e)}")
        return jsonify({'message': 'Failed to retrieve users'}), 500

@admin_bp.route('/users/<user_id>', methods=['GET'])
@token_required
@admin_required
def get_user(current_user, user_id):
    """Get a specific user by ID"""
    logger.info(f"Get user request from admin: {current_user.username}, user ID: {user_id}")
    
    try:
        user = User.query.get(user_id)
        
        if not user:
            logger.warning(f"User not found: {user_id}")
            return jsonify({'message': 'User not found'}), 404
        
        return jsonify({
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        logger.error(f"Error getting user: {str(e)}")
        return jsonify({'message': 'Failed to retrieve user'}), 500

@admin_bp.route('/users', methods=['POST'])
@token_required
@admin_required
def create_user(current_user):
    """Create a new user"""
    logger.info(f"Create user request from admin: {current_user.username}")
    
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['username', 'email', 'password', 'first_name', 'last_name']
    for field in required_fields:
        if field not in data or not data[field]:
            logger.warning(f"Missing required field: {field}")
            return jsonify({"message": f"Missing required field: {field}"}), 400
    
    # Validate role
    if 'role' in data and data['role'] not in UserRole.ROLES:
        logger.warning(f"Invalid role: {data.get('role')}")
        return jsonify({"message": f"Invalid role. Choose from: {', '.join(UserRole.ROLES)}"}), 400
    
    try:
        # Check if user already exists
        existing_user = User.query.filter(
            (User.username == data['username']) | (User.email == data['email'])
        ).first()
        
        if existing_user:
            if existing_user.username == data['username']:
                logger.warning(f"Username already exists: {data['username']}")
                return jsonify({'message': 'Username already exists'}), 409
            else:
                logger.warning(f"Email already exists: {data['email']}")
                return jsonify({'message': 'Email already exists'}), 409
        
        # Create new user
        new_user = User(
            username=data['username'],
            email=data['email'],
            password=data['password'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            role=data.get('role', UserRole.DOCTOR)
        )
        
        # Set active status if provided
        if 'is_active' in data:
            new_user.is_active = bool(data['is_active'])
        
        # Add to database
        db.session.add(new_user)
        db.session.commit()
        
        logger.info(f"User created successfully: {new_user.username}")
        
        return jsonify({
            'message': 'User created successfully',
            'user': new_user.to_dict()
        }), 201
        
    except SQLAlchemyError:
        db.session.rollback()
        logger.error(f"Database error creating user")
        return jsonify({'message': 'Database error creating user'}), 500
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error creating user: {str(e)}")
        return jsonify({'message': 'Failed to create user'}), 500

@admin_bp.route('/users/<user_id>', methods=['PUT'])
@token_required
@admin_required
def update_user(current_user, user_id):
    """Update a specific user"""
    logger.info(f"Update user request from admin: {current_user.username}, user ID: {user_id}")
    
    data = request.get_json()
    
    try:
        user = User.query.get(user_id)
        
        if not user:
            logger.warning(f"User not found: {user_id}")
            return jsonify({'message': 'User not found'}), 404
        
        # Update fields if provided
        if 'username' in data and data['username']:
            # Check if username is taken by another user
            existing = User.query.filter(User.username == data['username'], User.id != user_id).first()
            if existing:
                logger.warning(f"Username already taken: {data['username']}")
                return jsonify({'message': 'Username already taken by another user'}), 409
            user.username = data['username']
            
        if 'email' in data and data['email']:
            # Check if email is taken by another user
            existing = User.query.filter(User.email == data['email'], User.id != user_id).first()
            if existing:
                logger.warning(f"Email already taken: {data['email']}")
                return jsonify({'message': 'Email already taken by another user'}), 409
            user.email = data['email']
            
        if 'first_name' in data and data['first_name']:
            user.first_name = data['first_name']
            
        if 'last_name' in data and data['last_name']:
            user.last_name = data['last_name']
            
        if 'role' in data and data['role'] in UserRole.ROLES:
            user.role = data['role']
            
        if 'password' in data and data['password']:
            user.set_password(data['password'])
            
        if 'is_active' in data:
            user.is_active = bool(data['is_active'])
        
        # Save changes
        db.session.commit()
        
        logger.info(f"User updated successfully: {user.username}")
        
        return jsonify({
            'message': 'User updated successfully',
            'user': user.to_dict()
        }), 200
        
    except SQLAlchemyError:
        db.session.rollback()
        logger.error(f"Database error updating user")
        return jsonify({'message': 'Database error updating user'}), 500
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error updating user: {str(e)}")
        return jsonify({'message': 'Failed to update user'}), 500

@admin_bp.route('/users/<user_id>', methods=['DELETE'])
@token_required
@admin_required
def delete_user(current_user, user_id):
    """Delete a specific user"""
    logger.info(f"Delete user request from admin: {current_user.username}, user ID: {user_id}")
    
    try:
        user = User.query.get(user_id)
        
        if not user:
            logger.warning(f"User not found: {user_id}")
            return jsonify({'message': 'User not found'}), 404
        
        # Prevent self-deletion
        if user.id == current_user.id:
            logger.warning(f"Attempted self-deletion by admin: {current_user.username}")
            return jsonify({'message': 'Cannot delete your own account'}), 403
        
        db.session.delete(user)
        db.session.commit()
        
        logger.info(f"User deleted successfully: {user.username}")
        
        return jsonify({
            'message': 'User deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error deleting user: {str(e)}")
        return jsonify({'message': 'Failed to delete user'}), 500

@admin_bp.route('/analytics/patients', methods=['GET'])
@token_required
@admin_required
def get_patient_analytics(current_user):
    """Get patient analytics data"""
    logger.info(f"Patient analytics request from admin: {current_user.username}")
    
    # Get time range parameter
    time_range = request.args.get('timeRange', 'year')
    
    try:
        # Define date range based on time_range
        end_date = datetime.utcnow()
        if time_range == 'month':
            start_date = end_date - timedelta(days=30)
        elif time_range == 'quarter':
            start_date = end_date - timedelta(days=90)
        elif time_range == 'year':
            start_date = end_date - timedelta(days=365)
        else:  # 'all'
            start_date = datetime.min
        
        # Get total patient count
        total_patients = Patient.query.count()
        
        # Get new patients in the specified period
        new_patients = Patient.query.filter(Patient.created_at >= start_date).count()
        
        # Calculate average age
        patients = Patient.query.all()
        total_age = sum(patient.calculate_age() for patient in patients) if patients else 0
        avg_age = round(total_age / len(patients), 1) if patients else 0
        
        # Get gender distribution
        male_count = Patient.query.filter_by(gender='male').count()
        female_count = Patient.query.filter_by(gender='female').count()
        other_count = Patient.query.filter(Patient.gender.notin_(['male', 'female'])).count()
        
        # TODO: Add more analytics as needed
        
        return jsonify({
            'totalPatients': total_patients,
            'newPatientsLastMonth': new_patients,
            'averageAge': avg_age,
            'patientsByGender': {
                'male': male_count,
                'female': female_count,
                'other': other_count
            },
            # Add more data here
        }), 200
        
    except Exception as e:
        logger.error(f"Error getting patient analytics: {str(e)}")
        return jsonify({'message': 'Failed to retrieve patient analytics'}), 500

@admin_bp.route('/analytics/diagnostics', methods=['GET'])
@token_required
@admin_required
def get_diagnostics_analytics(current_user):
    """Get diagnostics analytics data"""
    logger.info(f"Diagnostics analytics request from admin: {current_user.username}")
    
    # Get time range parameter
    time_range = request.args.get('timeRange', 'year')
    
    try:
        # Define date range based on time_range
        end_date = datetime.utcnow()
        if time_range == 'month':
            start_date = end_date - timedelta(days=30)
        elif time_range == 'quarter':
            start_date = end_date - timedelta(days=90)
        elif time_range == 'year':
            start_date = end_date - timedelta(days=365)
        else:  # 'all'
            start_date = datetime.min
        
        # Get total counts for each diagnostic type
        diabetes_count = DiabetesPrediction.query.count()
        brain_tumor_count = BrainTumorPrediction.query.count()
        alzheimer_count = AlzheimerPrediction.query.count()
        breast_cancer_count = BreastCancerPrediction.query.count()
        
        total_diagnostics = diabetes_count + brain_tumor_count + alzheimer_count + breast_cancer_count
        
        # Get counts for the specified period
        diabetes_period = DiabetesPrediction.query.filter(DiabetesPrediction.created_at >= start_date).count()
        brain_tumor_period = BrainTumorPrediction.query.filter(BrainTumorPrediction.created_at >= start_date).count()
        alzheimer_period = AlzheimerPrediction.query.filter(AlzheimerPrediction.created_at >= start_date).count()
        breast_cancer_period = BreastCancerPrediction.query.filter(BreastCancerPrediction.created_at >= start_date).count()
        
        period_diagnostics = diabetes_period + brain_tumor_period + alzheimer_period + breast_cancer_period
        
        # TODO: Add more detailed analytics as needed
        
        return jsonify({
            'totalDiagnostics': total_diagnostics,
            'periodDiagnostics': period_diagnostics,
            'diagnosticsByType': {
                'diabetes': {
                    'total': diabetes_count,
                    'period': diabetes_period,
                    'percentage': round((diabetes_count / total_diagnostics * 100), 1) if total_diagnostics else 0
                },
                'brainTumor': {
                    'total': brain_tumor_count,
                    'period': brain_tumor_period,
                    'percentage': round((brain_tumor_count / total_diagnostics * 100), 1) if total_diagnostics else 0
                },
                'alzheimer': {
                    'total': alzheimer_count,
                    'period': alzheimer_period,
                    'percentage': round((alzheimer_count / total_diagnostics * 100), 1) if total_diagnostics else 0
                },
                'breastCancer': {
                    'total': breast_cancer_count,
                    'period': breast_cancer_period,
                    'percentage': round((breast_cancer_count / total_diagnostics * 100), 1) if total_diagnostics else 0
                }
            },
            # Add more data here
        }), 200
        
    except Exception as e:
        logger.error(f"Error getting diagnostics analytics: {str(e)}")
        return jsonify({'message': 'Failed to retrieve diagnostics analytics'}), 500

@admin_bp.route('/settings', methods=['GET'])
@token_required
@admin_required
def get_system_settings(current_user):
    """Get system settings"""
    logger.info(f"Get system settings request from admin: {current_user.username}")
    
    try:
        # In a real implementation, this would fetch settings from the database
        # For now, return dummy settings
        settings = {
            'general': {
                'siteName': 'HealthAI Diagnostic System',
                'adminEmail': 'admin@healthai.com',
                'maxUploadSize': 25,
                'defaultLanguage': 'en',
                'timeZone': 'UTC',
                'sessionTimeout': 30
            },
            'security': {
                'passwordExpiry': 90,
                'passwordComplexity': 'high',
                'twoFactorAuth': False,
                'loginAttempts': 5,
                'ipWhitelist': '',
                'enableGoogleAuth': False
            },
            # Add more settings here
        }
        
        return jsonify(settings), 200
        
    except Exception as e:
        logger.error(f"Error getting system settings: {str(e)}")
        return jsonify({'message': 'Failed to retrieve system settings'}), 500

@admin_bp.route('/settings', methods=['PUT'])
@token_required
@admin_required
def update_system_settings(current_user):
    """Update system settings"""
    logger.info(f"Update system settings request from admin: {current_user.username}")
    
    data = request.get_json()
    
    try:
        # In a real implementation, this would update settings in the database
        # For now, just log the settings
        logger.info(f"Updating system settings with data: {data}")
        
        return jsonify({
            'message': 'Settings updated successfully'
        }), 200
        
    except Exception as e:
        logger.error(f"Error updating system settings: {str(e)}")
        return jsonify({'message': 'Failed to update system settings'}), 500

@admin_bp.route('/reports/generate', methods=['POST'])
@token_required
@admin_required
def generate_report(current_user):
    """Generate a report"""
    logger.info(f"Generate report request from admin: {current_user.username}")
    
    data = request.get_json()
    
    try:
        # In a real implementation, this would generate a report
        # For now, just log the request
        logger.info(f"Generating report with config: {data}")
        
        # Validate required fields
        required_fields = ['reportType', 'dateRange']
        for field in required_fields:
            if field not in data:
                logger.warning(f"Missing required field: {field}")
                return jsonify({"message": f"Missing required field: {field}"}), 400
        
        # Return dummy response
        return jsonify({
            'message': 'Report generated successfully',
            'reportId': '12345',
            'downloadUrl': f'/api/admin/reports/download/12345'
        }), 200
        
    except Exception as e:
        logger.error(f"Error generating report: {str(e)}")
        return jsonify({'message': 'Failed to generate report'}), 500