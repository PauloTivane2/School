// frontend/src/components/login/Login.tsx
import { useState } from 'react';

interface LoginProps {
  onLoginSuccess: () => void;
  onForgotPassword: () => void;
}

export default function Login({ onLoginSuccess, onForgotPassword }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const validarUsername = (val: string) => /^\d{4,6}$/.test(val);
  const validarPassword = (val: string) => /^\d{5,}$/.test(val);

  const handleLogin = () => {
    if (!validarUsername(username)) return alert('⚠️ Username deve ter entre 4-6 números.');
    if (!validarPassword(password)) return alert('⚠️ Senha deve ter no mínimo 5 números.');
    onLoginSuccess();
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative flex flex-col items-center">
        {/* Título acima da borda */}
        <h2 className="absolute -top-6 bg-white px-4 py-1 rounded-full text-xl font-bold text-yellow-700 shadow">
          Gestão Escolar
        </h2>

        {/* Círculo com ícone */}
        <div className="w-20 h-20 rounded-full bg-yellow-200 flex items-center justify-center mb-6 mt-6 shadow-inner">
          <img
            src="https://cdn-icons-png.flaticon.com/512/29/29302.png"
            alt="Livro"
            className="w-12 h-12"
          />
        </div>

        {/* Campos */}
        <div className="w-full space-y-3">
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.replace(/\D/g, ''))}
              placeholder="4-6 números"
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value.replace(/\D/g, ''))}
              placeholder="min. 5 números"
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
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
