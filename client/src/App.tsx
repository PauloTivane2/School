import React, { useState, Component } from 'react';
import { Users, DollarSign, Menu, Calendar, X, Home, UserCheck, Award, Settings, LogOut, UserCog, BookOpen, TrendingUp, Bell } from 'lucide-react';
import Dialog from './components/Dialog';
import ForgotPassword from './pages/ForgotPasswordView';

// Componentes
import GuardiansView from './components/encarregadosList';
import AttendanceList from './components/presencasList';
import GradesList from './components/notasList';
import TurmasList from './components/turmasList';
import FuncionariosList from './components/funcionariosList';
import StudentsView from './components/alunosList';
import PaymentsList from './components/pagamentosList';
import AgendaPage from './components/agendaList';

// Pages
import AdminDashboard from './pages/AdminDashboard';
import ProfessoresDashboardList from './pages/professoresDashboardList';
import Login from './pages/loginView';

// Services
import authService from './services/authService';  


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
          <h2 className="text-xl font-bold text-error">Erro na aplicação</h2>
          <pre className="whitespace-pre-wrap mt-4 text-sm text-text-secondary">{String(this.state.error)}</pre>
          <p className="mt-4 text-sm text-neutral-gray">Verifique o console para mais detalhes.</p>
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
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [dialog, setDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'error' | 'success' | 'info' | 'warning';
  }>({ isOpen: false, title: '', message: '', type: 'info' });

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

  const showDialog = (title: string, message: string, type: 'error' | 'success' | 'info' | 'warning' = 'info') => {
    setDialog({ isOpen: true, title, message, type });
  };

  const closeDialog = () => {
    setDialog({ ...dialog, isOpen: false });
  };

  const handleLoginSuccess = async (email: string, password: string) => {
    try {
      const result = await authService.login({ email, password });
      
      if (result.token && result.user) {
        // Mapear a função do usuário para o role esperado
        const role = (result.user.funcao === 'Admin' || result.user.funcao === 'Diretor') ? 'Admin' : 'Professor';
        setUser({ 
          name: result.user.nome || result.user.nome_funcionario, 
          role 
        });
        setCurrentView('dashboard');
        console.log('✅ Usuário logado:', { nome: result.user.nome, funcao: result.user.funcao, role });
      } else {
        showDialog('Erro de Autenticação', 'Não foi possível fazer login. Tente novamente.', 'error');
      }
    } catch (error: any) {
      console.error('Erro no login:', error);
      const errorMessage = error?.response?.data?.error?.message || 'Credenciais inválidas. Verifique seu email e senha.';
      showDialog('Erro de Autenticação', errorMessage, 'error');
      throw error; // Re-throw para o loginView parar o loading
    }
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
  if (showForgotPassword) {
    return <ForgotPassword onBack={() => setShowForgotPassword(false)} />;
  }

  return (
    <>
      <Dialog
        isOpen={dialog.isOpen}
        onClose={closeDialog}
        title={dialog.title}
        message={dialog.message}
        type={dialog.type}
      />
      <Login
        onLoginSuccess={(username, password) => handleLoginSuccess(username, password)}
        onForgotPassword={() => setShowForgotPassword(true)}
      />
    </>
  );
}


  const menuItems = getMenuItems();

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-neutral-light">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-primary text-white transition-all duration-300 flex flex-col shadow-lg`}>
          <div className="p-4 flex items-center justify-between border-b border-primary-hover">
            {sidebarOpen && <h1 className="text-xl font-bold">SGE</h1>}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="p-2 hover:bg-primary-hover rounded transition-all duration-150"
              aria-label={sidebarOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          <nav className="flex-1 p-4">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg mb-2 transition-all duration-150 ${currentView === item.id ? 'bg-primary-hover' : 'hover:bg-primary-hover/80'}`}
                aria-label={item.label}
              >
                <item.icon size={20} />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-primary-hover">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 hover:bg-primary-hover rounded-lg transition-all duration-150"
              aria-label="Sair"
            >
              <LogOut size={20} />
              {sidebarOpen && <span className="text-sm font-medium">Sair</span>}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white shadow-sm border-b border-border-light">
            <div className="flex items-center justify-between px-6 py-4">
              <div>
                <h2 className="text-2xl font-semibold text-text-primary">{menuItems.find(item => item.id === currentView)?.label || 'Dashboard'}</h2>
                <p className="text-sm text-neutral-gray mt-1">Sistema de Gestão Escolar</p>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  className="relative p-2 hover:bg-accent rounded-lg transition-all duration-150"
                  aria-label="Notificações"
                >
                  <Bell size={20} className="text-neutral-gray" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-error text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                      {notifications}
                    </span>
                  )}
                </button>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-medium text-text-primary text-sm">{user.name}</p>
                    <p className="text-xs text-neutral-gray">{user.role}</p>
                  </div>
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                    {user.name.charAt(0)}
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto bg-neutral-light p-6">
            <div className="max-w-7xl mx-auto">
              {renderView()}
            </div>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;
