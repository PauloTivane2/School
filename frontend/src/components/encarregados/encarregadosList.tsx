import { useState, useEffect } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import EncarregadoForm from './encarregadosView';
import EncarregadoEditForm from './encarregadosEditView';  

export interface EncarregadoDetalhado {
  id: number;
  nome: string;
  contacto1: string;
  contacto2?: string;
  contacto3?: string;
  morada: string;
  aluno: string;
  classe: string;
  turma: string;
  email: string;
  cell: string;
}

const GuardiansView = () => {
  const [guardians, setGuardians] = useState<EncarregadoDetalhado[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingGuardian, setEditingGuardian] = useState<EncarregadoDetalhado | null>(null);

  useEffect(() => {
    fetchGuardians();
  }, []);

  const fetchGuardians = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/encarregados');
      const data = await res.json();
      setGuardians(data);
    } catch (err) {
      console.error('Erro ao buscar encarregados:', err);
    }
  };

  const handleEdit = (guardian: EncarregadoDetalhado) => {
    setEditingGuardian(guardian);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja realmente eliminar este encarregado?')) return;
    try {
      await fetch(`http://localhost:3000/api/encarregados/${id}`, {
        method: 'DELETE',
      });
      setGuardians(prev => prev.filter(g => g.id !== id));
      alert('✅ Encarregado eliminado com sucesso!');
    } catch (err) {
      console.error('Erro ao eliminar encarregado:', err);
      alert('❌ Erro ao eliminar encarregado');
    }
  };

  const handleAdd = () => {
    setEditingGuardian(null); // garante que abrirá o formulário de cadastro
    setShowForm(true);
  };

  const filteredGuardians = guardians.filter((g) => {
    const query = search.toLowerCase();
    return (
      g.nome.toLowerCase().includes(query) ||
      g.aluno.toLowerCase().includes(query) ||
      g.classe.toLowerCase().includes(query)
    );
  });

  return (
    <div className="bg-white rounded-lg shadow-md relative">
      {/* Cabeçalho */}
      <div className="p-6 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="flex items-center gap-12">
          <h2 className="text-2xl font-bold text-gray-800">Gestão de Encarregados</h2>
          <span className="text-gray-700 font-semibold bg-gray-100 px-3 py-1 rounded-md shadow-sm">
            Total: {guardians.length}
          </span>
        </div>

        <div className="flex items-center gap-5">
          <label className="text-gray-700 font-semibold text-sm">Pesquisar:</label>
          <input
            type="text"
            placeholder="nome ou aluno..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-1.5 rounded-md shadow-sm transition"
          >
            + Adicionar
          </button>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="min-w-[1400px] w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase min-w-[160px]">Encarregado</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Contacto 1</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Contacto 2</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Contacto 3</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Morada</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Aluno</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Classe</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Turma</th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase">Ações</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filteredGuardians.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                  Nenhum encarregado encontrado
                </td>
              </tr>
            ) : (
              filteredGuardians.map((g) => (
                <tr key={g.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800">{g.nome}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{g.contacto1}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{g.contacto2}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{g.contacto3}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{g.morada}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{g.aluno}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{g.classe}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{g.turma}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 flex justify-center space-x-4">
                    <button
                      onClick={() => handleEdit(g)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(g.id)}
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

      {/* Modal do formulário */}
      {editingGuardian ? (
        <EncarregadoEditForm
          encarregado={editingGuardian}
          onClose={() => setEditingGuardian(null)}
          onSuccess={() => {
            fetchGuardians();
            setEditingGuardian(null);
          }}
        />
      ) : null}

      {/* Modal de adicionar */}
      {showForm && !editingGuardian && (
        <EncarregadoForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            fetchGuardians();
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
};

export default GuardiansView;
