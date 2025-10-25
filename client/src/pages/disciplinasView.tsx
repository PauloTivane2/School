import { useState, useRef } from 'react';
import { X, Save } from 'lucide-react';

interface DisciplinaFormProps {
  disciplina?: any | null;
  onClose: () => void;
  refresh: () => void;
}

const DisciplinaForm = ({ disciplina, onClose, refresh }: DisciplinaFormProps) => {
  const [nome, setNome] = useState(disciplina?.nome || '');
  const [cargaHoraria, setCargaHoraria] = useState(disciplina?.carga_horaria || '');
  const [saving, setSaving] = useState(false);

  const nomeRef = useRef<HTMLSelectElement>(null);

  const isClearEnabled = nome.trim() !== '' || cargaHoraria.toString().trim() !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = disciplina ? 'PUT' : 'POST';
      const url = disciplina
        ? `http://localhost:3000/api/disciplinas/${disciplina.id}`
        : 'http://localhost:3000/api/disciplinas';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, carga_horaria: parseInt(cargaHoraria) })
      });
      if (!res.ok) throw new Error('Erro ao salvar disciplina');
      alert('✅ Disciplina salva com sucesso!');
      refresh();
      onClose();
    } catch (err: any) {
      alert('❌ ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleClear = () => {
    setNome('');
    setCargaHoraria('');
    nomeRef.current?.focus();
  };

  const handleCargaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valor = e.target.value.replace(/\D/g, '');
    if (valor) {
      const num = parseInt(valor);
      if (num < 2) valor = '2';
      else if (num > 8) valor = '8';
    }
    setCargaHoraria(valor);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mt-10 mb-10">
        <div className="bg-secondary p-4 text-white rounded-t-2xl flex justify-between items-center">
          <h3 className="text-lg font-bold">{disciplina ? 'Editar Disciplina' : 'Nova Disciplina'}</h3>
          <button onClick={onClose}><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Dropdown de disciplinas com scroll fino */}
          <div>
            <label className="block mb-1 font-semibold">Disciplina *</label>
            <select
              ref={nomeRef}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="w-full px-4 py-2 border-2 border-primary/20 rounded-lg focus:ring-2 focus:ring-yellow-500 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
            >
              <option value="" disabled>Selecione...</option>
              <option value="Português">Português</option>
              <option value="Inglês">Inglês</option>
              <option value="Matemática">Matemática</option>
              <option value="Física">Física</option>
              <option value="Biologia">Biologia</option>
              <option value="Geografia">Geografia</option>
              <option value="História">História</option>
              <option value="EMC">Ed. Moral e Cívica</option>
              <option value="Educação Física">Educação Física</option>
              <option value="TIC">TIC</option>
              <option value="Ofícios">Ofícios</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-semibold">Carga Horária *</label>
            <input
              type="number"
              value={cargaHoraria}
              onChange={handleCargaChange}
              required
              min={2}
              max={8}
              step={1}
              className="w-full px-4 py-2 border-2 border-primary/20 rounded-lg focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t-2">
            <button
              type="button"
              onClick={handleClear}
              disabled={!isClearEnabled}
              className={`px-6 py-2 border-2 rounded-lg ${
                isClearEnabled
                  ? 'bg-red-50 hover:bg-red-100 border-error'
                  : 'bg-primary/10 text-neutral-gray cursor-not-allowed'
              }`}
            >
              Limpar
            </button>

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
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DisciplinaForm;

