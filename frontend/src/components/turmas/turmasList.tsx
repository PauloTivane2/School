import { useState, useEffect } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import TurmaForm from './turmasView';  

export interface Turma {
  id_turma: number;
  nome: string;
  ano_letivo: number;
  nivel: string;
}

export interface Classe {
  id: number;
  turma: Turma;
  disciplina: string;
  professor: string;
}

const ClassesList = () => {
  const [classes, setClasses] = useState<Classe[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editTurma, setEditTurma] = useState<any | null>(null); // Ajustado para qualquer turma

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/classes');
      const data = await res.json();

      const formatted: Classe[] = data.map((c: any) => ({
        id: c.id,
        turma: c.turma || { id: 0, nome: 'Sem turma', ano_letivo: 0, nivel: '' },
        disciplina: c.disciplina || 'Sem disciplina',
        professor: c.professor || 'Sem professor',
      }));

      setClasses(formatted);
    } catch (err) {
      console.error('Erro ao buscar classes:', err);
    }
  };

  const handleAdd = () => {
    setEditTurma(null);
    setShowForm(true);
  };

  const handleEdit = (cl: Classe) => {
    setEditTurma(cl.turma); // Ajustado para enviar a turma para o formulário
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditTurma(null);
    fetchClasses();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja realmente eliminar esta classe?')) return;
    try {
      await fetch(`http://localhost:3000/api/classes/${id}`, { method: 'DELETE' });
      setClasses(prev => prev.filter(c => c.id !== id));
      alert('Classe eliminada com sucesso!');
    } catch (err) {
      console.error('Erro ao eliminar classe:', err);
      alert('Erro ao eliminar classe');
    }
  };

  const filteredClasses = classes.filter(c => {
    const query = search.toLowerCase();
    return c.turma.nome.toLowerCase().includes(query) ||
           c.disciplina.toLowerCase().includes(query) ||
           c.professor.toLowerCase().includes(query);
  });

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Cabeçalho */}
      <div className="p-6 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="flex items-center gap-12">
          <h2 className="text-2xl font-bold text-gray-800">Gestão de Classes</h2>
          <span className="text-gray-700 font-semibold bg-gray-100 px-3 py-1 rounded-md shadow-sm">
            Total: {classes.length}
          </span>
        </div>

        <div className="flex items-center gap-5">
          <label className="text-gray-700 font-semibold text-sm">Pesquisar:</label>
          <input
            type="text"
            placeholder="Classe, turma, disciplina ou professor..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleAdd}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-6 py-1.5 rounded-md shadow-sm transition"
          >
            + Adicionar
          </button>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full border-collapse">
          <thead className="bg-yellow-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Classe</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Turma</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Disciplina</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Professor</th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase">Ações</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filteredClasses.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  Nenhuma classe encontrada
                </td>
              </tr>
            ) : (
              filteredClasses.map(cl => (
                <tr key={cl.id} className="hover:bg-yellow-50">
                  <td className="px-6 py-4 text-sm text-gray-800">{cl.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{cl.turma.nome}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{cl.disciplina}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{cl.professor}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 flex justify-center gap-4">
                  <button
                    onClick={() => handleEdit(cl)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(cl.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showForm && (
        <TurmaForm turma={editTurma} onClose={handleClose} refresh={fetchClasses} />
      )}
    </div>
  );
};

export default ClassesList;


