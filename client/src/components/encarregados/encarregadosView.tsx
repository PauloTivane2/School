import { useState, useRef, useEffect } from 'react'; 
import { X, Save } from 'lucide-react';

interface EncarregadoFormProps {
  encarregado?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EncarregadoForm({ encarregado, onClose, onSuccess }: EncarregadoFormProps) {
  const [nome, setNome] = useState(encarregado?.nome || '');
  const [morada, setMorada] = useState(encarregado?.morada || '');
  const [email, setEmail] = useState(encarregado?.email || '');
  const [contacto1, setContacto1] = useState(encarregado?.contacto1 || '');
  const [contacto2, setContacto2] = useState(encarregado?.contacto2 || '');
  const [cell, setCell] = useState(encarregado?.contacto3 || '');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [saving, setSaving] = useState(false);
  const [canClear, setCanClear] = useState(false); // 🔹 controla o botão limpar

  const nomeRef = useRef<HTMLInputElement>(null);

  const focusNome = () => nomeRef.current?.focus();

  // 🔹 Detecta se algum campo está preenchido
  useEffect(() => {
    const algumCampoPreenchido =
      nome || morada || email || contacto1 || contacto2 || cell || senha || confirmarSenha;
    setCanClear(!!algumCampoPreenchido);
  }, [nome, morada, email, contacto1, contacto2, cell, senha, confirmarSenha]);

  const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valor = e.target.value
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
    setNome(valor);
  };

  const handleMoradaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valor = e.target.value
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
    setMorada(valor);
  };

  const validarContacto = (valor: string): boolean =>
    /^(82|83|84|85|86|87)\d{7}$/.test(valor);

  const validarSenha = (senha: string): boolean => {
    if (!/^\d{5,}$/.test(senha)) return false;
    const numeros = senha.split('').map(Number);
    let consecutivo = true;
    for (let i = 1; i < numeros.length; i++) {
      const diff = numeros[i] - numeros[i - 1];
      if (diff !== 1 && diff !== -1) {
        consecutivo = false;
        break;
      }
    }
    return !consecutivo;
  };

  const validateFields = (): boolean => {
    if (!nome || !morada || !email || !contacto1 || !cell || !senha || !confirmarSenha) {
      alert('⚠️ Preencha todos os campos obrigatórios.');
      return false;
    }
    if (!/^[A-Za-z0-9._%+-]+@gmail\.com$/.test(email)) {
      alert('⚠️ O e-mail deve ser do tipo exemplo@gmail.com');
      return false;
    }
    for (const [campo, valor] of Object.entries({ Contacto1: contacto1, Contacto2: contacto2, Cell: cell })) {
      if (valor && !validarContacto(valor)) {
        alert(`⚠️ ${campo} inválido. Deve começar com 82–87 e ter 9 dígitos no total.`);
        return false;
      }
    }
    if (!validarSenha(senha)) {
      alert('⚠️ A senha deve ter pelo menos 5 números e não pode conter números consecutivos.');
      return false;
    }
    if (senha !== confirmarSenha) {
      alert('⚠️ As senhas não coincidem.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFields()) return;
    setSaving(true);

    try {
      const payload = { nome, morada, email, contacto1, contacto2, cell, senha };
      const url = encarregado
        ? `http://localhost:3000/api/encarregados/${encarregado.id}`
        : 'http://localhost:3000/api/encarregados';
      const method = encarregado ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Erro ao salvar encarregado');
      alert('✅ Encarregado cadastrado com sucesso!');
      onSuccess();
      onClose();
    } catch (err: any) {
      alert('❌ ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleClear = () => {
    setNome('');
    setMorada('');
    setEmail('');
    setContacto1('');
    setContacto2('');
    setCell('');
    setSenha('');
    setConfirmarSenha('');
    focusNome();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6 overflow-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 hover:scale-[1.01]">
        {/* Cabeçalho */}
        <div className="bg-secondary p-4 text-white rounded-t-2xl flex justify-between items-center">
          <h3 className="text-lg font-bold">
            {encarregado ? 'Editar Encarregado' : 'Novo Encarregado'}
          </h3>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nome + Morada */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-semibold">Nome *</label>
              <input
                ref={nomeRef}
                type="text"
                value={nome}
                onChange={handleNomeChange}
                required
                className="w-full px-4 py-2 border-2 border-primary/20 rounded-lg focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Morada *</label>
              <input
                type="text"
                value={morada}
                onChange={handleMoradaChange}
                required
                className="w-full px-4 py-2 border-2 border-primary/20 rounded-lg focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>

          {/* Email + Contacto1 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-semibold">Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@gmail.com"
                required
                className="w-full px-4 py-2 border-2 border-primary/20 rounded-lg focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Contacto 1 *</label>
              <input
                type="text"
                value={contacto1}
                onChange={(e) => setContacto1(e.target.value.replace(/\D/g, ''))}
                maxLength={9}
                required
                placeholder="Ex: 84xxxxxxx"
                className="w-full px-4 py-2 border-2 border-primary/20 rounded-lg focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>

          {/* Contacto2 + Cell */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-semibold">Contacto 2</label>
              <input
                type="text"
                value={contacto2}
                onChange={(e) => setContacto2(e.target.value.replace(/\D/g, ''))}
                maxLength={9}
                placeholder="Ex: 85xxxxxxx"
                className="w-full px-4 py-2 border-2 border-primary/20 rounded-lg focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Cell *</label>
              <input
                type="text"
                value={cell}
                onChange={(e) => setCell(e.target.value.replace(/\D/g, ''))}
                maxLength={9}
                required
                placeholder="Ex: 86xxxxxxx"
                className="w-full px-4 py-2 border-2 border-primary/20 rounded-lg focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>

          {/* Senha + Confirmar Senha */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-semibold">Senha *</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value.replace(/\D/g, ''))}
                maxLength={10}
                required
                placeholder="Mínimo 5 números"
                className="w-full px-4 py-2 border-2 border-primary/20 rounded-lg focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Confirmar Senha *</label>
              <input
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value.replace(/\D/g, ''))}
                maxLength={10}
                required
                placeholder="Repita a senha"
                className="w-full px-4 py-2 border-2 border-primary/20 rounded-lg focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-4 border-t-2">
            <button
              type="button"
              onClick={handleClear}
              disabled={!canClear}
              className={`px-6 py-2 rounded-lg text-white transition ${
                canClear
                  ? 'bg-rose-500 hover:bg-rose-600'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Limpar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-gradient-to-r from-secondary/90 to-accent/90 text-white rounded-lg flex items-center gap-2 hover:from-yellow-700 hover:to-orange-700 disabled:opacity-50"
            >
              {saving ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <Save size={16} />
              )}
              {encarregado ? 'Atualizar' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
