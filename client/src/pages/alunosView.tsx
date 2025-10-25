// src/components/StudentForm.tsx
import { useState, useEffect, useRef } from 'react';
import { X, Save } from 'lucide-react';

interface Turma { id_turma?: number; turma?: string; } 
interface Classe { id_classes?: number; nome_classe?: string; }
interface Encarregado { id_encarregados?: number; nome?: string; }

interface StudentFormProps {
  student?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function StudentForm({ student, onClose, onSuccess }: StudentFormProps) {
  const [nome, setNome] = useState(student?.nome_aluno || '');
  const [dataNascimento, setDataNascimento] = useState(student?.data_nascimento || '');
  const [genero, setGenero] = useState(student?.genero || '');
  const [bi, setBi] = useState(student?.bi || '');
  const [nuit, setNuit] = useState(student?.nuit || '');
  const [classeId, setClasseId] = useState((student?.id_classe ?? '')?.toString());
  const [turmaId, setTurmaId] = useState((student?.id_turma ?? '')?.toString());
  const [encarregadoId, setEncarregadoId] = useState((student?.id_encarregados ?? '')?.toString());

  const [classes, setClasses] = useState<Classe[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [encarregados, setEncarregados] = useState<Encarregado[]>([]);
  const [saving, setSaving] = useState(false);
  const [canClear, setCanClear] = useState(false);

  const nomeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchDropdowns();
    nomeRef.current?.focus();
  }, []);

  useEffect(() => {
    const algumPreenchido = nome || dataNascimento || genero || bi || nuit || classeId || turmaId || encarregadoId;
    setCanClear(!!algumPreenchido);
  }, [nome, dataNascimento, genero, bi, nuit, classeId, turmaId, encarregadoId]);

  const fetchDropdowns = async () => {
    try {
      const [resClasses, resTurmas, resEncarregados] = await Promise.all([
        fetch('http://localhost:3000/api/students/dropdowns/classes'),
        fetch('http://localhost:3000/api/students/dropdowns/turmas'),
        fetch('http://localhost:3000/api/students/dropdowns/encarregados'),
      ]);
      setClasses(await resClasses.json());
      setTurmas(await resTurmas.json());
      setEncarregados(await resEncarregados.json());
    } catch (err) {
      console.error('Erro ao carregar dropdowns:', err);
    }
  };

  const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    setNome(valor);
  };

  const validateFields = (): boolean => {
    const nascimento = new Date(dataNascimento);
    const hoje = new Date();
    const idade = hoje.getFullYear() - nascimento.getFullYear();
    if (isNaN(nascimento.getTime()) || idade < 5 || nascimento > hoje) {
      alert('⚠️ O aluno deve ter pelo menos 5 anos.');
      return false;
    }
    if (!/^\d{12}[A-Z]$/.test(bi)) {
      alert('⚠️ O BI deve ter 12 números + 1 letra maiúscula.');
      return false;
    }
    if (!/^\d{9}$/.test(nuit)) {
      alert('⚠️ O NUIT deve conter 9 números.');
      return false;
    }
    if (!classeId || !turmaId || !encarregadoId) {
      alert('⚠️ Selecione Classe, Turma e Encarregado.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFields()) return;
    setSaving(true);

    try {
      const payload = {
        nome_aluno: nome,
        data_nascimento: dataNascimento,
        genero,
        bi,
        nuit,
        id_classe: parseInt(classeId!),
        id_turma: parseInt(turmaId!),
        id_encarregados: parseInt(encarregadoId!)
      };

      const url = student?.id_aluno
        ? `http://localhost:3000/api/students/${student.id_aluno}`
        : 'http://localhost:3000/api/students';

      const method = student ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text() || 'Erro ao salvar aluno');
      alert('✅ Aluno salvo com sucesso!');
      onSuccess();
      onClose();
    } catch (err: any) {
      alert('❌ ' + (err.message || 'Erro desconhecido'));
    } finally {
      setSaving(false);
    }
  };

  const handleClear = () => {
    setNome(''); setDataNascimento(''); setGenero(''); setBi(''); setNuit('');
    setClasseId(''); setTurmaId(''); setEncarregadoId('');
    nomeRef.current?.focus();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mt-10 mb-10">
        <div className="bg-secondary p-4 text-white rounded-t-2xl flex justify-between items-center">
          <h3 className="text-lg font-bold">{student ? 'Editar Aluno' : '+ Aluno'}</h3>
          <button onClick={onClose}><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* Nome e Data Nascimento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <label className="block mb-1 font-semibold">Data de Nascimento *</label>
              <input
                type="date"
                value={dataNascimento}
                onChange={e => setDataNascimento(e.target.value)}
                required
                className="w-full px-4 py-2 border-2 border-primary/20 rounded-lg focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>

          {/* Gênero e BI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-semibold">Gênero *</label>
              <select
                value={genero}
                onChange={e => setGenero(e.target.value)}
                required
                className="w-full px-4 py-2 border-2 border-primary/20 rounded-lg focus:ring-2 focus:ring-yellow-500"
              >
                <option value="" disabled>Selecione...</option>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-semibold">BI *</label>
              <input
                type="text"
                value={bi}
                onChange={e => setBi(e.target.value.toUpperCase())}
                required
                maxLength={13}
                className="w-full px-4 py-2 border-2 border-primary/20 rounded-lg focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>

          {/* NUIT e Classe */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-semibold">NUIT *</label>
              <input
                type="text"
                value={nuit}
                onChange={e => setNuit(e.target.value.replace(/\D/g,''))}
                required
                maxLength={9}
                className="w-full px-4 py-2 border-2 border-primary/20 rounded-lg focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Classe *</label>
              <select
                value={classeId}
                onChange={e => setClasseId(e.target.value)}
                required
                className="w-full px-4 py-2 border-2 border-primary/20 rounded-lg focus:ring-2 focus:ring-yellow-500"
              >
                <option value="" disabled>Selecione...</option>
                {classes.map(c => <option key={c.id_classes} value={c.id_classes}>{c.nome_classe}</option>)}
              </select>
            </div>
          </div>

          {/* Turma e Encarregado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-semibold">Turma *</label>
              <select
                value={turmaId}
                onChange={e => setTurmaId(e.target.value)}
                required
                className="w-full px-4 py-2 border-2 border-primary/20 rounded-lg focus:ring-2 focus:ring-yellow-500"
              >
                <option value="" disabled>Selecione...</option>
                {turmas.map(t => <option key={t.id_turma} value={t.id_turma}>{t.turma}</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-semibold">Encarregado *</label>
              <select
                value={encarregadoId}
                onChange={e => setEncarregadoId(e.target.value)}
                required
                className="w-full px-4 py-2 border-2 border-primary/20 rounded-lg focus:ring-2 focus:ring-yellow-500"
              >
                <option value="" disabled>Selecione...</option>
                {encarregados.map(e => <option key={e.id_encarregados} value={e.id_encarregados}>{e.nome}</option>)}
              </select>
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-4 border-t-2">
            <button type="button" onClick={handleClear} disabled={!canClear} className={`px-6 py-2 rounded-lg text-white transition ${canClear ? 'btn-danger' : 'btn-disabled'}`}>Limpar</button>
            <button type="submit" disabled={saving} className="px-6 py-2 btn-success disabled:opacity-50">
              {saving ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div> : <Save size={16} />}
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
