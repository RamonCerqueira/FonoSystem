import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: number;
  name: string;
  email: string;
  user_type: 'therapist' | 'patient';
  crfa_number?: string;
  phone?: string;
  specialization?: string;
  birth_date?: string;
  created_at: string;
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (userData: any) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// DADOS MOCK PARA DEMONSTRAÇÃO - REMOVER EM PRODUÇÃO
const MOCK_USERS: { [key: string]: User } = {
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
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('@FonoApp:user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Verificar credenciais mock
    const mockUser = MOCK_USERS[email];
    if (mockUser && password === 'teste123') {
      setUser(mockUser);
      await AsyncStorage.setItem('@FonoApp:user', JSON.stringify(mockUser));
      return { success: true };
    }
    
    return { 
      success: false, 
      message: 'Email ou senha incorretos. Use as credenciais de teste.' 
    };
  };

  const register = async (userData: any) => {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Criar usuário mock
    const newUser: User = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      user_type: userData.user_type,
      crfa_number: userData.crfa_number,
      specialization: userData.specialization,
      phone: userData.phone,
      birth_date: userData.birth_date,
      created_at: new Date().toISOString()
    };
    
    setUser(newUser);
    await AsyncStorage.setItem('@FonoApp:user', JSON.stringify(newUser));
    
    return { success: true };
  };

  const logout = async () => {
    await AsyncStorage.removeItem('@FonoApp:user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

