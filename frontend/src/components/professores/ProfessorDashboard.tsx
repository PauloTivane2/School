// frontend/src/components/professor/ProfessorDashboard.tsx
import { useState, useEffect } from 'react';
import { Settings, Edit, Plus, FileText } from 'lucide-react';
//import PresencaForm from '../presencas/presencasForm';
import NotaForm from '../notas/notasList';

interface Aluno {
  id: number;
  nome: string;
  presente?: boolean;
}

interface ProfessorClasse {
  id: number;
  nome_classe: string;
  ano_letivo: number;
  disciplina: string;
  alunos: Aluno[];
}

const ProfessorDashboard = () => {
  const [classes, setClasses] = useState<ProfessorClasse[]>([]);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPresencaForm, setShowPresencaForm] = useState(false);
  const [showNotaForm, setShowNotaForm] = useState(false);

  // Carregar turmas do professor
  const fetchClasses = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/professor/classes');
      const data = await res.json();
      setClasses(data);
    } catch (err) {
      console.error('Erro ao carregar turmas:', err);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const filteredClasses = classes.filter((c) => {
    const search = searchTerm.toLowerCase();
    return !search || c.disciplina.toLowerCase().includes(search) || c.nome_classe.toLowerCase().includes(search);
  });

  const handlePresenca = (id: number) => {
    setSelectedClass(id);
    setShowPresencaForm(true);
  };

  const handleNotas = (id: number) => {
    setSelectedClass(id);
    setShowNotaForm(true);
  };

  return (
    <div className="space-y-6 p-4">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Painel do Professor</h2>
        <div className="relative">
          <button
            className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            <Settings size={18} /> Definições
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-3 mt-4">
        <input
          type="text"
          placeholder="Pesquisar disciplina/classe"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-2 py-1 border rounded w-48"
        />
      </div>

      {/* Tabela de turmas */}
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full border border-gray-300 rounded-lg shadow-sm">
          <thead className="bg-gradient-to-r from-green-300 via-green-400 to-green-300 text-gray-900">
            <tr className="text-center">
              <th className="px-4 py-2 font-semibold text-sm border-r">Classe</th>
              <th className="px-4 py-2 font-semibold text-sm border-r">Ano</th>
              <th className="px-4 py-2 font-semibold text-sm border-r">Disciplina</th>
              <th className="px-4 py-2 font-semibold text-sm">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white text-center">
            {filteredClasses.map((c) => (
              <tr key={c.id} className="hover:bg-green-50 transition">
                <td className="px-4 py-2">{c.nome_classe}</td>
                <td className="px-4 py-2">{c.ano_letivo}</td>
                <td className="px-4 py-2">{c.disciplina}</td>
                <td className="px-4 py-2 flex items-center justify-center gap-3">
                  <button 
                    onClick={() => handlePresenca(c.id)}
                    className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
                  >
                    <Plus size={16} /> Presença
                  </button>
                  <button 
                    onClick={() => handleNotas(c.id)}
                    className="px-2 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 flex items-center gap-1"
                  >
                    <FileText size={16} /> Notas
                  </button>
                </td>
              </tr>
            ))}

            {filteredClasses.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  Nenhuma turma encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Forms */}
      {showPresencaForm && selectedClass && (
        <PresencaForm
          turmaId={selectedClass}
          onClose={() => setShowPresencaForm(false)}
          refresh={fetchClasses}
        />
      )}

      {showNotaForm && selectedClass && (
        <NotaForm
          turmaId={selectedClass}
          onClose={() => setShowNotaForm(false)}
          refresh={fetchClasses}
        />
      )}
    </div>
  );
};

export default ProfessorDashboard;







