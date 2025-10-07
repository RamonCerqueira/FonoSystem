// DADOS MOCK PARA DEMONSTRAÇÃO - REMOVER EM PRODUÇÃO

export const MOCK_PATIENTS = [
  {
    id: 1,
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 99999-1111',
    birth_date: '2015-05-10',
    diagnosis: 'Atraso de linguagem',
    therapist_id: 1,
    created_at: '2024-01-20T10:00:00Z',
    status: 'active'
  },
  {
    id: 2,
    name: 'Ana Beatriz',
    email: 'ana.beatriz@email.com',
    phone: '(11) 99999-2222',
    birth_date: '2018-08-15',
    diagnosis: 'Distúrbio fonológico',
    therapist_id: 1,
    created_at: '2024-02-01T14:30:00Z',
    status: 'active'
  },
  {
    id: 3,
    name: 'Carlos Eduardo',
    email: 'carlos.eduardo@email.com',
    phone: '(11) 99999-3333',
    birth_date: '2012-12-03',
    diagnosis: 'Gagueira',
    therapist_id: 1,
    created_at: '2024-02-15T09:15:00Z',
    status: 'active'
  }
];

export const MOCK_EXERCISES = [
  {
    id: 1,
    title: 'Exercícios de Respiração',
    description: 'Exercícios para melhorar o controle respiratório e apoio vocal',
    category: 'voz',
    difficulty: 'beginner',
    duration_minutes: 15,
    instructions: 'Inspire profundamente pelo nariz, segure por 3 segundos e expire lentamente pela boca.',
    patient_id: 2,
    therapist_id: 1,
    is_completed: false,
    created_at: '2024-02-20T10:00:00Z'
  },
  {
    id: 2,
    title: 'Articulação do Som /R/',
    description: 'Exercícios específicos para melhorar a produção do som /R/',
    category: 'fala',
    difficulty: 'intermediate',
    duration_minutes: 20,
    instructions: 'Posicione a língua no céu da boca e pratique o som vibrante.',
    patient_id: 2,
    therapist_id: 1,
    is_completed: true,
    created_at: '2024-02-18T14:30:00Z'
  },
  {
    id: 3,
    title: 'Vocabulário Temático - Animais',
    description: 'Expansão de vocabulário com tema de animais',
    category: 'linguagem',
    difficulty: 'beginner',
    duration_minutes: 25,
    instructions: 'Nomeie os animais mostrados nas figuras e crie frases com cada um.',
    patient_id: 1,
    therapist_id: 1,
    is_completed: false,
    created_at: '2024-02-22T11:00:00Z'
  },
  {
    id: 4,
    title: 'Discriminação Auditiva',
    description: 'Exercícios para melhorar a percepção auditiva de sons',
    category: 'audicao',
    difficulty: 'intermediate',
    duration_minutes: 30,
    instructions: 'Ouça os sons apresentados e identifique as diferenças.',
    patient_id: 3,
    therapist_id: 1,
    is_completed: false,
    created_at: '2024-02-25T16:00:00Z'
  },
  {
    id: 5,
    title: 'Mobilidade Orofacial',
    description: 'Exercícios para fortalecer a musculatura orofacial',
    category: 'motricidade',
    difficulty: 'beginner',
    duration_minutes: 10,
    instructions: 'Realize movimentos de língua, lábios e bochechas conforme demonstrado.',
    patient_id: 1,
    therapist_id: 1,
    is_completed: true,
    created_at: '2024-02-19T13:45:00Z'
  }
];

export const MOCK_APPOINTMENTS = [
  {
    id: 1,
    patient: { name: 'João Silva' },
    therapist: { name: 'Dra. Ana Carolina Silva' },
    appointment_date: '2024-03-01T10:00:00Z',
    duration_minutes: 60,
    appointment_type: 'presencial',
    status: 'confirmado',
    notes: 'Sessão de avaliação inicial'
  },
  {
    id: 2,
    patient: { name: 'Ana Beatriz' },
    therapist: { name: 'Dra. Ana Carolina Silva' },
    appointment_date: '2024-03-01T14:00:00Z',
    duration_minutes: 45,
    appointment_type: 'online',
    status: 'agendado',
    notes: 'Continuidade do tratamento fonológico'
  },
  {
    id: 3,
    patient: { name: 'Carlos Eduardo' },
    therapist: { name: 'Dra. Ana Carolina Silva' },
    appointment_date: '2024-03-02T09:00:00Z',
    duration_minutes: 60,
    appointment_type: 'presencial',
    status: 'realizado',
    notes: 'Sessão de terapia para gagueira'
  },
  {
    id: 4,
    patient: { name: 'João Silva' },
    therapist: { name: 'Dra. Ana Carolina Silva' },
    appointment_date: '2024-03-03T15:30:00Z',
    duration_minutes: 45,
    appointment_type: 'online',
    status: 'confirmado',
    notes: 'Reavaliação de progresso'
  }
];

// Função para simular delay de API
export const simulateApiDelay = (ms: number = 800): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Função para gerar dados mock baseados no tipo de usuário
export const getMockDataForUser = (user: any) => {
  if (user.user_type === 'therapist') {
    return {
      patients: MOCK_PATIENTS,
      exercises: MOCK_EXERCISES,
      appointments: MOCK_APPOINTMENTS
    };
  } else {
    // Para pacientes, filtrar apenas dados relacionados a eles
    const patientData = MOCK_PATIENTS.find(p => p.email === user.email) || MOCK_PATIENTS[0];
    return {
      patient: patientData,
      exercises: MOCK_EXERCISES.filter(e => e.patient_id === patientData.id),
      appointments: MOCK_APPOINTMENTS.filter(a => a.patient.name === patientData.name)
    };
  }
};

