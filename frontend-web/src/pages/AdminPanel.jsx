import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  Activity, 
  Calendar, 
  TrendingUp, 
  Settings, 
  UserCheck,
  FileText,
  BarChart3,
  Shield,
  Database
} from 'lucide-react'

export default function AdminPanel() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalUsers: 156,
    activeTherapists: 23,
    totalPatients: 133,
    monthlyAppointments: 342,
    completedExercises: 1247,
    systemHealth: 98.5
  })

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: 'user_registration',
      message: 'Nova fonoaudióloga cadastrada: Dra. Maria Silva',
      timestamp: '2024-03-01T10:30:00Z'
    },
    {
      id: 2,
      type: 'appointment_completed',
      message: '15 consultas realizadas hoje',
      timestamp: '2024-03-01T09:15:00Z'
    },
    {
      id: 3,
      type: 'exercise_milestone',
      message: '1000+ exercícios completados este mês',
      timestamp: '2024-03-01T08:00:00Z'
    }
  ])

  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    allowNewRegistrations: true,
    maxPatientsPerTherapist: 50,
    sessionTimeout: 30
  })

  useEffect(() => {
    // Simular carregamento de dados
    const timer = setTimeout(() => {
      console.log('Dados administrativos carregados')
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleSettingChange = (setting, value) => {
    setSystemSettings(prev => ({
      ...prev,
      [setting]: value
    }))
  }

  if (user?.user_type !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Acesso Negado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600">
              Você não tem permissão para acessar o painel administrativo.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-teal-800">Painel Administrativo</h1>
          <p className="text-gray-600">Gerencie o sistema FonoApp</p>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <Shield className="h-4 w-4 mr-1" />
          Sistema Online
        </Badge>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-teal-700">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-800">{stats.totalUsers}</div>
            <p className="text-xs text-teal-600">+12% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Fonoaudiólogos Ativos</CardTitle>
            <UserCheck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">{stats.activeTherapists}</div>
            <p className="text-xs text-blue-600">+3 novos este mês</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Consultas do Mês</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800">{stats.monthlyAppointments}</div>
            <p className="text-xs text-purple-600">+8% de crescimento</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Exercícios Concluídos</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">{stats.completedExercises}</div>
            <p className="text-xs text-green-600">Meta mensal atingida</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Saúde do Sistema</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800">{stats.systemHealth}%</div>
            <p className="text-xs text-orange-600">Uptime excelente</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-indigo-700">Total de Pacientes</CardTitle>
            <Database className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-800">{stats.totalPatients}</div>
            <p className="text-xs text-indigo-600">Base crescente</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="activity">Atividade Recente</TabsTrigger>
          <TabsTrigger value="users">Gerenciar Usuários</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-teal-600" />
                Atividade Recente do Sistema
              </CardTitle>
              <CardDescription>
                Últimas ações realizadas na plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-teal-500 rounded-full mt-2"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-teal-600" />
                Gerenciamento de Usuários
              </CardTitle>
              <CardDescription>
                Visualize e gerencie todos os usuários do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Input placeholder="Buscar usuários..." className="flex-1" />
                  <Button className="bg-teal-600 hover:bg-teal-700">
                    Buscar
                  </Button>
                </div>
                
                <div className="border rounded-lg">
                  <div className="p-4 bg-gray-50 border-b">
                    <div className="grid grid-cols-4 gap-4 font-medium text-sm text-gray-700">
                      <div>Nome</div>
                      <div>Email</div>
                      <div>Tipo</div>
                      <div>Ações</div>
                    </div>
                  </div>
                  <div className="divide-y">
                    <div className="p-4 grid grid-cols-4 gap-4 text-sm">
                      <div>Dra. Ana Carolina Silva</div>
                      <div>dra.ana@fonoapp.com</div>
                      <div>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          Fonoaudióloga
                        </Badge>
                      </div>
                      <div>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 grid grid-cols-4 gap-4 text-sm">
                      <div>Maria Santos</div>
                      <div>maria.paciente@email.com</div>
                      <div>
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          Paciente
                        </Badge>
                      </div>
                      <div>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-teal-600" />
                Relatórios do Sistema
              </CardTitle>
              <CardDescription>
                Gere relatórios detalhados sobre o uso da plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h3 className="font-medium mb-2">Relatório de Usuários</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Estatísticas detalhadas sobre cadastros e atividade
                  </p>
                  <Button variant="outline" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Gerar Relatório
                  </Button>
                </Card>

                <Card className="p-4">
                  <h3 className="font-medium mb-2">Relatório de Consultas</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Análise de agendamentos e consultas realizadas
                  </p>
                  <Button variant="outline" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Gerar Relatório
                  </Button>
                </Card>

                <Card className="p-4">
                  <h3 className="font-medium mb-2">Relatório de Exercícios</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Performance e conclusão de exercícios
                  </p>
                  <Button variant="outline" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Gerar Relatório
                  </Button>
                </Card>

                <Card className="p-4">
                  <h3 className="font-medium mb-2">Relatório Financeiro</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Receitas, assinaturas e métricas financeiras
                  </p>
                  <Button variant="outline" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Gerar Relatório
                  </Button>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-teal-600" />
                Configurações do Sistema
              </CardTitle>
              <CardDescription>
                Ajuste as configurações gerais da plataforma
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenance">Modo de Manutenção</Label>
                    <p className="text-sm text-gray-600">
                      Ativar para realizar manutenções no sistema
                    </p>
                  </div>
                  <Button
                    variant={systemSettings.maintenanceMode ? "destructive" : "outline"}
                    size="sm"
                    onClick={() => handleSettingChange('maintenanceMode', !systemSettings.maintenanceMode)}
                  >
                    {systemSettings.maintenanceMode ? 'Ativo' : 'Inativo'}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="registrations">Novos Cadastros</Label>
                    <p className="text-sm text-gray-600">
                      Permitir novos usuários se cadastrarem
                    </p>
                  </div>
                  <Button
                    variant={systemSettings.allowNewRegistrations ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSettingChange('allowNewRegistrations', !systemSettings.allowNewRegistrations)}
                    className={systemSettings.allowNewRegistrations ? "bg-teal-600 hover:bg-teal-700" : ""}
                  >
                    {systemSettings.allowNewRegistrations ? 'Permitido' : 'Bloqueado'}
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxPatients">Máximo de Pacientes por Fonoaudiólogo</Label>
                  <Input
                    id="maxPatients"
                    type="number"
                    value={systemSettings.maxPatientsPerTherapist}
                    onChange={(e) => handleSettingChange('maxPatientsPerTherapist', parseInt(e.target.value))}
                    className="w-32"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Timeout de Sessão (minutos)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={systemSettings.sessionTimeout}
                    onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                    className="w-32"
                  />
                </div>

                <div className="pt-4">
                  <Button className="bg-teal-600 hover:bg-teal-700">
                    Salvar Configurações
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

