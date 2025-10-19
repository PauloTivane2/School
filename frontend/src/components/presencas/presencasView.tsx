import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface AttendanceFormProps {
  turmaId: string;
  date: string;
  onClose: () => void;
}

interface Student {
  id: number;
  nome: string;
  presente?: boolean;
}

const AttendanceForm = ({ turmaId, date, onClose }: AttendanceFormProps) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, [turmaId]);

  const fetchStudents = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/attendance/students/${turmaId}`);
      const data = await response.json();
      setStudents(data.map((s: any) => ({ ...s, presente: true })));
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePresence = (studentId: number) => {
    setStudents(prev =>
      prev.map(s => s.id === studentId ? { ...s, presente: !s.presente } : s)
    );
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

      const response = await fetch('http://localhost:3000/api/attendance/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attendanceData),
      });

      if (!response.ok) throw new Error('Erro ao salvar presenças');

      alert('✅ Presenças registradas com sucesso!');
      onClose();
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
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Carregando alunos...</p>
        </div>
      </div>
    );
  }

  const presentes = students.filter(s => s.presente).length;
  const ausentes = students.length - presentes;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">Registrar Presença</h3>
              <p className="text-green-100 mt-1">
                Data: {new Date(date).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg"
            >
              <X size={24} />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <p className="text-green-100 text-sm">Presentes</p>
              <p className="text-2xl font-bold">{presentes}</p>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <p className="text-green-100 text-sm">Ausentes</p>
              <p className="text-2xl font-bold">{ausentes}</p>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-700">
                <th className="p-3">Aluno</th>
                <th className="p-3 text-center">Presente</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-b">
                  <td className="p-3">{s.nome}</td>
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={s.presente}
                      onChange={() => togglePresence(s.id)}
                      className="w-5 h-5 text-green-600"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold shadow"
            >
              {saving ? 'Salvando...' : 'Salvar Presenças'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceForm;
