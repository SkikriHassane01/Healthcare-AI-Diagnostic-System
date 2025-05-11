import os
import sys
import numpy as np
from pathlib import Path
from datetime import datetime
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from PIL import Image
import io

sys.path.append(str(Path(__file__).resolve().parents[2]))
from utils.logger import setup_logger
from utils.db import db
from models.diagnostic import AlzheimerPrediction

logger = setup_logger("alzheimer_model")

class AlzheimerModel:
    """
    Connector for the Alzheimer's detection model.
    Handles loading the model, preprocessing MRI images, making predictions,
    and storing results.
    """
    
    def __init__(self):
        """Initialize the model by loading from disk"""
        self.model_path = os.path.join(os.path.dirname(__file__), 'alzheimer_model.keras')
        self.model = self._load_model()
        
        # Define class labels
        self.class_labels = ['CN', 'EMCI', 'LMCI', 'AD']
        self.class_descriptions = {
            'CN': 'Cognitive Normal (Non Demented)',
            'EMCI': 'Early Mild Cognitive Impairment (Very Mild Dementia)',
            'LMCI': 'Late Mild Cognitive Impairment (Mild Dementia)',
            'AD': 'Alzheimer\'s Disease (Moderate Dementia)'
        }
        
        # Image preprocessing parameters
        self.target_size = (224, 224)  # Standard input size for DenseNet
        self.preprocess_input = tf.keras.applications.densenet.preprocess_input
    
    def _load_model(self):
        """Load the Keras model from disk"""
        try:
            if os.path.exists(self.model_path):
                # Load model with custom objects if needed
                model = load_model(self.model_path)
                logger.info(f"Successfully loaded Alzheimer model from {self.model_path}")
                return model
            else:
                logger.error(f"Model file not found at {self.model_path}")
                return None
        except Exception as e:
            logger.error(f"Error loading Alzheimer model: {str(e)}")
            return None
    
    def validate_input(self, image_data):
        """
        Validate the input image.
        
        Args:
            image_data (bytes): Raw image data
            
        Returns:
            tuple: (is_valid, error_message)
        """
        if not image_data or len(image_data) == 0:
            return False, "No image data provided"
        
        try:
            # Try to open the image to ensure it's valid
            img = Image.open(io.BytesIO(image_data))
            img.verify()
            return True, ""
        except Exception as e:
            return False, f"Invalid image data: {str(e)}"
    
    def preprocess_image(self, image_data):
        """
        Preprocess the input image for the model.
        
        Args:
            image_data (bytes): Raw image data
            
        Returns:
            numpy.ndarray: Preprocessed image ready for the model
        """
        try:
            # Load image from bytes
            img = Image.open(io.BytesIO(image_data)).convert('RGB')
            
            # Resize image
            img = img.resize(self.target_size)
            
            # Convert to numpy array
            img_array = image.img_to_array(img)
            
            # Expand dimensions for batch processing
            img_array = np.expand_dims(img_array, axis=0)
            
            # Apply DenseNet preprocessing
            preprocessed_img = self.preprocess_input(img_array)
            
            logger.info("Image successfully preprocessed")
            return preprocessed_img
            
        except Exception as e:
            logger.error(f"Error preprocessing image: {str(e)}")
            raise
    
    def predict(self, image_data, context=None):
        """
        Make a prediction using the Alzheimer model.
        
        Args:
            image_data (bytes): Raw image data
            context (dict, optional): Additional context like patient_id and image_path
            
        Returns:
            dict: Prediction results including Alzheimer's classification and confidence scores
        """
        # Validate input data
        is_valid, error_message = self.validate_input(image_data)
        if not is_valid:
            logger.error(f"Input validation failed: {error_message}")
            return {"error": error_message}
        
        try:
            # Preprocess the input image
            logger.info("Preprocessing input image")
            preprocessed_data = self.preprocess_image(image_data)
            
            # Check if model exists
            if self.model is None:
                logger.error("Model not loaded - prediction cannot continue")
                return {"error": "Model not loaded - please check server configuration"}
            
            # Make prediction
            logger.info("Making prediction with model")
            try:
                predictions = self.model.predict(preprocessed_data)
                logger.info(f"Raw prediction values: {predictions[0]}")
                
                # Get class probabilities
                class_probabilities = predictions[0]
                
                # Get the predicted class index and label
                predicted_class_index = np.argmax(class_probabilities)
                predicted_class = self.class_labels[predicted_class_index]
                
                # Get the confidence (highest probability)
                confidence = float(class_probabilities[predicted_class_index])
                
            except Exception as model_error:
                logger.error(f"Error during model prediction: {str(model_error)}")
                return {"error": f"Model prediction failed: {str(model_error)}"}
            
            # Create result dictionary
            result = {
                "predicted_class": predicted_class,
                "class_description": self.class_descriptions[predicted_class],
                "confidence": confidence,
                "probabilities": {
                    self.class_labels[i]: float(prob) 
                    for i, prob in enumerate(class_probabilities)
                },
                "timestamp": datetime.utcnow().isoformat()
            }
            
            logger.info(f"Prediction result: {predicted_class} with {confidence:.2f} confidence")
            
            # Store result in database if patient_id and image_path are provided
            if context and "patient_id" in context and "image_path" in context:
                try:
                    prediction_id = self._store_prediction(
                        result, 
                        context["patient_id"], 
                        context["image_path"]
                    )
                    result["id"] = str(prediction_id)
                    logger.info(f"Stored prediction with ID: {prediction_id}")
                except Exception as db_error:
                    logger.error(f"Error storing prediction in database: {str(db_error)}")
                    result["storage_error"] = "Failed to store prediction"
                    
                    # Try to rollback the transaction
                    try:
                        db.session.rollback()
                    except:
                        pass
            
            return result
            
        except Exception as e:
            logger.error(f"Error in Alzheimer prediction process: {str(e)}", exc_info=True)
            return {"error": "An error occurred during prediction processing"}
    
    def _store_prediction(self, result, patient_id, image_path):
        """
        Store the prediction result in the database.
        
        Args:
            result (dict): Prediction result
            patient_id (str): Patient ID
            image_path (str): Path where image is stored
        """
        prediction = AlzheimerPrediction(
            patient_id=patient_id,
            image_path=image_path,
            prediction_class=result["predicted_class"],
            cn_probability=result["probabilities"]["CN"],
            emci_probability=result["probabilities"]["EMCI"],
            lmci_probability=result["probabilities"]["LMCI"],
            ad_probability=result["probabilities"]["AD"],
            confidence=result["confidence"]
        )
        
        db.session.add(prediction)
        db.session.commit()
        
        logger.info(f"Stored Alzheimer prediction for patient {patient_id}")
        
        return prediction.id
