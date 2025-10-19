import React, { useState, Component } from 'react';
import { Users, DollarSign, Menu, Calendar, X, Home, UserCheck, Award, Settings, LogOut, UserCog, BookOpen, TrendingUp, Bell } from 'lucide-react';

// Componentes
import GuardiansView from './components/encarregados/encarregadosList';
import AttendanceList from './components/presencas/presencasList';
import GradesList from './components/notas/notasList';
import TurmasList from './components/turmas/turmasList';
import FuncionariosList from './components/funcionarios/funcionariosList';
import StudentsView from './components/alunos/alunosList';
import PaymentsList from './components/pagamentos/pagamentosList';
import AdminDashboard from './components/admin/AdminDashboard';
import ProfessoresDashboardList from './components/professores/professoresDashboardList';
import Login from './components/login/loginView';
import AgendaPage from './components/agendas/agendaList';  


// ErrorBoundary
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
  const [user, setUser] = useState<{name: string, role: 'Admin' | 'Professor'} | null>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications] = useState(3);

  // Menu dinâmico por role
  const getMenuItems = () => {
    if (!user) return [];
    if (user.role === 'Admin') {
      return [
        { id: 'dashboard', icon: Home, label: 'Dashboard' },
        { id: 'students', icon: Users, label: 'Alunos' },
        { id: 'payments', icon: DollarSign, label: 'Pagamentos' },
        { id: 'attendance', icon: UserCheck, label: 'Presenças' },
        { id: 'grades', icon: Award, label: 'Notas' },
        { id: 'guardians', icon: UserCog, label: 'Encarregados' },
        { id: 'classes', icon: BookOpen, label: 'Turmas' },
        { id: 'funcionarios', icon: TrendingUp, label: 'Funcionários' },
      ];
    } else if (user.role === 'Professor') {
      return [
        { id: 'dashboard', icon: Home, label: 'Dashboard' },
        { id: 'grades', icon: Award, label: 'Lançar Notas' },
        { id: 'attendance', icon: UserCheck, label: 'Marcar Presenças' },
        { id: 'reports', icon: BookOpen, label: 'Relatórios' },
        { id: 'agenda', icon: Calendar, label: 'Agenda' },
        { id: 'settings', icon: Settings, label: 'Configurações' },
      ];
    }
    return [];
  };

  const handleLoginSuccess = (username: string, password: string) => {
    // Credenciais simuladas
    if (username === 'Admin' && password === '12345') {
      setUser({ name: 'Administrador', role: 'Admin' });
    } else if (username === 'Professor' && password === '54321') {
      setUser({ name: 'Professor Teste', role: 'Professor' });
    } else {
      alert('Usuário ou senha inválidos!');
      return;
    }
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('dashboard');
  };

  const renderView = () => {
    if (!user) return null;

    switch(currentView) {
      case 'dashboard': return user.role === 'Admin' ? <AdminDashboard /> : <ProfessoresDashboardList />;
      case 'students': return <StudentsView />;
      case 'payments': return <PaymentsList />;
      case 'attendance': return <AttendanceList />;
      case 'grades': return <GradesList />;
      case 'classes': return <TurmasList />;
      case 'funcionarios': return <FuncionariosList />;
      case 'guardians': return <GuardiansView />;
      case 'reports': return <div>Relatórios (imprimir pautas, presenças)</div>;
      case 'agenda': return <AgendaPage />;
      case 'settings': return <div>Configurações (alterar senha, tema, idioma)</div>;
      default: return user.role === 'Admin' ? <AdminDashboard /> : <ProfessoresDashboardList />;
    }
  };

if (!user) {
  return (
    <Login
      onLoginSuccess={(username, password) => handleLoginSuccess(username, password)}
      onForgotPassword={() => alert('Recuperar senha')}
    />
  );
}


  const menuItems = getMenuItems();

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
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
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 hover:bg-blue-800 rounded transition"
            >
              <LogOut size={20} />
              {sidebarOpen && <span>Sair</span>}
            </button>
          </div>
        </div>

        {/* Main Content */}
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
