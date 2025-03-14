from datetime import datetime
import uuid
import sys 
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1]))

from utils.logger import setup_logger

logger = setup_logger("patient_model")

from utils.db import db

class Gender:
    MALE = 'male'
    FEMALE = 'female'
    PREFER_NOT_TO_SAY = 'prefer_not_to_say'
    CHOICES = [MALE, FEMALE, PREFER_NOT_TO_SAY]

class Patient(db.Model):
    """Patient model for storing patient information"""
    
    __tablename__ = 'patients'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    date_of_birth = db.Column(db.Date, nullable=False)
    gender = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(120), nullable=True)
    phone = db.Column(db.String(20), nullable=True)
    address = db.Column(db.String(200), nullable=True)
    
    # Basic medical information
    medical_history = db.Column(db.Text, nullable=True)
    height = db.Column(db.Float, nullable=True)  # in cm
    weight = db.Column(db.Float, nullable=True)  # in kg
    allergies = db.Column(db.Text, nullable=True)
    
    # Link to the doctor (user) who manages this patient
    doctor_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    
    # Record keeping
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    def __init__(self, first_name, last_name, date_of_birth, gender, doctor_id, **kwargs):
        self.first_name = first_name
        self.last_name = last_name
        self.date_of_birth = date_of_birth
        self.doctor_id = doctor_id
        
        # Validate and set gender
        if gender in Gender.CHOICES:
            self.gender = gender
        else:
            self.gender = Gender.PREFER_NOT_TO_SAY
            logger.warning(f"Invalid gender '{gender}' specified, defaulting to PREFER_NOT_TO_SAY")
            
        # Set optional fields from kwargs
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
        
        logger.info(f"Created new patient: {first_name} {last_name}")
    
    def calculate_age(self):
        """Calculate patient's age based on date of birth"""
        today = datetime.now().date()
        born = self.date_of_birth
        age = today.year - born.year - ((today.month, today.day) < (born.month, born.day))
        return age
    
    def to_dict(self):
        """Convert patient object to dictionary for API responses"""
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'full_name': f"{self.first_name} {self.last_name}",
            'date_of_birth': self.date_of_birth.isoformat() if self.date_of_birth else None,
            'age': self.calculate_age(),
            'gender': self.gender,
            'email': self.email,
            'phone': self.phone,
            'address': self.address,
            'medical_history': self.medical_history,
            'height': self.height,
            'weight': self.weight,
            'allergies': self.allergies,
            'doctor_id': self.doctor_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'is_active': self.is_active
        }
    
    def __repr__(self):
        return f'<Patient {self.first_name} {self.last_name}>'