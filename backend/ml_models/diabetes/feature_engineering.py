import numpy as np
import pandas as pd
from typing import Dict, Optional
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[2]))
from utils.logger import setup_logger

logger = setup_logger("diabetes_feature_engineering")

class FeatureEngineer:
    """
    Handles feature engineering for diabetes prediction model.
    Creates derived features from input data.
    """
    
    def __init__(self, config: Optional[Dict] = None):
        """
        Initialize feature engineering configuration.
        
        Args:
            config: Optional configuration dictionary
        """
        self.config = config or {
            'age_risk_threshold': 40.0,  # Age above which diabetes risk increases
            'bmi_categories': {
                'Underweight': 18.5,
                'Normal': 24.9,
                'Overweight': 29.9,
                'Obese': float('inf')
            },
            'glucose_risk_threshold': 140.0,  # High blood glucose threshold
            'HbA1c_risk_threshold': 5.7,  # Pre-diabetes threshold
        }
        logger.info("FeatureEngineer initialized with configuration")

    def transform(self, data: Dict) -> Dict:
        """
        Apply feature engineering transformations to a single data point.
        
        Args:
            data: Input data dictionary
            
        Returns:
            Dict with engineered features
        """
        logger.info("Starting feature engineering transformation for single data point")
        
        # Create copy to avoid modifying original data
        data_copy = data.copy()
        
        # Create features
        data_copy = self._create_bmi_features(data_copy)
        data_copy = self._create_age_related_features(data_copy)
        data_copy = self._create_medical_risk_score(data_copy)
        data_copy = self._create_metabolic_score(data_copy)
        data_copy = self._create_lifestyle_score(data_copy)
        data_copy = self._create_interaction_features(data_copy)
        
        logger.info("Feature engineering completed for single data point")
        return data_copy
    
    def _create_bmi_features(self, data: Dict) -> Dict:
        """Create BMI-related features."""
        # Get BMI value
        bmi = float(data['bmi'])
        
        # Determine BMI category
        if bmi < self.config['bmi_categories']['Underweight']:
            data['bmi_category'] = 0  # Underweight
        elif bmi < self.config['bmi_categories']['Normal']:
            data['bmi_category'] = 1  # Normal
        elif bmi < self.config['bmi_categories']['Overweight']:
            data['bmi_category'] = 2  # Overweight
        else:
            data['bmi_category'] = 3  # Obese
        
        logger.info("Created BMI category features")
        return data
    
    def _create_age_related_features(self, data: Dict) -> Dict:
        """Create age-related features."""
        # Age risk factor (increases after threshold)
        age = float(data['age'])
        data['age_risk'] = 1 if age > self.config['age_risk_threshold'] else 0
        
        # Age-BMI interaction
        data['age_bmi_interaction'] = age * float(data['bmi']) / 100.0
        
        logger.info("Created age-related features")
        return data
    
    def _create_medical_risk_score(self, data: Dict) -> Dict:
        """Create composite medical risk score."""
        hypertension = int(data['hypertension'])
        heart_disease = int(data['heart_disease'])
        age_risk = int(data['age_risk'])
        bmi_category = int(data['bmi_category'])
        
        data['medical_risk_score'] = (
            hypertension * 2.0 +  # High impact
            heart_disease * 2.0 +  # High impact
            age_risk * 1.5 +      # Medium impact
            (bmi_category >= 2) * 1.0  # Impact of overweight/obese
        ) / 6.5  # Normalize to 0-1 range
        
        logger.info("Created medical risk score")
        return data
    
    def _create_metabolic_score(self, data: Dict) -> Dict:
        """Create metabolic health score."""
        # High glucose risk
        glucose_risk = 1.0 if float(data['blood_glucose_level']) > self.config['glucose_risk_threshold'] else 0.0
        
        # High HbA1c risk
        hba1c_risk = 1.0 if float(data['HbA1c_level']) > self.config['HbA1c_risk_threshold'] else 0.0
        
        # Combined metabolic score
        data['metabolic_score'] = (
            glucose_risk * 2.0 +  # High impact
            hba1c_risk * 2.0 +   # High impact
            (data['bmi_category'] >= 2) * 1.0  # Impact of overweight/obese
        ) / 5.0  # Normalize to 0-1 range
        
        logger.info("Created metabolic score")
        return data
    
    def _create_lifestyle_score(self, data: Dict) -> Dict:
        """Create lifestyle risk score based on smoking history and BMI."""
        # Encode smoking history risk
        smoking_history = data['smoking_history']
        
        # Risk weights for different smoking statuses
        risk_weights = {
            'current': 1.0,
            'former': 0.7,
            'ever': 0.7,
            'not current': 0.5,
            'never': 0.0,
            'unknown': 0.5
        }
        
        # Get risk weight for this smoking status
        smoking_risk = risk_weights.get(smoking_history, 0.5)
        data['smoking_risk'] = smoking_risk
        
        # Combine with BMI risk for overall lifestyle score
        data['lifestyle_score'] = (
            smoking_risk * 0.6 +  # Smoking impact
            (data['bmi_category'] >= 2) * 0.4  # BMI impact
        )
        
        logger.info("Created lifestyle score")
        return data
    
    def _create_interaction_features(self, data: Dict) -> Dict:
        """Create interaction features between important variables."""
        # Age-medical interactions
        data['age_hypertension'] = float(data['age']) * int(data['hypertension'])
        data['age_heart_disease'] = float(data['age']) * int(data['heart_disease'])
        
        # Medical condition interactions
        data['cardio_metabolic_risk'] = int(data['hypertension']) * int(data['heart_disease']) * data['metabolic_score']
        
        # Risk score interactions
        data['combined_risk_score'] = (
            data['medical_risk_score'] * 0.4 +
            data['metabolic_score'] * 0.4 +
            data['lifestyle_score'] * 0.2
        )
        
        logger.info("Created interaction features")
        return data
