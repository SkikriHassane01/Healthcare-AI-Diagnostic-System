from flask import Blueprint, request, jsonify
import sys
from pathlib import Path
from sqlalchemy.exc import SQLAlchemyError

sys.path.append(str(Path(__file__).resolve().parents[1]))

from utils.logger import setup_logger
from utils.db import db
from utils.security import token_required
from models.patient import Patient
from models.diagnostic import DiabetesPrediction, BrainTumorPrediction
from ml_models.model_registry import model_registry

logger = setup_logger("diagnostics_api")

# Create a blueprint for the diagnostics routes
diagnostics_bp = Blueprint('diagnostics', __name__, url_prefix='/api/diagnostics')

@diagnostics_bp.route('/diabetes/predict/<patient_id>', methods=['POST'])
@token_required
def predict_diabetes(current_user, patient_id):
    """
    Make a diabetes prediction for a patient.
    
    Request body should contain all required features:
    - gender: string
    - age: number
    - hypertension: 0 or 1
    - heart_disease: 0 or 1
    - smoking_history: string
    - bmi: number
    - HbA1c_level: number
    - blood_glucose_level: number
    """
    logger.info(f"Diabetes prediction request for patient {patient_id} from user {current_user.username}")
    
    # Verify the patient exists and belongs to the current doctor
    patient = Patient.query.filter_by(id=patient_id, doctor_id=current_user.id).first()
    if not patient:
        logger.warning(f"Patient {patient_id} not found or doesn't belong to doctor {current_user.id}")
        return jsonify({"message": "Patient not found"}), 404
    
    # Get prediction data from request
    data = request.get_json()
    if not data:
        logger.warning("Missing request body for prediction")
        return jsonify({"message": "Missing request data"}), 400
    
    # Make prediction using the model registry
    try:
        result = model_registry.predict("diabetes", data, patient_id)
        
        if "error" in result:
            return jsonify({"message": result["error"]}), 400
            
        # Return the prediction result
        return jsonify({
            "prediction": {
                "result": bool(result["prediction"]),
                "probability": result["probability"],
                "confidence": result["confidence"],
                "risk_factors": result["risk_factors"],
                "patient": {
                    "id": patient.id,
                    "name": patient.full_name
                }
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Error making diabetes prediction: {str(e)}")
        return jsonify({"message": "An error occurred during prediction"}), 500

@diagnostics_bp.route('/diabetes/history/<patient_id>', methods=['GET'])
@token_required
def get_diabetes_history(current_user, patient_id):
    """Get diabetes prediction history for a patient"""
    logger.info(f"Diabetes history request for patient {patient_id} from user {current_user.username}")
    
    # Verify the patient exists and belongs to the current doctor
    patient = Patient.query.filter_by(id=patient_id, doctor_id=current_user.id).first()
    if not patient:
        logger.warning(f"Patient {patient_id} not found or doesn't belong to doctor {current_user.id}")
        return jsonify({"message": "Patient not found"}), 404
    
    try:
        # Get all predictions for the patient, ordered by most recent first
        predictions = DiabetesPrediction.query.filter_by(patient_id=patient_id).order_by(DiabetesPrediction.created_at.desc()).all()
        
        # Convert to dictionaries for JSON response
        history = [prediction.to_dict() for prediction in predictions]
        
        return jsonify({
            "patient": {
                "id": patient.id,
                "name": patient.full_name
            },
            "history": history
        }), 200
        
    except Exception as e:
        logger.error(f"Error retrieving diabetes history: {str(e)}")
        return jsonify({"message": "An error occurred retrieving prediction history"}), 500

@diagnostics_bp.route('/diabetes/prediction/<prediction_id>', methods=['GET'])
@token_required
def get_diabetes_prediction(current_user, prediction_id):
    """Get a specific diabetes prediction"""
    logger.info(f"Request for diabetes prediction {prediction_id} from user {current_user.username}")
    
    try:
        # Get the prediction
        prediction = DiabetesPrediction.query.get(prediction_id)
        
        if not prediction:
            logger.warning(f"Diabetes prediction {prediction_id} not found")
            return jsonify({"message": "Prediction not found"}), 404
            
        # Verify the prediction's patient belongs to the current doctor
        patient = Patient.query.filter_by(id=prediction.patient_id, doctor_id=current_user.id).first()
        if not patient:
            logger.warning(f"Patient for prediction {prediction_id} not found or doesn't belong to doctor {current_user.id}")
            return jsonify({"message": "Access denied: Patient not found"}), 404
            
        # Return the prediction
        return jsonify({
            "prediction": prediction.to_dict(),
            "patient": {
                "id": patient.id,
                "name": patient.full_name
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Error retrieving diabetes prediction: {str(e)}")
        return jsonify({"message": "An error occurred retrieving prediction"}), 500

@diagnostics_bp.route('/diabetes/prediction/<prediction_id>', methods=['PUT'])
@token_required
def update_diabetes_prediction(current_user, prediction_id):
    """Update a specific diabetes prediction with doctor's assessment"""
    logger.info(f"Update diabetes prediction {prediction_id} request from user {current_user.username}")
    
    data = request.get_json()
    if not data:
        logger.warning("Missing request body for prediction update")
        return jsonify({"message": "Missing update data"}), 400
        
    try:
        # Get the prediction
        prediction = DiabetesPrediction.query.get(prediction_id)
        
        if not prediction:
            logger.warning(f"Diabetes prediction {prediction_id} not found")
            return jsonify({"message": "Prediction not found"}), 404
            
        # Verify the prediction's patient belongs to the current doctor
        patient = Patient.query.filter_by(id=prediction.patient_id, doctor_id=current_user.id).first()
        if not patient:
            logger.warning(f"Patient for prediction {prediction_id} not found or doesn't belong to doctor {current_user.id}")
            return jsonify({"message": "Access denied: Patient not found"}), 404
            
        # Update doctor's assessment if provided
        if "doctor_assessment" in data:
            prediction.doctor_assessment = bool(data["doctor_assessment"])
            
        # Update doctor's notes if provided
        if "doctor_notes" in data:
            prediction.doctor_notes = data["doctor_notes"]
            
        # Save changes
        db.session.commit()
        
        logger.info(f"Updated diabetes prediction {prediction_id}")
            
        # Return the updated prediction
        return jsonify({
            "message": "Prediction updated successfully",
            "prediction": prediction.to_dict()
        }), 200
        
    except SQLAlchemyError as e:
        db.session.rollback()
        logger.error(f"Database error updating diabetes prediction: {str(e)}")
        return jsonify({"message": "Database error updating prediction"}), 500
    except Exception as e:
        logger.error(f"Error updating diabetes prediction: {str(e)}")
        return jsonify({"message": "An error occurred updating prediction"}), 500

@diagnostics_bp.route('/models', methods=['GET'])
@token_required
def get_available_models(current_user):
    """Get a list of all available diagnostic models"""
    logger.info(f"Available models request from user {current_user.username}")
    
    try:
        # Get all models from the registry
        models = model_registry.get_all_models()
        
        return jsonify({
            "models": models
        }), 200
        
    except Exception as e:
        logger.error(f"Error retrieving available models: {str(e)}")
        return jsonify({"message": "An error occurred retrieving models"}), 500