from flask import Blueprint, request, jsonify
import sys
from pathlib import Path
from sqlalchemy.exc import SQLAlchemyError

sys.path.append(str(Path(__file__).resolve().parents[1]))

from utils.logger import setup_logger
from utils.db import db
from utils.security import token_required
from models.patient import Patient
from models.diagnostic import DiabetesPrediction, BrainTumorPrediction, BreastCancerPrediction
from ml_models.model_registry import model_registry

logger = setup_logger("diagnostics_api")

# Create a blueprint for the diagnostics routes
diagnostics_bp = Blueprint('diagnostics', __name__, url_prefix='/api/diagnostics')

@diagnostics_bp.route('/diabetes/predict/<patient_id>', methods=['POST'])
@token_required
def predict_diabetes(current_user, patient_id):
    """Make a diabetes prediction for a patient"""
    logger.info(f"Diabetes prediction request for patient {patient_id} from user {current_user.username}")
    
    try:
        # Get the patient - make sure it belongs to the current doctor
        patient = Patient.query.filter_by(id=patient_id, doctor_id=current_user.id).first()
        
        if not patient:
            logger.warning(f"Diabetes prediction failed: patient not found - {patient_id}")
            return jsonify({'message': 'Patient not found'}), 404
        
        # Get the input data from the request
        data = request.json
        logger.info(f"Received input data for prediction")
        
        # Generate patient name
        patient_name = f"{patient.first_name} {patient.last_name}"
        logger.info(f"Processing diabetes prediction for {patient_name}")
        
        # Make prediction using model registry
        try:
            context = {"patient_id": patient_id, "doctor_id": current_user.id}
            prediction = model_registry.predict(model_name="diabetes", data=data, context=context)
        except Exception as model_error:
            logger.error(f"Error in model_registry.predict: {str(model_error)}", exc_info=True)
            return jsonify({'message': 'Model prediction service error'}), 500
        
        if "error" in prediction:
            logger.error(f"Diabetes prediction error: {prediction['error']}")
            return jsonify({'message': prediction['error']}), 400
        
        # Format the prediction result to ensure it can be serialized to JSON
        try:
            # Safe conversion of values with defaults to ensure serialization works
            prediction_result = {
                "result": bool(prediction.get("prediction", False)),
                "probability": float(prediction.get("probability", 0)),
                "confidence": float(prediction.get("confidence", 0)),
                "risk_factors": prediction.get("risk_factors", []),
                "timestamp": str(prediction.get("timestamp", "")),
                "id": prediction.get("id")
            }
        except Exception as format_error:
            logger.error(f"Error formatting prediction result: {str(format_error)}", exc_info=True)
            return jsonify({'message': 'Error formatting prediction result'}), 500
        
        # Return formatted results
        return jsonify({
            'prediction': prediction_result,
            'patient_id': patient_id,
            'patient_name': patient_name
        }), 200
        
    except Exception as e:
        logger.error(f"Error making diabetes prediction: {str(e)}", exc_info=True)
        db.session.rollback()  # Make sure to rollback any pending transactions
        return jsonify({'message': 'An error occurred during prediction'}), 500

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
                "name": f"{patient.first_name} {patient.last_name}"
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
                "name": f"{patient.first_name} {patient.last_name}"
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


# TODO:____________________________________Brain Tumor Prediction____________________________________
@diagnostics_bp.route('/breast-cancer/predict/<patient_id>', methods=['POST'])
@token_required
def predict_breast_cancer(current_user, patient_id):
    """Make a breast cancer prediction for a patient"""
    logger.info(f"Breast cancer prediction request for patient {patient_id} from user {current_user.username}")
    
    try:
        # Get the patient - make sure it belongs to the current doctor
        patient = Patient.query.filter_by(id=patient_id, doctor_id=current_user.id).first()
        
        if not patient:
            logger.warning(f"Breast cancer prediction failed: patient not found - {patient_id}")
            return jsonify({'message': 'Patient not found'}), 404
        
        # Get the input data from the request
        data = request.json
        logger.info(f"Received input data for breast cancer prediction")
        
        # Generate patient name
        patient_name = f"{patient.first_name} {patient.last_name}"
        logger.info(f"Processing breast cancer prediction for {patient_name}")
        
        # Make prediction using model registry
        try:
            context = {"patient_id": patient_id, "doctor_id": current_user.id}
            prediction = model_registry.predict(model_name="breast-cancer", data=data, context=context)
        except Exception as model_error:
            logger.error(f"Error in model_registry.predict: {str(model_error)}", exc_info=True)
            return jsonify({'message': 'Model prediction service error'}), 500
        
        if "error" in prediction:
            logger.error(f"Breast cancer prediction error: {prediction['error']}")
            return jsonify({'message': prediction['error']}), 400
        
        # Format the prediction result to ensure it can be serialized to JSON
        try:
            # Safe conversion of values with defaults to ensure serialization works
            prediction_result = {
                "result": bool(prediction.get("prediction", False)),
                "probability": float(prediction.get("probability", 0)),
                "confidence": float(prediction.get("confidence", 0)),
                "features_importance": prediction.get("features_importance", []),
                "timestamp": str(prediction.get("timestamp", "")),
                "id": prediction.get("id")
            }
        except Exception as format_error:
            logger.error(f"Error formatting breast cancer prediction result: {str(format_error)}", exc_info=True)
            return jsonify({'message': 'Error formatting prediction result'}), 500
        
        # Return formatted results
        return jsonify({
            'prediction': prediction_result,
            'patient_id': patient_id,
            'patient_name': patient_name
        }), 200
        
    except Exception as e:
        logger.error(f"Error making breast cancer prediction: {str(e)}", exc_info=True)
        db.session.rollback()  # Make sure to rollback any pending transactions
        return jsonify({'message': 'An error occurred during prediction'}), 500

@diagnostics_bp.route('/breast-cancer/history/<patient_id>', methods=['GET'])
@token_required
def get_breast_cancer_history(current_user, patient_id):
    """Get breast cancer prediction history for a patient"""
    logger.info(f"Breast cancer history request for patient {patient_id} from user {current_user.username}")
    
    # Verify the patient exists and belongs to the current doctor
    patient = Patient.query.filter_by(id=patient_id, doctor_id=current_user.id).first()
    if not patient:
        logger.warning(f"Patient {patient_id} not found or doesn't belong to doctor {current_user.id}")
        return jsonify({"message": "Patient not found"}), 404
    
    try:
        # Get all predictions for the patient, ordered by most recent first
        predictions = BreastCancerPrediction.query.filter_by(patient_id=patient_id).order_by(BreastCancerPrediction.created_at.desc()).all()
        
        # Convert to dictionaries for JSON response
        history = [prediction.to_dict() for prediction in predictions]
        
        return jsonify({
            "patient": {
                "id": patient.id,
                "name": f"{patient.first_name} {patient.last_name}"
            },
            "history": history
        }), 200
        
    except Exception as e:
        logger.error(f"Error retrieving breast cancer history: {str(e)}", exc_info=True)
        db.session.rollback()
        return jsonify({"message": "An error occurred retrieving prediction history"}), 500
    
@diagnostics_bp.route('/breast-cancer/prediction/<prediction_id>', methods=['GET'])
@token_required
def get_breast_cancer_prediction(current_user, prediction_id):
    """Get a specific breast cancer prediction"""
    logger.info(f"Request for breast cancer prediction {prediction_id} from user {current_user.username}")
    
    try:
        # Get the prediction
        prediction = BreastCancerPrediction.query.get(prediction_id)
        
        if not prediction:
            logger.warning(f"Breast cancer prediction {prediction_id} not found")
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
                "name": f"{patient.first_name} {patient.last_name}"
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Error retrieving breast cancer prediction: {str(e)}")
        return jsonify({"message": "An error occurred retrieving prediction"}), 500

@diagnostics_bp.route('/breast-cancer/prediction/<prediction_id>', methods=['PUT'])
@token_required
def update_breast_cancer_prediction(current_user, prediction_id):
    """Update a specific breast cancer prediction with doctor's assessment"""
    logger.info(f"Update breast cancer prediction {prediction_id} request from user {current_user.username}")
    
    data = request.get_json()
    if not data:
        logger.warning("Missing request body for prediction update")
        return jsonify({"message": "Missing update data"}), 400
        
    try:
        # Get the prediction
        prediction = BreastCancerPrediction.query.get(prediction_id)
        
        if not prediction:
            logger.warning(f"Breast cancer prediction {prediction_id} not found")
            return jsonify({"message": "Prediction not found"}), 404
            
        # Verify the prediction's patient belongs to the current doctor
        patient = Patient.query.filter_by(id=prediction.patient_id, doctor_id=current_user.id).first()
        if not patient:
            logger.warning(f"Patient for prediction {prediction_id} not found or doesn't belong to doctor {current_user.id}")
            return jsonify({"message": "Access denied: Patient not found"}), 404
            
        # Update doctor's assessment if provided
        if "doctor_assessment" in data:
            prediction.doctor_assessment = data["doctor_assessment"]
            
        # Update doctor's notes if provided
        if "doctor_notes" in data:
            prediction.doctor_notes = data["doctor_notes"]
            
        # Save changes
        db.session.commit()
        
        logger.info(f"Updated breast cancer prediction {prediction_id}")
            
        # Return the updated prediction
        return jsonify({
            "message": "Prediction updated successfully",
            "prediction": prediction.to_dict()
        }), 200
        
    except SQLAlchemyError as e:
        db.session.rollback()
        logger.error(f"Database error updating breast cancer prediction: {str(e)}")
        return jsonify({"message": "Database error updating prediction"}), 500
    except Exception as e:
        logger.error(f"Error updating breast cancer prediction: {str(e)}")
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