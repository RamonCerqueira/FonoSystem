// SERVIÇOS MOCK PARA DEMONSTRAÇÃO - REMOVER EM PRODUÇÃO
import { MOCK_PATIENTS, MOCK_EXERCISES, MOCK_APPOINTMENTS, simulateApiDelay } from './mockData'

// Simulação de API com dados mock
export const authService = {
  async login(email, password) {
    await simulateApiDelay()
    // Lógica já implementada no AuthContext
    return { data: { message: 'Login handled by AuthContext' } }
  },

  async register(userData) {
    await simulateApiDelay()
    // Lógica já implementada no AuthContext
    return { data: { message: 'Register handled by AuthContext' } }
  },

  async me() {
    await simulateApiDelay()
    const savedUser = localStorage.getItem('fonoapp_user')
    if (savedUser) {
      return { data: { user: JSON.parse(savedUser) } }
    }
    throw new Error('Not authenticated')
  },

  async changePassword(currentPassword, newPassword) {
    await simulateApiDelay()
    return { data: { message: 'Senha alterada com sucesso' } }
  }
}

export const patientsService = {
  async getAll() {
    await simulateApiDelay()
    return { 
      data: { 
        patients: MOCK_PATIENTS,
        total: MOCK_PATIENTS.length 
      } 
    }
  },

  async getById(id) {
    await simulateApiDelay()
    const patient = MOCK_PATIENTS.find(p => p.id === parseInt(id))
    return { data: { patient } }
  },

  async create(patientData) {
    await simulateApiDelay()
    const newPatient = {
      id: Date.now(),
      ...patientData,
      created_at: new Date().toISOString(),
      status: 'active'
    }
    return { data: { patient: newPatient } }
  },

  async update(id, patientData) {
    await simulateApiDelay()
    const updatedPatient = {
      id: parseInt(id),
      ...patientData,
      updated_at: new Date().toISOString()
    }
    return { data: { patient: updatedPatient } }
  },

  async getProgress(id) {
    await simulateApiDelay()
    return { 
      data: { 
        progress: [
          { date: '2024-02-01', score: 75, notes: 'Boa evolução' },
          { date: '2024-02-15', score: 82, notes: 'Melhora significativa' },
          { date: '2024-03-01', score: 88, notes: 'Excelente progresso' }
        ] 
      } 
    }
  },

  async addProgress(id, progressData) {
    await simulateApiDelay()
    return { data: { message: 'Progresso adicionado com sucesso' } }
  }
}

export const exercisesService = {
  async getAll(filters = {}) {
    await simulateApiDelay()
    let exercises = [...MOCK_EXERCISES]
    
    if (filters.category) {
      exercises = exercises.filter(e => e.category === filters.category)
    }
    
    return { 
      data: { 
        exercises,
        total: exercises.length 
      } 
    }
  },

  async getById(id) {
    await simulateApiDelay()
    const exercise = MOCK_EXERCISES.find(e => e.id === parseInt(id))
    return { data: { exercise } }
  },

  async getPatientExercises(patientId) {
    await simulateApiDelay()
    const exercises = MOCK_EXERCISES.filter(e => e.patient_id === parseInt(patientId))
    return { data: { exercises } }
  },

  async create(exerciseData) {
    await simulateApiDelay()
    const newExercise = {
      id: Date.now(),
      ...exerciseData,
      created_at: new Date().toISOString(),
      is_completed: false
    }
    return { data: { exercise: newExercise } }
  },

  async update(id, exerciseData) {
    await simulateApiDelay()
    const updatedExercise = {
      id: parseInt(id),
      ...exerciseData,
      updated_at: new Date().toISOString()
    }
    return { data: { exercise: updatedExercise } }
  },

  async assign(assignmentData) {
    await simulateApiDelay()
    return { data: { message: 'Exercício atribuído com sucesso' } }
  },

  async getCategories() {
    await simulateApiDelay()
    return { 
      data: { 
        categories: [
          { id: 'voz', name: 'Voz', description: 'Exercícios para trabalhar a voz' },
          { id: 'fala', name: 'Fala', description: 'Exercícios de articulação e fala' },
          { id: 'linguagem', name: 'Linguagem', description: 'Desenvolvimento da linguagem' },
          { id: 'audicao', name: 'Audição', description: 'Processamento auditivo' },
          { id: 'motricidade', name: 'Motricidade', description: 'Motricidade orofacial' }
        ] 
      } 
    }
  }
}

export const appointmentsService = {
  async getAll() {
    await simulateApiDelay()
    return { 
      data: { 
        appointments: MOCK_APPOINTMENTS,
        total: MOCK_APPOINTMENTS.length 
      } 
    }
  },

  async getToday() {
    await simulateApiDelay()
    const today = new Date().toISOString().split('T')[0]
    const todayAppointments = MOCK_APPOINTMENTS.filter(a => 
      a.appointment_date.startsWith(today)
    )
    return { data: { appointments: todayAppointments } }
  },

  async create(appointmentData) {
    await simulateApiDelay()
    const newAppointment = {
      id: Date.now(),
      ...appointmentData,
      status: 'agendado',
      created_at: new Date().toISOString()
    }
    return { data: { appointment: newAppointment } }
  },

  async update(id, appointmentData) {
    await simulateApiDelay()
    const updatedAppointment = {
      id: parseInt(id),
      ...appointmentData,
      updated_at: new Date().toISOString()
    }
    return { data: { appointment: updatedAppointment } }
  },

  async cancel(id) {
    await simulateApiDelay()
    return { data: { message: 'Agendamento cancelado' } }
  },

  async getAvailableSlots(therapistId, date) {
    await simulateApiDelay()
    return { 
      data: { 
        slots: [
          '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'
        ] 
      } 
    }
  }
}

// Manter a estrutura original da API para compatibilidade
export const api = {
  defaults: {
    headers: {
      common: {}
    }
  },
  get: async (url) => {
    await simulateApiDelay()
    return { data: { message: 'Mock API response' } }
  },
  post: async (url, data) => {
    await simulateApiDelay()
    return { data: { message: 'Mock API response', data } }
  }
}

