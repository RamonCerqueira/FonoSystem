from flask import Blueprint, request, jsonify
from src.models.appointment import Appointment, AppointmentReminder, db
from src.routes.auth import token_required
from datetime import datetime, timedelta

appointments_bp = Blueprint('appointments', __name__)

@appointments_bp.route('/', methods=['GET'])
@token_required
def get_appointments(current_user):
    try:
        if current_user.user_type == 'therapist':
            appointments = Appointment.query.filter_by(therapist_id=current_user.id).all()
        else:
            # Para pacientes, buscar por email
            from src.models.patient import Patient
            patient = Patient.query.filter_by(email=current_user.email).first()
            if patient:
                appointments = Appointment.query.filter_by(patient_id=patient.id).all()
            else:
                appointments = []
        
        return jsonify({
            'appointments': [appointment.to_dict() for appointment in appointments]
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@appointments_bp.route('/', methods=['POST'])
@token_required
def create_appointment(current_user):
    try:
        data = request.get_json()
        
        # Verificar permissões
        if current_user.user_type == 'therapist':
            # Fonoaudiólogo pode agendar para qualquer paciente seu
            from src.models.patient import Patient
            patient = Patient.query.get_or_404(data['patient_id'])
            if patient.therapist_id != current_user.id:
                return jsonify({'message': 'Acesso negado'}), 403
            therapist_id = current_user.id
        else:
            # Paciente pode agendar apenas para si mesmo
            from src.models.patient import Patient
            patient = Patient.query.filter_by(email=current_user.email).first()
            if not patient:
                return jsonify({'message': 'Paciente não encontrado'}), 404
            therapist_id = data['therapist_id']
        
        appointment = Appointment(
            patient_id=patient.id,
            therapist_id=therapist_id,
            appointment_date=datetime.strptime(data['appointment_date'], '%Y-%m-%d %H:%M'),
            duration_minutes=data.get('duration_minutes', 60),
            appointment_type=data.get('appointment_type', 'presencial'),
            notes=data.get('notes')
        )
        
        db.session.add(appointment)
        db.session.commit()
        
        # Criar lembretes automáticos
        create_automatic_reminders(appointment)
        
        return jsonify({
            'message': 'Agendamento criado com sucesso',
            'appointment': appointment.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@appointments_bp.route('/<int:appointment_id>', methods=['PUT'])
@token_required
def update_appointment(current_user, appointment_id):
    try:
        appointment = Appointment.query.get_or_404(appointment_id)
        
        # Verificar permissão
        if current_user.user_type == 'therapist' and appointment.therapist_id != current_user.id:
            return jsonify({'message': 'Acesso negado'}), 403
        elif current_user.user_type == 'patient':
            from src.models.patient import Patient
            patient = Patient.query.filter_by(email=current_user.email).first()
            if not patient or appointment.patient_id != patient.id:
                return jsonify({'message': 'Acesso negado'}), 403
        
        data = request.get_json()
        
        # Atualizar campos
        if 'appointment_date' in data:
            appointment.appointment_date = datetime.strptime(data['appointment_date'], '%Y-%m-%d %H:%M')
        
        for field in ['duration_minutes', 'appointment_type', 'status', 'notes', 'therapist_notes', 'video_link']:
            if field in data:
                setattr(appointment, field, data[field])
        
        appointment.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Agendamento atualizado com sucesso',
            'appointment': appointment.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@appointments_bp.route('/<int:appointment_id>', methods=['DELETE'])
@token_required
def cancel_appointment(current_user, appointment_id):
    try:
        appointment = Appointment.query.get_or_404(appointment_id)
        
        # Verificar permissão
        if current_user.user_type == 'therapist' and appointment.therapist_id != current_user.id:
            return jsonify({'message': 'Acesso negado'}), 403
        elif current_user.user_type == 'patient':
            from src.models.patient import Patient
            patient = Patient.query.filter_by(email=current_user.email).first()
            if not patient or appointment.patient_id != patient.id:
                return jsonify({'message': 'Acesso negado'}), 403
        
        appointment.status = 'cancelado'
        appointment.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({'message': 'Agendamento cancelado com sucesso'}), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@appointments_bp.route('/available-slots', methods=['GET'])
@token_required
def get_available_slots(current_user):
    try:
        therapist_id = request.args.get('therapist_id')
        date = request.args.get('date')  # YYYY-MM-DD
        
        if not therapist_id or not date:
            return jsonify({'message': 'therapist_id e date são obrigatórios'}), 400
        
        # Buscar agendamentos existentes para o dia
        target_date = datetime.strptime(date, '%Y-%m-%d').date()
        existing_appointments = Appointment.query.filter(
            Appointment.therapist_id == therapist_id,
            Appointment.appointment_date >= target_date,
            Appointment.appointment_date < target_date + timedelta(days=1),
            Appointment.status.in_(['agendado', 'confirmado'])
        ).all()
        
        # Gerar slots disponíveis (exemplo: 8h às 18h, de hora em hora)
        available_slots = []
        start_hour = 8
        end_hour = 18
        
        for hour in range(start_hour, end_hour):
            slot_time = datetime.combine(target_date, datetime.min.time().replace(hour=hour))
            
            # Verificar se o slot está ocupado
            is_occupied = any(
                appointment.appointment_date <= slot_time < 
                appointment.appointment_date + timedelta(minutes=appointment.duration_minutes)
                for appointment in existing_appointments
            )
            
            if not is_occupied:
                available_slots.append(slot_time.strftime('%H:%M'))
        
        return jsonify({'available_slots': available_slots}), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

def create_automatic_reminders(appointment):
    """Criar lembretes automáticos para um agendamento"""
    try:
        # Lembrete 24h antes
        reminder_24h = AppointmentReminder(
            appointment_id=appointment.id,
            reminder_type='push',
            send_at=appointment.appointment_date - timedelta(hours=24)
        )
        
        # Lembrete 1h antes
        reminder_1h = AppointmentReminder(
            appointment_id=appointment.id,
            reminder_type='push',
            send_at=appointment.appointment_date - timedelta(hours=1)
        )
        
        db.session.add(reminder_24h)
        db.session.add(reminder_1h)
        db.session.commit()
        
    except Exception as e:
        print(f"Erro ao criar lembretes: {e}")

@appointments_bp.route('/today', methods=['GET'])
@token_required
def get_today_appointments(current_user):
    try:
        today = datetime.now().date()
        
        if current_user.user_type == 'therapist':
            appointments = Appointment.query.filter(
                Appointment.therapist_id == current_user.id,
                Appointment.appointment_date >= today,
                Appointment.appointment_date < today + timedelta(days=1)
            ).order_by(Appointment.appointment_date).all()
        else:
            from src.models.patient import Patient
            patient = Patient.query.filter_by(email=current_user.email).first()
            if patient:
                appointments = Appointment.query.filter(
                    Appointment.patient_id == patient.id,
                    Appointment.appointment_date >= today,
                    Appointment.appointment_date < today + timedelta(days=1)
                ).order_by(Appointment.appointment_date).all()
            else:
                appointments = []
        
        return jsonify({
            'appointments': [appointment.to_dict() for appointment in appointments]
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

