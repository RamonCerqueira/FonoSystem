import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  Video,
  MapPin,
  User,
  Phone,
  Edit,
  Trash2,
  Filter
} from 'lucide-react'
import { appointmentsService, patientsService } from '../services/api'

export default function Appointments() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState('')

  useEffect(() => {
    loadAppointments()
    if (user?.user_type === 'therapist') {
      loadPatients()
    }
  }, [user])

  const loadAppointments = async () => {
    try {
      setLoading(true)
      const response = user?.user_type === 'therapist' 
        ? await appointmentsService.getAll()
        : await appointmentsService.getPatientAppointments()
      
      setAppointments(response.data.appointments || [])
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadPatients = async () => {
    try {
      const response = await patientsService.getAll()
      setPatients(response.data.patients || [])
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'agendado': return 'bg-blue-100 text-blue-800'
      case 'confirmado': return 'bg-green-100 text-green-800'
      case 'cancelado': return 'bg-red-100 text-red-800'
      case 'concluido': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'online': return <Video className="h-4 w-4" />
      case 'presencial': return <MapPin className="h-4 w-4" />
      default: return <CalendarIcon className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-teal-700 flex items-center gap-3">
            <CalendarIcon className="h-8 w-8" />
            Agendamentos
          </h1>
          <p className="text-gray-600 mt-2">
            {user?.user_type === 'therapist' 
              ? 'Gerencie suas consultas e horários'
              : 'Suas consultas agendadas'
            }
          </p>
        </div>
        
        {user?.user_type === 'therapist' && (
          <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Plus className="h-4 w-4" />
            Nova Consulta
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filtros:</span>
          </div>
          
          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Todos os status</option>
            <option value="agendado">Agendado</option>
            <option value="confirmado">Confirmado</option>
            <option value="concluido">Concluído</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-teal-600">{appointments.length}</p>
            </div>
            <CalendarIcon className="h-8 w-8 text-teal-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Hoje</p>
              <p className="text-2xl font-bold text-blue-600">
                {appointments.filter(apt => 
                  new Date(apt.date).toDateString() === new Date().toDateString()
                ).length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Confirmados</p>
              <p className="text-2xl font-bold text-green-600">
                {appointments.filter(apt => apt.status === 'confirmado').length}
              </p>
            </div>
            <User className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Online</p>
              <p className="text-2xl font-bold text-purple-600">
                {appointments.filter(apt => apt.type === 'online').length}
              </p>
            </div>
            <Video className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {selectedStatus ? `Consultas - ${selectedStatus}` : 'Todas as Consultas'}
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {appointments.length === 0 ? (
            <div className="p-8 text-center">
              <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma consulta encontrada
              </h3>
              <p className="text-gray-500">
                {user?.user_type === 'therapist' 
                  ? 'Comece criando uma nova consulta para seus pacientes.'
                  : 'Você não possui consultas agendadas no momento.'
                }
              </p>
            </div>
          ) : (
            appointments
              .filter(apt => !selectedStatus || apt.status === selectedStatus)
              .map((appointment, index) => (
                <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                          {getTypeIcon(appointment.type)}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-medium text-gray-900">
                            {user?.user_type === 'therapist' 
                              ? appointment.patient_name || 'Paciente'
                              : appointment.therapist_name || 'Dr(a). Terapeuta'
                            }
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                            {appointment.status || 'agendado'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4" />
                            <span>{appointment.date || 'Data não definida'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{appointment.time || 'Horário não definido'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {getTypeIcon(appointment.type)}
                            <span className="capitalize">{appointment.type || 'presencial'}</span>
                          </div>
                        </div>
                        
                        {appointment.notes && (
                          <p className="mt-2 text-sm text-gray-600">
                            {appointment.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {user?.user_type === 'therapist' && (
                        <>
                          <button className="text-teal-600 hover:text-teal-700 p-2 rounded-md hover:bg-teal-50 transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-700 p-2 rounded-md hover:bg-red-50 transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      
                      {appointment.type === 'online' && appointment.status === 'confirmado' && (
                        <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1 transition-colors">
                          <Video className="h-3 w-3" />
                          Entrar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  )
}

