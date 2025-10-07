from flask import Blueprint, request, jsonify
from src.models.patient import Patient, PatientProgress, db
from src.routes.auth import token_required
from datetime import datetime

patients_bp = Blueprint('patients', __name__)

@patients_bp.route('/', methods=['GET'])
@token_required
def get_patients(current_user):
    try:
        if current_user.user_type == 'therapist':
            patients = Patient.query.filter_by(therapist_id=current_user.id, is_active=True).all()
        else:
            # Paciente só pode ver seus próprios dados
            patients = Patient.query.filter_by(email=current_user.email, is_active=True).all()
        
        return jsonify({
            'patients': [patient.to_dict() for patient in patients]
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@patients_bp.route('/', methods=['POST'])
@token_required
def create_patient(current_user):
    try:
        if current_user.user_type != 'therapist':
            return jsonify({'message': 'Apenas fonoaudiólogos podem cadastrar pacientes'}), 403
        
        data = request.get_json()
        
        patient = Patient(
            name=data['name'],
            email=data.get('email'),
            phone=data.get('phone'),
            birth_date=datetime.strptime(data['birth_date'], '%Y-%m-%d').date() if data.get('birth_date') else None,
            gender=data.get('gender'),
            address=data.get('address'),
            medical_history=data.get('medical_history'),
            current_diagnosis=data.get('current_diagnosis'),
            therapy_goals=data.get('therapy_goals'),
            therapist_id=current_user.id
        )
        
        db.session.add(patient)
        db.session.commit()
        
        return jsonify({
            'message': 'Paciente cadastrado com sucesso',
            'patient': patient.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@patients_bp.route('/<int:patient_id>', methods=['GET'])
@token_required
def get_patient(current_user, patient_id):
    try:
        patient = Patient.query.get_or_404(patient_id)
        
        # Verificar permissão
        if current_user.user_type == 'therapist' and patient.therapist_id != current_user.id:
            return jsonify({'message': 'Acesso negado'}), 403
        elif current_user.user_type == 'patient' and patient.email != current_user.email:
            return jsonify({'message': 'Acesso negado'}), 403
        
        return jsonify({'patient': patient.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@patients_bp.route('/<int:patient_id>', methods=['PUT'])
@token_required
def update_patient(current_user, patient_id):
    try:
        patient = Patient.query.get_or_404(patient_id)
        
        # Verificar permissão
        if current_user.user_type != 'therapist' or patient.therapist_id != current_user.id:
            return jsonify({'message': 'Acesso negado'}), 403
        
        data = request.get_json()
        
        # Atualizar campos
        for field in ['name', 'email', 'phone', 'gender', 'address', 'medical_history', 'current_diagnosis', 'therapy_goals']:
            if field in data:
                setattr(patient, field, data[field])
        
        if 'birth_date' in data and data['birth_date']:
            patient.birth_date = datetime.strptime(data['birth_date'], '%Y-%m-%d').date()
        
        patient.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Paciente atualizado com sucesso',
            'patient': patient.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@patients_bp.route('/<int:patient_id>/progress', methods=['GET'])
@token_required
def get_patient_progress(current_user, patient_id):
    try:
        patient = Patient.query.get_or_404(patient_id)
        
        # Verificar permissão
        if current_user.user_type == 'therapist' and patient.therapist_id != current_user.id:
            return jsonify({'message': 'Acesso negado'}), 403
        elif current_user.user_type == 'patient' and patient.email != current_user.email:
            return jsonify({'message': 'Acesso negado'}), 403
        
        progress_records = PatientProgress.query.filter_by(patient_id=patient_id).order_by(PatientProgress.completed_at.desc()).all()
        
        return jsonify({
            'progress': [record.to_dict() for record in progress_records]
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@patients_bp.route('/<int:patient_id>/progress', methods=['POST'])
@token_required
def add_patient_progress(current_user, patient_id):
    try:
        patient = Patient.query.get_or_404(patient_id)
        
        # Verificar permissão (paciente pode registrar seu próprio progresso)
        if current_user.user_type == 'therapist' and patient.therapist_id != current_user.id:
            return jsonify({'message': 'Acesso negado'}), 403
        elif current_user.user_type == 'patient' and patient.email != current_user.email:
            return jsonify({'message': 'Acesso negado'}), 403
        
        data = request.get_json()
        
        progress = PatientProgress(
            patient_id=patient_id,
            exercise_id=data['exercise_id'],
            score=data.get('score'),
            duration_minutes=data.get('duration_minutes'),
            notes=data.get('notes'),
            audio_file=data.get('audio_file'),
            video_file=data.get('video_file')
        )
        
        db.session.add(progress)
        db.session.commit()
        
        return jsonify({
            'message': 'Progresso registrado com sucesso',
            'progress': progress.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

