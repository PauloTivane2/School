import { useState, useEffect } from 'react';
import { X, Save, BookOpen } from 'lucide-react';

interface GradeFormProps {
  turmaId: string;
  trimestre: string;
  onClose: () => void;
}

interface Student {
  id: number;
  nome: string;
}

interface Disciplina {
  id: number;
  nome: string;
}

const GradeForm = ({ turmaId, trimestre, onClose }: GradeFormProps) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedDisciplina, setSelectedDisciplina] = useState('');
  const [nota, setNota] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [turmaId]);

  const fetchData = async () => {
    try {
      const [studentsRes, disciplinasRes] = await Promise.all([
        fetch(`http://localhost:3000/api/grades/students/${turmaId}`),
        fetch('http://localhost:3000/api/grades/disciplinas')
      ]);

      const studentsData = await studentsRes.json();
      const disciplinasData = await disciplinasRes.json();

      setStudents(studentsData);
      setDisciplinas(disciplinasData);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('http://localhost:3000/api/grades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aluno_id: parseInt(selectedStudent),
          disciplina_id: parseInt(selectedDisciplina),
          valor: nota,
          trimestre: parseInt(trimestre),
          periodo: `${trimestre}º Trimestre`
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      alert('✅ Nota lançada com sucesso!');
      
      // Limpar formulário
      setSelectedStudent('');
      setSelectedDisciplina('');
      setNota('');
    } catch (error: any) {
      alert('❌ ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-2xl shadow-2xl">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-primary/70 font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
        <div className="bg-gradient-to-r from-secondary/90 to-accent/90 p-6 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <BookOpen size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Lançar Nota</h3>
                <p className="text-yellow-100">{trimestre}º Trimestre</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg">
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-primary/80 mb-2">
              Aluno *
            </label>
            <select
              required
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:ring-2 focus:ring-yellow-500"
            >
              <option value="">Selecione o aluno...</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary/80 mb-2">
              Disciplina *
            </label>
            <select
              required
              value={selectedDisciplina}
              onChange={(e) => setSelectedDisciplina(e.target.value)}
              className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:ring-2 focus:ring-yellow-500"
            >
              <option value="">Selecione a disciplina...</option>
              {disciplinas.map((disc) => (
                <option key={disc.id} value={disc.id}>
                  {disc.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary/80 mb-2">
              Nota (0-20) *
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="20"
              required
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:ring-2 focus:ring-yellow-500 text-2xl font-bold text-center"
              placeholder="0.0"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-primary/20 rounded-lg hover:bg-neutral-bg/50 font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 btn-success disabled:opacity-50 font-semibold shadow-md flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Salvar Nota
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GradeForm;