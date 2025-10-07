from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db

class Exercise(db.Model):
    __tablename__ = 'exercises'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    instructions = db.Column(db.Text, nullable=True)
    
    # Categorização
    category = db.Column(db.String(50), nullable=False)  # voz, fala, linguagem, audição, motricidade
    subcategory = db.Column(db.String(50), nullable=True)
    difficulty_level = db.Column(db.Integer, default=1)  # 1-5
    age_group = db.Column(db.String(20), nullable=True)  # infantil, adolescente, adulto, idoso
    
    # Conteúdo do exercício
    content_type = db.Column(db.String(20), nullable=False)  # text, audio, video, interactive
    content_data = db.Column(db.Text, nullable=True)  # JSON com dados específicos
    
    # Arquivos de mídia
    image_file = db.Column(db.String(255), nullable=True)
    audio_file = db.Column(db.String(255), nullable=True)
    video_file = db.Column(db.String(255), nullable=True)
    
    # Configurações
    estimated_duration = db.Column(db.Integer, nullable=True)  # em minutos
    points_reward = db.Column(db.Integer, default=10)
    
    # Criador e controle
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    is_public = db.Column(db.Boolean, default=False)
    is_approved = db.Column(db.Boolean, default=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamentos
    creator = db.relationship('User', backref='created_exercises')
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'instructions': self.instructions,
            'category': self.category,
            'subcategory': self.subcategory,
            'difficulty_level': self.difficulty_level,
            'age_group': self.age_group,
            'content_type': self.content_type,
            'content_data': self.content_data,
            'image_file': self.image_file,
            'audio_file': self.audio_file,
            'video_file': self.video_file,
            'estimated_duration': self.estimated_duration,
            'points_reward': self.points_reward,
            'created_by': self.created_by,
            'is_public': self.is_public,
            'is_approved': self.is_approved,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class PatientExercise(db.Model):
    __tablename__ = 'patient_exercises'
    
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'), nullable=False)
    exercise_id = db.Column(db.Integer, db.ForeignKey('exercises.id'), nullable=False)
    
    # Configurações específicas para o paciente
    assigned_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    assigned_at = db.Column(db.DateTime, default=datetime.utcnow)
    due_date = db.Column(db.DateTime, nullable=True)
    
    # Frequência e repetições
    frequency_per_week = db.Column(db.Integer, default=1)
    repetitions_per_session = db.Column(db.Integer, default=1)
    
    # Status
    is_completed = db.Column(db.Boolean, default=False)
    completed_at = db.Column(db.DateTime, nullable=True)
    
    # Instruções personalizadas
    custom_instructions = db.Column(db.Text, nullable=True)
    
    # Relacionamentos
    patient = db.relationship('Patient', backref='assigned_exercises')
    exercise = db.relationship('Exercise', backref='patient_assignments')
    assigner = db.relationship('User', backref='assigned_patient_exercises')
    
    def to_dict(self):
        return {
            'id': self.id,
            'patient_id': self.patient_id,
            'exercise_id': self.exercise_id,
            'assigned_by': self.assigned_by,
            'assigned_at': self.assigned_at.isoformat(),
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'frequency_per_week': self.frequency_per_week,
            'repetitions_per_session': self.repetitions_per_session,
            'is_completed': self.is_completed,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'custom_instructions': self.custom_instructions,
            'exercise': self.exercise.to_dict() if self.exercise else None
        }

