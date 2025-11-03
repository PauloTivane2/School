import { useState, useEffect, useRef } from 'react';
import { X, Save } from 'lucide-react';

interface TurmaFormProps {
  turma?: any | null;
  onClose: () => void;
  refresh: () => void;
}

interface Classe {
  id: number;
  display: string;
}

interface Diretor {
  id: number;
  nome: string;
}

const TurmaForm = ({ turma, onClose, refresh }: TurmaFormProps) => {
  const [classes, setClasses] = useState<Classe[]>([]);
  const [diretores, setDiretores] = useState<Diretor[]>([]);
  const [classeId, setClasseId] = useState(turma?.classe_id || '');
  const [letraTurma, setLetraTurma] = useState(turma?.letra || '');
  const [ano, setAno] = useState(turma?.ano || '2025');
  const [diretorId, setDiretorId] = useState(turma?.diretor_id || '');
  const [saving, setSaving] = useState(false);

  const classeSelectRef = useRef<HTMLSelectElement>(null);

  // 🟡 Novo estado para controlar se o botão limpar deve estar habilitado
  const [canClear, setCanClear] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Ativa o botão "Limpar" se qualquer campo estiver preenchido
    const filled =
      classeId !== '' ||
      letraTurma !== '' ||
      ano !== '2025' ||
      diretorId !== '';
    setCanClear(filled);
  }, [classeId, letraTurma, ano, diretorId]);

  const fetchData = async () => {
    try {
      const [cRes, dRes] = await Promise.all([
        fetch('http://localhost:3000/api/classes'),
        fetch('http://localhost:3000/api/funcionarios')
      ]);

      const classesData = await cRes.json();
      const diretoresData: Diretor[] = await dRes.json();

      const formattedClasses: Classe[] = classesData.map((c: any) => ({
        id: c.id,
        display: `${c.nome} - ${c.nivel} (${c.ano_letivo})`
      }));

      setClasses(formattedClasses);
      setDiretores(diretoresData);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = turma ? 'PUT' : 'POST';
      const url = turma
        ? `http://localhost:3000/api/turmas/${turma.id}`
        : 'http://localhost:3000/api/turmas';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classe_id: parseInt(classeId),
          letra: letraTurma,
          ano: parseInt(ano),
          diretor_id: parseInt(diretorId)
        })
      });

      if (!res.ok) throw new Error('Erro ao salvar turma');
      alert('✅ Turma salva com sucesso!');
      refresh();
      onClose();
    } catch (err: any) {
      alert('❌ ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleClear = () => {
    setClasseId('');
    setLetraTurma('');
    setAno('2025');
    setDiretorId('');
    classeSelectRef.current?.focus();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mt-10 mb-10">
        <div className="bg-secondary p-4 text-white rounded-t-2xl flex justify-between items-center">
          <h3 className="text-lg font-bold">{turma ? 'Editar Turma' : 'Nova Turma'}</h3>
          <button onClick={onClose}><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Classe e Turma lado a lado */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-semibold">Classe *</label>
              <select
                ref={classeSelectRef}
                value={classeId}
                onChange={e => setClasseId(e.target.value)}
                required
                className="w-full px-4 py-2 border-2 border-primary/20 rounded-lg focus:ring-2 focus:ring-yellow-500"
              >
                <option value="" disabled>Selecione...</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.display}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-semibold">Turma *</label>
              <select
                value={letraTurma}
                onChange={e => setLetraTurma(e.target.value)}
                required
                className="w-full px-4 py-2 border-2 border-primary/20 rounded-lg focus:ring-2 focus:ring-yellow-500"
              >
                <option value="" disabled>Selecione...</option>
                {['A','B','C','D','E','F','G'].map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Ano e Diretor lado a lado */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-semibold">Ano *</label>
              <select
                value={ano}
                onChange={e => setAno(e.target.value)}
                required
                className="w-full px-4 py-2 border-2 border-primary/20 rounded-lg focus:ring-2 focus:ring-yellow-500"
              >
                {Array.from({ length: 18 }, (_, i) => 2023 + i).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-semibold">Diretor *</label>
              <select
                value={diretorId}
                onChange={e => setDiretorId(e.target.value)}
                required
                className="w-full px-4 py-2 border-2 border-primary/20 rounded-lg focus:ring-2 focus:ring-yellow-500"
              >
                <option value="" disabled>Selecione...</option>
                {diretores.map(d => (
                  <option key={d.id} value={d.id}>{d.nome}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-2 pt-4 border-t-2">
            <button
              type="button"
              onClick={handleClear}
              disabled={!canClear} // 🔴 desabilita quando não há campos preenchidos
              className={`px-6 py-2 rounded-lg text-white transition-colors ${
                canClear
                  ? 'btn-danger'
                  : 'btn-disabled'
              }`}
            >
              Limpar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 btn-success disabled:opacity-50"
            >
              {saving ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <Save size={16} />
              )}
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TurmaForm;

