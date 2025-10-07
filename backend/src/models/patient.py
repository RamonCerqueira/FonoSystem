from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db

class Patient(db.Model):
    __tablename__ = 'patients'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=True)
    phone = db.Column(db.String(20), nullable=True)
    birth_date = db.Column(db.Date, nullable=True)
    gender = db.Column(db.String(10), nullable=True)
    address = db.Column(db.Text, nullable=True)
    
    # Informações médicas
    medical_history = db.Column(db.Text, nullable=True)
    current_diagnosis = db.Column(db.Text, nullable=True)
    therapy_goals = db.Column(db.Text, nullable=True)
    
    # Relacionamento com fonoaudiólogo
    therapist_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Informações de controle
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relacionamentos
    therapist = db.relationship('User', backref='patients')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'birth_date': self.birth_date.isoformat() if self.birth_date else None,
            'gender': self.gender,
            'address': self.address,
            'medical_history': self.medical_history,
            'current_diagnosis': self.current_diagnosis,
            'therapy_goals': self.therapy_goals,
            'therapist_id': self.therapist_id,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'is_active': self.is_active
        }

class PatientProgress(db.Model):
    __tablename__ = 'patient_progress'
    
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'), nullable=False)
    exercise_id = db.Column(db.Integer, db.ForeignKey('exercises.id'), nullable=False)
    
    # Dados do progresso
    completed_at = db.Column(db.DateTime, default=datetime.utcnow)
    score = db.Column(db.Integer, nullable=True)  # 0-100
    duration_minutes = db.Column(db.Integer, nullable=True)
    notes = db.Column(db.Text, nullable=True)
    
    # Arquivos de mídia
    audio_file = db.Column(db.String(255), nullable=True)
    video_file = db.Column(db.String(255), nullable=True)
    
    # Relacionamentos
    patient = db.relationship('Patient', backref='progress_records')
    
    def to_dict(self):
        return {
            'id': self.id,
            'patient_id': self.patient_id,
            'exercise_id': self.exercise_id,
            'completed_at': self.completed_at.isoformat(),
            'score': self.score,
            'duration_minutes': self.duration_minutes,
            'notes': self.notes,
            'audio_file': self.audio_file,
            'video_file': self.video_file
        }

