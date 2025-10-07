import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { appointmentsService, patientsService, exercisesService } from '../services/api';

interface Stats {
  patients?: number;
  exercises: number;
  appointments: number;
  completedExercises: number;
}

interface Appointment {
  id: number;
  appointment_date: string;
  patient?: { name: string };
  therapist?: { name: string };
  status: string;
}

export function DashboardScreen() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    exercises: 0,
    appointments: 0,
    completedExercises: 0,
  });
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      if (user?.user_type === 'therapist') {
        const [patientsRes, exercisesRes, appointmentsRes, todayRes] = await Promise.all([
          patientsService.getAll(),
          exercisesService.getAll(),
          appointmentsService.getAll(),
          appointmentsService.getToday()
        ]);
        
        setStats({
          patients: patientsRes.data.patients?.length || 0,
          exercises: exercisesRes.data.exercises?.length || 0,
          appointments: appointmentsRes.data.appointments?.length || 0,
          completedExercises: 0
        });
        
        setTodayAppointments(todayRes.data.appointments || []);
      } else {
        const [exercisesRes, appointmentsRes, todayRes] = await Promise.all([
          exercisesService.getPatientExercises(user?.id || 0),
          appointmentsService.getAll(),
          appointmentsService.getToday()
        ]);
        
        setStats({
          exercises: exercisesRes.data.exercises?.length || 0,
          appointments: appointmentsRes.data.appointments?.length || 0,
          completedExercises: exercisesRes.data.exercises?.filter((e: any) => e.is_completed)?.length || 0
        });
        
        setTodayAppointments(todayRes.data.appointments || []);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const StatCard = ({ title, value, icon, color }: { title: string; value: number | string; icon: string; color: string }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <Ionicons name={icon as any} size={24} color={color} />
        <Text style={styles.statValue}>{value}</Text>
      </View>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>
          {getGreeting()}, {user?.name?.split(' ')[0]}!
        </Text>
        <Text style={styles.subtitle}>
          {user?.user_type === 'therapist' 
            ? 'Aqui está um resumo da sua prática hoje.'
            : 'Vamos continuar sua jornada fonoaudiológica.'
          }
        </Text>
      </View>

      <View style={styles.statsContainer}>
        {user?.user_type === 'therapist' ? (
          <>
            <StatCard
              title="Total de Pacientes"
              value={stats.patients || 0}
              icon="people"
              color="#3b82f6"
            />
            <StatCard
              title="Exercícios Criados"
              value={stats.exercises}
              icon="book"
              color="#10b981"
            />
            <StatCard
              title="Consultas Agendadas"
              value={stats.appointments}
              icon="calendar"
              color="#f59e0b"
            />
            <StatCard
              title="Taxa de Adesão"
              value="87%"
              icon="trending-up"
              color="#8b5cf6"
            />
          </>
        ) : (
          <>
            <StatCard
              title="Exercícios Atribuídos"
              value={stats.exercises}
              icon="book"
              color="#3b82f6"
            />
            <StatCard
              title="Exercícios Concluídos"
              value={stats.completedExercises}
              icon="checkmark-circle"
              color="#10b981"
            />
            <StatCard
              title="Próxima Consulta"
              value={todayAppointments.length > 0 ? 'Hoje' : 'Em breve'}
              icon="calendar"
              color="#f59e0b"
            />
            <StatCard
              title="Pontos Ganhos"
              value="245"
              icon="trophy"
              color="#8b5cf6"
            />
          </>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Consultas de Hoje</Text>
        {todayAppointments.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={48} color="#ccc" />
            <Text style={styles.emptyStateText}>Nenhuma consulta agendada para hoje</Text>
          </View>
        ) : (
          <View style={styles.appointmentsList}>
            {todayAppointments.slice(0, 3).map((appointment) => (
              <View key={appointment.id} style={styles.appointmentCard}>
                <View style={styles.appointmentInfo}>
                  <Text style={styles.appointmentName}>
                    {user?.user_type === 'therapist' 
                      ? appointment.patient?.name 
                      : appointment.therapist?.name
                    }
                  </Text>
                  <Text style={styles.appointmentTime}>
                    {new Date(appointment.appointment_date).toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { 
                  backgroundColor: appointment.status === 'confirmado' ? '#10b981' : '#6b7280' 
                }]}>
                  <Text style={styles.statusText}>{appointment.status}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Atividade Recente</Text>
        <View style={styles.activityList}>
          {user?.user_type === 'therapist' ? (
            <>
              <View style={styles.activityItem}>
                <View style={[styles.activityIcon, { backgroundColor: '#10b981' }]}>
                  <Ionicons name="checkmark-circle" size={16} color="white" />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>Exercício concluído</Text>
                  <Text style={styles.activityDescription}>Maria Silva completou "Exercícios de Respiração"</Text>
                </View>
                <Text style={styles.activityTime}>2h atrás</Text>
              </View>

              <View style={styles.activityItem}>
                <View style={[styles.activityIcon, { backgroundColor: '#3b82f6' }]}>
                  <Ionicons name="person-add" size={16} color="white" />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>Novo paciente cadastrado</Text>
                  <Text style={styles.activityDescription}>João Santos foi adicionado à sua lista</Text>
                </View>
                <Text style={styles.activityTime}>1 dia atrás</Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.activityItem}>
                <View style={[styles.activityIcon, { backgroundColor: '#10b981' }]}>
                  <Ionicons name="checkmark-circle" size={16} color="white" />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>Exercício concluído</Text>
                  <Text style={styles.activityDescription}>Você completou "Exercícios de Articulação"</Text>
                </View>
                <Text style={styles.activityTime}>1h atrás</Text>
              </View>

              <View style={styles.activityItem}>
                <View style={[styles.activityIcon, { backgroundColor: '#8b5cf6' }]}>
                  <Ionicons name="trophy" size={16} color="white" />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>Conquista desbloqueada</Text>
                  <Text style={styles.activityDescription}>Você ganhou a medalha "Dedicação Semanal"</Text>
                </View>
                <Text style={styles.activityTime}>3 dias atrás</Text>
              </View>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'white',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statTitle: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  section: {
    margin: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
  },
  appointmentsList: {
    gap: 12,
  },
  appointmentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  appointmentTime: {
    fontSize: 14,
    color: '#6b7280',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  activityList: {
    gap: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 16,
  },
  activityTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
});

