import { useState } from 'react';
import { ArrowLeft, Mail, Lock, CheckCircle } from 'lucide-react';
import Dialog from '../components/Dialog';
import api from '../services/api';

interface ForgotPasswordProps {
  onBack: () => void;
}

type Step = 'request' | 'reset' | 'success';

export default function ForgotPassword({ onBack }: ForgotPasswordProps) {
  const [step, setStep] = useState<Step>('request');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dialog, setDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'error' | 'success' | 'info' | 'warning';
  }>({ isOpen: false, title: '', message: '', type: 'info' });

  const showDialog = (title: string, message: string, type: 'error' | 'success' | 'info' | 'warning' = 'info') => {
    setDialog({ isOpen: true, title, message, type });
  };

  const closeDialog = () => {
    setDialog({ ...dialog, isOpen: false });
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      showDialog('Email Obrigatório', 'Por favor, insira seu email.', 'warning');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showDialog('Email Inválido', 'Por favor, insira um email válido.', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/auth/forgot-password', { email });
      
      if (response.data.success && response.data.data?.token) {
        // Em desenvolvimento, mostrar o token
        setToken(response.data.data.token);
        setStep('reset');
        showDialog(
          'Token Gerado', 
          `Token de recuperação: ${response.data.data.token}\n\nEm produção, este token seria enviado por email.`, 
          'info'
        );
      } else {
        showDialog(
          'Solicitação Enviada',
          'Se o email existir em nosso sistema, você receberá instruções para recuperar sua senha.',
          'success'
        );
      }
    } catch (error: any) {
      console.error('Erro ao solicitar recuperação:', error);
      showDialog(
        'Erro',
        error.response?.data?.error?.message || 'Erro ao processar solicitação',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      showDialog('Token Obrigatório', 'Por favor, insira o token de recuperação.', 'warning');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      showDialog('Senha Inválida', 'A senha deve ter no mínimo 6 caracteres.', 'warning');
      return;
    }

    if (newPassword !== confirmPassword) {
      showDialog('Senhas Diferentes', 'As senhas não coincidem.', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/auth/reset-password', {
        token,
        newPassword
      });

      if (response.data.success) {
        setStep('success');
      } else {
        showDialog(
          'Erro',
          response.data.error?.message || 'Erro ao resetar senha',
          'error'
        );
      }
    } catch (error: any) {
      console.error('Erro ao resetar senha:', error);
      showDialog(
        'Erro',
        error.response?.data?.error?.message || 'Erro ao resetar senha',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog
        isOpen={dialog.isOpen}
        onClose={closeDialog}
        title={dialog.title}
        message={dialog.message}
        type={dialog.type}
      />

      <div className="fixed inset-0 bg-accent flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 border border-border-light">
          {/* Botão Voltar */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-neutral-gray hover:text-primary transition-all duration-150 mb-6"
          >
            <ArrowLeft size={20} />
            <span>Voltar ao login</span>
          </button>

          {/* Step 1: Solicitar Recuperação */}
          {step === 'request' && (
            <>
              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-text-primary">
                  Recuperar Senha
                </h2>
                <p className="text-sm text-neutral-gray mt-2">
                  Insira seu email para receber instruções
                </p>
              </div>

              <form onSubmit={handleRequestReset} className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-text-primary">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.email@escola.com"
                    className="input-field"
                    disabled={isLoading}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? 'Enviando...' : 'Enviar Instruções'}
                </button>
              </form>
            </>
          )}

          {/* Step 2: Resetar Senha */}
          {step === 'reset' && (
            <>
              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-text-primary">
                  Nova Senha
                </h2>
                <p className="text-sm text-neutral-gray mt-2">
                  Insira o token e sua nova senha
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-text-primary">
                    Token de Recuperação
                  </label>
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Cole o token aqui"
                    className="input-field font-mono text-sm"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-text-primary">
                    Nova Senha
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="input-field"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-text-primary">
                    Confirmar Senha
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Digite a senha novamente"
                    className="input-field"
                    disabled={isLoading}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? 'Alterando...' : 'Alterar Senha'}
                </button>
              </form>
            </>
          )}

          {/* Step 3: Sucesso */}
          {step === 'success' && (
            <>
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-success flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-text-primary mb-4">
                  Senha Alterada!
                </h2>
                <p className="text-neutral-gray mb-6">
                  Sua senha foi alterada com sucesso. Você já pode fazer login com a nova senha.
                </p>
                <button
                  onClick={onBack}
                  className="btn-primary w-full"
                >
                  Voltar ao Login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
