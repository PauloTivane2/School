import { useState } from 'react';

interface LoginProps {
  onLoginSuccess: (username: string, password: string) => void;
  onForgotPassword: () => void;
}

export default function Login({ onLoginSuccess, onForgotPassword }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Validação provisória: Username aceita palavras, senha mantém mínimo de 5 números
  const validarUsername = (val: string) => val.trim().length > 0;
  const validarPassword = (val: string) => /^\d{5,}$/.test(val);

  const handleLogin = () => {
    if (!validarUsername(username)) return alert('⚠️ Username não pode estar vazio.');
    if (!validarPassword(password)) return alert('⚠️ Senha deve ter no mínimo 5 números.');
    onLoginSuccess(username, password); // ✅ PASSA OS VALORES CORRETOS
  };

  return (
    <div className="fixed inset-0 bg-accent flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 border border-border-light">
        {/* Título */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
            <img
              src="https://cdn-icons-png.flaticon.com/512/29/29302.png"
              alt="Livro"
              className="w-12 h-12 brightness-0 invert"
            />
          </div>
          <h2 className="text-2xl font-semibold text-text-primary">
            Sistema de Gestão Escolar
          </h2>
          <p className="text-sm text-neutral-gray mt-2">Faça login para continuar</p>
        </div>

        {/* Campos */}
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-text-primary">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu usuário"
              className="input-field"
              aria-label="Nome de usuário"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-text-primary">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value.replace(/\D/g, ''))}
              placeholder="Mínimo 5 números"
              className="input-field"
              aria-label="Senha"
            />
          </div>

          {/* Botões */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => window.close()}
              className="btn-secondary flex-1"
              aria-label="Cancelar"
            >
              Cancelar
            </button>
            <button
              onClick={handleLogin}
              className="btn-primary flex-1"
              aria-label="Entrar"
            >
              Entrar
            </button>
          </div>

          {/* Recuperar senha */}
          <p className="mt-4 text-sm text-neutral-gray text-center">
            Esqueceu a senha?{' '}
            <button
              onClick={onForgotPassword}
              className="text-primary hover:text-primary-hover font-medium transition-all duration-150 underline"
              aria-label="Recuperar senha"
            >
              Clique aqui
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
