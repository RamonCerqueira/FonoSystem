import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    
    if (!result.success) {
      Alert.alert('Erro', result.message || 'Erro ao fazer login');
    }
    
    setLoading(false);
  };

  // FUNÇÃO PARA TESTES - REMOVER EM PRODUÇÃO
  const handleQuickLogin = async (userType: 'therapist' | 'patient') => {
    setLoading(true);
    
    // Dados de teste - substituir por dados reais do seu sistema
    const testCredentials = {
      therapist: {
        email: 'dra.ana@fonoapp.com',
        password: 'teste123'
      },
      patient: {
        email: 'maria.paciente@email.com', 
        password: 'teste123'
      }
    };
    
    const credentials = testCredentials[userType];
    setEmail(credentials.email);
    setPassword(credentials.password);
    
    const result = await login(credentials.email, credentials.password);
    
    if (!result.success) {
      Alert.alert('Erro', result.message || 'Erro ao fazer login');
    }
    
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Ionicons name="medical" size={64} color="#2c5aa0" />
          <Text style={styles.title}>FonoApp</Text>
          <Text style={styles.subtitle}>Sua plataforma de fonoaudiologia</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Entrar na sua conta</Text>
          
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons 
                name={showPassword ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color="#666" 
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginButtonText}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Text>
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Não tem uma conta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register' as never)}>
              <Text style={styles.registerLink}>Cadastre-se aqui</Text>
            </TouchableOpacity>
          </View>

          {/* PAINEL DE TESTE - REMOVER EM PRODUÇÃO */}
          <View style={styles.testContainer}>
            <Text style={styles.testTitle}>🧪 Modo de Teste - Login Rápido</Text>
            
            <TouchableOpacity
              style={[styles.testButton, loading && styles.testButtonDisabled]}
              onPress={() => handleQuickLogin('therapist')}
              disabled={loading}
            >
              <Text style={styles.testButtonText}>
                {loading ? 'Entrando...' : 'Login como Fonoaudiólogo'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.testButton, loading && styles.testButtonDisabled]}
              onPress={() => handleQuickLogin('patient')}
              disabled={loading}
            >
              <Text style={styles.testButtonText}>
                {loading ? 'Entrando...' : 'Login como Paciente'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.testWarning}>
              ⚠️ Remover este painel antes do deploy em produção
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c5aa0',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 4,
  },
  loginButton: {
    backgroundColor: '#2c5aa0',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    backgroundColor: '#ccc',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  registerText: {
    color: '#666',
    fontSize: 14,
  },
  registerLink: {
    color: '#2c5aa0',
    fontSize: 14,
    fontWeight: 'bold',
  },
  // ESTILOS PARA TESTE - REMOVER EM PRODUÇÃO
  testContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#fefce8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fde047',
  },
  testTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#a16207',
    marginBottom: 12,
    textAlign: 'center',
  },
  testButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#fde047',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  testButtonDisabled: {
    opacity: 0.6,
  },
  testButtonText: {
    color: '#a16207',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  testWarning: {
    fontSize: 10,
    color: '#ca8a04',
    textAlign: 'center',
    marginTop: 8,
  },
});

