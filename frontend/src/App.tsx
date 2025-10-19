// frontend/src/App.tsx
import React, { Component, useEffect, useState } from 'react';
import {
  Users, DollarSign, Menu, X, Home, UserCheck, TrendingUp,
  Bell, Award, Settings, LogOut, UserCog, BookOpen
} from 'lucide-react';

// importa teus componentes (mantém os mesmos caminhos que já tens)
import GuardiansView from './components/encarregados/encarregadosList';
import AttendanceList from './components/presencas/presencasList';
import GradesList from './components/notas/notasList';
import TurmasList from './components/turmas/turmasList';
import FuncionariosList from './components/funcionarios/funcionariosList';
import StudentsView from './components/alunos/alunosList';
import PaymentsList from './components/pagamentos/pagamentosList';
import AdminDashboard from './components/admin/AdminDashboard';

interface DashboardStats {
  totalStudents: number;
  monthlyRevenue: number;
  attendanceRate: number;
  averageGrade: number;
}

interface Payment {
  id: number;
  student: string;
  amount: number;
  date: string;
  method: string;
  status: string;
}

interface Attendance {
  id: number;
  class: string;
  date: string;
  present: number;
  absent: number;
  total: number;
}

/* --- Error Boundary to avoid blank page --- */
class ErrorBoundary extends Component<{children: React.ReactNode}, {hasError: boolean, error?: any}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: undefined };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, info: any) {
    console.error('ErrorBoundary caught', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6">
          <h2 className="text-xl font-bold text-red-600">Erro na aplicação</h2>
          <pre className="whitespace-pre-wrap mt-4 text-sm text-gray-700">{String(this.state.error)}</pre>
          <p className="mt-4 text-sm text-gray-600">Verifica o console para mais detalhes.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const App = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications] = useState(3);
  const [user] = useState({ name: 'Administrador', role: 'Admin' });

  const [payments, setPayments] = useState<Payment[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalStudents: 0,
    monthlyRevenue: 0,
    attendanceRate: 0,
    averageGrade: 0
  });

  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  useEffect(() => {
    const apiBase = 'http://localhost:3000';

    async function loadAll() {
      setLoadingDashboard(true);
      setDashboardError(null);

      // dashboard-stats
      try {
        const res = await fetch(`${apiBase}/dashboard-stats`);
        if (!res.ok) throw new Error(`dashboard-stats: ${res.status}`);
        const data = await res.json();
        setDashboardStats(data || {
          totalStudents: 0, monthlyRevenue: 0, attendanceRate: 0, averageGrade: 0
        });
      } catch (err: any) {
        console.error('Erro ao carregar dashboard-stats', err);
        setDashboardError('Erro ao carregar estatísticas do dashboard. Ver console.');
      }

      // payments (safe)
      try {
        const res = await fetch(`${apiBase}/payments`);
        if (!res.ok) throw new Error(`/payments: ${res.status}`);
        const data = await res.json();
        setPayments(Array.isArray(data) ? data.slice(0, 50) : []);
      } catch (err) {
        console.warn('fetch /payments falhou, tentando /api/payments', err);
        // fallback para /api/payments se existir
        try {
          const res2 = await fetch(`${apiBase}/api/payments`);
          if (!res2.ok) throw new Error(`/api/payments: ${res2.status}`);
          const data2 = await res2.json();
          setPayments(Array.isArray(data2) ? data2.slice(0, 50) : []);
        } catch (err2) {
          console.error('Erro ao carregar payments', err2);
        }
      }

      // attendance
      try {
        const res = await fetch(`${apiBase}/attendance`);
        if (!res.ok) throw new Error(`/attendance: ${res.status}`);
        const data = await res.json();
        setAttendance(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Erro ao carregar attendance', err);
      }

      setLoadingDashboard(false);
    }

    loadAll();
  }, []);

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'students', icon: Users, label: 'Alunos' },
    { id: 'payments', icon: DollarSign, label: 'Pagamentos' },
    { id: 'attendance', icon: UserCheck, label: 'Presenças' },
    { id: 'grades', icon: Award, label: 'Notas' },
    { id: 'guardians', icon: UserCog, label: 'Encarregados' },
    { id: 'classes', icon: BookOpen, label: 'Turmas' },
    { id: 'funcionarios', icon: TrendingUp, label: 'Funcionários' },
  ];

  const DashboardView = () => (
    <div className="space-y-6">
      {loadingDashboard && <div className="p-6 text-center">Carregando dashboard...</div>}
      {dashboardError && <div className="p-4 bg-red-50 text-red-700 rounded">{dashboardError}</div>}

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total de Alunos</p>
              <p className="text-3xl font-bold text-gray-800">{dashboardStats.totalStudents}</p>
            </div>
            <Users className="text-blue-500" size={40} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Receita Mensal</p>
              <p className="text-3xl font-bold text-gray-800">{dashboardStats.monthlyRevenue} MT</p>
            </div>
            <DollarSign className="text-green-500" size={40} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Taxa de Presença</p>
              <p className="text-3xl font-bold text-gray-800">{dashboardStats.attendanceRate}%</p>
            </div>
            <UserCheck className="text-yellow-500" size={40} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Média Geral</p>
              <p className="text-3xl font-bold text-gray-800">{dashboardStats.averageGrade}</p>
            </div>
            <Award className="text-purple-500" size={40} />
          </div>
        </div>
      </div>

      {/* Recentes / Presenças */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-4 text-gray-800">Pagamentos Recentes</h3>
          <div className="space-y-3">
            {payments.slice(0, 5).map(payment => (
              <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-semibold text-gray-800">{payment.student}</p>
                  <p className="text-sm text-gray-500">{payment.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">{payment.amount} MT</p>
                  <span className={`text-xs px-2 py-1 rounded ${payment.status === 'Confirmado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {payment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-4 text-gray-800">Presenças Hoje</h3>
          <div className="space-y-3">
            {attendance.map(record => (
              <div key={record.id} className="p-3 bg-gray-50 rounded">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-800">{record.class}</p>
                  <p className="text-sm text-gray-500">{record.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(record.present / (record.total || 1)) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {record.present}/{record.total}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderView = () => {
    switch(currentView) {
      case 'dashboard': return <AdminDashboard />;
      case 'students': return <StudentsView />;
      case 'payments': return <PaymentsList />;
      case 'attendance': return <AttendanceList />;
      case 'grades': return <GradesList />;
      case 'classes': return <TurmasList />;
      case 'funcionarios': return <FuncionariosList />;
      case 'guardians': return <GuardiansView />;
      case 'settings': return <div className="bg-white p-8 rounded-lg shadow-md text-center"><Settings size={48} className="mx-auto mb-4 text-gray-400" /><p className="text-gray-600">Configurações do Sistema</p></div>;
      default: return <DashboardView />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-gray-100">
        <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-blue-900 text-white transition-all duration-300 flex flex-col`}>
          <div className="p-4 flex items-center justify-between border-b border-blue-800">
            {sidebarOpen && <h1 className="text-xl font-bold">SGE</h1>}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-blue-800 rounded">
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          <nav className="flex-1 p-4">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded mb-2 transition ${currentView === item.id ? 'bg-blue-800' : 'hover:bg-blue-800'}`}
              >
                <item.icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-blue-800">
            <button className="w-full flex items-center gap-3 p-3 hover:bg-blue-800 rounded transition">
              <LogOut size={20} />
              {sidebarOpen && <span>Sair</span>}
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{menuItems.find(item => item.id === currentView)?.label || 'Dashboard'}</h2>
                <p className="text-sm text-gray-500">Sistema de Gestão Escolar</p>
              </div>
              <div className="flex items-center gap-4">
                <button className="relative p-2 hover:bg-gray-100 rounded-full transition">
                  <Bell size={20} />
                  {notifications > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </button>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {user.name.charAt(0)}
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6">
            {renderView()}
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;

