import { useAuth } from '../contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Bell, Menu, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function Header({ onMenuClick }) {
  const { user } = useAuth()

  return (
    <header className="bg-white shadow-sm border-b border-teal-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden text-teal-600 hover:bg-teal-50"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="hidden md:flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar pacientes, exercícios..."
                className="pl-10 w-80 border-gray-200 focus:border-teal-500 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="relative text-teal-600 hover:bg-teal-50">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </Button>
          
          <div className="text-right">
            <p className="text-sm font-medium text-teal-700">{user?.name}</p>
            <p className="text-xs text-gray-500">
              {user?.user_type === 'therapist' ? 'Fonoaudiólogo(a)' : 
               user?.user_type === 'admin' ? 'Administrador' : 'Paciente'}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}

