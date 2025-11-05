import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import ConfirmDialog from '../../components/ConfirmDialog';

interface AttendanceFormProps {
  turmaId: string;
  date: string;
  disciplina?: string;
  turno?: string;
  periodo?: string;
  onClose: () => void;
}

interface Student {
  id: number;
  nome: string;
  presente?: boolean;
}

const AttendanceForm = ({ turmaId, date, onClose, disciplina, turno, periodo }: AttendanceFormProps) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState('');
  const [dialog, setDialog] = useState<{ isOpen: boolean; title: string; message: string; type: 'confirm' | 'alert' | 'success' | 'error' | 'warning' }>(
    { isOpen: false, title: '', message: '', type: 'alert' }
  );

  const API = (import.meta as any).env.VITE_API_URL as string;

  useEffect(() => {
    fetchStudents();
  }, [turmaId]);

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API}/attendance/students/${turmaId}`);
      const data = await response.json();
      setStudents(data.map((s: any) => ({ ...s, presente: true })));
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
      setDialog({ isOpen: true, title: 'Erro', message: 'Erro ao buscar alunos.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const setPresence = (studentId: number, value: boolean) => {
    setStudents(prev => prev.map(s => (s.id === studentId ? { ...s, presente: value } : s)));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const attendanceData = students.map(s => ({
        aluno_id: s.id.toString(),
        turma_id: turmaId,
        data: new Date(date),
        presente: s.presente || false,
      }));

      const response = await fetch(`${API}/attendance/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attendanceData),
      });

      if (!response.ok) throw new Error('Erro ao salvar presenças');

      setDialog({ isOpen: true, title: 'Sucesso', message: 'Presenças registradas com sucesso!', type: 'success' });
      // Fechar após breve atraso para o usuário ver o feedback
      setTimeout(() => onClose(), 600);
    } catch (error: any) {
      setDialog({ isOpen: true, title: 'Erro', message: error.message || 'Falha ao salvar presenças.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-xl shadow-2xl border border-border-light">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-neutral-gray text-sm">Carregando alunos...</p>
        </div>
      </div>
    );
  }

  const presentes = students.filter(s => s.presente).length;
  const ausentes = students.length - presentes;
  const filteredStudents = students.filter(s => s.nome.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-border-light">
        <div className="px-6 py-4 border-b border-border-light bg-neutral-light/60">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-text-primary">Registrar Presença</h3>
              <p className="text-xs text-neutral-gray mt-0.5">Data: {new Date(date).toLocaleDateString('pt-PT')}</p>
              <p className="text-xs text-neutral-gray mt-0.5">
                Turma {turmaId}
                {disciplina ? ` • ${disciplina}` : ''}
                {turno ? ` • ${turno}` : ''}
                {periodo ? ` • ${periodo}` : ''}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-accent transition-colors"
              aria-label="Fechar"
            >
              <X size={18} className="text-neutral-gray" />
            </button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-white border border-border-light">
              <p className="text-xs text-neutral-gray">Presentes</p>
              <p className="text-xl font-semibold text-text-primary">{presentes}</p>
            </div>
            <div className="p-3 rounded-lg bg-white border border-border-light">
              <p className="text-xs text-neutral-gray">Ausentes</p>
              <p className="text-xl font-semibold text-text-primary">{ausentes}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-3 text-xs">
            <span className="px-2 py-0.5 rounded-md bg-success-light text-success border border-success/20">Presente</span>
            <span className="px-2 py-0.5 rounded-md bg-error-light text-error border border-error/20">Ausente</span>
            <span className="text-neutral-gray">Clique no estado desejado para cada aluno.</span>
          </div>
          <div className="mt-3 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquisar aluno..."
              className="input-field md:max-w-xs"
              aria-label="Pesquisar aluno"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setStudents(prev => prev.map(s => ({ ...s, presente: true })))}
                className="px-3 py-1.5 rounded-md border border-border-light text-xs hover:bg-accent"
              >
                Marcar todos presentes
              </button>
              <button
                onClick={() => setStudents(prev => prev.map(s => ({ ...s, presente: false })))}
                className="px-3 py-1.5 rounded-md border border-border-light text-xs hover:bg-accent"
              >
                Marcar todos ausentes
              </button>
              <button
                onClick={() => setStudents(prev => prev.map(s => ({ ...s, presente: undefined })))}
                className="px-3 py-1.5 rounded-md border border-border-light text-xs hover:bg-accent"
              >
                Limpar
              </button>
            </div>
          </div>
        </div>

        <div className="p-0 overflow-y-auto max-h-[70vh]">
          {students.length === 0 ? (
            <div className="p-8 text-center text-neutral-gray">Nenhum aluno encontrado para a turma selecionada.</div>
          ) : (
            <table className="w-full">
              <thead className="sticky top-0 bg-white border-b border-border-light z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">Aluno</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-neutral-gray uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {filteredStudents.map((s, idx) => (
                  <tr key={s.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-neutral-light/40'}>
                    <td className="px-6 py-3 text-sm text-text-primary">{s.nome}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setPresence(s.id, true)}
                          className={`px-3 py-1 rounded-md text-xs border ${s.presente ? 'bg-success text-white border-success' : 'bg-white text-text-primary border-border-light hover:bg-success-light'}`}
                          aria-pressed={!!s.presente}
                          aria-label={`Marcar ${s.nome} como presente`}
                        >
                          Presente
                        </button>
                        <button
                          onClick={() => setPresence(s.id, false)}
                          className={`px-3 py-1 rounded-md text-xs border ${s.presente === false ? 'bg-error text-white border-error' : 'bg-white text-text-primary border-border-light hover:bg-error-light'}`}
                          aria-pressed={s.presente === false}
                          aria-label={`Marcar ${s.nome} como ausente`}
                        >
                          Ausente
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border-light bg-white">
            <button
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 rounded-lg border border-border-light text-sm hover:bg-accent disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-primary text-white text-sm hover:bg-primary-hover disabled:opacity-50"
            >
              {saving ? 'Salvando...' : 'Salvar Presenças'}
            </button>
            <span className="sr-only" aria-live="polite"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceForm;

