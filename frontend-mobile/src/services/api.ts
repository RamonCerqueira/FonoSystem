// SERVIÇOS MOCK PARA DEMONSTRAÇÃO - REMOVER EM PRODUÇÃO
import { MOCK_PATIENTS, MOCK_EXERCISES, MOCK_APPOINTMENTS, simulateApiDelay } from './mockData';

// Simulação de API com dados mock
export const authService = {
  async login(email: string, password: string) {
    await simulateApiDelay();
    // Lógica já implementada no AuthContext
    return { data: { message: 'Login handled by AuthContext' } };
  },

  async register(userData: any) {
    await simulateApiDelay();
    // Lógica já implementada no AuthContext
    return { data: { message: 'Register handled by AuthContext' } };
  },

  async me() {
    await simulateApiDelay();
    // Lógica já implementada no AuthContext
    return { data: { message: 'Me handled by AuthContext' } };
  }
};

export const patientsService = {
  async getAll() {
    await simulateApiDelay();
    return { 
      data: { 
        patients: MOCK_PATIENTS,
        total: MOCK_PATIENTS.length 
      } 
    };
  },

  async getById(id: number) {
    await simulateApiDelay();
    const patient = MOCK_PATIENTS.find(p => p.id === id);
    return { data: { patient } };
  },

  async create(patientData: any) {
    await simulateApiDelay();
    const newPatient = {
      id: Date.now(),
      ...patientData,
      created_at: new Date().toISOString(),
      status: 'active'
    };
    return { data: { patient: newPatient } };
  },

  async update(id: number, patientData: any) {
    await simulateApiDelay();
    const updatedPatient = {
      id,
      ...patientData,
      updated_at: new Date().toISOString()
    };
    return { data: { patient: updatedPatient } };
  }
};

export const exercisesService = {
  async getAll(filters: any = {}) {
    await simulateApiDelay();
    let exercises = [...MOCK_EXERCISES];
    
    if (filters.category) {
      exercises = exercises.filter(e => e.category === filters.category);
    }
    
    return { 
      data: { 
        exercises,
        total: exercises.length 
      } 
    };
  },

  async getPatientExercises(patientId: number) {
    await simulateApiDelay();
    const exercises = MOCK_EXERCISES.filter(e => e.patient_id === patientId);
    return { data: { exercises } };
  },

  async create(exerciseData: any) {
    await simulateApiDelay();
    const newExercise = {
      id: Date.now(),
      ...exerciseData,
      created_at: new Date().toISOString(),
      is_completed: false
    };
    return { data: { exercise: newExercise } };
  },

  async markCompleted(id: number) {
    await simulateApiDelay();
    return { data: { message: 'Exercício marcado como concluído' } };
  }
};

export const appointmentsService = {
  async getAll() {
    await simulateApiDelay();
    return { 
      data: { 
        appointments: MOCK_APPOINTMENTS,
        total: MOCK_APPOINTMENTS.length 
      } 
    };
  },

  async getToday() {
    await simulateApiDelay();
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = MOCK_APPOINTMENTS.filter(a => 
      a.appointment_date.startsWith(today)
    );
    return { data: { appointments: todayAppointments } };
  },

  async create(appointmentData: any) {
    await simulateApiDelay();
    const newAppointment = {
      id: Date.now(),
      ...appointmentData,
      status: 'agendado',
      created_at: new Date().toISOString()
    };
    return { data: { appointment: newAppointment } };
  },

  async update(id: number, appointmentData: any) {
    await simulateApiDelay();
    const updatedAppointment = {
      id,
      ...appointmentData,
      updated_at: new Date().toISOString()
    };
    return { data: { appointment: updatedAppointment } };
  },

  async cancel(id: number) {
    await simulateApiDelay();
    return { data: { message: 'Agendamento cancelado' } };
  }
};

// Manter a estrutura original da API para compatibilidade
export const api = {
  defaults: {
    headers: {
      common: {} as any
    }
  },
  get: async (url: string) => {
    await simulateApiDelay();
    return { data: { message: 'Mock API response' } };
  },
  post: async (url: string, data?: any) => {
    await simulateApiDelay();
    return { data: { message: 'Mock API response', data } };
  }
};

