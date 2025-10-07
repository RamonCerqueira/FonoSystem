import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Play, 
  Video, 
  ExternalLink, 
  BookOpen, 
  Users, 
  Calendar,
  Activity,
  Star,
  Clock,
  Monitor
} from 'lucide-react'

export default function VideoDemo() {
  const [activeVideo, setActiveVideo] = useState(null)

  const demoVideos = [
    {
      id: 1,
      title: 'Introdução ao FonoApp',
      description: 'Conheça as principais funcionalidades da plataforma',
      duration: '3:45',
      category: 'overview',
      thumbnail: '/api/placeholder/400/225',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
      featured: true
    },
    {
      id: 2,
      title: 'Dashboard do Fonoaudiólogo',
      description: 'Como navegar e utilizar o painel principal',
      duration: '5:20',
      category: 'therapist',
      thumbnail: '/api/placeholder/400/225',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      featured: false
    },
    {
      id: 3,
      title: 'Gestão de Pacientes',
      description: 'Cadastro, edição e acompanhamento de pacientes',
      duration: '4:15',
      category: 'therapist',
      thumbnail: '/api/placeholder/400/225',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      featured: false
    },
    {
      id: 4,
      title: 'Biblioteca de Exercícios',
      description: 'Como criar e atribuir exercícios personalizados',
      duration: '6:30',
      category: 'exercises',
      thumbnail: '/api/placeholder/400/225',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      featured: true
    },
    {
      id: 5,
      title: 'Sistema de Agendamentos',
      description: 'Agende consultas presenciais e online',
      duration: '3:55',
      category: 'appointments',
      thumbnail: '/api/placeholder/400/225',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      featured: false
    },
    {
      id: 6,
      title: 'Experiência do Paciente',
      description: 'Como os pacientes interagem com a plataforma',
      duration: '4:40',
      category: 'patient',
      thumbnail: '/api/placeholder/400/225',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      featured: false
    }
  ]

  const externalLinks = [
    {
      id: 1,
      title: 'Webinar: Telepráticas em Fonoaudiologia',
      description: 'Aprenda sobre as melhores práticas em atendimento remoto',
      url: 'https://example.com/webinar-telepraticas',
      type: 'webinar',
      duration: '45 min'
    },
    {
      id: 2,
      title: 'Curso: Gamificação em Terapia',
      description: 'Como usar jogos para motivar pacientes',
      url: 'https://example.com/curso-gamificacao',
      type: 'course',
      duration: '2h 30min'
    },
    {
      id: 3,
      title: 'E-book: Guia Completo do FonoApp',
      description: 'Manual detalhado com todas as funcionalidades',
      url: 'https://example.com/ebook-guia',
      type: 'ebook',
      duration: 'PDF - 45 páginas'
    }
  ]

  const handleVideoPlay = (video) => {
    setActiveVideo(video)
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'therapist':
        return <Users className="h-4 w-4" />
      case 'exercises':
        return <Activity className="h-4 w-4" />
      case 'appointments':
        return <Calendar className="h-4 w-4" />
      case 'patient':
        return <BookOpen className="h-4 w-4" />
      default:
        return <Video className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'therapist':
        return 'bg-blue-100 text-blue-800'
      case 'exercises':
        return 'bg-green-100 text-green-800'
      case 'appointments':
        return 'bg-purple-100 text-purple-800'
      case 'patient':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-teal-100 text-teal-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-teal-800">Central de Demonstrações</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore todas as funcionalidades do FonoApp através de vídeos demonstrativos, 
          tutoriais e recursos educacionais.
        </p>
      </div>

      {/* Vídeo em Destaque */}
      {activeVideo && (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-teal-600" />
                  {activeVideo.title}
                </CardTitle>
                <CardDescription>{activeVideo.description}</CardDescription>
              </div>
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {activeVideo.duration}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              {/* Placeholder para vídeo - substituir por iframe real */}
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto">
                  <Play className="h-8 w-8 text-teal-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Vídeo: {activeVideo.title}</p>
                  <p className="text-sm text-gray-600">
                    Em produção, aqui seria exibido o vídeo incorporado
                  </p>
                  <Button 
                    className="mt-2 bg-teal-600 hover:bg-teal-700"
                    onClick={() => window.open(activeVideo.videoUrl, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Assistir no YouTube
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="videos" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="videos">Vídeos Demonstrativos</TabsTrigger>
          <TabsTrigger value="tutorials">Tutoriais</TabsTrigger>
          <TabsTrigger value="resources">Recursos Externos</TabsTrigger>
        </TabsList>

        <TabsContent value="videos" className="space-y-6">
          {/* Vídeos em Destaque */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Vídeos em Destaque
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {demoVideos.filter(video => video.featured).map((video) => (
                <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gray-200 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button
                        size="lg"
                        className="bg-teal-600 hover:bg-teal-700 rounded-full w-16 h-16"
                        onClick={() => handleVideoPlay(video)}
                      >
                        <Play className="h-6 w-6" />
                      </Button>
                    </div>
                    <Badge 
                      className={`absolute top-2 left-2 ${getCategoryColor(video.category)}`}
                    >
                      {getCategoryIcon(video.category)}
                      <span className="ml-1 capitalize">{video.category}</span>
                    </Badge>
                    <Badge 
                      variant="secondary" 
                      className="absolute bottom-2 right-2 bg-black/70 text-white"
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      {video.duration}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{video.title}</h3>
                    <p className="text-sm text-gray-600">{video.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Todos os Vídeos */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Todos os Vídeos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {demoVideos.map((video) => (
                <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gray-200 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button
                        className="bg-teal-600 hover:bg-teal-700 rounded-full w-12 h-12"
                        onClick={() => handleVideoPlay(video)}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                    <Badge 
                      className={`absolute top-2 left-2 text-xs ${getCategoryColor(video.category)}`}
                    >
                      {getCategoryIcon(video.category)}
                    </Badge>
                    <Badge 
                      variant="secondary" 
                      className="absolute bottom-2 right-2 bg-black/70 text-white text-xs"
                    >
                      {video.duration}
                    </Badge>
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-medium text-gray-900 mb-1 text-sm">{video.title}</h3>
                    <p className="text-xs text-gray-600">{video.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tutorials" className="space-y-6">
          <div className="text-center py-8">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Tutoriais Interativos</h2>
            <p className="text-gray-600 mb-6">
              Aprenda passo a passo como usar cada funcionalidade do FonoApp
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card className="p-6">
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold">Tutorial para Fonoaudiólogos</h3>
                  <p className="text-sm text-gray-600">
                    Guia completo para profissionais começarem a usar a plataforma
                  </p>
                  <Button className="bg-teal-600 hover:bg-teal-700">
                    Iniciar Tutorial
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
                    <BookOpen className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold">Tutorial para Pacientes</h3>
                  <p className="text-sm text-gray-600">
                    Como pacientes podem aproveitar ao máximo seus exercícios
                  </p>
                  <Button className="bg-teal-600 hover:bg-teal-700">
                    Iniciar Tutorial
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recursos Externos</h2>
            <div className="space-y-4">
              {externalLinks.map((resource) => (
                <Card key={resource.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{resource.title}</h3>
                      <p className="text-gray-600 mb-3">{resource.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <Badge variant="outline" className="capitalize">
                          {resource.type}
                        </Badge>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {resource.duration}
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="outline"
                      onClick={() => window.open(resource.url, '_blank')}
                      className="ml-4"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Acessar
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Card className="p-6 bg-teal-50 border-teal-200">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto">
                <Video className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-teal-800">
                Precisa de Mais Recursos?
              </h3>
              <p className="text-teal-700">
                Entre em contato conosco para acessar mais materiais educacionais e de treinamento
              </p>
              <Button className="bg-teal-600 hover:bg-teal-700">
                Entrar em Contato
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

