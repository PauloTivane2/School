// frontend/src/components/alunos/StudentsList.tsx
import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import StudentForm from '../pages/alunosView';
import StudentEditForm from '../pages/alunosEditarView';

export interface Student {
  id: number;
  usuario?: string;
  nome: string;
  data_nascimento: string;
  genero: string;
  numero_identificacao: string;
  turma_id: number;
  turma_nome: string;
  classe_id?: number;
  classe_nome?: string;
  encarregado_nome: string;
  status?: string;
  pagamento?: string;
}

const StudentsList = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);

  const [selectedYear, setSelectedYear] = useState<string>('');
  const [turmas, setTurmas] = useState<{ id_turma: number; turma_nome: string; classe_nome: string; classe_turma: string }[]>([]);
  const [selectedTurma, setSelectedTurma] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setStudents([]);
    setTurmas([]);
    setSelectedTurma('');
  }, []);

    const fetchStudents = async (q = '', ano = '', turma_id = '') => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (q) params.append('q', q);
        if (ano) params.append('ano', ano);
        if (turma_id) params.append('turma_id', turma_id);
        const qs = params.toString() ? `?${params.toString()}` : '';
        const res = await fetch(`http://localhost:3000/api/students${qs}`);
        if (!res.ok) throw new Error('Erro ao buscar alunos');
        const data = await res.json();
        const formatted: Student[] = data.map((s: any) => ({
    id: s.usuario ?? s.id_aluno ?? s.id,
    usuario: s.usuario ?? '',
    nome: s.nome ?? s.nome_aluno ?? '',
    data_nascimento: s.data_nascimento,
    genero: s.genero,
    numero_identificacao: s.numero_identificacao ?? s.bi,
    turma_id: s.turma_id ?? s.id_turma ?? 0,
    turma_nome: s.turma_nome ?? s.turma ?? '',
    classe_id: s.classe_id ?? s.id_classes ?? undefined,
    classe_nome: s.classe_nome ?? s.nome_classe ?? '',
    encarregado_nome: s.encarregado_nome ?? '',
    status: s.status ?? s.estado ?? '',
    pagamento: s.pagamento ?? '',
  }));

      setStudents(formatted);
    } catch (err) {
      console.error(err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTurmasByYear = async (ano: string) => {
    try {
      if (!ano) {
        setTurmas([]);
        setSelectedTurma('');
        return;
      }
      const res = await fetch(`http://localhost:3000/api/students/dropdowns/turmas?ano=${encodeURIComponent(ano)}`);

      if (!res.ok) throw new Error('Erro ao buscar turmas');
      const data = await res.json();
      setTurmas(data);
      setSelectedTurma('');
    } catch (err) {
      console.error(err);
      setTurmas([]);
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const ano = e.target.value;
    setSelectedYear(ano);
    if (ano) {
      fetchTurmasByYear(ano);
      fetchStudents(search.trim(), ano, '');
    } else {
      setStudents([]);
      setTurmas([]);
    }
  };

  const handleTurmaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const turmaId = e.target.value;
    setSelectedTurma(turmaId);
    fetchStudents(search.trim(), selectedYear, turmaId);
  };

  const handleAdd = () => {
    setEditingStudent(undefined);
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingStudent(undefined);
    setIsEditing(false);
  };

  const handleFormSuccess = () => {
    fetchStudents(search.trim(), selectedYear, selectedTurma);
    handleClose();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja realmente eliminar este aluno?')) return;
    try {
      const res = await fetch(`http://localhost:3000/api/students/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao eliminar');
      setStudents(prev => prev.filter(s => s.id !== id));
      alert('Aluno eliminado com sucesso!');
    } catch (err) {
      console.error(err);
      alert('Erro ao eliminar aluno');
    }
  };

  const handleSearch = async () => {
    await fetchStudents(search.trim(), selectedYear, selectedTurma);
  };

  const anos = Array.from({ length: 8 }, (_, i) => 2023 + i);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Gestão de Alunos</h2>
            <p className="text-sm text-neutral-gray mt-1">
              Total de alunos: <span className="font-medium text-text-primary">{students.length}</span>
            </p>
          </div>

          <button
            onClick={handleAdd}
            className="btn-primary flex items-center gap-2"
            aria-label="Adicionar aluno"
          >
            <Plus size={16} /> Novo Aluno
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-text-primary">Ano:</label>
            <select
              value={selectedYear}
              onChange={handleYearChange}
              className="input-field w-28"
              aria-label="Selecionar ano"
            >
              <option value="" disabled>Selecionar</option>
              {anos.map(a => <option key={a} value={String(a)}>{a}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-text-primary">Turma:</label>
            <select
              value={selectedTurma}
              onChange={handleTurmaChange}
              className="input-field w-44"
              aria-label="Selecionar turma"
              disabled={!selectedYear}
            >
              <option value="" disabled>Selecionar turma</option>
              {turmas.map(t => (
                <option key={t.id_turma} value={String(t.id_turma)}>
                  {t.classe_turma}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-text-primary">Pesquisar:</label>
            <input
              type="text"
              placeholder="Nome ou NUI"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field w-52"
              aria-label="Pesquisar aluno"
            />
          </div>

          <button
            onClick={handleSearch}
            className="btn-secondary"
            aria-label="Buscar"
          >
            Buscar
          </button>
        </div>
      </div>

      {/* Tabela */}
      {!selectedYear ? (
        <div className="card text-center text-neutral-gray">
          <p>Selecione o ano letivo para visualizar os alunos</p>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border-light">
              <thead className="table-header">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Usuário</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Nome</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">NUI</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Gênero</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Classe</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Turma</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Encarregado</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Pagamento</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light bg-white">
                {loading ? (
                  <tr><td colSpan={10} className="px-4 py-8 text-center text-neutral-gray">Carregando...</td></tr>
                ) : students.length === 0 ? (
                  <tr><td colSpan={10} className="px-4 py-8 text-center text-neutral-gray">Nenhum aluno encontrado</td></tr>
                ) : (
                  students.map(s => (
                    <tr key={s.id} className="table-row">
                      <td className="px-4 py-3 text-sm text-text-primary font-medium">{s.usuario}</td>
                      <td className="px-4 py-3 text-sm text-text-primary">{s.nome}</td>
                      <td className="px-4 py-3 text-sm text-neutral-gray">{s.numero_identificacao}</td>
                      <td className="px-4 py-3 text-sm text-text-secondary">{s.genero}</td>
                      <td className="px-4 py-3 text-sm text-text-secondary">{s.classe_nome}</td>
                      <td className="px-4 py-3 text-sm text-text-secondary">{s.turma_nome}</td>
                      <td className="px-4 py-3 text-sm text-text-secondary">{s.encarregado_nome}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          s.status === 'ativo' ? 'bg-success-light text-success' : 'bg-error-light text-error'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-text-secondary">{s.pagamento}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => handleEdit(s)} 
                            className="p-2 text-primary hover:bg-accent rounded-lg transition-all duration-150"
                            aria-label="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(s.id)} 
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
      )}

      {showForm && (
        isEditing && editingStudent ? (
          <StudentEditForm student={editingStudent} onClose={handleClose} onSuccess={handleFormSuccess} />
        ) : (
          <StudentForm onClose={handleClose} onSuccess={handleFormSuccess} />
        )
      )}
    </div>
  );
};

export default StudentsList;
