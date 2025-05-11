from datetime import datetime
import uuid
import json
import sys 
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1]))

from utils.logger import setup_logger
from utils.db import db

logger = setup_logger("diagnostic_models")

class DiabetesPrediction(db.Model):
    """Model for storing diabetes prediction results"""
    
    __tablename__ = 'diabetes_predictions'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = db.Column(db.String(36), db.ForeignKey('patients.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Store input data as JSON
    _input_data = db.Column('input_data', db.Text, nullable=False)
    
    # Store prediction results
    prediction_result = db.Column(db.Boolean, nullable=False)  # 0: No Diabetes, 1: Diabetes
    prediction_probability = db.Column(db.Float, nullable=False)  # Probability of diabetes (0-1)
    
    # Store risk factors as JSON
    _risk_factors = db.Column('risk_factors', db.Text, nullable=True)
    
    # Doctor's assessment and notes
    doctor_assessment = db.Column(db.Boolean, nullable=True)  # Doctor's final assessment
    doctor_notes = db.Column(db.Text, nullable=True)  # Doctor's notes
    
    # Relationship with patient
    patient = db.relationship("Patient", backref=db.backref("diabetes_predictions", lazy=True))
    
    @property
    def input_data(self):
        """Get the input data as a dictionary"""
        if self._input_data:
            return json.loads(self._input_data)
        return {}
    
    @input_data.setter
    def input_data(self, value):
        """Set the input data from a dictionary"""
        self._input_data = json.dumps(value)
    
    @property
    def risk_factors(self):
        """Get the risk factors as a list"""
        if self._risk_factors:
            return json.loads(self._risk_factors)
        return []
    
    @risk_factors.setter
    def risk_factors(self, value):
        """Set the risk factors from a list"""
        self._risk_factors = json.dumps(value)
    
    def __init__(self, patient_id, input_data, prediction_result, prediction_probability, risk_factors=None, doctor_assessment=None, doctor_notes=None):
        """Initialize a new diabetes prediction record"""
        self.patient_id = patient_id
        self.input_data = input_data
        self.prediction_result = bool(prediction_result)
        self.prediction_probability = float(prediction_probability)
        self.risk_factors = risk_factors or []
        self.doctor_assessment = doctor_assessment
        self.doctor_notes = doctor_notes
        
        logger.info(f"Created new diabetes prediction for patient: {patient_id}")
    
    def to_dict(self):
        """Convert the prediction to a dictionary for API responses"""
        return {
            'id': self.id,
            'patient_id': self.patient_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'input_data': self.input_data,
            'prediction_result': self.prediction_result,
            'prediction_probability': self.prediction_probability,
            'risk_factors': self.risk_factors,
            'doctor_assessment': self.doctor_assessment,
            'doctor_notes': self.doctor_notes
        }
    
class BrainTumorPrediction(db.Model):
    """Placeholder model for storing brain tumor prediction results"""
    
    __tablename__ = 'brain_tumor_predictions'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = db.Column(db.String(36), db.ForeignKey('patients.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Image information
    image_path = db.Column(db.String(255), nullable=False)
    image_type = db.Column(db.String(50), nullable=False)  # MRI, CT, etc.
    
    # Prediction results
    prediction_result = db.Column(db.Boolean, nullable=False)  # 0: No Tumor, 1: Tumor
    prediction_probability = db.Column(db.Float, nullable=False)  # Probability of tumor (0-1)
    tumor_type = db.Column(db.String(100), nullable=True)  # Type of tumor if detected
    
    # Localization data (stored as JSON)
    _localization_data = db.Column('localization_data', db.Text, nullable=True)
    
    # Doctor's assessment and notes
    doctor_assessment = db.Column(db.Boolean, nullable=True)  # Doctor's final assessment
    doctor_notes = db.Column(db.Text, nullable=True)  # Doctor's notes
    
    # Relationship with patient
    patient = db.relationship("Patient", backref=db.backref("brain_tumor_predictions", lazy=True))
    
    @property
    def localization_data(self):
        """Get the localization data as a dictionary"""
        if self._localization_data:
            return json.loads(self._localization_data)
        return {}
    
    @localization_data.setter
    def localization_data(self, value):
        """Set the localization data from a dictionary"""
        self._localization_data = json.dumps(value)
    
    def to_dict(self):
        """Convert the prediction to a dictionary for API responses"""
        return {
            'id': self.id,
            'patient_id': self.patient_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'image_path': self.image_path,
            'image_type': self.image_type,
            'prediction_result': self.prediction_result,
            'prediction_probability': self.prediction_probability,
            'tumor_type': self.tumor_type,
            'localization_data': self.localization_data,
            'doctor_assessment': self.doctor_assessment,
            'doctor_notes': self.doctor_notes
        }

class AlzheimerPrediction(db.Model):
    """Model for storing Alzheimer's detection prediction results"""
    
    __tablename__ = 'alzheimer_predictions'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = db.Column(db.String(36), db.ForeignKey('patients.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Image information
    image_path = db.Column(db.String(255), nullable=False)
    
    # Prediction results - store class probabilities
    prediction_class = db.Column(db.String(10), nullable=False)  # CN, EMCI, LMCI, AD
    cn_probability = db.Column(db.Float, nullable=False)
    emci_probability = db.Column(db.Float, nullable=False)
    lmci_probability = db.Column(db.Float, nullable=False)
    ad_probability = db.Column(db.Float, nullable=False)
    confidence = db.Column(db.Float, nullable=False)  # Highest probability value
    
    # Doctor's assessment and notes
    doctor_assessment = db.Column(db.String(10), nullable=True)  # Doctor's final assessment class
    doctor_notes = db.Column(db.Text, nullable=True)  # Doctor's notes
    
    # Relationship with patient
    patient = db.relationship("Patient", backref=db.backref("alzheimer_predictions", lazy=True))
    
    def to_dict(self):
        """Convert the prediction to a dictionary for API responses"""
        class_descriptions = {
            "CN": "Cognitive Normal (Non Demented)",
            "EMCI": "Early Mild Cognitive Impairment (Very Mild Dementia)",
            "LMCI": "Late Mild Cognitive Impairment (Mild Dementia)",
            "AD": "Alzheimer's Disease (Moderate Dementia)"
        }
        
        return {
            'id': self.id,
            'patient_id': self.patient_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'image_path': self.image_path,
            'prediction': {
                'class': self.prediction_class,
                'description': class_descriptions.get(self.prediction_class, "Unknown"),
                'probabilities': {
                    'CN': self.cn_probability,
                    'EMCI': self.emci_probability,
                    'LMCI': self.lmci_probability,
                    'AD': self.ad_probability
                },
                'confidence': self.confidence
            },
            'doctor_assessment': self.doctor_assessment,
            'doctor_notes': self.doctor_notes
        }

class BreastCancerPrediction(db.Model):
    """Model for storing breast cancer prediction results from FNA test data"""
    
    __tablename__ = 'breast_cancer_predictions'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = db.Column(db.String(36), db.ForeignKey('patients.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Store input data (FNA test data) as JSON
    _input_data = db.Column('input_data', db.Text, nullable=False)
    
    # Store prediction results
    prediction_result = db.Column(db.String(10), nullable=False)  # 'benign' or 'malignant'
    prediction_probability = db.Column(db.Float, nullable=False)  # Probability of malignancy (0-1)
    
    # Doctor's assessment and notes
    doctor_assessment = db.Column(db.String(10), nullable=True)  # Doctor's final assessment
    doctor_notes = db.Column(db.Text, nullable=True)  # Doctor's notes
    
    # Relationship with patient
    patient = db.relationship("Patient", backref=db.backref("breast_cancer_predictions", lazy=True))
    
    @property
    def input_data(self):
        """Get the input data as a dictionary"""
        if self._input_data:
            return json.loads(self._input_data)
        return {}
    
    @input_data.setter
    def input_data(self, value):
        """Set the input data from a dictionary"""
        self._input_data = json.dumps(value)
    
    def __init__(self, patient_id, input_data, prediction_result, prediction_probability, doctor_assessment=None, doctor_notes=None):
        """Initialize a new breast cancer prediction record"""
        self.patient_id = patient_id
        self.input_data = input_data
        self.prediction_result = prediction_result  # 'benign' or 'malignant'
        self.prediction_probability = float(prediction_probability)
        self.doctor_assessment = doctor_assessment
        self.doctor_notes = doctor_notes
        
        logger.info(f"Created new breast cancer prediction for patient: {patient_id}")
    
    def to_dict(self):
        """Convert the prediction to a dictionary for API responses"""
        return {
            'id': self.id,
            'patient_id': self.patient_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'input_data': self.input_data,
            'prediction_result': self.prediction_result,
            'prediction_probability': self.prediction_probability,
            'doctor_assessment': self.doctor_assessment,
            'doctor_notes': self.doctor_notes
        }