// frontend/src/components/alunos/StudentEditForm.tsx
import { useState, useEffect, useRef } from 'react';
import { X, Save } from 'lucide-react';

interface Turma { id_turma?: number; id?: number; nome?: string; turma?: string; }
interface Classe { id_classes?: number; id?: number; nome_classe?: string; nome?: string; }
interface Encarregado { id_encarregados?: number; id?: number; nome?: string; }

interface StudentEditFormProps {
  student: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function StudentEditForm({ student, onClose, onSuccess }: StudentEditFormProps) {
  const [usuario, setUsuario] = useState(student.usuario || '');
  const [classeId, setClasseId] = useState((student.id_classe ?? student.classe_id)?.toString() || '');
  const [turmaId, setTurmaId] = useState((student.id_turma ?? student.turma_id)?.toString() || '');
  const [encarregadoId, setEncarregadoId] = useState((student.id_encarregados ?? student.encarregado_id)?.toString() || '');
  const [estado, setEstado] = useState(student.estado ?? 'ativo');

  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [classes, setClasses] = useState<Classe[]>([]);
  const [encarregados, setEncarregados] = useState<Encarregado[]>([]);
  const [saving, setSaving] = useState(false);
  const [canClear, setCanClear] = useState(false);

  const classeRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    fetchAllDropdowns();
    classeRef.current?.focus();
  }, []);

  useEffect(() => {
    const alterado =
      usuario !== (student.usuario || '') ||
      classeId !== (student.id_classe?.toString() || student.classe_id?.toString() || '') ||
      turmaId !== (student.id_turma?.toString() || student.turma_id?.toString() || '') ||
      encarregadoId !== (student.id_encarregados?.toString() || student.encarregado_id?.toString() || '') ||
      estado !== (student.estado || 'ativo');
    setCanClear(alterado);
  }, [usuario, classeId, turmaId, encarregadoId, estado, student]);

  const fetchAllDropdowns = async () => {
    try {
      const [turmasRes, classesRes, encarregadosRes] = await Promise.all([
        fetch('http://localhost:3000/api/dropdowns/turmas'),
        fetch('http://localhost:3000/api/dropdowns/classes'),
        fetch('http://localhost:3000/api/dropdowns/encarregados')
      ]);

      setTurmas(await turmasRes.json());
      setClasses(await classesRes.json());
      setEncarregados(await encarregadosRes.json());
    } catch (err) {
      console.error('Erro ao carregar dropdowns:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        usuario,
        id_classe: parseInt(classeId),
        id_turma: parseInt(turmaId),
        id_encarregados: parseInt(encarregadoId),
        estado
      };

      const res = await fetch(`http://localhost:3000/api/students/${student.id_aluno ?? student.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Erro ao salvar alterações');
      }

      alert('✅ Aluno atualizado com sucesso!');
      onSuccess();
      onClose();
    } catch (err: any) {
      alert('❌ ' + (err.message || 'Erro desconhecido'));
    } finally {
      setSaving(false);
    }
  };

  const handleClear = () => {
    setUsuario(student.usuario || '');
    setClasseId((student.id_classe ?? student.classe_id)?.toString() || '');
    setTurmaId((student.id_turma ?? student.turma_id)?.toString() || '');
    setEncarregadoId((student.id_encarregados ?? student.encarregado_id)?.toString() || '');
    setEstado(student.estado ?? 'ativo');
    classeRef.current?.focus();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mt-10 mb-10">
        {/* Cabeçalho */}
        <div className="bg-secondary p-4 text-white rounded-t-2xl flex justify-between items-center">
          <h3 className="text-lg font-bold">Editar Aluno</h3>
          <button onClick={onClose}><X size={24} /></button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Nome</label>
            <input
              type="text"
              value={student.nome_aluno ?? student.nome}
              disabled
              className="w-full px-4 py-2 border-2 border-primary/20 rounded-lg bg-neutral-bg cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 font-semibold">Usuario</label>
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)} disabled 
                className="w-full px-4 py-2 border-2 border-primary/20 rounded-lg cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Classe *</label>
              <select
                ref={classeRef}
                value={classeId}
                onChange={(e) => setClasseId(e.target.value)}
                required
                className="w-full px-4 py-2 border-2 border-primary/20 rounded-lg focus:ring-2 focus:ring-yellow-500"
              >
                <option value="" disabled>Selecione...</option>
                {classes.map((c: any) => (
                  <option key={c.id_classes ?? c.id} value={c.id_classes ?? c.id}>
                    {c.nome_classe ?? c.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-semibold">Turma *</label>
              <select
                value={turmaId}
                onChange={(e) => setTurmaId(e.target.value)}
                required
                className="w-full px-4 py-2 border-2 border-primary/20 rounded-lg focus:ring-2 focus:ring-yellow-500"
              >
                <option value="" disabled>Selecione...</option>
                {turmas.map((t: any) => (
                  <option key={t.id_turma ?? t.id} value={t.id_turma ?? t.id}>
                    {t.turma ?? t.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-semibold">Encarregado *</label>
            <select
              value={encarregadoId}
              onChange={(e) => setEncarregadoId(e.target.value)}
              required
              className="w-full px-4 py-2 border-2 border-primary/20 rounded-lg focus:ring-2 focus:ring-yellow-500"
            >
              <option value="" disabled>Selecione...</option>
              {encarregados.map((e: any) => (
                <option key={e.id_encarregados ?? e.id} value={e.id_encarregados ?? e.id}>
                  {e.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-semibold">Estado *</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="estado"
                  value="ativo"
                  checked={estado === 'ativo'}
                  onChange={(e) => setEstado(e.target.value)}
                  className="w-4 h-4 text-primary focus:ring-yellow-500"
                />
                Ativo
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="estado"
                  value="inativo"
                  checked={estado === 'inativo'}
                  onChange={(e) => setEstado(e.target.value)}
                  className="w-4 h-4 text-primary focus:ring-yellow-500"
                />
                Inativo
              </label>
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-4 border-t-2">
            <button
              type="button"
              onClick={handleClear}
              disabled={!canClear}
              className={`px-6 py-2 rounded-lg text-white transition ${
                canClear ? 'bg-rose-500 hover:bg-rose-600' : 'bg-gray-400 cursor-not-allowed'
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
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
