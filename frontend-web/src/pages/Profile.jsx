import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Award,
  Settings,
  Lock,
  Eye,
  EyeOff,
  Edit,
  Save,
  Shield,
  Bell,
  Palette
} from 'lucide-react'

export default function Profile() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    crfa_number: user?.crfa_number || '',
    specialization: user?.specialization || '',
    bio: 'Fonoaudióloga especializada em terapia da fala e linguagem, com mais de 10 anos de experiência.',
    address: 'São Paulo, SP',
    birth_date: '1985-03-15'
  })
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    try {
      // Simular atualização
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage('Perfil atualizado com sucesso!')
      setIsEditing(false)
    } catch (error) {
      setMessage('Erro ao atualizar perfil.')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage('As senhas não coincidem.')
      setLoading(false)
      return
    }
    
    try {
      // Simular atualização
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage('Senha atualizada com sucesso!')
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      })
    } catch (error) {
      setMessage('Erro ao atualizar senha.')
    } finally {
      setLoading(false)
    }
  }

  const tabButtonStyle = (tabId) => ({
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    background: activeTab === tabId ? '#14b8a6' : 'transparent',
    color: activeTab === tabId ? 'white' : '#64748b',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  })

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    transition: 'border-color 0.2s ease',
    backgroundColor: isEditing ? 'white' : '#f8fafc'
  }

  const buttonStyle = {
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    background: '#14b8a6',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'background-color 0.2s ease'
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-teal-700 flex items-center gap-3">
          <User className="h-8 w-8" />
          Meu Perfil
        </h1>
        <p className="text-gray-600 mt-2">
          Gerencie suas informações pessoais e configurações da conta
        </p>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg mb-6 ${
          message.includes('sucesso') 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-teal-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-600">
                {user?.user_type === 'therapist' ? 'Fonoaudiólogo(a)' : 'Paciente'}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Ativo
                </span>
                {user?.user_type === 'therapist' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    CRFa: {profileData.crfa_number || '12345-SP'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex space-x-1 p-4">
            <button
              style={tabButtonStyle('profile')}
              onClick={() => setActiveTab('profile')}
              onMouseEnter={(e) => {
                if (activeTab !== 'profile') {
                  e.target.style.backgroundColor = '#f0fdfa'
                  e.target.style.color = '#14b8a6'
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'profile') {
                  e.target.style.backgroundColor = 'transparent'
                  e.target.style.color = '#64748b'
                }
              }}
            >
              <User className="h-4 w-4" />
              Informações Pessoais
            </button>
            <button
              style={tabButtonStyle('security')}
              onClick={() => setActiveTab('security')}
              onMouseEnter={(e) => {
                if (activeTab !== 'security') {
                  e.target.style.backgroundColor = '#f0fdfa'
                  e.target.style.color = '#14b8a6'
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'security') {
                  e.target.style.backgroundColor = 'transparent'
                  e.target.style.color = '#64748b'
                }
              }}
            >
              <Lock className="h-4 w-4" />
              Segurança
            </button>
            <button
              style={tabButtonStyle('preferences')}
              onClick={() => setActiveTab('preferences')}
              onMouseEnter={(e) => {
                if (activeTab !== 'preferences') {
                  e.target.style.backgroundColor = '#f0fdfa'
                  e.target.style.color = '#14b8a6'
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'preferences') {
                  e.target.style.backgroundColor = 'transparent'
                  e.target.style.color = '#64748b'
                }
              }}
            >
              <Settings className="h-4 w-4" />
              Preferências
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Informações Pessoais</h3>
                <button
                  style={buttonStyle}
                  onClick={() => setIsEditing(!isEditing)}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#0d9488'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#14b8a6'}
                >
                  {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                  {isEditing ? 'Salvar' : 'Editar'}
                </button>
              </div>

              <form onSubmit={handleProfileUpdate}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      disabled={!isEditing}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      disabled={!isEditing}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      disabled={!isEditing}
                      style={inputStyle}
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  {user?.user_type === 'therapist' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CRFa
                      </label>
                      <input
                        type="text"
                        value={profileData.crfa_number}
                        onChange={(e) => setProfileData({...profileData, crfa_number: e.target.value})}
                        disabled={!isEditing}
                        style={inputStyle}
                        placeholder="12345-SP"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data de Nascimento
                    </label>
                    <input
                      type="date"
                      value={profileData.birth_date}
                      onChange={(e) => setProfileData({...profileData, birth_date: e.target.value})}
                      disabled={!isEditing}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Endereço
                    </label>
                    <input
                      type="text"
                      value={profileData.address}
                      onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                      disabled={!isEditing}
                      style={inputStyle}
                      placeholder="Cidade, Estado"
                    />
                  </div>
                </div>

                {user?.user_type === 'therapist' && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Especialização
                    </label>
                    <input
                      type="text"
                      value={profileData.specialization}
                      onChange={(e) => setProfileData({...profileData, specialization: e.target.value})}
                      disabled={!isEditing}
                      style={inputStyle}
                      placeholder="Ex: Terapia da Fala, Audiologia"
                    />
                  </div>
                )}

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Biografia
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    disabled={!isEditing}
                    rows={4}
                    style={{...inputStyle, resize: 'vertical'}}
                    placeholder="Conte um pouco sobre você..."
                  />
                </div>

                {isEditing && (
                  <div className="mt-6 flex gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      style={buttonStyle}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#0d9488'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#14b8a6'}
                    >
                      <Save className="h-4 w-4" />
                      {loading ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      style={{
                        ...buttonStyle,
                        background: '#6b7280',
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#4b5563'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#6b7280'}
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Segurança da Conta</h3>
              
              <form onSubmit={handlePasswordUpdate}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Senha Atual
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={passwordData.current_password}
                        onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                        style={inputStyle}
                        placeholder="Digite sua senha atual"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nova Senha
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordData.new_password}
                        onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                        style={inputStyle}
                        placeholder="Digite sua nova senha"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar Nova Senha
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={passwordData.confirm_password}
                        onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                        style={inputStyle}
                        placeholder="Confirme sua nova senha"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={buttonStyle}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#0d9488'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#14b8a6'}
                  >
                    <Lock className="h-4 w-4" />
                    {loading ? 'Atualizando...' : 'Atualizar Senha'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Preferências</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-gray-600" />
                    <div>
                      <h4 className="font-medium text-gray-900">Notificações por E-mail</h4>
                      <p className="text-sm text-gray-600">Receba atualizações sobre consultas e exercícios</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Palette className="h-5 w-5 text-gray-600" />
                    <div>
                      <h4 className="font-medium text-gray-900">Tema Escuro</h4>
                      <p className="text-sm text-gray-600">Ativar modo escuro da interface</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

