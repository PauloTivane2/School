import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';
import RevenueChart from '../../components/dashboard/RevenueChart';
import RecentPayments from '../../components/dashboard/RecentPayments';
import dashboardService from '../../services/dashboard/dashboard.service';
import type { DashboardStats, RevenueData, RecentPayment } from '../../types/dashboard.types';

export default function TesourariaDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [recentPayments, setRecentPayments] = useState<RecentPayment[]>([]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, revenueResp, paymentsResp] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRevenueData(6),
        dashboardService.getRecentPayments(10)
      ]);
      setStats(statsData);
      setRevenueData(revenueResp);
      setRecentPayments(paymentsResp);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return { value: 0, isPositive: true };
    const change = ((current - previous) / previous) * 100;
    return { value: change, isPositive: change >= 0 };
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
        <p className="text-error font-medium">Erro ao carregar dados</p>
        <button onClick={handleRefresh} className="mt-4 px-4 py-2 bg-error text-white rounded-lg hover:bg-error-hover transition-colors">
          Tentar novamente
        </button>
      </div>
    );
  }

  const totalRecebido = recentPayments.filter(p => p.estado === 'pago').reduce((sum, p) => sum + p.valor, 0);
  const totalPendente = recentPayments.filter(p => p.estado === 'pendente').reduce((sum, p) => sum + p.valor, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Dashboard Financeiro</h1>
          <p className="text-neutral-gray mt-1">Visão geral das métricas financeiras (Tesouraria)</p>
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

      {/* Cards de Estatísticas Financeiras */}
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
          title="Taxa de Inadimplência"
          value={`${stats.percentagemInadimplencia.toFixed(1)}%`}
          subtitle="Percentagem de atraso"
          icon={AlertTriangle}
          trend={calculateTrend(stats.inadimplenciaAnterior, stats.percentagemInadimplencia)}
          iconColor="text-warning"
          iconBgColor="bg-warning-light"
        />

        <StatCard
          title="Recebido (Recente)"
          value={`${(totalRecebido / 1000).toFixed(1)}K MT`}
          subtitle={`${recentPayments.filter(p => p.estado === 'pago').length} pagamentos`}
          icon={CheckCircle}
          iconColor="text-success"
          iconBgColor="bg-success-light"
        />

        <StatCard
          title="Pendente (Recente)"
          value={`${(totalPendente / 1000).toFixed(1)}K MT`}
          subtitle={`${recentPayments.filter(p => p.estado === 'pendente').length} pendentes`}
          icon={TrendingUp}
          iconColor="text-warning"
          iconBgColor="bg-warning-light"
        />
      </div>

      {/* Gráfico de Receitas */}
      <RevenueChart data={revenueData} />

      {/* Pagamentos Recentes */}
      <RecentPayments payments={recentPayments} />

      {/* Ações Rápidas */}
      <div className="bg-white rounded-xl shadow-sm border border-border-light p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-border-light rounded-lg hover:border-primary transition-colors text-left">
            <DollarSign className="text-primary mb-2" size={24} />
            <h4 className="font-medium text-text-primary">Registrar Pagamento</h4>
            <p className="text-sm text-neutral-gray mt-1">Adicionar novo pagamento</p>
          </button>
          <button className="p-4 border border-border-light rounded-lg hover:border-primary transition-colors text-left">
            <AlertTriangle className="text-warning mb-2" size={24} />
            <h4 className="font-medium text-text-primary">Pendências</h4>
            <p className="text-sm text-neutral-gray mt-1">Ver pagamentos atrasados</p>
          </button>
          <button className="p-4 border border-border-light rounded-lg hover:border-primary transition-colors text-left">
            <TrendingUp className="text-success mb-2" size={24} />
            <h4 className="font-medium text-text-primary">Relatórios</h4>
            <p className="text-sm text-neutral-gray mt-1">Gerar relatório financeiro</p>
          </button>
        </div>
      </div>
    </div>
  );
}
