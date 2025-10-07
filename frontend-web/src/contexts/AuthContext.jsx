import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

// DADOS MOCK PARA DEMONSTRAÇÃO - REMOVER EM PRODUÇÃO
const MOCK_USERS = {
  'dra.ana@fonoapp.com': {
    id: 1,
    name: 'Dra. Ana Carolina Silva',
    email: 'dra.ana@fonoapp.com',
    user_type: 'therapist',
    crfa_number: 'CRFa 12345-SP',
    specialization: 'Linguagem Infantil',
    phone: '(11) 99999-9999',
    created_at: '2024-01-15T10:00:00Z'
  },
  'maria.paciente@email.com': {
    id: 2,
    name: 'Maria Santos',
    email: 'maria.paciente@email.com',
    user_type: 'patient',
    birth_date: '1985-03-15',
    phone: '(11) 88888-8888',
    created_at: '2024-02-01T14:30:00Z'
  }
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar se há usuário salvo no localStorage
    const savedUser = localStorage.getItem('fonoapp_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        localStorage.removeItem('fonoapp_user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Verificar credenciais mock
    const mockUser = MOCK_USERS[email]
    if (mockUser && password === 'teste123') {
      setUser(mockUser)
      localStorage.setItem('fonoapp_user', JSON.stringify(mockUser))
      return { success: true }
    }
    
    return { 
      success: false, 
      message: 'Email ou senha incorretos. Use as credenciais de teste.' 
    }
  }

  const register = async (userData) => {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Criar usuário mock
    const newUser = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      user_type: userData.user_type,
      crfa_number: userData.crfa_number,
      specialization: userData.specialization,
      phone: userData.phone,
      birth_date: userData.birth_date,
      created_at: new Date().toISOString()
    }
    
    setUser(newUser)
    localStorage.setItem('fonoapp_user', JSON.stringify(newUser))
    
    return { success: true }
  }

  const logout = () => {
    localStorage.removeItem('fonoapp_user')
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

