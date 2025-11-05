/**
 * Admin Dashboard - Visão Geral Consolidada
 * Dashboard principal com todos os indicadores operacionais
 */

import { useState, useEffect } from 'react';
import { DollarSign, AlertTriangle, UserX, Award, RefreshCw } from 'lucide-react';

// Components
import StatCard from '../../components/dashboard/StatCard';
import RevenueChart from '../../components/dashboard/RevenueChart';
import AttendanceChart from '../../components/dashboard/AttendanceChart';
import RecentPayments from '../../components/dashboard/RecentPayments';
import RecentEvents from '../../components/dashboard/RecentEvents';

// Service
import dashboardService from '../../services/dashboard/dashboard.service';

// Types
import type {
  DashboardStats,
  RevenueData,
  AttendanceData,
  RecentPayment,
  RecentEvent
} from '../../types/dashboard.types';

export function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Estado dos dados
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [recentPayments, setRecentPayments] = useState<RecentPayment[]>([]);
  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);

  // Carregar dados
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [
        statsData,
        revenueResp,
        attendanceResp,
        paymentsResp,
        eventsResp
      ] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRevenueData(6),
        dashboardService.getAttendanceData(),
        dashboardService.getRecentPayments(5),
        dashboardService.getRecentEvents(5)
      ]);

      setStats(statsData);
      setRevenueData(revenueResp);
      setAttendanceData(attendanceResp);
      setRecentPayments(paymentsResp);
      setRecentEvents(eventsResp);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return { value: 0, isPositive: true };
    const change = ((current - previous) / previous) * 100;
    return {
      value: change,
      isPositive: change >= 0
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto mb-4 text-primary" size={48} />
          <p className="text-neutral-gray">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-error-light border border-error rounded-xl p-6 text-center">
        <p className="text-error font-medium">Erro ao carregar dados do dashboard</p>
        <button
          onClick={handleRefresh}
          className="mt-4 px-4 py-2 bg-error text-white rounded-lg hover:bg-error-hover transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com botão de refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-neutral-gray mt-1">Visão geral dos indicadores operacionais</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-border-light rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          <span className="text-sm font-medium">Atualizar</span>
        </button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Receitas do Mês"
          value={`${(stats.receitaMesAtual / 1000).toFixed(0)}K MT`}
          subtitle={`${stats.receitaMesAtual.toLocaleString('pt-PT')} MT`}
          icon={DollarSign}
          trend={calculateTrend(stats.receitaMesAtual, stats.receitaMesAnterior)}
          iconColor="text-success"
          iconBgColor="bg-success-light"
        />

        <StatCard
          title="Inadimplência"
          value={`${stats.percentagemInadimplencia.toFixed(1)}%`}
          subtitle="Percentagem de atraso"
          icon={AlertTriangle}
          trend={calculateTrend(stats.inadimplenciaAnterior, stats.percentagemInadimplencia)}
          iconColor="text-warning"
          iconBgColor="bg-warning-light"
        />

        <StatCard
          title="Faltas Hoje"
          value={stats.faltasHoje.total}
          subtitle={`${stats.faltasHoje.porTurma.length} turmas afetadas`}
          icon={UserX}
          iconColor="text-error"
          iconBgColor="bg-error-light"
        />

        <StatCard
          title="Candidatos a Exames"
          value={stats.candidatosExames}
          subtitle="Alunos inscritos"
          icon={Award}
          trend={calculateTrend(stats.candidatosExames, stats.candidatosAnterior)}
          iconColor="text-primary"
          iconBgColor="bg-primary/10"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={revenueData} />
        <AttendanceChart data={attendanceData} />
      </div>

      {/* Faltas por Turma */}
      {stats.faltasHoje.porTurma.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-border-light p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Faltas por Turma (Hoje)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.faltasHoje.porTurma.map((item, index) => (
              <div
                key={index}
                className="p-4 bg-accent rounded-lg border border-border-light hover:border-primary transition-colors"
              >
                <p className="text-sm text-neutral-gray">Turma {item.turma}</p>
                <p className="text-2xl font-bold text-text-primary mt-1">{item.faltas}</p>
                <p className="text-xs text-neutral-gray mt-1">alunos ausentes</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Listas: Pagamentos e Eventos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentPayments payments={recentPayments} />
        <RecentEvents events={recentEvents} />
      </div>
    </div>
  );
}

export default AdminDashboardPage;
