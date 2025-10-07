import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { 
  Users, 
  Activity, 
  Calendar, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Mic,
  MessageSquare,
  BookOpen,
  Ear,
  Zap,
  Target,
  Award,
  BarChart3
} from 'lucide-react'
import { appointmentsService, patientsService, exercisesService } from '../services/api'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    patients: 0,
    exercises: 0,
    appointments: 0,
    completedExercises: 0
  })
  const [todayAppointments, setTodayAppointments] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      if (user?.user_type === 'therapist') {
        const [patientsRes, exercisesRes, appointmentsRes, todayRes] = await Promise.all([
          patientsService.getAll(),
          exercisesService.getAll(),
          appointmentsService.getAll(),
          appointmentsService.getToday()
        ])
        
        setStats({
          patients: patientsRes.data.patients?.length || 0,
          exercises: exercisesRes.data.exercises?.length || 0,
          appointments: appointmentsRes.data.appointments?.length || 0,
          completedExercises: exercisesRes.data.exercises?.filter(ex => ex.is_completed)?.length || 0
        })
        
        setTodayAppointments(todayRes.data.appointments || [])
      } else {
        const [exercisesRes, appointmentsRes] = await Promise.all([
          exercisesService.getPatientExercises(),
          appointmentsService.getPatientAppointments()
        ])
        
        setStats({
          exercises: exercisesRes.data.exercises?.length || 0,
          completedExercises: exercisesRes.data.exercises?.filter(ex => ex.is_completed)?.length || 0,
          appointments: appointmentsRes.data.appointments?.length || 0
        })
        
        setTodayAppointments(appointmentsRes.data.appointments?.filter(apt => 
          new Date(apt.date).toDateString() === new Date().toDateString()
        ) || [])
      }
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Bom dia'
    if (hour < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  const exerciseCategories = [
    { id: 'voz', name: 'Voz', icon: Mic, color: 'voice', count: 12 },
    { id: 'fala', name: 'Fala', icon: MessageSquare, color: 'speech', count: 8 },
    { id: 'linguagem', name: 'Linguagem', icon: BookOpen, color: 'language', count: 15 },
    { id: 'audicao', name: 'Audição', icon: Ear, color: 'hearing', count: 6 },
    { id: 'motricidade', name: 'Motricidade', icon: Zap, color: 'motor', count: 10 }
  ]

  if (loading) {
    return (
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            height: '32px',
            backgroundColor: '#e2e8f0',
            borderRadius: '8px',
            width: '300px',
            marginBottom: '8px'
          }} className="fono-skeleton"></div>
          <div style={{
            height: '20px',
            backgroundColor: '#e2e8f0',
            borderRadius: '6px',
            width: '400px'
          }} className="fono-skeleton"></div>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{
              height: '120px',
              backgroundColor: '#e2e8f0',
              borderRadius: '12px'
            }} className="fono-skeleton"></div>
          ))}
        </div>
      </div>
    )
  }

  const headerStyle = {
    marginBottom: '32px'
  }

  const titleStyle = {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#0d9488',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  }

  const subtitleStyle = {
    fontSize: '16px',
    color: '#64748b'
  }

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
    marginBottom: '32px'
  }

  const cardStyle = {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(20, 184, 166, 0.1)',
    border: '1px solid rgba(20, 184, 166, 0.1)',
    transition: 'all 0.2s ease'
  }

  const cardHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px'
  }

  const cardTitleStyle = {
    fontSize: '14px',
    fontWeight: '500',
    color: '#64748b'
  }

  const cardValueStyle = {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#0d9488',
    marginBottom: '4px'
  }

  const cardDescStyle = {
    fontSize: '12px',
    color: '#64748b'
  }

  return (
    <div style={{ padding: '24px' }} className="fade-in">
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>
          <BarChart3 size={32} className="icon-primary" />
          {getGreeting()}, {user?.name?.split(' ')[0] || 'Usuário'}!
        </h1>
        <p style={subtitleStyle}>
          {user?.user_type === 'therapist' 
            ? 'Aqui está um resumo da sua prática hoje.'
            : 'Vamos continuar sua jornada fonoaudiológica.'
          }
        </p>
      </div>

      {/* Stats Cards */}
      <div style={statsGridStyle}>
        {user?.user_type === 'therapist' ? (
          <>
            <div 
              style={cardStyle} 
              className="card-therapist hover-lift"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(20, 184, 166, 0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(20, 184, 166, 0.1)'
              }}
            >
              <div style={cardHeaderStyle}>
                <span style={cardTitleStyle}>Total de Pacientes</span>
                <Users size={20} className="icon-primary" />
              </div>
              <div style={cardValueStyle}>{stats.patients}</div>
              <p style={cardDescStyle}>Pacientes ativos</p>
            </div>

            <div 
              style={cardStyle} 
              className="card-exercise hover-lift"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(34, 197, 94, 0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(20, 184, 166, 0.1)'
              }}
            >
              <div style={cardHeaderStyle}>
                <span style={cardTitleStyle}>Exercícios Criados</span>
                <Activity size={20} className="icon-accent" />
              </div>
              <div style={cardValueStyle}>{stats.exercises}</div>
              <p style={cardDescStyle}>Na sua biblioteca</p>
            </div>

            <div 
              style={cardStyle} 
              className="card-appointment hover-lift"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(245, 158, 11, 0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(20, 184, 166, 0.1)'
              }}
            >
              <div style={cardHeaderStyle}>
                <span style={cardTitleStyle}>Consultas Agendadas</span>
                <Calendar size={20} style={{ color: '#f59e0b' }} />
              </div>
              <div style={cardValueStyle}>{stats.appointments}</div>
              <p style={cardDescStyle}>Este mês</p>
            </div>

            <div 
              style={cardStyle} 
              className="card-patient hover-lift"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(20, 184, 166, 0.1)'
              }}
            >
              <div style={cardHeaderStyle}>
                <span style={cardTitleStyle}>Taxa de Adesão</span>
                <TrendingUp size={20} className="icon-secondary" />
              </div>
              <div style={cardValueStyle}>87%</div>
              <p style={cardDescStyle}>+2% desde o mês passado</p>
            </div>
          </>
        ) : (
          <>
            <div style={cardStyle} className="card-exercise hover-lift">
              <div style={cardHeaderStyle}>
                <span style={cardTitleStyle}>Exercícios Atribuídos</span>
                <Activity size={20} className="icon-accent" />
              </div>
              <div style={cardValueStyle}>{stats.exercises}</div>
              <p style={cardDescStyle}>Para esta semana</p>
            </div>

            <div style={cardStyle} className="card-patient hover-lift">
              <div style={cardHeaderStyle}>
                <span style={cardTitleStyle}>Exercícios Concluídos</span>
                <CheckCircle size={20} className="icon-secondary" />
              </div>
              <div style={cardValueStyle}>{stats.completedExercises}</div>
              <p style={cardDescStyle}>Parabéns pelo progresso!</p>
            </div>

            <div style={cardStyle} className="card-appointment hover-lift">
              <div style={cardHeaderStyle}>
                <span style={cardTitleStyle}>Próxima Consulta</span>
                <Calendar size={20} style={{ color: '#f59e0b' }} />
              </div>
              <div style={cardValueStyle}>
                {todayAppointments.length > 0 ? 'Hoje' : 'Em breve'}
              </div>
              <p style={cardDescStyle}>
                {todayAppointments.length > 0 
                  ? `${todayAppointments[0]?.time || '14:00'}`
                  : 'Aguardando agendamento'
                }
              </p>
            </div>

            <div style={cardStyle} className="card-therapist hover-lift">
              <div style={cardHeaderStyle}>
                <span style={cardTitleStyle}>Sequência Atual</span>
                <Award size={20} className="icon-primary" />
              </div>
              <div style={cardValueStyle}>7</div>
              <p style={cardDescStyle}>dias consecutivos</p>
            </div>
          </>
        )}
      </div>

      {/* Categorias de Exercícios */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#0d9488',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Target size={24} className="icon-primary" />
          Categorias de Exercícios
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          {exerciseCategories.map((category) => {
            const Icon = category.icon
            return (
              <div
                key={category.id}
                style={cardStyle}
                className={`exercise-${category.id} hover-lift smooth-transition`}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(20, 184, 166, 0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(20, 184, 166, 0.1)'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '8px'
                }}>
                  <Icon size={24} className={`icon-${category.color}`} />
                  <span style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#0d9488'
                  }}>
                    {category.name}
                  </span>
                </div>
                <div style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#334155'
                }}>
                  {category.count} exercícios
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Consultas de Hoje */}
      {todayAppointments.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#0d9488',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Clock size={24} className="icon-primary" />
            Consultas de Hoje
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {todayAppointments.map((appointment, index) => (
              <div
                key={index}
                style={{
                  ...cardStyle,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 24px'
                }}
                className="hover-lift smooth-transition"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#f0fdfa',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Calendar size={20} className="icon-primary" />
                  </div>
                  <div>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#0d9488',
                      marginBottom: '4px'
                    }}>
                      {appointment.patient_name || 'Paciente'}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#64748b'
                    }}>
                      {appointment.time || '14:00'} - {appointment.type || 'Consulta de rotina'}
                    </div>
                  </div>
                </div>
                
                <div style={{
                  padding: '6px 12px',
                  backgroundColor: '#f0fdfa',
                  color: '#0d9488',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {appointment.status || 'Agendado'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ações Rápidas */}
      <div>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#0d9488',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Plus size={24} className="icon-primary" />
          Ações Rápidas
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          {user?.user_type === 'therapist' ? (
            <>
              <button
                style={{
                  ...cardStyle,
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
                className="hover-lift smooth-transition"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(20, 184, 166, 0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(20, 184, 166, 0.1)'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '8px'
                }}>
                  <Users size={20} className="icon-primary" />
                  <span style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#0d9488'
                  }}>
                    Novo Paciente
                  </span>
                </div>
                <p style={{
                  fontSize: '14px',
                  color: '#64748b',
                  margin: '0'
                }}>
                  Cadastrar um novo paciente
                </p>
              </button>

              <button
                style={{
                  ...cardStyle,
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
                className="hover-lift smooth-transition"
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '8px'
                }}>
                  <Activity size={20} className="icon-accent" />
                  <span style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#0d9488'
                  }}>
                    Criar Exercício
                  </span>
                </div>
                <p style={{
                  fontSize: '14px',
                  color: '#64748b',
                  margin: '0'
                }}>
                  Adicionar novo exercício
                </p>
              </button>
            </>
          ) : (
            <>
              <button
                style={{
                  ...cardStyle,
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
                className="hover-lift smooth-transition"
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '8px'
                }}>
                  <Activity size={20} className="icon-accent" />
                  <span style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#0d9488'
                  }}>
                    Continuar Exercícios
                  </span>
                </div>
                <p style={{
                  fontSize: '14px',
                  color: '#64748b',
                  margin: '0'
                }}>
                  Retomar onde parou
                </p>
              </button>

              <button
                style={{
                  ...cardStyle,
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
                className="hover-lift smooth-transition"
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '8px'
                }}>
                  <Calendar size={20} style={{ color: '#f59e0b' }} />
                  <span style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#0d9488'
                  }}>
                    Agendar Consulta
                  </span>
                </div>
                <p style={{
                  fontSize: '14px',
                  color: '#64748b',
                  margin: '0'
                }}>
                  Marcar nova consulta
                </p>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

