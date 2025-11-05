import { useNavigate } from 'react-router-dom';
import Login from './LoginPage';
import { useAuth } from '../../context/auth/AuthContext';

export default function LoginContainer() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const onLoginSuccess = async (email: string, password: string) => {
    const res = await login(email, password);
    if (!res.success) throw new Error(res.error || 'Erro ao entrar');
    // redireciona conforme role
    const stored = localStorage.getItem('user');
    const user = stored ? JSON.parse(stored) : null;
    const v = (user?.funcao || '').toLowerCase();
    if (["admin", "diretor", "director"].includes(v)) return navigate('/admin', { replace: true });
    if (["tesouraria", "tesoureiro", "financeiro"].includes(v)) return navigate('/financeiro', { replace: true });
    if (["professor", "docente"].includes(v)) return navigate('/professor', { replace: true });
    if (["encarregado", "guardiao", "guardian"].includes(v)) return navigate('/encarregado', { replace: true });
    navigate('/login', { replace: true });
  };

  return (
    <Login onLoginSuccess={onLoginSuccess} onForgotPassword={() => navigate('/login')} />
  );
}
