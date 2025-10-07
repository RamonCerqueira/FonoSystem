from flask import Blueprint, request, jsonify
from src.models.exercise import Exercise, PatientExercise, db
from src.routes.auth import token_required
from datetime import datetime

exercises_bp = Blueprint('exercises', __name__)

@exercises_bp.route('/', methods=['GET'])
@token_required
def get_exercises(current_user):
    try:
        # Filtros
        category = request.args.get('category')
        difficulty = request.args.get('difficulty')
        age_group = request.args.get('age_group')
        
        query = Exercise.query
        
        # Aplicar filtros
        if category:
            query = query.filter_by(category=category)
        if difficulty:
            query = query.filter_by(difficulty_level=int(difficulty))
        if age_group:
            query = query.filter_by(age_group=age_group)
        
        # Fonoaudiólogos veem exercícios públicos + seus próprios
        if current_user.user_type == 'therapist':
            query = query.filter(
                (Exercise.is_public == True) | 
                (Exercise.created_by == current_user.id)
            )
        else:
            # Pacientes veem apenas exercícios públicos aprovados
            query = query.filter_by(is_public=True, is_approved=True)
        
        exercises = query.all()
        
        return jsonify({
            'exercises': [exercise.to_dict() for exercise in exercises]
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@exercises_bp.route('/', methods=['POST'])
@token_required
def create_exercise(current_user):
    try:
        if current_user.user_type != 'therapist':
            return jsonify({'message': 'Apenas fonoaudiólogos podem criar exercícios'}), 403
        
        data = request.get_json()
        
        exercise = Exercise(
            title=data['title'],
            description=data['description'],
            instructions=data.get('instructions'),
            category=data['category'],
            subcategory=data.get('subcategory'),
            difficulty_level=data.get('difficulty_level', 1),
            age_group=data.get('age_group'),
            content_type=data['content_type'],
            content_data=data.get('content_data'),
            image_file=data.get('image_file'),
            audio_file=data.get('audio_file'),
            video_file=data.get('video_file'),
            estimated_duration=data.get('estimated_duration'),
            points_reward=data.get('points_reward', 10),
            created_by=current_user.id,
            is_public=data.get('is_public', False)
        )
        
        db.session.add(exercise)
        db.session.commit()
        
        return jsonify({
            'message': 'Exercício criado com sucesso',
            'exercise': exercise.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@exercises_bp.route('/<int:exercise_id>', methods=['GET'])
@token_required
def get_exercise(current_user, exercise_id):
    try:
        exercise = Exercise.query.get_or_404(exercise_id)
        
        # Verificar permissão
        if not exercise.is_public and exercise.created_by != current_user.id:
            return jsonify({'message': 'Acesso negado'}), 403
        
        return jsonify({'exercise': exercise.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@exercises_bp.route('/<int:exercise_id>', methods=['PUT'])
@token_required
def update_exercise(current_user, exercise_id):
    try:
        exercise = Exercise.query.get_or_404(exercise_id)
        
        # Verificar permissão
        if exercise.created_by != current_user.id:
            return jsonify({'message': 'Acesso negado'}), 403
        
        data = request.get_json()
        
        # Atualizar campos
        for field in ['title', 'description', 'instructions', 'category', 'subcategory', 
                     'difficulty_level', 'age_group', 'content_type', 'content_data',
                     'image_file', 'audio_file', 'video_file', 'estimated_duration', 
                     'points_reward', 'is_public']:
            if field in data:
                setattr(exercise, field, data[field])
        
        exercise.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Exercício atualizado com sucesso',
            'exercise': exercise.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@exercises_bp.route('/patient/<int:patient_id>', methods=['GET'])
@token_required
def get_patient_exercises(current_user, patient_id):
    try:
        # Verificar permissão
        from src.models.patient import Patient
        patient = Patient.query.get_or_404(patient_id)
        
        if current_user.user_type == 'therapist' and patient.therapist_id != current_user.id:
            return jsonify({'message': 'Acesso negado'}), 403
        elif current_user.user_type == 'patient' and patient.email != current_user.email:
            return jsonify({'message': 'Acesso negado'}), 403
        
        patient_exercises = PatientExercise.query.filter_by(patient_id=patient_id).all()
        
        return jsonify({
            'exercises': [pe.to_dict() for pe in patient_exercises]
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@exercises_bp.route('/assign', methods=['POST'])
@token_required
def assign_exercise(current_user):
    try:
        if current_user.user_type != 'therapist':
            return jsonify({'message': 'Apenas fonoaudiólogos podem atribuir exercícios'}), 403
        
        data = request.get_json()
        
        # Verificar se o paciente pertence ao fonoaudiólogo
        from src.models.patient import Patient
        patient = Patient.query.get_or_404(data['patient_id'])
        if patient.therapist_id != current_user.id:
            return jsonify({'message': 'Acesso negado'}), 403
        
        patient_exercise = PatientExercise(
            patient_id=data['patient_id'],
            exercise_id=data['exercise_id'],
            assigned_by=current_user.id,
            due_date=datetime.strptime(data['due_date'], '%Y-%m-%d') if data.get('due_date') else None,
            frequency_per_week=data.get('frequency_per_week', 1),
            repetitions_per_session=data.get('repetitions_per_session', 1),
            custom_instructions=data.get('custom_instructions')
        )
        
        db.session.add(patient_exercise)
        db.session.commit()
        
        return jsonify({
            'message': 'Exercício atribuído com sucesso',
            'assignment': patient_exercise.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@exercises_bp.route('/categories', methods=['GET'])
@token_required
def get_categories(current_user):
    try:
        categories = [
            {'value': 'voz', 'label': 'Voz'},
            {'value': 'fala', 'label': 'Fala'},
            {'value': 'linguagem', 'label': 'Linguagem'},
            {'value': 'audicao', 'label': 'Audição'},
            {'value': 'motricidade', 'label': 'Motricidade Orofacial'}
        ]
        
        age_groups = [
            {'value': 'infantil', 'label': 'Infantil (0-12 anos)'},
            {'value': 'adolescente', 'label': 'Adolescente (13-17 anos)'},
            {'value': 'adulto', 'label': 'Adulto (18-59 anos)'},
            {'value': 'idoso', 'label': 'Idoso (60+ anos)'}
        ]
        
        return jsonify({
            'categories': categories,
            'age_groups': age_groups
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

