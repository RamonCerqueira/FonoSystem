from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db

class Appointment(db.Model):
    __tablename__ = 'appointments'
    
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'), nullable=False)
    therapist_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Data e hora
    appointment_date = db.Column(db.DateTime, nullable=False)
    duration_minutes = db.Column(db.Integer, default=60)
    
    # Tipo de consulta
    appointment_type = db.Column(db.String(20), default='presencial')  # presencial, online
    
    # Status
    status = db.Column(db.String(20), default='agendado')  # agendado, confirmado, realizado, cancelado, faltou
    
    # Notas e observações
    notes = db.Column(db.Text, nullable=True)
    therapist_notes = db.Column(db.Text, nullable=True)
    
    # Informações de controle
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Link para videochamada (se online)
    video_link = db.Column(db.String(255), nullable=True)
    
    # Relacionamentos
    patient = db.relationship('Patient', backref='appointments')
    therapist = db.relationship('User', backref='appointments')
    
    def to_dict(self):
        return {
            'id': self.id,
            'patient_id': self.patient_id,
            'therapist_id': self.therapist_id,
            'appointment_date': self.appointment_date.isoformat(),
            'duration_minutes': self.duration_minutes,
            'appointment_type': self.appointment_type,
            'status': self.status,
            'notes': self.notes,
            'therapist_notes': self.therapist_notes,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'video_link': self.video_link,
            'patient': {
                'id': self.patient.id,
                'name': self.patient.name
            } if self.patient else None,
            'therapist': {
                'id': self.therapist.id,
                'name': self.therapist.name
            } if self.therapist else None
        }

class AppointmentReminder(db.Model):
    __tablename__ = 'appointment_reminders'
    
    id = db.Column(db.Integer, primary_key=True)
    appointment_id = db.Column(db.Integer, db.ForeignKey('appointments.id'), nullable=False)
    
    # Configurações do lembrete
    reminder_type = db.Column(db.String(20), nullable=False)  # email, sms, push
    send_at = db.Column(db.DateTime, nullable=False)
    
    # Status
    is_sent = db.Column(db.Boolean, default=False)
    sent_at = db.Column(db.DateTime, nullable=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relacionamentos
    appointment = db.relationship('Appointment', backref='reminders')
    
    def to_dict(self):
        return {
            'id': self.id,
            'appointment_id': self.appointment_id,
            'reminder_type': self.reminder_type,
            'send_at': self.send_at.isoformat(),
            'is_sent': self.is_sent,
            'sent_at': self.sent_at.isoformat() if self.sent_at else None,
            'created_at': self.created_at.isoformat()
        }

