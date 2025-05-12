import os
import importlib
import json
from pathlib import Path
import sys

sys.path.append(str(Path(__file__).resolve().parents[1]))
from utils.logger import setup_logger

logger = setup_logger("model_registry")

class ModelRegistry:
    """
    Central registry for all prediction models in the system.
    Handles model discovery, registration, and access.
    """
    
    def __init__(self):
        self.models = {}
        self.config_path = os.path.join(os.path.dirname(__file__), 'model_config.json')
        self._load_config()
        
    def _load_config(self):
        """Load model configuration from JSON file"""
        try:
            if os.path.exists(self.config_path):
                with open(self.config_path, 'r') as f:
                    self.model_config = json.load(f)
                logger.info(f"Loaded model configuration from {self.config_path}")
            else:
                self.model_config = {
                    "models": {
                        "diabetes": {
                            "connector": "ml_models.diabetes.connector",
                            "class": "DiabetesModel",
                            "type": "tabular",
                            "version": "1.0.0",
                            "enabled": True
                        }
                    }
                }
                # Save default config
                with open(self.config_path, 'w') as f:
                    json.dump(self.model_config, f, indent=4)
                logger.info(f"Created default model configuration at {self.config_path}")
        except Exception as e:
            logger.error(f"Error loading model configuration: {str(e)}")
            self.model_config = {"models": {}}
            
    def register_models(self):
        """Discover and register all enabled models from configuration"""
        for model_name, model_info in self.model_config.get("models", {}).items():
            if model_info.get("enabled", False):
                try:
                    # Dynamically import the connector module
                    module_name = model_info.get("connector")
                    class_name = model_info.get("class")
                    
                    if not module_name or not class_name:
                        logger.error(f"Missing connector or class for model {model_name}")
                        continue
                    
                    # Import the module
                    module = importlib.import_module(module_name)
                    
                    # Get the model class
                    model_class = getattr(module, class_name)
                    
                    # Instantiate the model
                    model_instance = model_class()
                    
                    # Register the model
                    self.models[model_name] = {
                        "instance": model_instance,
                        "info": model_info
                    }
                    
                    logger.info(f"Successfully registered model: {model_name} (v{model_info.get('version', 'unknown')})")
                except Exception as e:
                    logger.error(f"Error registering model {model_name}: {str(e)}")
    
    def get_model(self, model_name):
        """Get a specific model by name"""
        if (model_name not in self.models):
            logger.warning(f"Model {model_name} not found in registry")
            return None
            
        return self.models[model_name]["instance"]
    
    def get_all_models(self):
        """Get all registered models with their metadata"""
        return {name: {"info": info["info"]} for name, info in self.models.items()}
    
    def predict(self, model_name, data, context=None):
        """
        Make a prediction using the specified model
        
        Args:
            model_name (str): Name of the model to use
            data (dict): Input data for prediction
            context (dict, optional): Additional context information such as patient_id, doctor_id
            
        Returns:
            dict: Prediction results
        """
        model = self.get_model(model_name)
        
        if not model:
            logger.error(f"Model {model_name} not found for prediction")
            return {"error": f"Model {model_name} not found"}
        
        try:
            # Make prediction with context
            result = model.predict(data, context)
            logger.info(f"Prediction made with model {model_name}")
            
            # Log the prediction result structure for debugging
            logger.info(f"Prediction result structure: {type(result)}")
            if isinstance(result, dict):
                logger.info(f"Prediction result keys: {result.keys()}")
            
            # Return results
            return result
        except Exception as e:
            logger.error(f"Error making prediction with model {model_name}: {str(e)}", exc_info=True)
            return {"error": str(e)}

# Create a singleton instance of the registry
model_registry = ModelRegistry()

# Register all models at import time
model_registry.register_models()