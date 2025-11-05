import { useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, RefreshCw, Search } from 'lucide-react';
import FuncionarioForm from './FuncionariosPage';
import ConfirmDialog from '../../components/ConfirmDialog';

interface FuncionarioRow {
  id: number;
  nome_funcionario: string;
  funcao: string;
  email?: string;
  contacto1?: string;
  contacto2?: string;
  contacto3?: string;
  ativo?: boolean;
}

export default function FuncionariosMainPage() {
  const [items, setItems] = useState<FuncionarioRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<FuncionarioRow | null>(null);
  const [dialog, setDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'confirm' | 'alert' | 'success' | 'error' | 'warning';
    onConfirm?: () => void;
  }>({ isOpen: false, title: '', message: '', type: 'confirm' });

  const API = (import.meta as any).env.VITE_API_URL as string;

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const url = new URL(`${API}/funcionarios`);
      if (query) url.searchParams.set('q', query);
      if (roleFilter) url.searchParams.set('funcao', roleFilter);
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error('Falha ao carregar funcionários');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : data?.data || []);
    } catch (e: any) {
      setError(e.message || 'Erro desconhecido');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    let r = items;
    if (query) r = r.filter(i => (i.nome_funcionario || '').toLowerCase().includes(query.toLowerCase()));
    if (roleFilter) r = r.filter(i => (i.funcao || '') === roleFilter);
    return r;
  }, [items, query, roleFilter]);

  const openCreate = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (row: FuncionarioRow) => { setEditing(row); setFormOpen(true); };

  const handleDelete = async (row: FuncionarioRow) => {
    setDialog({
      isOpen: true,
      title: 'Excluir Funcionário',
      message: `Tem certeza que deseja excluir "${row.nome_funcionario}"?`,
      type: 'confirm',
      onConfirm: async () => {
        try {
          const res = await fetch(`${API}/funcionarios/${row.id}`, { method: 'DELETE' });
          if (!res.ok) throw new Error('Erro ao excluir');
          await load();
          setDialog({ isOpen: true, title: 'Sucesso', message: 'Excluído com sucesso.', type: 'success' });
        } catch (e: any) {
          setDialog({ isOpen: true, title: 'Erro', message: e.message || 'Erro ao excluir', type: 'error' });
        }
      }
    });
  };

  const onSuccess = async () => { await load(); };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Funcionários</h1>
          <p className="text-sm text-neutral-gray mt-1">Gestão de colaboradores com operações de CRUD</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setRefreshing(true); load(); }}
            className="px-3 py-2 bg-white border border-border-light rounded-lg hover:bg-accent flex items-center gap-2 disabled:opacity-50"
            disabled={refreshing || loading}
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} /> Atualizar
          </button>
          <button
            onClick={openCreate}
            className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover flex items-center gap-2"
          >
            <Plus size={16} /> Novo
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-border-light p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Pesquisar</label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-gray" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Nome do funcionário"
                className="pl-9 input-field"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Função</label>
            <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="input-field">
              <option value="">Todos</option>
              <option value="Professor">Professor</option>
              <option value="Diretor">Diretor</option>
              <option value="Admin">Admin</option>
              <option value="Secretaria">Secretaria</option>
            </select>
          </div>
          <div className="flex md:justify-end gap-2">
            <button onClick={() => { setQuery(''); setRoleFilter(''); }} className="px-4 py-2 rounded-lg border border-border-light text-sm hover:bg-accent">Limpar</button>
            <button onClick={load} className="px-4 py-2 rounded-lg bg-primary text-white text-sm hover:bg-primary-hover">Filtrar</button>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl shadow-sm border border-border-light overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead className="sticky top-0 bg-white border-b border-border-light z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">Função</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">Contacto</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-gray uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {loading ? (
                <tr><td className="px-6 py-6 text-center text-neutral-gray" colSpan={5}>Carregando...</td></tr>
              ) : error ? (
                <tr><td className="px-6 py-6 text-center text-error" colSpan={5}>{error}</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td className="px-6 py-6 text-center text-neutral-gray" colSpan={5}>Nenhum funcionário encontrado</td></tr>
              ) : (
                filtered.map((row) => (
                  <tr key={row.id} className="even:bg-neutral-light/40">
                    <td className="px-6 py-3 text-sm text-text-primary truncate">{row.nome_funcionario}</td>
                    <td className="px-6 py-3 text-sm text-text-primary truncate">{row.funcao}</td>
                    <td className="px-6 py-3 text-sm text-text-primary truncate">{row.email || '-'}</td>
                    <td className="px-6 py-3 text-sm text-text-primary truncate">{row.contacto1 || '-'}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(row)} className="px-2 py-1 rounded border border-border-light hover:bg-accent" aria-label={`Editar ${row.nome_funcionario}`}>
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => handleDelete(row)} className="px-2 py-1 rounded border border-border-light hover:bg-error-light" aria-label={`Excluir ${row.nome_funcionario}`}>
                          <Trash2 size={16} className="text-error" />
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

      {formOpen && (
        <FuncionarioForm
          funcionario={editing}
          onClose={() => { setFormOpen(false); setEditing(null); }}
          onSuccess={onSuccess}
        />
      )}

      <ConfirmDialog
        isOpen={dialog.isOpen}
        title={dialog.title}
        message={dialog.message}
        type={dialog.type}
        onConfirm={dialog.onConfirm}
        onCancel={() => setDialog(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
