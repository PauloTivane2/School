// frontend/src/components/alunos/StudentsList.tsx
import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import StudentForm from './alunosView';
import StudentEditForm from './alunosEditarView';

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
    <div className="bg-white rounded-lg shadow-md">
      {/* Header + Filtros */}
      <div className="p-4 border-b flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-2xl font-bold text-gray-800">Gestão de Alunos</h2>
          <span className="text-gray-700 font-semibold bg-gray-100 px-3 py-1 rounded-md shadow-sm">
            Total: {students.length}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 ml-auto justify-end">
          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm w-18 focus:outline-none focus:ring-2 focus:ring-blue-400"
            title="Ano"
          >
            <option value="" disabled>Ano</option>
            {anos.map(a => <option key={a} value={String(a)}>{a}</option>)}
          </select>

          <button
            onClick={handleSearch}
            className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 text-sm"
          >
            Pesquisar
          </button>

          <input
            type="text"
            placeholder="Pesquisar..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm w-34 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <select
            value={selectedTurma}
            onChange={handleTurmaChange}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm w-31 focus:outline-none focus:ring-2 focus:ring-blue-400"
            title="Classe / Turma"
          >
            <option value="" disabled>Classe / Turma</option>
            {turmas.map(t => (
              <option key={t.id_turma} value={String(t.id_turma)}>
                {t.classe_turma}
              </option>
            ))}
          </select>

          <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1.5 rounded-md shadow-sm flex items-center gap-1"
          >
            <Plus size={16} /> Classe
          </button>
        </div>
      </div>

      {/* Tabela */}
      {!selectedYear ? (
        <div className="p-6 text-center text-gray-500">Selecione o Ano para ver a tabela de alunos.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[1000px] w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase">Usuário</th>
                <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase">Nome</th>
                <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase">NUI</th>
                <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase">Gênero</th>
                <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase">Classe</th>
                <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase">Turma</th>
                <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase">Encarregado</th>
                <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase">Pagamento</th>
                <th className="px-4 py-2 text-center text-xs font-bold text-gray-700 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={10} className="px-4 py-6 text-center text-gray-500">Carregando...</td></tr>
              ) : students.length === 0 ? (
                <tr><td colSpan={10} className="px-4 py-6 text-center text-gray-500">Nenhum aluno encontrado</td></tr>
              ) : (
                students.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-800">{s.usuario}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">{s.nome}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{s.numero_identificacao}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{s.genero}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{s.classe_nome}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{s.turma_nome}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{s.encarregado_nome}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{s.status}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{s.pagamento}</td>
                    <td className="px-4 py-2 text-sm text-gray-600 flex justify-center space-x-2">
                      <button onClick={() => handleEdit(s)} className="text-blue-600 hover:text-blue-800"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
