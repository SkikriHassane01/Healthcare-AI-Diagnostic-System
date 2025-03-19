import os
import joblib
import numpy as np
import pandas as pd
from datetime import datetime
import sys
from pathlib import Path
from typing import Dict, Optional

sys.path.append(str(Path(__file__).resolve().parents[2]))
from utils.logger import setup_logger
from utils.db import db
from models.diagnostic import DiabetesPrediction
from .feature_engineering import FeatureEngineer

logger = setup_logger("diabetes_model")

class DiabetesModel:
    """
    Connector for the diabetes prediction model.
    Handles loading the model, preprocessing input data, making predictions,
    and storing results.
    """
    
    def __init__(self):
        """Initialize the model by loading from disk"""
        self.model_path = os.path.join(os.path.dirname(__file__), 'diabetes_model.pkl')
        self.model = self._load_model()
        self.feature_engineer = FeatureEngineer()
        
        # Define feature information for validation and preprocessing
        self.features_info = {
            "categorical": {
                "gender": ["Male", "Female", "Other"],
                "smoking_history": ["never", "former", "current", "not current", "ever", "unknown"]
            },
            "binary": {
                "hypertension": [0, 1],
                "heart_disease": [0, 1]
            },
            "continuous": {
                "age": {"min": 0, "max": 120},
                "bmi": {"min": 10, "max": 60},
                "HbA1c_level": {"min": 3, "max": 15},
                "blood_glucose_level": {"min": 50, "max": 400}
            }
        }
        
        # Define the expected order of features for the model
        self.feature_order = [
            "gender", "age", "hypertension", "heart_disease", "smoking_history", 
            "bmi", "bmi_category", "age_risk", "age_bmi_interaction", 
            "medical_risk_score", "metabolic_score", "lifestyle_score",
            "age_hypertension", "age_heart_disease", "cardio_metabolic_risk",
            "combined_risk_score", "smoking_risk", 
            "HbA1c_level", "blood_glucose_level"
        ]
        
        # Define mapping for categorical features
        self.gender_mapping = {
            "Male": 0,
            "Female": 1,
            "Other": 2
        }
        
        self.smoking_history_mapping = {
            "never": 0,
            "former": 1,
            "current": 2,
            "not current": 3,
            "ever": 4,
            "unknown": 5
        }
    
    def _load_model(self):
        """Load the serialized model from disk"""
        try:
            if os.path.exists(self.model_path):
                model = joblib.load(self.model_path)
                logger.info(f"Successfully loaded diabetes model from {self.model_path}")
                return model
            else:
                logger.error(f"Model file not found at {self.model_path}")
                return None
        except Exception as e:
            logger.error(f"Error loading diabetes model: {str(e)}")
            return None
    
    def validate_input(self, data):
        """
        Validate that all required fields are present and within expected ranges.
        
        Args:
            data (dict): Input data for prediction
            
        Returns:
            tuple: (is_valid, error_message)
        """
        missing_fields = []
        invalid_fields = []
        
        # Check categorical features
        for feature, valid_values in self.features_info["categorical"].items():
            if feature not in data:
                missing_fields.append(feature)
            elif data[feature] not in valid_values:
                invalid_fields.append(f"{feature} must be one of {valid_values}")
        
        # Check binary features
        for feature, valid_values in self.features_info["binary"].items():
            if feature not in data:
                missing_fields.append(feature)
            elif data[feature] not in valid_values:
                invalid_fields.append(f"{feature} must be one of {valid_values}")
        
        # Check continuous features
        for feature, limits in self.features_info["continuous"].items():
            if feature not in data:
                missing_fields.append(feature)
            else:
                try:
                    value = float(data[feature])
                    if value < limits["min"] or value > limits["max"]:
                        invalid_fields.append(f"{feature} must be between {limits['min']} and {limits['max']}")
                except (ValueError, TypeError):
                    invalid_fields.append(f"{feature} must be a number")
        
        if missing_fields:
            return False, f"Missing required fields: {', '.join(missing_fields)}"
        
        if invalid_fields:
            return False, f"Invalid field values: {'; '.join(invalid_fields)}"
        
        return True, ""
    
    def preprocess_input(self, data):
        """
        Preprocess input data for the model.
        
        Args:
            data (dict): Input data for prediction
            
        Returns:
            numpy.ndarray: Preprocessed input data ready for the model
        """
        # Apply comprehensive feature engineering to create all derived features
        enhanced_data = self.feature_engineer.transform(data)
        logger.info(f"Features created: {list(enhanced_data.keys())}")
        
        # Create a list to store the preprocessed features in the correct order
        preprocessed = []
        
        # Process each feature in the expected order
        for feature in self.feature_order:
            if feature == "gender":
                # Map gender to numeric value
                preprocessed.append(self.gender_mapping[enhanced_data[feature]])
            elif feature == "smoking_history":
                # Map smoking history to numeric value
                preprocessed.append(self.smoking_history_mapping[enhanced_data[feature]])
            elif feature in self.features_info["continuous"]:
                # Convert continuous features to float
                preprocessed.append(float(enhanced_data[feature]))
            elif feature in enhanced_data:
                # Use the engineered feature if it exists
                preprocessed.append(enhanced_data[feature])
            else:
                # If a feature is missing, use a default value of 0
                logger.warning(f"Feature {feature} was not found in engineered data, using default value")
                preprocessed.append(0)
        
        return np.array([preprocessed])
    
    def predict(self, data, context=None):
        """
        Make a prediction using the diabetes model.
        
        Args:
            data (dict): Input data for prediction
            context (dict, optional): Additional context like patient_id
            
        Returns:
            dict: Prediction results including diabetic status and confidence scores
        """
        # Validate input data
        is_valid, error_message = self.validate_input(data)
        if not is_valid:
            logger.error(f"Input validation failed: {error_message}")
            return {"error": error_message}
        
        try:
            # Preprocess the input data
            preprocessed_data = self.preprocess_input(data)
            
            # Make prediction
            prediction_proba = self.model.predict_proba(preprocessed_data)[0]
            prediction = int(prediction_proba[1] >= 0.5)  # 1 if probability >= 0.5, else 0
            
            # Calculate risk factors (this is a simplified version)
            risk_factors = self._calculate_risk_factors(data)
            
            # Create result dictionary
            result = {
                "prediction": prediction,
                "probability": float(prediction_proba[1]),
                "confidence": float(max(prediction_proba)),
                "risk_factors": risk_factors,
                "timestamp": datetime.utcnow().isoformat()
            }
            
            # Store result in database if patient_id is provided and prevent database errors from affecting the response
            if context and "patient_id" in context:
                try:
                    prediction_id = self._store_prediction(data, result, context["patient_id"])
                    result["id"] = prediction_id
                except Exception as e:
                    logger.error(f"Error storing prediction in database: {str(e)}")
                    # Add a flag to indicate storage failure but still return prediction
                    result["storage_error"] = "Failed to store prediction in database"
                    
                    # If the error is related to missing tables, provide a hint
                    if "relation" in str(e) and "does not exist" in str(e):
                        result["storage_error_hint"] = "Database tables may not be initialized. Run initialize_db.py script."
                        
                    # If there's a transaction issue, try to rollback
                    try:
                        db.session.rollback()
                        logger.info("Database session rolled back")
                    except Exception as rollback_error:
                        logger.error(f"Error rolling back session: {str(rollback_error)}")
            
            return result
            
        except Exception as e:
            logger.error(f"Error making diabetes prediction: {str(e)}")
            return {"error": "An error occurred during prediction"}
    
    def _calculate_risk_factors(self, data):
        """
        Calculate risk factors and their contributions to the prediction.
        
        Args:
            data (dict): Input data for prediction
            
        Returns:
            list: Risk factors sorted by importance
        """
        risk_factors = []
        
        # Age factor
        age = float(data["age"])
        if age > 45:
            risk_level = "high" if age > 65 else "medium"
            risk_factors.append({
                "factor": "age",
                "value": age,
                "level": risk_level,
                "description": "Age above 45 increases diabetes risk"
            })
        
        # BMI factor
        bmi = float(data["bmi"])
        if bmi >= 25:
            risk_level = "high" if bmi >= 30 else "medium"
            risk_factors.append({
                "factor": "bmi",
                "value": bmi,
                "level": risk_level,
                "description": "BMI of 25 or higher indicates overweight/obesity, increasing diabetes risk"
            })
        
        # Blood glucose level
        glucose = float(data["blood_glucose_level"])
        if glucose >= 140:
            risk_level = "high" if glucose >= 200 else "medium"
            risk_factors.append({
                "factor": "blood_glucose_level",
                "value": glucose,
                "level": risk_level,
                "description": "Elevated blood glucose level indicates potential diabetes"
            })
        
        # HbA1c level
        hba1c = float(data["HbA1c_level"])
        if hba1c >= 5.7:
            risk_level = "high" if hba1c >= 6.5 else "medium"
            risk_factors.append({
                "factor": "HbA1c_level",
                "value": hba1c,
                "level": risk_level,
                "description": "HbA1c of 5.7 or higher indicates prediabetes or diabetes"
            })
        
        # Hypertension
        if data["hypertension"] == 1:
            risk_factors.append({
                "factor": "hypertension",
                "value": "Yes",
                "level": "medium",
                "description": "Hypertension is associated with increased diabetes risk"
            })
        
        # Heart disease
        if data["heart_disease"] == 1:
            risk_factors.append({
                "factor": "heart_disease",
                "value": "Yes",
                "level": "medium",
                "description": "Heart disease is associated with increased diabetes risk"
            })
        
        # Smoking history
        if data["smoking_history"] in ["current", "ever"]:
            risk_factors.append({
                "factor": "smoking_history",
                "value": data["smoking_history"],
                "level": "medium",
                "description": "Smoking is associated with increased diabetes risk"
            })
        
        # Sort risk factors by level (high to low)
        level_order = {"high": 0, "medium": 1, "low": 2}
        risk_factors.sort(key=lambda x: level_order[x["level"]])
        
        return risk_factors
    
    def _store_prediction(self, input_data, result, patient_id):
        """
        Store the prediction result in the database.
        
        Args:
            input_data (dict): Original input data
            result (dict): Prediction result
            patient_id (str): Patient ID
        """
        prediction = DiabetesPrediction(
            patient_id=patient_id,
            input_data=input_data,
            prediction_result=result["prediction"],
            prediction_probability=result["probability"],
            risk_factors=result["risk_factors"]
        )
        
        db.session.add(prediction)
        db.session.commit()
        
        logger.info(f"Stored diabetes prediction for patient {patient_id}")
        
        return prediction.id