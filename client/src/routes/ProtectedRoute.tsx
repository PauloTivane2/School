import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/auth/AuthContext';
import type { Role } from '@/context/auth/AuthContext';

interface ProtectedRouteProps {
  children: JSX.Element;
  allowed: Role[];
}

export default function ProtectedRoute({ children, allowed }: ProtectedRouteProps) {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  const role = (() => {
    const v = (user.role || user.funcao || '').toLowerCase();
    if (["admin", "diretor", "director"].includes(v)) return 'Admin';
    if (["tesouraria", "tesoureiro", "financeiro"].includes(v)) return 'Tesouraria';
    if (["professor", "docente"].includes(v)) return 'Professor';
    if (["encarregado", "guardiao", "guardian"].includes(v)) return 'Encarregado';
    return undefined;
  })();

  if (!role || !allowed.includes(role as Role)) return <Navigate to="/login" replace />;
  return children;
}
