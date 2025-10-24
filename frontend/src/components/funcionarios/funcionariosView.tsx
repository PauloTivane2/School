import { useState, useRef, useEffect } from 'react';
import { X, Save } from 'lucide-react';

interface FuncionarioFormProps {
  funcionario?: any | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function FuncionarioForm({ funcionario, onClose, onSuccess }: FuncionarioFormProps) {
  const [nome, setNome] = useState(funcionario?.nome_funcionario || '');
  const [bi, setBI] = useState(funcionario?.bi || '');
  const [nuit, setNuit] = useState(funcionario?.nuit || '');
  const [nivelAcademico, setNivelAcademico] = useState(funcionario?.nivel_academico || '');
  const [funcao, setFuncao] = useState(funcionario?.funcao || '');
  const [email, setEmail] = useState(funcionario?.email || '');
  const [contacto1, setContacto1] = useState(funcionario?.contacto1 || '');
  const [contacto2, setContacto2] = useState(funcionario?.contacto2 || '');
  const [contacto3, setContacto3] = useState(funcionario?.contacto3 || '');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [saving, setSaving] = useState(false);
  const [canClear, setCanClear] = useState(false); // 🔹 controla se o botão limpar pode ser habilitado

  const nomeRef = useRef<HTMLInputElement>(null);

  // 🔹 Atualiza o estado de "canClear" quando qualquer campo é alterado
  useEffect(() => {
    const algumPreenchido =
      nome ||
      bi ||
      nuit ||
      nivelAcademico ||
      funcao ||
      email ||
      contacto1 ||
      contacto2 ||
      contacto3 ||
      senha ||
      confirmarSenha;
    setCanClear(!!algumPreenchido);
  }, [nome, bi, nuit, nivelAcademico, funcao, email, contacto1, contacto2, contacto3, senha, confirmarSenha]);

  // 🔹 Formatação do nome (primeira letra maiúscula e depois de espaços também)
  const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
    setNome(valor);
  };

  // 🔹 Validações
  const validarBI = (valor: string) => /^[0-9]{12}[A-Z]$/.test(valor);
  const validarNuit = (valor: string) => /^[0-9]{9}$/.test(valor);
  const validarContacto = (valor: string) => /^(82|83|84|85|86|87)\d{7}$/.test(valor);
  const validarEmail = (valor: string) => /^[A-Za-z0-9._%+-]+@gmail\.com$/.test(valor);
  const validarSenha = (senha: string): boolean => {
    if (!/^\d{5,}$/.test(senha)) return false;
    const nums = senha.split('').map(Number);
    let consecutivo = true;
    for (let i = 1; i < nums.length; i++) {
      const diff = nums[i] - nums[i - 1];
      if (diff !== 1 && diff !== -1) {
        consecutivo = false;
        break;
      }
    }
    return !consecutivo;
  };

  const validateFields = () => {
    if (!nome || !bi || !nuit || !nivelAcademico || !funcao || !email || !contacto1 || !senha || !confirmarSenha) {
      alert('⚠️ Preencha todos os campos obrigatórios.');
      return false;
    }
    if (!validarBI(bi)) { alert('⚠️ BI inválido! Deve ter 12 dígitos seguidos de uma letra maiúscula.'); return false; }
    if (!validarNuit(nuit)) { alert('⚠️ Nuit inválido! Deve ter 9 dígitos.'); return false; }
    if (!validarEmail(email)) { alert('⚠️ Email inválido! Deve terminar com @gmail.com'); return false; }
    for (const [campo, valor] of Object.entries({ Contacto1: contacto1, Contacto2: contacto2, Contacto3: contacto3 })) {
      if (valor && !validarContacto(valor)) { alert(`⚠️ ${campo} inválido! Deve começar com 82-87 e ter 9 dígitos.`); return false; }
    }
    if (!validarSenha(senha)) { alert('⚠️ Senha inválida! Mínimo 5 dígitos e não pode ser consecutiva.'); return false; }
    if (senha !== confirmarSenha) { alert('⚠️ Senhas não coincidem.'); return false; }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFields()) return;

    setSaving(true);
    try {
      const payload = {
        nome, bi, nuit, nivelAcademico, funcao, email,
        contacto1, contacto2, contacto3, senha
      };
      const url = funcionario
        ? `http://localhost:3000/api/funcionarios/${funcionario.id}`
        : 'http://localhost:3000/api/funcionarios';
      const method = funcionario ? 'PUT' : 'POST';

      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Erro ao salvar funcionário');
      alert('✅ Funcionário cadastrado com sucesso!');
      onSuccess();
      onClose();
    } catch (err: any) {
      alert('❌ ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleClear = () => {
    setNome(''); setBI(''); setNuit(''); setNivelAcademico(''); setFuncao('');
    setEmail(''); setContacto1(''); setContacto2(''); setContacto3(''); setSenha(''); setConfirmarSenha('');
    nomeRef.current?.focus();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6 overflow-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl transform transition-all duration-300 hover:scale-[1.01]">
        <div className="bg-secondary p-4 text-white rounded-t-2xl flex justify-between items-center">
          <h3 className="text-lg font-bold">{funcionario ? 'Editar Funcionário' : 'Novo Funcionário'}</h3>
          <button onClick={onClose}><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Linha 1: Nome | BI */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Nome *</label>
              <input
                ref={nomeRef}
                type="text"
                value={nome}
                onChange={handleNomeChange}
                required
                className="w-full p-2 border-2 border-primary/20 rounded-lg focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">BI *</label>
              <input
                type="text"
                value={bi}
                onChange={e => setBI(e.target.value.toUpperCase())}
                maxLength={13}
                required
                className="w-full p-2 border-2 border-primary/20 rounded-lg focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>

          {/* Linha 2: Nuit | Nível Acadêmico */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Nuit *</label>
              <input
                type="text"
                value={nuit}
                onChange={e => setNuit(e.target.value.replace(/\D/g, ''))}
                maxLength={9}
                required
                className="w-full p-2 border-2 border-primary/20 rounded-lg focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Nível Acadêmico *</label>
              <select
                value={nivelAcademico}
                onChange={e => setNivelAcademico(e.target.value)}
                required
                className="w-full p-2 border-2 border-primary/20 rounded-lg focus:ring-2 focus:ring-yellow-500"
              >
                <option value="" disabled>Selecione</option>
                <option value="Tecnico Medio">Tecnico Medio</option>
                <option value="Tecnico Superior">Tecnico Superior</option>
                <option value="Mestrado">Mestrado</option>
                <option value="Professor Doutor">Professor Doutor</option>
              </select>
            </div>
          </div>

          {/* Linha 3: Função | Email */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Função *</label>
              <select
                value={funcao}
                onChange={e => setFuncao(e.target.value)}
                required
                className="w-full p-2 border-2 border-primary/20 rounded-lg focus:ring-2 focus:ring-yellow-500"
              >
                <option value="" disabled>Selecione</option>
                <option value="Professor">Professor</option>
                <option value="Diretor">Diretor</option>
                <option value="Admin">Admin</option>
                <option value="Secretaria">Secretaria</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">Email *</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="exemplo@gmail.com"
                required
                className="w-full p-2 border-2 border-primary/20 rounded-lg focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>

          {/* Linha 4: Contactos */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold mb-1">Contacto 1 *</label>
              <input type="text" value={contacto1} onChange={e => setContacto1(e.target.value.replace(/\D/g, ''))} maxLength={9} placeholder="Ex: 82xxxxxxx" required className="w-full p-2 border-2 border-primary/20 rounded-lg focus:ring-2 focus:ring-yellow-500" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Contacto 2</label>
              <input type="text" value={contacto2} onChange={e => setContacto2(e.target.value.replace(/\D/g, ''))} maxLength={9} placeholder="Ex: 82xxxxxxx" className="w-full p-2 border-2 border-primary/20 rounded-lg focus:ring-2 focus:ring-yellow-500" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Contacto 3</label>
              <input type="text" value={contacto3} onChange={e => setContacto3(e.target.value.replace(/\D/g, ''))} maxLength={9} placeholder="Ex: 82xxxxxxx" className="w-full p-2 border-2 border-primary/20 rounded-lg focus:ring-2 focus:ring-yellow-500" />
            </div>
          </div>

          {/* Linha 5: Senha | Confirmar Senha */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Senha *</label>
              <input type="password" value={senha} onChange={e => setSenha(e.target.value.replace(/\D/g, ''))} required placeholder="Mínimo 5 dígitos" className="w-full p-2 border-2 border-primary/20 rounded-lg focus:ring-2 focus:ring-yellow-500" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Confirmar Senha *</label>
              <input type="password" value={confirmarSenha} onChange={e => setConfirmarSenha(e.target.value.replace(/\D/g, ''))} required placeholder="Repita a senha" className="w-full p-2 border-2 border-primary/20 rounded-lg focus:ring-2 focus:ring-yellow-500" />
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-4 pt-4 border-t-2">
            <button
              type="button"
              onClick={handleClear}
              disabled={!canClear}
              className={`px-6 py-2 rounded-lg text-white transition-colors ${
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
              className="px-6 py-2 bg-gradient-to-r from-secondary/90 to-accent/90 text-white rounded-lg flex items-center gap-2"
            >
              {saving ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div> : <Save size={16} />}
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


