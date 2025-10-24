// frontend/src/components/login/ConfirmacaoOTP.tsx
import { useState, useEffect } from 'react';

interface ConfirmacaoOTPProps {
  onConfirm: () => void;
}

export default function ConfirmacaoOTP({ onConfirm }: ConfirmacaoOTPProps) {
  const [otp, setOtp] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [habilitarCampos, setHabilitarCampos] = useState(false);
  const [habilitarLimpar, setHabilitarLimpar] = useState(false);
  const [habilitarEnviar, setHabilitarEnviar] = useState(false);

  useEffect(() => {
    setHabilitarLimpar(novaSenha !== '' || confirmarSenha !== '');
    setHabilitarEnviar(confirmarSenha.length > 0 && novaSenha === confirmarSenha);
  }, [novaSenha, confirmarSenha]);

  const handleConfirmOtp = () => {
    if (otp.length === 0) return alert('⚠️ Insira o código OTP.');
    setHabilitarCampos(true);
    alert('✅ OTP confirmado! Agora pode definir nova senha.');
  };

  const handleLimpar = () => {
    setNovaSenha('');
    setConfirmarSenha('');
  };

  const handleEnviar = () => {
    alert('✅ Senha alterada com sucesso!');
    onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-neutral-bg flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-primary mb-6 text-center">Confirmação OTP</h2>

        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Confirmar Código OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="w-full px-4 py-2 border-2 border-primary/20 rounded-lg focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Nova Senha</label>
            <input
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value.replace(/\D/g, ''))}
              disabled={!habilitarCampos}
              placeholder="Nova senha"
              className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 ${
                habilitarCampos ? 'border-primary/20 focus:ring-yellow-500' : 'border-primary/10 bg-neutral-bg'
              }`}
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Confirmar Nova Senha</label>
            <input
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value.replace(/\D/g, ''))}
              disabled={!habilitarCampos}
              placeholder="Confirme a nova senha"
              className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 ${
                habilitarCampos ? 'border-primary/20 focus:ring-yellow-500' : 'border-primary/10 bg-neutral-bg'
              }`}
            />
          </div>

          {/* Botões */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleConfirmOtp}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-secondary/90 to-accent/90 text-white rounded-lg hover:from-yellow-700 hover:to-orange-700"
            >
              Confirmar
            </button>
            <button
              onClick={handleLimpar}
              disabled={!habilitarLimpar}
              className={`flex-1 px-4 py-2 rounded-lg text-white ${
                habilitarLimpar ? 'bg-rose-500 hover:bg-rose-600' : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Limpar
            </button>
            <button
              onClick={handleEnviar}
              disabled={!habilitarEnviar}
              className={`flex-1 px-4 py-2 rounded-lg text-white ${
                habilitarEnviar
                  ? 'bg-gradient-to-r from-secondary/90 to-accent/90 hover:from-yellow-700 hover:to-orange-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
