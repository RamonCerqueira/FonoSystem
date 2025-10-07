import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Stethoscope, Eye, EyeOff, TestTube } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(email, password)
    
    if (result.success) {
      navigate('/')
    } else {
      setError(result.message)
    }
    
    setLoading(false)
  }

  // FUNÇÃO PARA TESTES - REMOVER EM PRODUÇÃO
  const handleQuickLogin = async (userType) => {
    setError('')
    setLoading(true)
    
    const testCredentials = {
      therapist: {
        email: 'dra.ana@fonoapp.com',
        password: 'teste123'
      },
      patient: {
        email: 'maria.paciente@email.com', 
        password: 'teste123'
      }
    }
    
    const credentials = testCredentials[userType]
    setEmail(credentials.email)
    setPassword(credentials.password)
    
    const result = await login(credentials.email, credentials.password)
    
    if (result.success) {
      navigate('/')
    } else {
      setError(result.message)
    }
    
    setLoading(false)
  }

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 50%, #5eead4 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  }

  const cardStyle = {
    width: '100%',
    maxWidth: '400px',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 20px 25px -5px rgba(20, 184, 166, 0.1), 0 10px 10px -5px rgba(20, 184, 166, 0.04)',
    border: '1px solid rgba(20, 184, 166, 0.1)'
  }

  const headerStyle = {
    textAlign: 'center',
    padding: '32px 32px 24px 32px'
  }

  const logoStyle = {
    width: '64px',
    height: '64px',
    background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px auto'
  }

  const titleStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#0d9488',
    marginBottom: '8px'
  }

  const subtitleStyle = {
    fontSize: '16px',
    color: '#64748b',
    marginBottom: '0'
  }

  const formStyle = {
    padding: '0 32px 32px 32px'
  }

  const inputGroupStyle = {
    marginBottom: '20px'
  }

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#334155',
    marginBottom: '6px'
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    transition: 'all 0.2s ease',
    backgroundColor: 'white'
  }

  const passwordContainerStyle = {
    position: 'relative'
  }

  const passwordToggleStyle = {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#64748b',
    padding: '4px'
  }

  const buttonStyle = {
    width: '100%',
    background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginBottom: '16px'
  }

  const linkStyle = {
    textAlign: 'center',
    fontSize: '14px',
    color: '#64748b'
  }

  const linkAnchorStyle = {
    color: '#14b8a6',
    textDecoration: 'none',
    fontWeight: '500'
  }

  const testPanelStyle = {
    background: '#fffbeb',
    border: '1px solid #f59e0b',
    borderRadius: '8px',
    padding: '16px',
    marginTop: '24px'
  }

  const testButtonStyle = {
    width: '100%',
    background: '#f59e0b',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    marginBottom: '8px',
    transition: 'all 0.2s ease'
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <div style={logoStyle}>
            <Stethoscope size={32} color="white" />
          </div>
          <h1 style={titleStyle}>FonoApp</h1>
          <p style={subtitleStyle}>
            Plataforma especializada em fonoaudiologia
          </p>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #ef4444',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '20px',
              color: '#dc2626',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <div style={inputGroupStyle}>
            <label htmlFor="email" style={labelStyle}>
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = '#14b8a6'
                e.target.style.boxShadow = '0 0 0 3px rgba(20, 184, 166, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0'
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>

          <div style={inputGroupStyle}>
            <label htmlFor="password" style={labelStyle}>
              Senha
            </label>
            <div style={passwordContainerStyle}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = '#14b8a6'
                  e.target.style.boxShadow = '0 0 0 3px rgba(20, 184, 166, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0'
                  e.target.style.boxShadow = 'none'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={passwordToggleStyle}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={buttonStyle}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.background = 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)'
                e.target.style.transform = 'translateY(-1px)'
                e.target.style.boxShadow = '0 4px 12px rgba(20, 184, 166, 0.3)'
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.background = 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)'
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = 'none'
              }
            }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <div style={linkStyle}>
            Não tem uma conta?{' '}
            <Link to="/register" style={linkAnchorStyle}>
              Cadastre-se aqui
            </Link>
          </div>

          {/* PAINEL DE TESTE - REMOVER EM PRODUÇÃO */}
          <div style={testPanelStyle}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px',
              color: '#92400e',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              <TestTube size={16} />
              <span>Acesso Rápido para Testes</span>
            </div>
            <p style={{
              fontSize: '12px',
              color: '#92400e',
              marginBottom: '12px',
              margin: '0 0 12px 0'
            }}>
              ⚠️ Apenas para demonstração - remover em produção
            </p>
            
            <button
              type="button"
              onClick={() => handleQuickLogin('therapist')}
              disabled={loading}
              style={testButtonStyle}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.background = '#d97706'
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.background = '#f59e0b'
                }
              }}
            >
              🩺 Login como Fonoaudiólogo
            </button>
            
            <button
              type="button"
              onClick={() => handleQuickLogin('patient')}
              disabled={loading}
              style={{...testButtonStyle, marginBottom: '0'}}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.background = '#d97706'
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.background = '#f59e0b'
                }
              }}
            >
              👤 Login como Paciente
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

