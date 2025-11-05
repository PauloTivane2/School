import React, { useState, Component } from 'react';
import { Users, DollarSign, Menu, Calendar, X, Home, UserCheck, Award, Settings, LogOut, UserCog, BookOpen, TrendingUp, Bell, MessageSquare, Download } from 'lucide-react';
import Dialog from './components/Dialog';

// Componentes
import GuardiansView from './components/encarregadosList';
import { PresencasPage } from './pages/presencas';
import GradesList from './components/notasList';
import TurmasList from './components/turmasList';
import FuncionariosMainPage from './pages/funcionarios/FuncionariosMainPage';
import StudentsView from './components/alunosList';
import PaymentsList from './components/pagamentosList';
import AgendaPage from './components/agendaList';

// Pages - Organizadas
import { LoginPage as Login } from './pages/login';
import { RecuperarSenhaPage as ForgotPassword } from './pages/recuperar-senha';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import { ProfessoresDashboardPage as ProfessoresDashboardList } from './pages/dashboard';
import EncarregadoDashboard from './pages/dashboard/EncarregadoDashboard';
import EncarregadoNotifications from './pages/encarregado/EncarregadoNotifications';
import EncarregadoReclamacoes from './pages/encarregado/EncarregadoReclamacoes';
import EncarregadoExportar from './pages/encarregado/EncarregadoExportar';
import { HorariosPage } from './pages/horarios';
import { ExamesPage } from './pages/exames';
import { RelatoriosPage } from './pages/relatorios';
import { PerfilPage } from './pages/perfil';
import { SettingsPage } from './pages/settings';
import { NotificationsPage } from './pages/notifications';

// Services
import authService from './services/auth';  


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

const AcademicSection = () => {
  const [tab, setTab] = useState<'turmas' | 'horarios' | 'presencas' | 'notas'>('turmas');
  const baseBtn = 'px-4 py-2 rounded-lg text-sm font-medium transition-colors';
  const active = 'bg-primary text-white';
  const inactive = 'bg-white border border-border-light text-text-primary hover:bg-accent';
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setTab('turmas')}
          className={`${baseBtn} ${tab === 'turmas' ? active : inactive}`}
        >
          Turmas
        </button>
        <button
          onClick={() => setTab('horarios')}
          className={`${baseBtn} ${tab === 'horarios' ? active : inactive}`}
        >
          Horários
        </button>
        <button
          onClick={() => setTab('presencas')}
          className={`${baseBtn} ${tab === 'presencas' ? active : inactive}`}
        >
          Presenças
        </button>
        <button
          onClick={() => setTab('notas')}
          className={`${baseBtn} ${tab === 'notas' ? active : inactive}`}
        >
          Notas
        </button>
      </div>
      <div>
        {tab === 'turmas' && <TurmasList />}
        {tab === 'horarios' && <HorariosPage />}
        {tab === 'presencas' && <PresencasPage />}
        {tab === 'notas' && <GradesList />}
      </div>
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState<{name: string, role: 'Admin' | 'Professor' | 'Encarregado' | 'Tesouraria'} | null>(null);
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
        { id: 'guardians', icon: UserCog, label: 'Encarregados' },
        { id: 'academico', icon: BookOpen, label: 'Académico' },
        { id: 'payments', icon: DollarSign, label: 'Financeiro' },
        { id: 'exames', icon: Award, label: 'Exames' },
        { id: 'reports', icon: TrendingUp, label: 'Relatórios' },
        { id: 'funcionarios', icon: Users, label: 'Funcionários' },
        { id: 'perfil', icon: Settings, label: 'Perfil' },
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
    } else if (user.role === 'Encarregado') {
      return [
        { id: 'dashboard', icon: Home, label: 'Meus Educandos' },
        { id: 'notifications', icon: Bell, label: 'Notificações' },
        { id: 'reclamacoes', icon: MessageSquare, label: 'Reclamações' },
        { id: 'exportar', icon: Download, label: 'Exportar Dados' },
        { id: 'perfil', icon: Settings, label: 'Perfil' },
      ];
    } else if (user.role === 'Tesouraria') {
      return [
        { id: 'dashboard', icon: Home, label: 'Dashboard' },
        { id: 'payments', icon: DollarSign, label: 'Financeiro' },
        { id: 'reports', icon: TrendingUp, label: 'Relatórios' },
        { id: 'perfil', icon: Settings, label: 'Perfil' },
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
        let role: 'Admin' | 'Professor' | 'Encarregado' | 'Tesouraria' = 'Professor';
        
        if (result.user.funcao === 'Admin' || result.user.funcao === 'Diretor' || result.user.funcao === 'Secretaria') {
          role = 'Admin';
        } else if (result.user.funcao === 'Encarregado') {
          role = 'Encarregado';
        } else if (result.user.funcao === 'Tesouraria') {
          role = 'Tesouraria';
        } else {
          role = 'Professor';
        }
        
        const userName = (result.user.nome || result.user.nome_funcionario || 'Usuário') as string;
        setUser({ 
          name: userName, 
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
      case 'dashboard': 
        if (user.role === 'Admin') return <AdminDashboard />;
        if (user.role === 'Encarregado') return <EncarregadoDashboard />;
        return <ProfessoresDashboardList />;
      case 'students': return <StudentsView />;
      case 'guardians': return <GuardiansView />;
      case 'classes': return <TurmasList />;
      case 'horarios': return <HorariosPage />;
      case 'payments': return <PaymentsList />;
      case 'attendance': return <PresencasPage />;
      case 'grades': return <GradesList />;
      case 'academico': return <AcademicSection />;
      case 'exames': return <ExamesPage />;
      case 'reports': return <RelatoriosPage />;
      case 'funcionarios': return <FuncionariosMainPage />;
      case 'perfil': return <PerfilPage />;
      case 'agenda': return <AgendaPage />;
      case 'settings': return <SettingsPage />;
      case 'notifications': 
        return user.role === 'Encarregado' ? <EncarregadoNotifications /> : <NotificationsPage />;
      case 'reclamacoes': return <EncarregadoReclamacoes />;
      case 'exportar': return <EncarregadoExportar />;
      default: 
        if (user.role === 'Admin') return <AdminDashboard />;
        if (user.role === 'Encarregado') return <EncarregadoDashboard />;
        return <ProfessoresDashboardList />;
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
                  onClick={() => setCurrentView('notifications')}
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
