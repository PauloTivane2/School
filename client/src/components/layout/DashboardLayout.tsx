import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, Role } from '@/context/auth/AuthContext';
import {
  Menu,
  X,
  Home,
  Users,
  UserCog,
  BookOpen,
  DollarSign,
  Award,
  TrendingUp,
  Settings,
  LogOut,
  Bell,
  UserCheck,
  Calendar,
  FileText,
  MessageSquare,
  Download,
} from 'lucide-react';

interface MenuItem {
  id: string;
  path: string;
  icon: any;
  label: string;
  roles: Role[];
}

const menuItems: MenuItem[] = [
  // Admin menu
  { id: 'admin', path: '/admin', icon: Home, label: 'Dashboard', roles: ['Admin'] },
  { id: 'alunos', path: '/alunos', icon: Users, label: 'Alunos', roles: ['Admin', 'Professor', 'Tesouraria'] },
  { id: 'encarregados', path: '/encarregados', icon: UserCog, label: 'Encarregados', roles: ['Admin', 'Tesouraria'] },
  { id: 'funcionarios', path: '/funcionarios', icon: Users, label: 'Funcionários', roles: ['Admin'] },
  { id: 'turmas', path: '/turmas', icon: BookOpen, label: 'Turmas', roles: ['Admin', 'Professor'] },
  { id: 'horarios', path: '/horarios', icon: Calendar, label: 'Horários', roles: ['Admin', 'Professor'] },
  { id: 'presencas', path: '/presencas', icon: UserCheck, label: 'Presenças', roles: ['Admin', 'Professor'] },
  { id: 'notas', path: '/notas', icon: Award, label: 'Notas', roles: ['Admin', 'Professor'] },
  { id: 'exames', path: '/exames', icon: FileText, label: 'Exames', roles: ['Admin'] },
  { id: 'pagamentos', path: '/financeiro/pagamentos', icon: DollarSign, label: 'Pagamentos', roles: ['Admin', 'Tesouraria'] },
  { id: 'relatorios', path: '/relatorios', icon: TrendingUp, label: 'Relatórios', roles: ['Admin', 'Professor', 'Tesouraria'] },
  { id: 'settings', path: '/settings', icon: Settings, label: 'Configurações', roles: ['Admin'] },
  
  // Tesouraria menu
  { id: 'financeiro', path: '/financeiro', icon: Home, label: 'Dashboard', roles: ['Tesouraria'] },
  
  // Professor menu
  { id: 'professor', path: '/professor', icon: Home, label: 'Dashboard', roles: ['Professor'] },
  
  // Encarregado menu
  { id: 'encarregado', path: '/encarregado', icon: Home, label: 'Meus Educandos', roles: ['Encarregado'] },
  { id: 'notificacoes', path: '/encarregado/notificacoes', icon: Bell, label: 'Notificações', roles: ['Encarregado'] },
  { id: 'reclamacoes', path: '/encarregado/reclamacoes', icon: MessageSquare, label: 'Reclamações', roles: ['Encarregado'] },
  { id: 'exportar', path: '/encarregado/exportar', icon: Download, label: 'Exportar Dados', roles: ['Encarregado'] },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // Get user role
  const getUserRole = (): Role | null => {
    if (!user) return null;
    const v = (user.role || user.funcao || '').toLowerCase();
    if (['admin', 'diretor', 'director'].includes(v)) return 'Admin';
    if (['tesouraria', 'tesoureiro', 'financeiro'].includes(v)) return 'Tesouraria';
    if (['professor', 'docente'].includes(v)) return 'Professor';
    if (['encarregado', 'guardiao', 'guardian'].includes(v)) return 'Encarregado';
    return null;
  };

  const userRole = getUserRole();

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter((item) => {
    if (!userRole) return false;
    return item.roles.includes(userRole);
  });

  // Get current page title
  const getCurrentPageTitle = () => {
    const currentItem = filteredMenuItems.find((item) => item.path === location.pathname);
    return currentItem?.label || 'Sistema de Gestão Escolar';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="flex h-screen bg-neutral-light">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-primary text-white transition-all duration-300 flex flex-col shadow-lg`}
      >
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

        <nav className="flex-1 p-4 overflow-y-auto">
          {filteredMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg mb-2 transition-all duration-150 ${
                  isActive ? 'bg-primary-hover' : 'hover:bg-primary-hover/80'
                }`}
                aria-label={item.label}
              >
                <item.icon size={20} />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            );
          })}
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
              <h2 className="text-2xl font-semibold text-text-primary">{getCurrentPageTitle()}</h2>
              <p className="text-sm text-neutral-gray mt-1">Sistema de Gestão Escolar</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/notificacoes')}
                className="relative p-2 hover:bg-accent rounded-lg transition-all duration-150"
                aria-label="Notificações"
              >
                <Bell size={20} className="text-neutral-gray" />
              </button>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-medium text-text-primary text-sm">
                    {user?.nome || user?.nome_funcionario || 'Usuário'}
                  </p>
                  <p className="text-xs text-neutral-gray">{userRole}</p>
                </div>
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                  {(user?.nome || user?.nome_funcionario || 'U').charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-neutral-light p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
