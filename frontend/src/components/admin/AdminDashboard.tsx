// frontend/src/components/admin/AdminDashboard.tsx
import { useState, useEffect } from 'react';
import { Settings, Edit, Trash2, Plus } from 'lucide-react';
import ClasseForm from '../classes/classesView';
import DisciplinasForm from '../disciplinas/disciplinasView';


interface Professor {
  nome: string;
  contacto1: string;
  contacto2?: string;
  contacto3?: string;
}

interface Classe {
  id_classes: number;
  nome_classe: string;
  turma: string; // 👈 nova propriedade
  ano_letivo: number;
  disciplina: string;
  carga_horaria: number;
  professor: Professor;
}


const AdminDashboard = () => {
  const [classes, setClasses] = useState<Classe[]>([]);
  const [allClasses, setAllClasses] = useState<Classe[]>([]);
  const [showClasseForm, setShowClasseForm] = useState(false);
  const [showDisciplinaForm, setShowDisciplinaForm] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  // Carregar todas as classes do banco
  const fetchClasses = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/admin/classes-detalhes');
      const data = await res.json();
      setAllClasses(data);
    } catch (err) {
      console.error('Erro ao carregar classes:', err);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  // Filtrar por ano e classe
  useEffect(() => {
    if (selectedYear && selectedClass) {
      const filtradas = allClasses.filter(
        (c) => c.ano_letivo === selectedYear && c.nome_classe === selectedClass
      );
      setClasses(filtradas);
    } else {
      setClasses([]);
    }
  }, [selectedYear, selectedClass, allClasses]);

  const handleDelete = async (id: number) => {
    if (confirm('Deseja eliminar este registo?')) {
      try {
        const res = await fetch(`http://localhost:3000/api/admin/classes/${id}`, { 
          method: 'DELETE' 
        });
        if (!res.ok) throw new Error(await res.text());
        alert('✅ Classe eliminada com sucesso!');
        fetchClasses();
      } catch (err: any) {
        alert('❌ ' + (err.message || 'Erro desconhecido'));
      }
    }
  };

  const handleEdit = (id: number) => {
    alert(`Editar classe ID: ${id}`);
  };

  const filteredClasses = classes.filter((c) => {
    const search = searchTerm.toLowerCase();
    return (
      !search ||
      c.disciplina.toLowerCase().includes(search) ||
      c.professor?.nome.toLowerCase().includes(search)
    );
  });

  return (
    <div className="space-y-6 p-4">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          Painel do Administrador
        </h2>

        {/* Botão Definições */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            <Settings size={18} /> Definições
          </button>
        </div>
      </div>

      {/* Filtros */}
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
            <option value="" disabled>Selecionar</option>
            {Array.from({ length: 8 }, (_, i) => 2023 + i).map((y) => (
              <option key={y} value={y}>{y}</option>
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
            <option value="" disabled>Selecionar</option>
            {[...new Set(allClasses.map((c) => c.nome_classe))].map((nome) => (
              <option key={nome} value={nome}>{nome}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-bold">Pesquisar:</label>
          <input
            type="text"
            placeholder="Disciplina/Professor"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-2 py-1 border rounded w-48"
          />
        </div>
      </div>

      {/* Tabela */}
      {selectedYear && selectedClass && (
        <div className="overflow-x-auto mt-2">
          <table className="min-w-full border border-gray-300 rounded-lg shadow-sm">
            <thead className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 text-gray-900">
              <tr className="text-center">
                <th className="px-4 py-2 font-semibold text-sm border-r">Turma</th>
                <th className="px-4 py-2 font-semibold text-sm border-r">Ano</th>
                <th className="px-4 py-2 font-semibold text-sm border-r">Disciplina</th>
                <th className="px-4 py-2 font-semibold text-sm border-r">Carga Horária</th>
                <th className="px-4 py-2 font-semibold text-sm border-r">Professor</th>
                <th className="px-4 py-2 font-semibold text-sm border-r">Contacto 1</th>
                <th className="px-4 py-2 font-semibold text-sm border-r">Contacto 2</th>
                <th className="px-4 py-2 font-semibold text-sm border-r">Contacto 3</th>
                <th className="px-4 py-2 font-semibold text-sm">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white text-center">
              {filteredClasses.map((c) => (
                <tr key={c.id_classes} className="hover:bg-yellow-50 transition">
                  <td className="px-4 py-2">{c.nome_classe}</td>
                  <td className="px-4 py-2">{c.ano_letivo}</td>
                  <td className="px-4 py-2">{c.disciplina}</td>
                  <td className="px-4 py-2">{c.carga_horaria}</td>
                  <td className="px-4 py-2">{c.professor?.nome || '-'}</td>
                  <td className="px-4 py-2">{c.professor?.contacto1 || '-'}</td>
                  <td className="px-4 py-2">{c.professor?.contacto2 || '-'}</td>
                  <td className="px-4 py-2">{c.professor?.contacto3 || '-'}</td>
                  <td className="px-4 py-2 flex items-center justify-center gap-3">
                    <button 
                      onClick={() => handleEdit(c.id_classes)} 
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(c.id_classes)} 
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredClasses.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-4 text-gray-500">
                    Nenhum registro encontrado para os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Forms */}
      {showClasseForm && (
        <ClasseForm 
          classe={null} 
          onClose={() => { 
            setShowClasseForm(false); 
            fetchClasses(); 
          }} 
          refresh={fetchClasses} 
        />
      )}
      
      {showDisciplinaForm && (
        <DisciplinasForm 
          disciplina={null} 
          onClose={() => setShowDisciplinaForm(false)} 
          refresh={fetchClasses} 
        />
      )}
    </div>
  );
};

export default AdminDashboard;

