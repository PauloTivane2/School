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
    <div className="fixed inset-0 bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-4 relative flex flex-col items-center">
        {/* Título dentro da borda */}
        <h2 className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-yellow-200 px-4 py-0.5 rounded-full text-lg font-bold text-yellow-700 shadow-inner">
          Gestão Escolar
        </h2>

        {/* Círculo com ícone maior */}
        <div className="w-24 h-24 rounded-full bg-yellow-200 flex items-center justify-center mt-10 mb-4 shadow-inner">
          <img
            src="https://cdn-icons-png.flaticon.com/512/29/29302.png"
            alt="Livro"
            className="w-16 h-16"
          />
        </div>

        {/* Campos */}
        <div className="w-full space-y-3 mt-2">
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu usuário"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value.replace(/\D/g, ''))}
              placeholder="min. 5 números"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            />
          </div>

          {/* Botões */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => window.close()}
              className="flex-1 px-3 py-2 bg-red-400 hover:bg-red-500 text-white rounded-lg font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleLogin}
              className="flex-1 px-3 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 font-medium"
            >
              Entrar
            </button>
          </div>

          {/* Recuperar senha */}
          <p className="mt-3 text-sm text-gray-600 text-center">
            Esqueceu-se da senha?{' '}
            <span
              onClick={onForgotPassword}
              className="text-yellow-700 cursor-pointer hover:underline font-medium"
            >
              Recupere aqui...
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
