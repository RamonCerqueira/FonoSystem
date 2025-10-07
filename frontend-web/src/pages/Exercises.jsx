import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { exercisesService, patientsService } from '../services/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Activity, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  User, 
  CheckCircle, 
  Circle,
  Mic,
  MessageSquare,
  BookOpen,
  Ear,
  Zap,
  Edit,
  Trash2,
  Eye,
  Play,
  Users,
  Target,
  TrendingUp,
  Star,
  Award,
  BarChart3
} from 'lucide-react'

export default function Exercises() {
  const { user } = useAuth()
  const [exercises, setExercises] = useState([])
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showAssignDialog, setShowAssignDialog] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState(null)
  const [newExercise, setNewExercise] = useState({
    title: '',
    description: '',
    category: 'voz',
    difficulty: 'beginner',
    duration_minutes: 15,
    instructions: ''
  })

  const categories = [
    { id: 'voz', name: 'Voz', icon: Mic, color: 'voice', description: 'Exercícios para trabalhar a voz' },
    { id: 'fala', name: 'Fala', icon: MessageSquare, color: 'speech', description: 'Exercícios de articulação e fala' },
    { id: 'linguagem', name: 'Linguagem', icon: BookOpen, color: 'language', description: 'Desenvolvimento da linguagem' },
    { id: 'audicao', name: 'Audição', icon: Ear, color: 'hearing', description: 'Processamento auditivo' },
    { id: 'motricidade', name: 'Motricidade', icon: Zap, color: 'motor', description: 'Motricidade orofacial' }
  ]

  const difficulties = [
    { id: 'beginner', name: 'Iniciante', color: 'bg-green-100 text-green-800' },
    { id: 'intermediate', name: 'Intermediário', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'advanced', name: 'Avançado', color: 'bg-red-100 text-red-800' }
  ]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [exercisesResponse, patientsResponse] = await Promise.all([
        exercisesService.getAll(),
        user.user_type === 'therapist' ? patientsService.getAll() : Promise.resolve({ data: { patients: [] } })
      ])
      
      setExercises(exercisesResponse.data.exercises || [])
      setPatients(patientsResponse.data.patients || [])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateExercise = async () => {
    try {
      const response = await exercisesService.create({
        ...newExercise,
        therapist_id: user.id
      })
      
      setExercises(prev => [...prev, response.data.exercise])
      setShowCreateDialog(false)
      setNewExercise({
        title: '',
        description: '',
        category: 'voz',
        difficulty: 'beginner',
        duration_minutes: 15,
        instructions: ''
      })
    } catch (error) {
      console.error('Erro ao criar exercício:', error)
    }
  }

  const handleAssignExercise = async (patientId) => {
    try {
      await exercisesService.assign({
        exercise_id: selectedExercise.id,
        patient_id: patientId,
        therapist_id: user.id
      })
      
      // Atualizar o exercício na lista
      setExercises(prev => prev.map(ex => 
        ex.id === selectedExercise.id 
          ? { ...ex, patient_id: patientId }
          : ex
      ))
      
      setShowAssignDialog(false)
      setSelectedExercise(null)
    } catch (error) {
      console.error('Erro ao atribuir exercício:', error)
    }
  }

  const handleCompleteExercise = async (exerciseId) => {
    try {
      await exercisesService.markCompleted(exerciseId)
      
      setExercises(prev => prev.map(ex => 
        ex.id === exerciseId 
          ? { ...ex, is_completed: true }
          : ex
      ))
    } catch (error) {
      console.error('Erro ao marcar exercício como concluído:', error)
    }
  }

  const getCategoryInfo = (categoryId) => {
    return categories.find(cat => cat.id === categoryId) || categories[0]
  }

  const getDifficultyInfo = (difficultyId) => {
    return difficulties.find(diff => diff.id === difficultyId) || difficulties[0]
  }

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'all' || exercise.difficulty === selectedDifficulty
    
    // Para pacientes, mostrar apenas exercícios atribuídos a eles
    if (user.user_type === 'patient') {
      return matchesSearch && matchesCategory && matchesDifficulty && exercise.patient_id === user.id
    }
    
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const getExercisesByCategory = () => {
    return categories.map(category => ({
      ...category,
      exercises: filteredExercises.filter(ex => ex.category === category.id)
    }))
  }

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.id === patientId)
    return patient ? patient.name : 'Não atribuído'
  }

  const getExerciseStats = () => {
    const total = exercises.length
    const assigned = exercises.filter(ex => ex.patient_id).length
    const completed = exercises.filter(ex => ex.is_completed).length
    const successRate = total > 0 ? Math.round((completed / total) * 100) : 0
    
    return { total, assigned, completed, successRate }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 mb-2 fono-skeleton"></div>
            <div className="h-4 bg-gray-200 rounded w-64 fono-skeleton"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-32 fono-skeleton"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg fono-skeleton"></div>
          ))}
        </div>
      </div>
    )
  }

  const stats = getExerciseStats()

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-teal-800 flex items-center gap-3">
            <Activity className="h-8 w-8 icon-primary" />
            {user.user_type === 'therapist' ? 'Biblioteca de Exercícios' : 'Meus Exercícios'}
          </h1>
          <p className="text-gray-600 mt-2">
            {user.user_type === 'therapist' 
              ? 'Crie, gerencie e atribua exercícios personalizados para seus pacientes'
              : 'Complete seus exercícios e acompanhe seu progresso'
            }
          </p>
        </div>
        
        {user.user_type === 'therapist' && (
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Criar Exercício
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-primary">Criar Novo Exercício</DialogTitle>
                <DialogDescription>
                  Preencha as informações para criar um exercício personalizado
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="form-label">Título do Exercício</Label>
                    <Input
                      id="title"
                      value={newExercise.title}
                      onChange={(e) => setNewExercise(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Ex: Exercícios de Respiração"
                      className="fono-input"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category" className="form-label">Categoria</Label>
                    <Select 
                      value={newExercise.category} 
                      onValueChange={(value) => setNewExercise(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger className="fono-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            <div className="flex items-center gap-2">
                              <category.icon className={`h-4 w-4 icon-${category.color}`} />
                              {category.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="difficulty" className="form-label">Dificuldade</Label>
                    <Select 
                      value={newExercise.difficulty} 
                      onValueChange={(value) => setNewExercise(prev => ({ ...prev, difficulty: value }))}
                    >
                      <SelectTrigger className="fono-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {difficulties.map(difficulty => (
                          <SelectItem key={difficulty.id} value={difficulty.id}>
                            {difficulty.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="duration" className="form-label">Duração (minutos)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={newExercise.duration_minutes}
                      onChange={(e) => setNewExercise(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) }))}
                      min="1"
                      max="120"
                      className="fono-input"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description" className="form-label">Descrição</Label>
                  <Textarea
                    id="description"
                    value={newExercise.description}
                    onChange={(e) => setNewExercise(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descreva brevemente o objetivo do exercício"
                    rows={3}
                    className="fono-input"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="instructions" className="form-label">Instruções Detalhadas</Label>
                  <Textarea
                    id="instructions"
                    value={newExercise.instructions}
                    onChange={(e) => setNewExercise(prev => ({ ...prev, instructions: e.target.value }))}
                    placeholder="Passo a passo de como realizar o exercício"
                    rows={4}
                    className="fono-input"
                  />
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleCreateExercise}
                    className="btn-primary"
                    disabled={!newExercise.title || !newExercise.description}
                  >
                    Criar Exercício
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filtros */}
      <Card className="fono-card">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar exercícios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 fono-input"
                />
              </div>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 fono-input">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <category.icon className={`h-4 w-4 icon-${category.color}`} />
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-48 fono-input">
                <SelectValue placeholder="Dificuldade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as dificuldades</SelectItem>
                {difficulties.map(difficulty => (
                  <SelectItem key={difficulty.id} value={difficulty.id}>
                    {difficulty.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas Rápidas - Apenas para Fonoaudiólogos */}
      {user.user_type === 'therapist' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="card-therapist hover-lift">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-teal-700">Total de Exercícios</p>
                  <p className="text-2xl font-bold text-teal-800">{stats.total}</p>
                </div>
                <Activity className="h-8 w-8 icon-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-patient hover-lift">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Atribuídos</p>
                  <p className="text-2xl font-bold text-blue-800">{stats.assigned}</p>
                </div>
                <Users className="h-8 w-8 icon-secondary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-exercise hover-lift">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Concluídos</p>
                  <p className="text-2xl font-bold text-green-800">{stats.completed}</p>
                </div>
                <CheckCircle className="h-8 w-8 icon-accent" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-appointment hover-lift">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Taxa de Sucesso</p>
                  <p className="text-2xl font-bold text-purple-800">{stats.successRate}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Lista de Exercícios */}
      <Tabs defaultValue="grid" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grid">Visualização em Grade</TabsTrigger>
          <TabsTrigger value="category">Por Categoria</TabsTrigger>
          <TabsTrigger value="list">Lista Detalhada</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-4">
          {filteredExercises.length === 0 ? (
            <Card className="p-12 text-center">
              <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {user.user_type === 'therapist' ? 'Nenhum exercício encontrado' : 'Nenhum exercício atribuído'}
              </h3>
              <p className="text-gray-500 mb-6">
                {user.user_type === 'therapist' 
                  ? 'Crie seu primeiro exercício para começar'
                  : 'Aguarde seu fonoaudiólogo atribuir exercícios para você'
                }
              </p>
              {user.user_type === 'therapist' && (
                <Button 
                  onClick={() => setShowCreateDialog(true)}
                  className="btn-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Exercício
                </Button>
              )}
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExercises.map((exercise) => {
                const categoryInfo = getCategoryInfo(exercise.category)
                const difficultyInfo = getDifficultyInfo(exercise.difficulty)
                
                return (
                  <Card key={exercise.id} className={`fono-card hover-lift exercise-${exercise.category}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <categoryInfo.icon className={`h-5 w-5 icon-${categoryInfo.color}`} />
                          <Badge className={`badge-${categoryInfo.color}`}>
                            {categoryInfo.name}
                          </Badge>
                        </div>
                        <Badge className={difficultyInfo.color}>
                          {difficultyInfo.name}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg text-primary">{exercise.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {exercise.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {exercise.duration_minutes} min
                        </div>
                        {user.user_type === 'therapist' && exercise.patient_id && (
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span className="text-xs">{getPatientName(exercise.patient_id)}</span>
                          </div>
                        )}
                        {exercise.is_completed ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-xs">Concluído</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-gray-500">
                            <Circle className="h-4 w-4" />
                            <span className="text-xs">Pendente</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-1" />
                          Ver Detalhes
                        </Button>
                        
                        {user.user_type === 'therapist' ? (
                          <Button 
                            size="sm" 
                            className="btn-primary"
                            onClick={() => {
                              setSelectedExercise(exercise)
                              setShowAssignDialog(true)
                            }}
                          >
                            <Target className="h-4 w-4 mr-1" />
                            Atribuir
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            className="btn-accent"
                            disabled={exercise.is_completed}
                            onClick={() => handleCompleteExercise(exercise.id)}
                          >
                            <Play className="h-4 w-4 mr-1" />
                            {exercise.is_completed ? 'Concluído' : 'Iniciar'}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="category" className="space-y-6">
          {getExercisesByCategory().map((category) => (
            <div key={category.id}>
              <div className="flex items-center gap-3 mb-4">
                <category.icon className={`h-6 w-6 icon-${category.color}`} />
                <h2 className="text-xl font-semibold text-primary">{category.name}</h2>
                <Badge variant="outline">{category.exercises.length} exercícios</Badge>
              </div>
              
              {category.exercises.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.exercises.map((exercise) => {
                    const difficultyInfo = getDifficultyInfo(exercise.difficulty)
                    
                    return (
                      <Card key={exercise.id} className={`exercise-${category.id} hover-lift smooth-transition`}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base text-primary">{exercise.title}</CardTitle>
                            <Badge className={difficultyInfo.color} size="sm">
                              {difficultyInfo.name}
                            </Badge>
                          </div>
                          <CardDescription className="text-sm line-clamp-2">
                            {exercise.description}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="pt-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1 text-gray-600">
                              <Clock className="h-3 w-3" />
                              {exercise.duration_minutes} min
                            </span>
                            
                            {exercise.is_completed ? (
                              <span className="flex items-center gap-1 text-green-600">
                                <CheckCircle className="h-3 w-3" />
                                Concluído
                              </span>
                            ) : (
                              <Button size="sm" variant="outline" className="smooth-transition">
                                {user.user_type === 'therapist' ? 'Gerenciar' : 'Iniciar'}
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <category.icon className={`h-12 w-12 icon-${category.color} mx-auto mb-3 opacity-50`} />
                  <p className="text-gray-500">Nenhum exercício encontrado nesta categoria</p>
                  {user.user_type === 'therapist' && (
                    <Button 
                      variant="outline" 
                      className="mt-3"
                      onClick={() => {
                        setNewExercise(prev => ({ ...prev, category: category.id }))
                        setShowCreateDialog(true)
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Exercício de {category.name}
                    </Button>
                  )}
                </Card>
              )}
            </div>
          ))}
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <Card className="fono-card">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="table-fono">
                  <thead>
                    <tr>
                      <th>Exercício</th>
                      <th>Categoria</th>
                      <th>Dificuldade</th>
                      <th>Duração</th>
                      {user.user_type === 'therapist' && <th>Paciente</th>}
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExercises.map((exercise) => {
                      const categoryInfo = getCategoryInfo(exercise.category)
                      const difficultyInfo = getDifficultyInfo(exercise.difficulty)
                      
                      return (
                        <tr key={exercise.id}>
                          <td>
                            <div>
                              <div className="font-medium text-primary">{exercise.title}</div>
                              <div className="text-sm text-gray-600 line-clamp-1">
                                {exercise.description}
                              </div>
                            </div>
                          </td>
                          <td>
                            <Badge className={`badge-${categoryInfo.color}`}>
                              <categoryInfo.icon className="h-3 w-3 mr-1" />
                              {categoryInfo.name}
                            </Badge>
                          </td>
                          <td>
                            <Badge className={difficultyInfo.color}>
                              {difficultyInfo.name}
                            </Badge>
                          </td>
                          <td>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-gray-400" />
                              {exercise.duration_minutes} min
                            </span>
                          </td>
                          {user.user_type === 'therapist' && (
                            <td>
                              {exercise.patient_id ? (
                                <span className="text-sm">{getPatientName(exercise.patient_id)}</span>
                              ) : (
                                <span className="text-sm text-gray-400">Não atribuído</span>
                              )}
                            </td>
                          )}
                          <td>
                            {exercise.is_completed ? (
                              <Badge className="status-completed">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Concluído
                              </Badge>
                            ) : (
                              <Badge className="status-pending">
                                <Circle className="h-3 w-3 mr-1" />
                                Pendente
                              </Badge>
                            )}
                          </td>
                          <td>
                            <div className="flex gap-1">
                              <Button variant="outline" size="sm" className="smooth-transition">
                                <Eye className="h-3 w-3" />
                              </Button>
                              {user.user_type === 'therapist' && (
                                <>
                                  <Button variant="outline" size="sm" className="smooth-transition">
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="smooth-transition"
                                    onClick={() => {
                                      setSelectedExercise(exercise)
                                      setShowAssignDialog(true)
                                    }}
                                  >
                                    <Target className="h-3 w-3" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog para Atribuir Exercício */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-primary">Atribuir Exercício</DialogTitle>
            <DialogDescription>
              Selecione um paciente para atribuir o exercício "{selectedExercise?.title}"
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid gap-2">
              {patients.map((patient) => (
                <Card 
                  key={patient.id} 
                  className="p-4 cursor-pointer hover:bg-gray-50 smooth-transition"
                  onClick={() => handleAssignExercise(patient.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-primary">{patient.name}</div>
                      <div className="text-sm text-gray-600">{patient.diagnosis}</div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date().getFullYear() - new Date(patient.birth_date).getFullYear()} anos
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            {patients.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">Nenhum paciente cadastrado</p>
                <p className="text-sm text-gray-400">Cadastre pacientes para atribuir exercícios</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

