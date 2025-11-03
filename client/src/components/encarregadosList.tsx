import { useState, useEffect } from "react";
import { Edit, Trash2 } from "lucide-react";
import { EncarregadosPage as EncarregadoForm } from "../pages/encarregados";
import { EncarregadosEditPage as EncarregadoEditForm } from "../pages/encarregados";  

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
      setGuardians(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erro ao buscar encarregados:', err);
      setGuardians([]);
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
          <h2 className="text-2xl font-bold text-primary">Gestão de Encarregados</h2>
          <span className="text-primary/80 font-semibold bg-neutral-bg px-3 py-1 rounded-md shadow-sm">
            Total: {guardians.length}
          </span>
        </div>

        <div className="flex items-center gap-5">
          <label className="text-primary/80 font-semibold text-sm">Pesquisar:</label>
          <input
            type="text"
            placeholder="nome ou aluno..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-primary/20 rounded-md px-3 py-1 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleAdd}
            className="bg-secondary hover:bg-secondary/90 text-white font-semibold px-6 py-1.5 rounded-md shadow-sm transition"
          >
            + Adicionar
          </button>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="min-w-[1400px] w-full border-collapse">
          <thead className="bg-neutral-bg/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-primary/80 uppercase min-w-[160px]">Encarregado</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-primary/80 uppercase">Contacto 1</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-primary/80 uppercase">Contacto 2</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-primary/80 uppercase">Contacto 3</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-primary/80 uppercase">Morada</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-primary/80 uppercase">Aluno</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-primary/80 uppercase">Classe</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-primary/80 uppercase">Turma</th>
              <th className="px-6 py-3 text-center text-xs font-bold text-primary/80 uppercase">Ações</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-primary/10">
            {filteredGuardians.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-8 text-center text-primary/60">
                  Nenhum encarregado encontrado
                </td>
              </tr>
            ) : (
              filteredGuardians.map((g) => (
                <tr key={g.id} className="hover:bg-neutral-bg/50">
                  <td className="px-6 py-4 text-sm text-primary">{g.nome}</td>
                  <td className="px-6 py-4 text-sm text-primary/70">{g.contacto1}</td>
                  <td className="px-6 py-4 text-sm text-primary/70">{g.contacto2}</td>
                  <td className="px-6 py-4 text-sm text-primary/70">{g.contacto3}</td>
                  <td className="px-6 py-4 text-sm text-primary/70">{g.morada}</td>
                  <td className="px-6 py-4 text-sm text-primary">{g.aluno}</td>
                  <td className="px-6 py-4 text-sm text-primary/70">{g.classe}</td>
                  <td className="px-6 py-4 text-sm text-primary/70">{g.turma}</td>
                  <td className="px-6 py-4 text-sm text-primary/70 flex justify-center space-x-4">
                    <button
                      onClick={() => handleEdit(g)}
                      className="text-secondary hover:text-secondary/80"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(g.id)}
                      className="text-primary hover:text-primary/80"
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
