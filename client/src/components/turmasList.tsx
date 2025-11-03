import { useState, useEffect } from "react";
import { Edit, Trash2 } from "lucide-react";
import { TurmasPage as TurmaForm } from "../pages/turmas";  

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
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Gestão de Classes</h2>
            <p className="text-sm text-neutral-gray mt-1">
              Total de classes: <span className="font-medium text-text-primary">{classes.length}</span>
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="btn-primary flex items-center gap-2"
            aria-label="Adicionar classe"
          >
            + Nova Classe
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-text-primary">Pesquisar:</label>
          <input
            type="text"
            placeholder="Turma, disciplina ou professor"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field w-64"
            aria-label="Pesquisar classe"
          />
        </div>
      </div>

      {/* Tabela */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border-light">
            <thead className="table-header">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Turma</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Disciplina</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Professor</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border-light bg-white">
              {filteredClasses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-neutral-gray">
                    Nenhuma classe encontrada
                  </td>
                </tr>
              ) : (
                filteredClasses.map(cl => (
                  <tr key={cl.id} className="table-row">
                    <td className="px-4 py-3 text-sm text-text-primary font-medium">{cl.id}</td>
                    <td className="px-4 py-3 text-sm text-text-primary">{cl.turma.nome}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{cl.disciplina}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{cl.professor}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(cl)}
                          className="p-2 text-primary hover:bg-accent rounded-lg transition-all duration-150"
                          aria-label="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(cl.id)}
                          className="p-2 text-error hover:bg-accent rounded-lg transition-all duration-150"
                          aria-label="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <TurmaForm turma={editTurma} onClose={handleClose} refresh={fetchClasses} />
      )}
    </div>
  );
};

export default ClassesList;


