import { useState } from 'react';
import AttendanceForm from './PresencasPage';

export default function PresencasMainPage() {
  const [turmaId, setTurmaId] = useState<string>('10A');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [open, setOpen] = useState<boolean>(false);
  const [disciplina, setDisciplina] = useState<string>('');
  const [turno, setTurno] = useState<string>('');
  const [periodo, setPeriodo] = useState<string>('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Registo de Presenças Diário</h1>
          <p className="text-sm text-neutral-gray mt-1">Operação simplificada para Administração, Professores e Encarregados</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border-light p-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Classe e Turma</label>
            <select
              value={turmaId}
              onChange={(e) => setTurmaId(e.target.value)}
              className="input-field"
              aria-label="Classe e Turma"
            >
              <option value="">Selecione...</option>
              <option value="8A">8ª A</option>
              <option value="9A">9ª A</option>
              <option value="10A">10ª A</option>
              <option value="11A">11ª A</option>
              <option value="12A">12ª A</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Disciplina</label>
            <select
              value={disciplina}
              onChange={(e) => setDisciplina(e.target.value)}
              className="input-field"
              aria-label="Disciplina"
            >
              <option value="">Selecione...</option>
              <option value="Matemática">Matemática</option>
              <option value="Português">Português</option>
              <option value="Física">Física</option>
              <option value="Química">Química</option>
              <option value="Biologia">Biologia</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Turno</label>
            <select
              value={turno}
              onChange={(e) => setTurno(e.target.value)}
              className="input-field"
              aria-label="Turno"
            >
              <option value="">Selecione...</option>
              <option value="Manhã">Manhã</option>
              <option value="Tarde">Tarde</option>
              <option value="Noite">Noite</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Período/Aula</label>
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="input-field"
              aria-label="Período/Aula"
            >
              <option value="">Selecione...</option>
              <option value="1ª Aula">1ª Aula</option>
              <option value="2ª Aula">2ª Aula</option>
              <option value="3ª Aula">3ª Aula</option>
              <option value="4ª Aula">4ª Aula</option>
              <option value="5ª Aula">5ª Aula</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Data</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-field"
              aria-label="Data"
            />
          </div>
          <div className="md:col-span-1 flex items-end justify-end gap-3">
            <button
              className="px-4 py-2 rounded-lg border border-border-light text-sm hover:bg-accent"
              onClick={() => { setTurmaId('10A'); setDisciplina(''); setTurno(''); setPeriodo(''); setDate(new Date().toISOString().split('T')[0]); }}
            >
              Limpar
            </button>
            <button
              className="btn-primary"
              onClick={() => setOpen(true)}
              disabled={!turmaId || !disciplina || !turno || !periodo || !date}
            >
              Abrir Formulário
            </button>
          </div>
        </div>
      </div>

      {open && (
        <AttendanceForm
          turmaId={turmaId}
          date={date}
          disciplina={disciplina}
          turno={turno}
          periodo={periodo}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
