import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  Home,
  Users,
  BookOpen,
  Calendar,
  User,
  LogOut,
  X,
  Stethoscope,
  Activity,
  Shield,
  Video,
  LayoutDashboard
} from 'lucide-react'

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth()
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, show: true },
    { name: 'Pacientes', href: '/patients', icon: Users, show: user?.user_type === 'therapist' },
    { name: 'Exercícios', href: '/exercises', icon: Activity, show: true },
    { name: 'Agendamentos', href: '/appointments', icon: Calendar, show: true },
    { name: 'Demonstração', href: '/demo', icon: Video, show: true },
    { name: 'Perfil', href: '/profile', icon: User, show: true },
    { name: 'Painel Admin', href: '/admin', icon: Shield, show: user?.user_type === 'admin' },
  ]

  const isActive = (href) => {
    return location.pathname === href || (href === '/' && location.pathname === '/dashboard')
  }

  const handleLogout = () => {
    logout()
    onClose()
  }

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:inset-0
        bg-gradient-to-b from-teal-600 to-teal-700 text-white
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Stethoscope className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">FonoApp</h1>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-white hover:bg-white/10 p-1 rounded transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {navigation.filter(item => item.show).map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={`
                    flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${active 
                      ? 'bg-white/20 text-white font-semibold' 
                      : 'text-white hover:bg-white/10'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.name || 'Usuário'}
              </p>
              <p className="text-xs text-white/70 truncate">
                {user?.user_type === 'therapist' ? 'Fonoaudiólogo(a)' : 
                 user?.user_type === 'admin' ? 'Administrador' : 'Paciente'}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-sm font-medium">Sair</span>
          </button>
        </div>
      </div>
    </>
  )
}

