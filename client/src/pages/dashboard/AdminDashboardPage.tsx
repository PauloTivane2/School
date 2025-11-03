// frontend/src/components/admin/AdminDashboard.tsx
import { useState, useEffect } from 'react';
import { Settings, Edit, Trash2, Plus, Bell, Cog } from 'lucide-react';
import { ClassesFormPage as ClasseForm } from '../turmas';
import { DisciplinasFormPage as DisciplinasForm } from '../turmas';
import { NotificationsPage as NotificationsView } from '../notifications';
import { SettingsPage as SettingsView } from '../settings';


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
  const [currentView, setCurrentView] = useState<'dashboard' | 'notifications' | 'settings'>('dashboard');

  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  // Carregar todas as classes do banco
  const fetchClasses = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/admin/classes-detalhes');
      const data = await res.json();
      setAllClasses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erro ao carregar classes:', err);
      setAllClasses([]);
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

  // Renderizar view baseada no estado
  if (currentView === 'notifications') {
    return <NotificationsView />;
  }

  if (currentView === 'settings') {
    return <SettingsView />;
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">
              Painel do Administrador
            </h2>
            <p className="text-sm text-neutral-gray mt-1">Gerencie classes, disciplinas e professores</p>
          </div>

          {/* Botão Definições com Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="btn-secondary flex items-center gap-2"
              aria-label="Definições"
            >
              <Settings size={18} /> Definições
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-border-light z-50">
                <div className="py-2">
                  <button
                    onClick={() => {
                      setCurrentView('notifications');
                      setDropdownOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-accent transition-all flex items-center gap-3"
                  >
                    <Bell size={18} className="text-primary" />
                    <div>
                      <p className="font-semibold text-text-primary">Notificações</p>
                      <p className="text-xs text-neutral-gray">Ver alertas do sistema</p>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentView('settings');
                      setDropdownOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-accent transition-all flex items-center gap-3"
                  >
                    <Cog size={18} className="text-primary" />
                    <div>
                      <p className="font-semibold text-text-primary">Configurações</p>
                      <p className="text-xs text-neutral-gray">Definições do sistema</p>
                    </div>
                  </button>
                  {currentView !== 'dashboard' && (
                    <>
                      <div className="border-t border-border-light my-2"></div>
                      <button
                        onClick={() => {
                          setCurrentView('dashboard');
                          setDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-accent transition-all text-primary font-medium"
                      >
                        ← Voltar ao Dashboard
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowClasseForm(true)}
            className="btn-primary flex items-center gap-2"
            aria-label="Adicionar classe"
          >
            <Plus size={16} /> Nova Classe
          </button>

          <button
            onClick={() => setShowDisciplinaForm(true)}
            className="btn-primary flex items-center gap-2"
            aria-label="Adicionar disciplina"
          >
            <Plus size={16} /> Nova Disciplina
          </button>

          <div className="flex items-center gap-2 ml-4">
            <label className="text-sm font-medium text-text-primary">Ano:</label>
            <select
              value={selectedYear || ''}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="input-field w-28"
              aria-label="Selecionar ano"
            >
              <option value="" disabled>Selecionar</option>
              {Array.from({ length: 8 }, (_, i) => 2023 + i).map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-text-primary">Classe:</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="input-field w-36"
              aria-label="Selecionar classe"
            >
              <option value="" disabled>Selecionar</option>
              {Array.isArray(allClasses) && allClasses.length > 0 ? (
                [...new Set(allClasses.map((c) => c.nome_classe))].map((nome) => (
                  <option key={nome} value={nome}>{nome}</option>
                ))
              ) : (
                <option disabled>Nenhuma classe disponível</option>
              )}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-text-primary">Pesquisar:</label>
            <input
              type="text"
              placeholder="Disciplina ou professor"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field w-52"
              aria-label="Pesquisar"
            />
          </div>
        </div>
      </div>

      {/* Tabela */}
      {selectedYear && selectedClass && (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border-light">
              <thead className="table-header">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-sm">Turma</th>
                  <th className="px-4 py-3 text-left font-semibold text-sm">Ano</th>
                  <th className="px-4 py-3 text-left font-semibold text-sm">Disciplina</th>
                  <th className="px-4 py-3 text-left font-semibold text-sm">Carga Horária</th>
                  <th className="px-4 py-3 text-left font-semibold text-sm">Professor</th>
                  <th className="px-4 py-3 text-left font-semibold text-sm">Contacto 1</th>
                  <th className="px-4 py-3 text-left font-semibold text-sm">Contacto 2</th>
                  <th className="px-4 py-3 text-left font-semibold text-sm">Contacto 3</th>
                  <th className="px-4 py-3 text-center font-semibold text-sm">Ações</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border-light bg-white">
                {filteredClasses.map((c) => (
                  <tr key={c.id_classes} className="table-row">
                    <td className="px-4 py-3 text-sm text-text-primary">{c.nome_classe}</td>
                    <td className="px-4 py-3 text-sm text-text-primary">{c.ano_letivo}</td>
                    <td className="px-4 py-3 text-sm text-text-primary">{c.disciplina}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{c.carga_horaria}h</td>
                    <td className="px-4 py-3 text-sm text-text-primary">{c.professor?.nome || '-'}</td>
                    <td className="px-4 py-3 text-sm text-neutral-gray">{c.professor?.contacto1 || '-'}</td>
                    <td className="px-4 py-3 text-sm text-neutral-gray">{c.professor?.contacto2 || '-'}</td>
                    <td className="px-4 py-3 text-sm text-neutral-gray">{c.professor?.contacto3 || '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleEdit(c.id_classes)} 
                          className="p-2 text-primary hover:bg-accent rounded-lg transition-all duration-150"
                          aria-label="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(c.id_classes)} 
                          className="p-2 text-error hover:bg-accent rounded-lg transition-all duration-150"
                          aria-label="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredClasses.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-neutral-gray">
                      Nenhum registro encontrado para os filtros selecionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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

