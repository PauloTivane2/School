import api from './api';

const authService = {
    // Login
    login: async(credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }

            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Logout
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    },

    // Registrar novo usuário
    register: async(userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Recuperar senha
    forgotPassword: async(email) => {
        try {
            const response = await api.post('/auth/forgot-password', { email });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Resetar senha
    resetPassword: async(token, newPassword) => {
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
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    // Obter usuário atual
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Obter token
    getToken: () => {
        return localStorage.getItem('token');
    },

    // Atualizar perfil do usuário
    updateProfile: async(userData) => {
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
    changePassword: async(passwordData) => {
        try {
            const response = await api.put('/auth/change-password', passwordData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default authService;