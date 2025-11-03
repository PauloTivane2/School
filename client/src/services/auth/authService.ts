import api from '../api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface User {
  id: number;
  nome: string;
  nome_funcionario?: string;
  email: string;
  funcao: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

interface AuthResponse {
  success?: boolean;
  data?: LoginResponse;
  token?: string;
  user?: User;
}

const authService = {
  // Login
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      console.log('🔐 Enviando credenciais:', { email: credentials.email });
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      console.log('📥 Resposta do servidor:', response.data);

      if (response.data.success && response.data.data) {
        const { token, user } = response.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        console.log('✅ Login salvo no localStorage');
        return { token, user };
      } else if (response.data.token && response.data.user) {
        // Formato antigo
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return { token: response.data.token, user: response.data.user };
      }

      throw new Error('Resposta inválida do servidor');
    } catch (error: any) {
      console.error('❌ Erro no login:', error);
      console.error('❌ Resposta de erro:', error.response?.data);
      throw error;
    }
  },

  // Logout
  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  // Registrar novo usuário
  register: async (userData: any): Promise<any> => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Recuperar senha
  forgotPassword: async (email: string): Promise<any> => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Resetar senha
  resetPassword: async (token: string, newPassword: string): Promise<any> => {
    try {
      const response = await api.post('/auth/reset-password', {
        token,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Verificar se está autenticado
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  // Obter usuário atual
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Obter token
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  // Atualizar perfil do usuário
  updateProfile: async (userData: any): Promise<any> => {
    try {
      const response = await api.put('/auth/profile', userData);

      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Trocar senha
  changePassword: async (passwordData: any): Promise<any> => {
    try {
      const response = await api.put('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default authService;
