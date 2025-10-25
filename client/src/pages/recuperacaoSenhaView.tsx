// frontend/src/components/login/RecuperacaoSenha.tsx
import { useState } from 'react';

interface RecuperacaoSenhaProps {
  onBack: () => void;
  onConfirm: () => void;
}

export default function RecuperacaoSenha({ onBack, onConfirm }: RecuperacaoSenhaProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const validarUsername = (val: string) => /^\d{4,6}$/.test(val);
  const validarEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleConfirm = () => {
    if (!validarUsername(username)) return alert('⚠️ Username deve ter entre 4-6 números.');
    if (!validarEmail(email)) return alert('⚠️ Email inválido.');
    onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[280px] p-4 flex flex-col items-center">
        
        {/* Título dentro da borda principal */}
        <h2 className="text-xl font-bold text-primary mb-3 text-center">Recuperação de Senha</h2>

        {/* Campos */}
        <div className="w-full space-y-2">
          <div>
            <label className="block mb-1 font-semibold text-primary/80 text-sm">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.replace(/\D/g, ''))}
              placeholder="4-6 números"
              className="w-full px-2 py-1.5 border-2 border-primary/20 rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-primary/80 text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemplo@email.com"
              className="w-full px-2 py-1.5 border-2 border-primary/20 rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none text-sm"
            />
          </div>

          {/* Botões */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={onBack}
              className="flex-1 px-2 py-1.5 btn-disabled hover:bg-neutral-bg/500 text-white rounded-lg text-sm font-medium"
            >
              Voltar
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-2 py-1.5 bg-gradient-to-r from-secondary to-accent text-white rounded-lg hover:from-secondary/90 hover:to-accent/90 text-sm font-medium"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
