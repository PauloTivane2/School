import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import authService from '../../services/auth/authService';

export type Role = 'Admin' | 'Tesouraria' | 'Professor' | 'Encarregado';

export interface AuthUser {
  id: number;
  nome?: string;
  nome_funcionario?: string;
  email: string;
  funcao: string;
  role?: Role;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  hasPermission: (allowedRoles: Role[]) => boolean;
  hasAccess: (page: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = authService.getToken();
    const currentUser = authService.getCurrentUser() as AuthUser | null;
    if (token && currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await authService.login({ email, password });
      setUser(res.user as AuthUser);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error?.response?.data?.error?.message || 'Falha no login' };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // Normalizar role do usuário
  const getUserRole = (authUser: AuthUser): Role | null => {
    const v = (authUser.role || authUser.funcao || '').toLowerCase();
    if (['admin', 'diretor', 'director'].includes(v)) return 'Admin';
    if (['tesouraria', 'tesoureiro', 'financeiro'].includes(v)) return 'Tesouraria';
    if (['professor', 'docente'].includes(v)) return 'Professor';
    if (['encarregado', 'guardiao', 'guardian'].includes(v)) return 'Encarregado';
    return null;
  };

  // Helper para verificar se usuário tem permissão baseado em roles
  const hasPermission = (allowedRoles: Role[]): boolean => {
    if (!user) return false;
    const userRole = getUserRole(user);
    return userRole ? allowedRoles.includes(userRole) : false;
  };

  // Mapa de páginas por perfil (RN01, RN04)
  // ADMIN: Acesso total a todas as funcionalidades
  // TESOURARIA: Apenas módulo financeiro + consultas
  // PROFESSOR: Apenas pedagógico (suas turmas)
  // ENCARREGADO: Apenas visualização dos seus educandos
  const pagePermissions: Record<string, Role[]> = {
    // Dashboards
    '/admin': ['Admin'],
    '/dashboard': ['Admin', 'Tesouraria', 'Professor', 'Encarregado'],
    '/professor': ['Admin', 'Professor'],
    '/financeiro': ['Admin', 'Tesouraria'],
    '/encarregado': ['Admin', 'Encarregado'],
    
    // Gestão Acadêmica
    '/alunos': ['Admin', 'Tesouraria', 'Professor', 'Encarregado'], // View filtrado por role
    '/encarregados': ['Admin', 'Tesouraria'], // Tesouraria: apenas consulta de contactos
    '/funcionarios': ['Admin'], // BLOQUEADO para todos exceto Admin
    '/turmas': ['Admin', 'Professor'], // Professor: apenas suas turmas
    '/horarios': ['Admin', 'Professor'], // Professor: consulta
    
    // Gestão Pedagógica
    '/presencas': ['Admin', 'Professor', 'Encarregado'], // Professor: criar; Encarregado: view
    '/notas': ['Admin', 'Professor', 'Encarregado'], // Professor: criar; Encarregado: view
    '/exames': ['Admin', 'Encarregado'], // Admin: gestão; Encarregado: view (BLOQUEADO para Professor e Tesouraria)
    
    // Gestão Financeira
    '/pagamentos': ['Admin', 'Tesouraria', 'Encarregado'], // Encarregado: view apenas suas mensalidades
    
    // Relatórios
    '/relatorios': ['Admin', 'Tesouraria', 'Professor'], // Filtrado por perfil
    
    // Sistema
    '/settings': ['Admin'], // BLOQUEADO para todos exceto Admin
    '/perfil': ['Admin', 'Tesouraria', 'Professor', 'Encarregado'],
    '/notificacoes': ['Admin', 'Tesouraria', 'Professor', 'Encarregado'],
  };

  // Helper para verificar acesso a uma página específica
  const hasAccess = (page: string): boolean => {
    const allowedRoles = pagePermissions[page];
    return allowedRoles ? hasPermission(allowedRoles) : false;
  };

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    hasPermission,
    hasAccess,
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
