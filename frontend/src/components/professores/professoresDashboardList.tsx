// frontend/src/components/professores/ProfessorDashboard.tsx
import { useState, useEffect } from 'react';
import { Settings, Edit, Trash2, Plus } from 'lucide-react';
import ClasseForm from '../classes/classesView';
import DisciplinasForm from '../disciplinas/disciplinasView';

interface Professor {
  id: number;
  nome_funcionario: string;
  bi: string;
  nuit: string;
  nivel_academico: string;
  funcao: string;
  classes: string; // Concatenado: Classe - Turma
}

interface Aluno {
  id_aluno: number;
  nome_aluno: string;
  bi: string;
  nuit: string;
  turma: string;
  ano: number;
  estado: string;
}

const ProfessorDashboard = () => {
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [showClasseForm, setShowClasseForm] = useState(false);
  const [showDisciplinaForm, setShowDisciplinaForm] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  // Carregar dados do professor
  const fetchProfessor = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/professor/meus-dados');
      const data = await res.json();
      setProfessor(data);
    } catch (err) {
      console.error('Erro ao carregar dados do professor:', err);
    }
  };

  // Carregar alunos filtrados por ano e classe
  const fetchAlunos = async (ano: number, classe: string) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/professor/alunos?ano=${ano}&classe=${encodeURIComponent(classe)}`
      );
      const data = await res.json();
      setAlunos(data);
    } catch (err) {
      console.error('Erro ao carregar alunos:', err);
    }
  };

  useEffect(() => {
    fetchProfessor();
  }, []);

  // Atualizar alunos quando filtros mudarem
  useEffect(() => {
    if (selectedYear && selectedClass) {
      fetchAlunos(selectedYear, selectedClass);
    } else {
      setAlunos([]);
    }
  }, [selectedYear, selectedClass]);

  const handleDelete = async (id: number) => {
    if (confirm('Deseja eliminar este registo?')) {
      try {
        const res = await fetch(`http://localhost:3000/api/professor/alunos/${id}`, {
          method: 'DELETE'
        });
        if (!res.ok) throw new Error(await res.text());
        alert('✅ Registo eliminado com sucesso!');
        if (selectedYear && selectedClass) fetchAlunos(selectedYear, selectedClass);
      } catch (err: any) {
        alert('❌ ' + (err.message || 'Erro desconhecido'));
      }
    }
  };

  const handleEdit = (id: number) => {
    alert(`Editar registo ID: ${id}`);
  };

  const filteredAlunos = alunos.filter((a) => {
    const search = searchTerm.toLowerCase();
    return (
      !search ||
      a.nome_aluno.toLowerCase().includes(search) ||
      a.bi.toLowerCase().includes(search) ||
      a.nuit.toLowerCase().includes(search)
    );
  });

  return (
    <div className="space-y-6 p-4">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Painel do Professor</h2>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            <Settings size={18} /> Definições
          </button>
        </div>
      </div>

      {/* Filtros e Ações */}
      <div className="flex flex-wrap items-center gap-3 mt-4">
        <button
          onClick={() => setShowClasseForm(true)}
          className="px-4 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition flex items-center gap-1"
        >
          <Plus size={16} /> Classe
        </button>

        <button
          onClick={() => setShowDisciplinaForm(true)}
          className="px-4 py-1 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition flex items-center gap-1"
        >
          <Plus size={16} /> Disciplina
        </button>

        <div className="flex items-center gap-2 ml-2">
          <label className="text-sm font-bold">Ano:</label>
          <select
            value={selectedYear || ''}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-2 py-1 border rounded w-24"
          >
            <option value="" disabled>
              Selecionar
            </option>
            {Array.from({ length: 8 }, (_, i) => 2023 + i).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-bold">Classe:</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-2 py-1 border rounded w-32"
          >
            <option value="" disabled>
              Selecionar
            </option>
            {professor?.classes.split(',').map((nome) => (
              <option key={nome} value={nome}>
                {nome}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-bold">Pesquisar:</label>
          <input
            type="text"
            placeholder="Nome/BI/NUIT"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-2 py-1 border rounded w-48"
          />
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto mt-2">
        <table className="min-w-full border border-gray-300 rounded-lg shadow-sm">
          <thead className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 text-gray-900">
            <tr className="text-center">
              {!selectedYear && !selectedClass ? (
                <>
                  <th className="px-4 py-2 font-semibold text-sm border-r">Usuário (ID)</th>
                  <th className="px-4 py-2 font-semibold text-sm border-r">BI</th>
                  <th className="px-4 py-2 font-semibold text-sm border-r">NUIT</th>
                  <th className="px-4 py-2 font-semibold text-sm border-r">Nível</th>
                  <th className="px-4 py-2 font-semibold text-sm border-r">Função</th>
                  <th className="px-4 py-2 font-semibold text-sm">Classes</th>
                </>
              ) : (
                <>
                  <th className="px-4 py-2 font-semibold text-sm border-r">Nome do Aluno</th>
                  <th className="px-4 py-2 font-semibold text-sm border-r">BI</th>
                  <th className="px-4 py-2 font-semibold text-sm border-r">NUIT</th>
                  <th className="px-4 py-2 font-semibold text-sm border-r">Turma</th>
                  <th className="px-4 py-2 font-semibold text-sm border-r">Ano</th>
                  <th className="px-4 py-2 font-semibold text-sm border-r">Estado</th>
                  <th className="px-4 py-2 font-semibold text-sm">Ações</th>
                </>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white text-center">
            {!selectedYear && !selectedClass && professor ? (
              <tr className="hover:bg-yellow-50 transition">
                <td className="px-4 py-2">{professor.id}</td>
                <td className="px-4 py-2">{professor.bi}</td>
                <td className="px-4 py-2">{professor.nuit}</td>
                <td className="px-4 py-2">{professor.nivel_academico}</td>
                <td className="px-4 py-2">{professor.funcao}</td>
                <td className="px-4 py-2">{professor.classes}</td>
              </tr>
            ) : filteredAlunos.length > 0 ? (
              filteredAlunos.map((a) => (
                <tr key={a.id_aluno} className="hover:bg-yellow-50 transition">
                  <td className="px-4 py-2">{a.nome_aluno}</td>
                  <td className="px-4 py-2">{a.bi}</td>
                  <td className="px-4 py-2">{a.nuit}</td>
                  <td className="px-4 py-2">{a.turma}</td>
                  <td className="px-4 py-2">{a.ano}</td>
                  <td className="px-4 py-2">{a.estado}</td>
                  <td className="px-4 py-2 flex items-center justify-center gap-3">
                    <button
                      onClick={() => handleEdit(a.id_aluno)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(a.id_aluno)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={selectedYear && selectedClass ? 7 : 6} className="text-center py-4 text-gray-500">
                  Nenhum registro encontrado para os filtros selecionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Forms */}
      {showClasseForm && (
<ClasseForm
  classe={null}
  onClose={() => {
    setShowClasseForm(false);
  }}
  refresh={fetchProfessor} // 🔹 adiciona a função de refresh
/>

      )}

      {showDisciplinaForm && (
<DisciplinasForm
  disciplina={null}
  onClose={() => setShowDisciplinaForm(false)}
  refresh={fetchProfessor} // 🔹 adiciona a função de refresh
/>

      )}
    </div>
  );
};

export default ProfessorDashboard;
