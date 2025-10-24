import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

interface Agenda {
  id?: number;
  tipo: 'Reuniao' | 'Avaliacao';
  data: string;
  hora_inicio: string;
  duracao?: number;
  local?: string;
  assunto?: string;
  penalidades?: string;
  ata?: string;
  tolerancia?: number;
  requisitos?: string;
  conteudos?: string;
}

const AgendaPage = () => {
  const [tipo, setTipo] = useState('');
  const [agendas, setAgendas] = useState<Agenda[]>([]);
  const [form, setForm] = useState<Agenda>({ tipo: 'Reuniao', data: '', hora_inicio: '', duracao: 0, local: '', assunto: '', penalidades: '', ata: '', tolerancia: 0, requisitos: '', conteudos: '' });
  const [isFormChanged, setIsFormChanged] = useState(false);

  useEffect(() => {
    fetchAgendas();
  }, []);

  const fetchAgendas = async () => {
    const res = await fetch('/api/agendas');
    const data = await res.json();
    setAgendas(data);
  };

  const handleFormChange = (field: keyof Agenda, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setIsFormChanged(true);
  };

  const handleSubmit = async () => {
    if (!form.tipo || !form.data || !form.hora_inicio) return alert('Preencha todos os campos obrigatórios!');
    
    const res = await fetch('/api/agendas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      fetchAgendas();
      setForm({ tipo: 'Reuniao', data: '', hora_inicio: '', duracao: 0, local: '', assunto: '', penalidades: '', ata: '', tolerancia: 0, requisitos: '', conteudos: '' });
      setIsFormChanged(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja realmente eliminar esta agenda?')) return;
    await fetch(`/api/agendas/${id}`, { method: 'DELETE' });
    fetchAgendas();
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-[1800px] mx-auto space-y-4">
        <div className="bg-white rounded-2xl shadow-lg p-4 border-4 border-indigo-400 relative">
          <h2 className="text-2xl font-bold text-primary mb-2">Gestão de Agendas</h2>
          <p className="text-primary/60 text-sm">Criação, edição e acompanhamento de agendas</p>
        </div>

        {/* Tipo de agenda */}
        <div className="bg-white rounded-2xl shadow-xl p-4 border-4 border-indigo-200 flex items-center gap-4">
          <label className="font-bold text-primary/80">Tipo de Agenda:</label>
          <select value={tipo} onChange={e => { setTipo(e.target.value); setForm(prev => ({ ...prev, tipo: e.target.value as 'Reuniao' | 'Avaliacao' })); }} className="border-2 border-indigo-300 rounded-md p-1">
            <option value="">Selecione...</option>
            <option value="Reuniao">Reunião</option>
            <option value="Avaliacao">Avaliação</option>
          </select>
        </div>

        {/* Formulário dinâmico */}
        {tipo && (
          <div className="bg-white rounded-2xl shadow-xl p-4 border-4 border-indigo-300 space-y-2">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <input type="date" value={form.data} onChange={e => handleFormChange('data', e.target.value)} className="border-2 border-indigo-300 rounded-md p-1" />
              <input type="time" value={form.hora_inicio} onChange={e => handleFormChange('hora_inicio', e.target.value)} className="border-2 border-indigo-300 rounded-md p-1" />
              <input type="number" value={form.duracao} onChange={e => handleFormChange('duracao', parseInt(e.target.value))} placeholder="Duração (min)" className="border-2 border-indigo-300 rounded-md p-1" />
              <input type="text" value={form.local} onChange={e => handleFormChange('local', e.target.value)} placeholder="Local" className="border-2 border-indigo-300 rounded-md p-1" />
            </div>

            {tipo === 'Reuniao' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                <input type="text" value={form.assunto} onChange={e => handleFormChange('assunto', e.target.value)} placeholder="Assunto" className="border-2 border-indigo-300 rounded-md p-1" />
                <input type="text" value={form.penalidades} onChange={e => handleFormChange('penalidades', e.target.value)} placeholder="Penalidades" className="border-2 border-indigo-300 rounded-md p-1" />
                <textarea value={form.ata} onChange={e => handleFormChange('ata', e.target.value)} placeholder="Ata da reunião" className="border-2 border-indigo-300 rounded-md p-1 col-span-2"></textarea>
              </div>
            )}

            {tipo === 'Avaliacao' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                <input type="number" value={form.tolerancia} onChange={e => handleFormChange('tolerancia', parseInt(e.target.value))} placeholder="Tolerância (min)" className="border-2 border-indigo-300 rounded-md p-1" />
                <input type="text" value={form.requisitos} onChange={e => handleFormChange('requisitos', e.target.value)} placeholder="Requisitos" className="border-2 border-indigo-300 rounded-md p-1" />
                <textarea value={form.conteudos} onChange={e => handleFormChange('conteudos', e.target.value)} placeholder="Conteúdos" className="border-2 border-indigo-300 rounded-md p-1 col-span-2"></textarea>
                <input type="text" value={form.penalidades} onChange={e => handleFormChange('penalidades', e.target.value)} placeholder="Penalidades" className="border-2 border-indigo-300 rounded-md p-1 col-span-2" />
              </div>
            )}

            <div className="flex gap-2 mt-2">
              <button onClick={() => setForm({ tipo: tipo as any, data: '', hora_inicio: '', duracao: 0, local: '', assunto: '', penalidades: '', ata: '', tolerancia: 0, requisitos: '', conteudos: '' })} disabled={!isFormChanged} className="bg-primary/10 px-4 py-1 rounded-md disabled:opacity-50">Limpar</button>
              <button onClick={handleSubmit} disabled={!isFormChanged} className="bg-secondary text-white px-4 py-1 rounded-md disabled:opacity-50 flex items-center gap-1"><Save size={14}/> Submeter</button>
            </div>
          </div>
        )}

        {/* Tabela de agendas */}
        <div className="overflow-x-auto">
          <table className="min-w-[1200px] mt-4">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tipo</th>
                <th>Data</th>
                <th>Hora Início</th>
                <th>Duração</th>
                <th>Local</th>
                <th>Assunto / Conteúdos</th>
                <th>Penalidades</th>
                <th>Ata / Requisitos</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {agendas.map(a => (
                <tr key={a.id} className="hover:bg-neutral-bg/50">
                  <td>{a.id}</td>
                  <td>{a.tipo}</td>
                  <td>{a.data}</td>
                  <td>{a.hora_inicio}</td>
                  <td>{a.duracao}</td>
                  <td>{a.local}</td>
                  <td>{a.tipo==='Reuniao'?a.assunto:a.conteudos}</td>
                  <td>{a.penalidades}</td>
                  <td>{a.tipo==='Reuniao'?a.ata:a.requisitos}</td>
                  <td className="flex gap-1 justify-center">
                    <button onClick={()=>alert('Editar ainda não implementado')} className="bg-secondary text-white px-2 py-0.5 rounded">Editar</button>
                    <button onClick={()=>a.id && handleDelete(a.id)} className="bg-primary text-white px-2 py-0.5 rounded">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default AgendaPage;
