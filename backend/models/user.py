from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import uuid
from pathlib import Path
import sys

sys.path.append(str(Path(__file__).resolve().parents[1]))
from utils.db import db
from utils.logger import setup_logger
logger = setup_logger('User Model')

from patient import Patient

class UserRole:
    DOCTOR = 'doctor'
    ADMIN = 'admin'
    ROLES = [DOCTOR, ADMIN]

class User(db.Model):
    """
    User Model for storing user related details
    """
    __tablename__ = 'users'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    role = db.Column(db.String(20), nullable=False, default=UserRole.DOCTOR)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationship to patients (one doctor can have many patients)
    patients = db.relationship("Patient", backref="doctor", lazy=True)
    
    def __init__(self, username, email, password, first_name, last_name, role=UserRole.DOCTOR):
        self.username = username
        self.email = email
        self.set_password(password)
        self.first_name = first_name
        self.last_name = last_name
    
        if role in UserRole.ROLES:
            self.role = role
        else:
            self.role = UserRole.DOCTOR
            logger.warning(f"Invalid role '{role}' specified, defaulting to DOCTOR")
    
    def set_password(self, password):
        """Convert password to secure hash"""
        self.password_hash = generate_password_hash(password)
        logger.info(f"Password set for user: {self.username}")
    
    def check_password(self, password):
        """Check if password matches the hash"""
        result = check_password_hash(self.password_hash, password)
        if not result:
            logger.warning(f"Failed login attempt for user: {self.username}")
        return result
    
    def to_dict(self):
        """Convert user object to dictionary for API responses"""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'full_name': f"{self.first_name} {self.last_name}",
            'role': self.role,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'is_active': self.is_active
        }
    
    def is_admin(self):
        """Check if user has admin role"""
        return self.role == UserRole.ADMIN
    
    def __repr__(self):
        return f'<User {self.username}>'

if __name__ == '__main__':
    from app import app, db
    with app.app_context():
        # create test user
        test_user = User(
            username='HassaneDoctor',
            email="hassane@gmail.com",
            password="password",
            first_name="Hassane",
            last_name="Doctor",
            role=UserRole.DOCTOR
        )
        
        # password check 
        print(f"Password check Correct: {test_user.check_password('password')}")
        print(f"Password check Not Correct: {test_user.check_password('password Not correct')}")
        
        # data to dictionary
        print(f"User to dict: {test_user.to_dict()}")
        
        # is admin
        print(f"Is Admin: {test_user.is_admin()}")