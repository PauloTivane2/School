import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import FuncionarioForm from '../pages/funcionariosView';
import FuncionarioEditForm from '../pages/funcionarioEditView';

export interface Funcionario {
  id: number;
  nome: string;
  papel: 'Professor' | 'Diretor' | 'Secretaria' | 'Admin';
  email?: string;
  contacto1?: string;
  contacto2?: string;
  contacto3?: string;
  ativo?: boolean;
  usuario?: number;
}

const FuncionariosList = () => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editFuncionario, setEditFuncionario] = useState<Funcionario | null>(null);

  useEffect(() => {
    fetchFuncionarios();
  }, []);

  const fetchFuncionarios = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/funcionarios');
      if (!res.ok) {
        console.error('Erro ao buscar dados:', res.statusText);
        return;
      }
      const data = await res.json();
      if (!Array.isArray(data)) {
        console.error('Resposta inesperada:', data);
        return;
      }

      // 🔹 Formata dados garantindo que contatos não fiquem nulos
      const formatted = data.map((f: any) => ({
        id: f.id_funcionarios,
        nome: f.nome_funcionario,
        papel: f.funcao,
        email: f.email || '', // fallback para string vazia
        contacto1: f.contacto1 || '', // fallback para string vazia
        contacto2: f.contacto2 || '',
        contacto3: f.contacto3 || '',
        ativo: f.estado === 'ativo',
        usuario: f.id_funcionarios,
      }));

      setFuncionarios(formatted);
    } catch (err) {
      console.error('Erro ao buscar funcionários:', err);
    }
  };

  const handleEdit = async (f: Funcionario) => {
    const res = await fetch(`http://localhost:3000/api/funcionarios/${f.id}`);
    const data = await res.json();

    setEditFuncionario({
      id: data.id_funcionarios,
      nome: data.nome_funcionario,
      papel: data.funcao,
      email: data.email || '',
      contacto1: data.contacto1 || '',
      contacto2: data.contacto2 || '',
      contacto3: data.contacto3 || '',
      ativo: data.estado === 'ativo',
      usuario: data.id_funcionarios,
    });
    setShowEditForm(true);
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!confirm('Deseja realmente eliminar este funcionário?')) return;
    try {
      await fetch(`http://localhost:3000/api/funcionarios/${id}`, { method: 'DELETE' });
      setFuncionarios(prev => prev.filter(f => f.id !== id));
    } catch (err) {
      console.error(err);
      alert('Erro ao eliminar funcionário');
    }
  };

  const filtered = funcionarios.filter(f =>
    f.nome.toLowerCase().includes(search.toLowerCase()) ||
    f.papel.toLowerCase().includes(search.toLowerCase()) ||
    (f.usuario && f.usuario.toString().includes(search))
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-primary">Gestão de Funcionários</h2>
          <span className="text-primary/80 font-medium bg-neutral-bg px-2 py-1 rounded shadow-sm">
            Total: {filtered.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <label className="font-medium text-primary/80">Pesquisar:</label>
          <input
            type="text"
            placeholder="Nome, Cargo ou Usuário..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-3 py-1.4 border border-primary/20 rounded-md focus:ring-2 focus:ring-yellow-500"
          />
          <button
            onClick={() => { setEditFuncionario(null); setShowForm(true); }}
            className="px-3 py-1 bg-secondary text-white rounded flex items-center gap-1 hover:bg-secondary/90"
          >
            <Plus size={14} /> Adicionar
          </button>
        </div>
      </div>

      {/* Tabela com scroll horizontal */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-[1100px] w-full border-collapse text-left text-sm">
          <thead className="bg-accent/10">
            <tr>
              <th className="px-4 py-2 border w-16">ID</th>
              <th className="px-4 py-2 border w-48">Nome</th>
              <th className="px-4 py-2 border w-32">Cargo</th>
              <th className="px-4 py-2 border w-32">Contato 1</th>
              <th className="px-4 py-2 border w-32">Contato 2</th>
              <th className="px-4 py-2 border w-32">Contato 3</th>
              <th className="px-4 py-2 border w-48">Email</th>
              <th className="px-4 py-2 border w-16">Ativo</th>
              <th className="px-4 py-2 border w-24 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/10">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-6 text-center text-primary/60">
                  Nenhum funcionário encontrado
                </td>
              </tr>
            ) : (
              filtered.map(f => (
                <tr key={f.id} className="hover:bg-accent/10">
                  <td className="px-4 py-2">{f.usuario}</td>
                  <td className="px-4 py-2">{f.nome}</td>
                  <td className="px-4 py-2">{f.papel}</td>
                  <td className="px-4 py-2">{f.contacto1 || ''}</td>
                  <td className="px-4 py-2">{f.contacto2 || ''}</td>
                  <td className="px-4 py-2">{f.contacto3 || ''}</td>
                  <td className="px-4 py-2">{f.email}</td>
                  <td className="px-4 py-2">{f.ativo ? 'Sim' : 'Não'}</td>
                  <td className="px-4 py-2 flex justify-center gap-2">
                    <button onClick={() => handleEdit(f)} className="text-secondary hover:text-secondary/80">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(f.id)} className="text-primary hover:text-primary/80">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Forms */}
      {showForm && <FuncionarioForm onClose={() => setShowForm(false)} onSuccess={fetchFuncionarios} />}
      {showEditForm && editFuncionario && (
        <FuncionarioEditForm funcionario={editFuncionario} onClose={() => setShowEditForm(false)} onSuccess={fetchFuncionarios} />
      )}
    </div>
  );
};

export default FuncionariosList;
