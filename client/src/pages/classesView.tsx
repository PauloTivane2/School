import { useState, useEffect, useRef } from 'react';
import { X, Save, Trash2, PlusCircle } from 'lucide-react';
import axios from 'axios';

interface ClasseFormProps {
  classe?: any | null;
  onClose: () => void;
  refresh: () => void;
}

interface Disciplina {
  id_disciplinas: number;
  nome_disciplina: string;
}

interface Professor {
  id_funcionarios: number;
  nome_funcionario: string;
}

interface RelacaoTemp {
  id: number;
  professor: Professor;
  disciplina: Disciplina;
}

const ClasseForm = ({ classe, onClose, refresh }: ClasseFormProps) => {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [selectedClasse, setSelectedClasse] = useState<string>('');
  const [selectedProfessor, setSelectedProfessor] = useState<number | null>(null);
  const [selectedDisciplina, setSelectedDisciplina] = useState<number | null>(null);
  const [relacoesTemp, setRelacoesTemp] = useState<RelacaoTemp[]>([]);
  const [saving, setSaving] = useState(false);
  const classeRef = useRef<HTMLSelectElement | null>(null);

  // 🔹 Carregar Professores e Disciplinas do banco real
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profRes, discRes] = await Promise.all([
          axios.get('http://localhost:3000/api/funcionarios?funcao=Professor'),
          axios.get('http://localhost:3000/api/disciplinas'),
        ]);

        setProfessores(profRes.data);
        setDisciplinas(discRes.data);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        alert('❌ Erro ao carregar professores ou disciplinas.');
      }
    };
    fetchData();
  }, []);

  const handleAddRelacao = () => {
    if (!selectedProfessor || !selectedDisciplina) {
      alert('⚠️ Selecione um professor e uma disciplina antes de adicionar.');
      return;
    }

    const jaExiste = relacoesTemp.some(
      (r) =>
        r.professor.id_funcionarios === selectedProfessor &&
        r.disciplina.id_disciplinas === selectedDisciplina
    );
    if (jaExiste) {
      alert('❌ Esta combinação de professor e disciplina já foi adicionada.');
      return;
    }

    const professorObj = professores.find((p) => p.id_funcionarios === selectedProfessor);
    const disciplinaObj = disciplinas.find((d) => d.id_disciplinas === selectedDisciplina);

    if (professorObj && disciplinaObj) {
      const novaRelacao: RelacaoTemp = {
        id: Date.now(),
        professor: professorObj,
        disciplina: disciplinaObj,
      };
      setRelacoesTemp([...relacoesTemp, novaRelacao]);
      setSelectedProfessor(null);
      setSelectedDisciplina(null);
    }
  };

  const handleRemoveRelacao = (id: number) => {
    setRelacoesTemp((prev) => prev.filter((r) => r.id !== id));
  };

  const handleClearAll = () => {
    setRelacoesTemp([]);
    setSelectedClasse('');
    setSelectedProfessor(null);
    setSelectedDisciplina(null);
    setTimeout(() => classeRef.current?.focus(), 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClasse) {
      alert('⚠️ Selecione uma classe antes de salvar.');
      return;
    }
    if (relacoesTemp.length === 0) {
      alert('⚠️ Adicione pelo menos uma relação Professor–Disciplina.');
      return;
    }

    setSaving(true);
    try {
      // 🔹 Criar Classe
      const classeRes = await axios.post('http://localhost:3000/api/classes', {
        nome_classe: selectedClasse,
      });
      const classeId = classeRes.data.id_classes;

      // 🔹 Salvar todas as relações Professor–Disciplina
      await Promise.all(
        relacoesTemp.map((r) =>
          axios.post('http://localhost:3000/api/classes/relacoes', {
            id_classe: classeId,
            id_professor: r.professor.id_funcionarios,
            id_disciplina: r.disciplina.id_disciplinas,
          })
        )
      );

      alert('✅ Classe salva com sucesso!');
      refresh();
      onClose();
    } catch (err: any) {
      console.error(err);
      alert('❌ Erro ao salvar classe.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mt-10 mb-10">
        <div className="bg-secondary p-4 text-white rounded-t-2xl flex justify-between items-center">
          <h3 className="text-lg font-bold">{classe ? 'Editar Classe' : 'Nova Classe'}</h3>
          <button onClick={onClose}><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Seleção da Classe */}
          <div>
            <label className="block mb-1 font-semibold">Classe *</label>
            <select
              ref={classeRef}
              value={selectedClasse}
              onChange={(e) => setSelectedClasse(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500"
            >
              <option value="" disabled>Selecione uma classe</option>
              {['1ª Classe','2ª Classe','3ª Classe','4ª Classe','5ª Classe','6ª Classe','7ª Classe','8ª Classe','9ª Classe','10ª Classe','11ª Classe','12ª Classe'].map((nome) => (
                <option key={nome} value={nome}>{nome}</option>
              ))}
            </select>
          </div>

          {/* Professor e Disciplina */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block mb-1 font-semibold">Professor *</label>
              <select
                value={selectedProfessor || ''}
                onChange={(e) => setSelectedProfessor(Number(e.target.value))}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500"
              >
                <option value="" disabled>Selecione o professor</option>
                {professores.map((p) => (
                  <option key={p.id_funcionarios} value={p.id_funcionarios}>{p.nome_funcionario}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-semibold">Disciplina *</label>
              <select
                value={selectedDisciplina || ''}
                onChange={(e) => setSelectedDisciplina(Number(e.target.value))}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500"
              >
                <option value="" disabled>Selecione a disciplina</option>
                {disciplinas.map((d) => (
                  <option key={d.id_disciplinas} value={d.id_disciplinas}>{d.nome_disciplina}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleAddRelacao}
                className="w-full bg-secondary text-white rounded-lg py-2 flex justify-center items-center gap-2 hover:bg-secondary/90 transition"
              >
                <PlusCircle size={18} /> Adicionar
              </button>
            </div>
          </div>

          {/* Tabela Temporária */}
          {relacoesTemp.length > 0 && (
            <div className="mt-4 border-t pt-3 container-error transition-all duration-300">
              <h4 className="font-semibold mb-3 text-primary">
                Classe Selecionada: <span className="text-primary">{selectedClasse}</span>
              </h4>
              <table className="w-full border text-sm text-primary">
                <thead className="bg-error-light">
                  <tr>
                    <th className="px-4 py-2 border text-center w-20">Ordem</th>
                    <th className="px-4 py-2 border text-left">Professor</th>
                    <th className="px-4 py-2 border text-left">Disciplina</th>
                    <th className="px-4 py-2 border text-center w-24">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {relacoesTemp.map((r, index) => (
                    <tr key={r.id} className="hover:bg-error-light">
                      <td className="border px-4 py-2 text-center">{index + 1}</td>
                      <td className="border px-4 py-2 text-left">{r.professor.nome_funcionario}</td>
                      <td className="border px-4 py-2 text-left">{r.disciplina.nome_disciplina}</td>
                      <td className="border px-4 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveRelacao(r.id)}
                          className="text-primary hover:text-primary/80 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-end mt-3">
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-sm px-5 py-2 border border-error rounded-lg bg-error-light text-primary/90 font-medium hover:bg-error-light transition"
                >
                  Limpar Tudo
                </button>
              </div>
            </div>
          )}

          {/* Botões finais */}
          <div className="flex justify-end gap-2 pt-4 border-t-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 btn-success disabled:opacity-50"
            >
              {saving ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <Save size={16} />
              )}
              Salvar Classe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClasseForm;
