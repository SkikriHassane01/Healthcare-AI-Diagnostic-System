from flask import Blueprint, request, jsonify
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parents[1]))
import re
from datetime import datetime
from sqlalchemy import or_
from utils.logger import setup_logger
from utils.db import db
from utils.security import token_required
from models.patient import Gender, Patient

logger = setup_logger(__name__)

# create a blueprint for the patients routes
patients_bp = Blueprint('patients', __name__, url_prefix="/api/patients")

@patients_bp.route('', methods=["POST"])
@token_required
def create_patient(current_user):
    """Create a new patient"""
    logger.info(f"Create patient request from user: {current_user.username}")
    data = request.get_json()
    
    # validate the data
    required_fields = ['first_name', 'last_name', 'date_of_birth', 'gender']
    for field in required_fields:
        if field not in data or not data[field]:
            logger.warning(f"Missing required field: {field}")
            return jsonify({"message": f"Missing required field: {field}"}), 400
        
    
    # parse date of birth
    try:
        date_of_birth = datetime.strptime(data['date_of_birth'], "%Y-%m-%d").date()
    except ValueError:
        logger.warning(f"Create patient failed: invalid date format - {data['date_of_birth']}")
        return jsonify({'message': 'Invalid date format for date_of_birth. Use YYYY-MM-DD'}), 400
    
    # Validate gender
    if data['gender'] not in Gender.CHOICES:
        logger.warning(f"Create patient failed: invalid gender - {data['gender']}")
        return jsonify({'message': f"Invalid gender. Choose from: {', '.join(Gender.CHOICES)}"}), 400
    
    # Validate email if provided
    if 'email' in data and data['email']:
        email_pattern = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
        if not email_pattern.match(data['email']):
            logger.warning(f"Create patient failed: invalid email format - {data['email']}")
            return jsonify({'message': 'Invalid email format'}), 400

    try:
        # Clean data to handle empty strings for numeric fields
        # Convert empty strings to None for numeric fields
        height = None
        if 'height' in data and data['height'] not in ['', None]:
            try:
                height = float(data['height'])
            except ValueError:
                logger.warning(f"Create patient failed: invalid height value - {data['height']}")
                return jsonify({'message': 'Height must be a valid number'}), 400
                
        weight = None
        if 'weight' in data and data['weight'] not in ['', None]:
            try:
                weight = float(data['weight'])
            except ValueError:
                logger.warning(f"Create patient failed: invalid weight value - {data['weight']}")
                return jsonify({'message': 'Weight must be a valid number'}), 400
        
        # Create new patient
        new_patient = Patient(
            first_name=data['first_name'],
            last_name=data['last_name'],
            date_of_birth=date_of_birth,
            gender=data['gender'],
            doctor_id=current_user.id,
            email=data.get('email'),
            phone=data.get('phone'),
            address=data.get('address'),
            medical_history=data.get('medical_history'),
            height=height,  # Use the cleaned value
            weight=weight,  # Use the cleaned value
            allergies=data.get('allergies')
        )
        
        # Add to database
        db.session.add(new_patient)
        db.session.commit()
        
        logger.info(f"Patient created successfully: {new_patient.first_name} {new_patient.last_name}")
        
        return jsonify({
            'message': 'Patient created successfully',
            'patient': new_patient.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Create patient error: {str(e)}")
        return jsonify({'message': 'Patient creation failed. Please try again.'}), 500

@patients_bp.route('', methods=['GET'])
@token_required
def get_patients(current_user):
    """Get all patients for the current doctor"""
    logger.info(f"Get patients request from user: {current_user.username}")
    
    try:
        # Get query parameters
        search = request.args.get('search', '')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        include_inactive = request.args.get('include_inactive', 'false').lower() == 'true'
        
        # Base query - filter by doctor
        query = Patient.query.filter_by(doctor_id=current_user.id)
        
        # Only include active patients unless specifically requested
        if not include_inactive:
            query = query.filter_by(is_active=True)
        
        # Add search filter if provided
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                or_(
                    Patient.first_name.ilike(search_term),
                    Patient.last_name.ilike(search_term),
                    Patient.email.ilike(search_term),
                    Patient.phone.ilike(search_term)
                )
            )
        
        # Get total count for pagination
        total = query.count()
        
        # Add pagination
        patients = query.order_by(Patient.last_name).paginate(page=page, per_page=per_page)
        
        # Convert to dict
        patients_data = [patient.to_dict() for patient in patients.items]
        
        return jsonify({
            'patients': patients_data,
            'pagination': {
                'total': total,
                'page': page,
                'per_page': per_page,
                'pages': (total + per_page - 1) // per_page  # Ceiling division
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Get patients error: {str(e)}")
        return jsonify({'message': 'Failed to retrieve patients. Please try again.'}), 500

@patients_bp.route('/<patient_id>', methods=['GET'])
@token_required
def get_patient(current_user, patient_id):
    """Get a specific patient by ID"""
    logger.info(f"Get patient request from user: {current_user.username}, patient ID: {patient_id}")
    
    try:
        # Get patient - ensure it belongs to the current doctor
        patient = Patient.query.filter_by(id=patient_id, doctor_id=current_user.id).first()
        
        if not patient:
            logger.warning(f"Get patient failed: patient not found - {patient_id}")
            return jsonify({'message': 'Patient not found'}), 404
        
        return jsonify({
            'patient': patient.to_dict()
        }), 200
        
    except Exception as e:
        logger.error(f"Get patient error: {str(e)}")
        return jsonify({'message': 'Failed to retrieve patient. Please try again.'}), 500

@patients_bp.route('/<patient_id>', methods=['PUT'])
@token_required
def update_patient(current_user, patient_id):
    """Update a specific patient by ID"""
    logger.info(f"Update patient request from user: {current_user.username}, patient ID: {patient_id}")
    data = request.get_json()
    
    try:
        # Get patient - ensure it belongs to the current doctor
        patient = Patient.query.filter_by(id=patient_id, doctor_id=current_user.id).first()
        
        if not patient:
            logger.warning(f"Update patient failed: patient not found - {patient_id}")
            return jsonify({'message': 'Patient not found'}), 404
        
        # Update basic fields if provided
        if 'first_name' in data and data['first_name']:
            patient.first_name = data['first_name']
            
        if 'last_name' in data and data['last_name']:
            patient.last_name = data['last_name']
            
        if 'gender' in data and data['gender']:
            if data['gender'] in Gender.CHOICES:
                patient.gender = data['gender']
            else:
                logger.warning(f"Update patient: invalid gender - {data['gender']}")
                return jsonify({'message': f"Invalid gender. Choose from: {', '.join(Gender.CHOICES)}"}), 400
        
        if 'date_of_birth' in data and data['date_of_birth']:
            try:
                patient.date_of_birth = datetime.strptime(data['date_of_birth'], '%Y-%m-%d').date()
            except ValueError:
                logger.warning(f"Update patient failed: invalid date format - {data['date_of_birth']}")
                return jsonify({'message': 'Invalid date format for date_of_birth. Use YYYY-MM-DD'}), 400
        
        # Clean and update numeric fields
        if 'height' in data:
            if data['height'] in ['', None]:
                patient.height = None
            else:
                try:
                    patient.height = float(data['height'])
                except ValueError:
                    logger.warning(f"Update patient failed: invalid height - {data['height']}")
                    return jsonify({'message': 'Height must be a valid number'}), 400
                
        if 'weight' in data:
            if data['weight'] in ['', None]:
                patient.weight = None
            else:
                try:
                    patient.weight = float(data['weight'])
                except ValueError:
                    logger.warning(f"Update patient failed: invalid weight - {data['weight']}")
                    return jsonify({'message': 'Weight must be a valid number'}), 400
        
        # Update other optional fields
        optional_fields = ['email', 'phone', 'address', 'medical_history', 'allergies']
        for field in optional_fields:
            if field in data:
                setattr(patient, field, data[field])
        
        # Validate email if provided
        if 'email' in data and data['email']:
            email_pattern = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
            if not email_pattern.match(data['email']):
                logger.warning(f"Update patient failed: invalid email format - {data['email']}")
                return jsonify({'message': 'Invalid email format'}), 400
        
        # Save changes
        db.session.commit()
        
        logger.info(f"Patient updated successfully: {patient.first_name} {patient.last_name}")
        
        return jsonify({
            'message': 'Patient updated successfully',
            'patient': patient.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Update patient error: {str(e)}")
        return jsonify({'message': 'Patient update failed. Please try again.'}), 500

@patients_bp.route('/<patient_id>', methods=['DELETE'])
@token_required
def delete_patient(current_user, patient_id):
    """
    Handle patient deletion. Can either:
    1. Permanently delete the patient (with 'permanent=true' in request body)
    2. Deactivate the patient (mark as inactive - default behavior)
    """
    logger.info(f"Delete/deactivate patient request from user: {current_user.username}, patient ID: {patient_id}")
    
    try:
        # Get patient - ensure it belongs to the current doctor
        patient = Patient.query.filter_by(id=patient_id, doctor_id=current_user.id).first()
        
        if not patient:
            logger.warning(f"Delete/deactivate patient failed: patient not found - {patient_id}")
            return jsonify({'message': 'Patient not found'}), 404
        
        # Log the request body for debugging
        body_data = request.get_json(silent=True)
        logger.info(f"Request body for delete operation: {body_data}")
        
        # Check if permanent deletion was requested
        permanent = False
        if body_data and isinstance(body_data, dict):
            permanent = body_data.get('permanent', False)
        
        logger.info(f"Permanent deletion requested: {permanent}")
        
        if permanent:
            # Permanently delete the patient from the database
            try:
                db.session.delete(patient)
                db.session.commit()
                logger.info(f"Patient permanently deleted: {patient.first_name} {patient.last_name}")
                return jsonify({
                    'message': 'Patient permanently deleted'
                }), 200
            except Exception as inner_e:
                db.session.rollback()
                logger.error(f"Database error during permanent deletion: {str(inner_e)}")
                return jsonify({'message': f'Database error: {str(inner_e)}'}), 500
        else:
            # Set to inactive (soft delete)
            try:
                patient.is_active = False
                db.session.commit()
                logger.info(f"Patient deactivated: {patient.first_name} {patient.last_name}")
                return jsonify({
                    'message': 'Patient deactivated successfully'
                }), 200
            except Exception as inner_e:
                db.session.rollback()
                logger.error(f"Database error during deactivation: {str(inner_e)}")
                return jsonify({'message': f'Database error: {str(inner_e)}'}), 500
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Delete/deactivate patient error: {str(e)}", exc_info=True)
        return jsonify({'message': f'Operation failed: {str(e)}'}), 500