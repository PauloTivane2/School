import { useState, useEffect } from 'react';
import { Award, Save } from 'lucide-react';

interface Aluno {
  id: number;
  usuario: string;
  nome: string;
  presencas: Record<number, 'P' | 'F' | null>;
  totalPresentes: number;
  percentagemPresenca: number;
  totalAusentes: number;
  percentagemAusencia: number;
}

const AttendanceList = () => {
  const [classe, setClasse] = useState('');
  const [turma, setTurma] = useState('');
  const [disciplina, setDisciplina] = useState('');
  const [trimestre, setTrimestre] = useState('1');
  const [showTable, setShowTable] = useState(false);
  const [mesAtual, setMesAtual] = useState('');
  const [anoAtual, setAnoAtual] = useState('');
  const [diaAtual, setDiaAtual] = useState(0);
  const [diasNoMes, setDiasNoMes] = useState(0);

  const [presentes, setPresentes] = useState({ numero: 0, percentagem: 0 });
  const [ausentes, setAusentes] = useState({ numero: 0, percentagem: 0 });

  const [alunos, setAlunos] = useState<Aluno[]>([
    { id: 1, usuario: 'ALU001', nome: 'João Pedro Machado', presencas: {}, totalPresentes: 0, percentagemPresenca: 0, totalAusentes: 0, percentagemAusencia: 0 },
    { id: 2, usuario: 'ALU002', nome: 'Maria Francisca Costa', presencas: {}, totalPresentes: 0, percentagemPresenca: 0, totalAusentes: 0, percentagemAusencia: 0 },
    { id: 3, usuario: 'ALU003', nome: 'Carlos Eduardo Santos', presencas: {}, totalPresentes: 0, percentagemPresenca: 0, totalAusentes: 0, percentagemAusencia: 0 },
    { id: 4, usuario: 'ALU004', nome: 'Ana Beatriz Oliveira', presencas: {}, totalPresentes: 0, percentagemPresenca: 0, totalAusentes: 0, percentagemAusencia: 0 },
  ]);

  useEffect(() => {
    const hoje = new Date();
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    setMesAtual(meses[hoje.getMonth()]);
    setAnoAtual(hoje.getFullYear().toString());
    setDiaAtual(hoje.getDate());

    const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
    setDiasNoMes(ultimoDia.getDate());
  }, []);

  const handleFilterChange = (field: string, value: string) => {
    if (field === 'classe') setClasse(value);
    if (field === 'turma') setTurma(value);
    if (field === 'disciplina') setDisciplina(value);
    if (field === 'trimestre') setTrimestre(value);

    if (
      (field === 'classe' && value && turma && disciplina) ||
      (field === 'turma' && value && classe && disciplina) ||
      (field === 'disciplina' && value && classe && turma) ||
      (field === 'trimestre' && value && classe && turma && disciplina)
    )
      setShowTable(true);
  };

  const handlePresencaChange = (alunoId: number, dia: number, valor: string) => {
    const valorUpper = valor.toUpperCase();
    if (valorUpper !== '' && valorUpper !== 'P' && valorUpper !== 'F') return;

    const novaPresenca = valorUpper === '' ? null : (valorUpper as 'P' | 'F');

    setAlunos(prev =>
      prev.map(a => {
        if (a.id !== alunoId) return a;

        const novasPresencas = { ...a.presencas, [dia]: novaPresenca };
        const valores = Object.values(novasPresencas);
        const totalPresentes = valores.filter(v => v === 'P').length;
        const totalAusentes = valores.filter(v => v === 'F').length;
        const totalRegistros = totalPresentes + totalAusentes;

        const percentagemPresenca = totalRegistros > 0 ? (totalPresentes / totalRegistros) * 100 : 0;
        const percentagemAusencia = totalRegistros > 0 ? (totalAusentes / totalRegistros) * 100 : 0;

        return {
          ...a,
          presencas: novasPresencas,
          totalPresentes,
          percentagemPresenca,
          totalAusentes,
          percentagemAusencia
        };
      })
    );

    calcularTotaisGerais();
  };

  const calcularTotaisGerais = () => {
    setTimeout(() => {
      setAlunos(current => {
        const totalPresentes = current.reduce((acc, a) => acc + a.totalPresentes, 0);
        const totalAusentes = current.reduce((acc, a) => acc + a.totalAusentes, 0);
        const total = totalPresentes + totalAusentes;

        setPresentes({
          numero: totalPresentes,
          percentagem: total > 0 ? (totalPresentes / total) * 100 : 0
        });

        setAusentes({
          numero: totalAusentes,
          percentagem: total > 0 ? (totalAusentes / total) * 100 : 0
        });

        return current;
      });
    }, 0);
  };

  const isDiaHabilitado = (dia: number) => dia === diaAtual;

  const handleSave = () => alert('Presenças salvas com sucesso!');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6">
      <div className="max-w-[1800px] mx-auto space-y-4">

        {/* Cabeçalho */}
        <div className="bg-white rounded-2xl shadow-lg p-4 border-4 border-indigo-400 relative">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-xl">
              <Award size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary">Controle de Presença</h2>
              <p className="text-primary/60 text-sm">Registro diário de frequência</p>
            </div>
          </div>

          <div className="absolute bottom-3 right-4 flex items-center gap-2">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm px-3 py-1 rounded-md shadow-md">
              Mês
            </div>
            <input
              type="text"
              value={`${mesAtual} ${anoAtual}`}
              disabled
              className="px-4 py-1 border-2 border-primary rounded-md text-sm font-bold text-primary bg-warning-light cursor-not-allowed"
            />
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl shadow-xl p-4 border-4 border-indigo-200">
          <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 items-end">
            {[
              { label: 'Classe *', field: 'classe', value: classe, options: ['8ª Classe', '9ª Classe', '10ª Classe', '11ª Classe', '12ª Classe'] },
              { label: 'Turma *', field: 'turma', value: turma, options: ['Turma A', 'Turma B', 'Turma C'] },
              { label: 'Disciplina *', field: 'disciplina', value: disciplina, options: ['Matemática', 'Português', 'Física', 'Química', 'Biologia'] },
              { label: 'Trimestre *', field: 'trimestre', value: trimestre, options: ['1','2','3'] },
            ].map((f, i) => (
              <div key={i}>
                <label className="block text-sm font-bold text-primary mb-1">{f.label}</label>
                <select
                  value={f.value}
                  onChange={e => handleFilterChange(f.field, e.target.value)}
                  className="w-full px-2 py-[6px] border-2 border-indigo-300 rounded-md bg-white text-xs font-medium focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Selecione...</option>
                  {f.options.map(o => {
                    const display = f.field === 'trimestre' ? `${o}º` : o;
                    return <option key={o} value={o}>{display}</option>;
                  })}
                </select>
              </div>
            ))}

            {/* Presentes */}
            <div>
              <label className="block text-sm font-bold text-primary mb-1">Presentes</label>
              <div className="flex gap-1">
                <input
                  type="text"
                  value={presentes.numero}
                  readOnly
                  className="w-1/2 px-2 py-[6px] border-2 border-green-300 rounded-md bg-secondary/10 text-xs font-bold text-secondary/90 text-center"
                />
                <input
                  type="text"
                  value={`${presentes.percentagem.toFixed(1)}%`}
                  readOnly
                  className="w-1/2 px-2 py-[4px] border-2 border-green-300 rounded-md bg-secondary/10 text-xs font-bold text-secondary/90 text-center"
                />
              </div>
            </div>

            {/* Ausentes */}
            <div>
              <label className="block text-sm font-bold text-primary mb-1">Ausentes</label>
              <div className="flex gap-1">
                <input
                  type="text"
                  value={ausentes.numero}
                  readOnly
                  className="w-1/2 px-2 py-[4px] border-2 border-error rounded-md bg-error-light text-xs font-bold text-primary/90 text-center"
                />
                <input
                  type="text"
                  value={`${ausentes.percentagem.toFixed(1)}%`}
                  readOnly
                  className="w-1/2 px-2 py-[5px] border-2 border-error rounded-md bg-error-light text-xs font-bold text-primary/90 text-center"
                />
              </div>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleSave}
                disabled={!showTable}
                className="w-[90%] h-[30px] px-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-md hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Save size={14} /> Salvar
              </button>
            </div>
          </div>
        </div>

        {/* Tabela */}
        {showTable && (
          <div className="bg-white rounded-2xl shadow-xl border-4 border-indigo-300 relative">
            {/* Cabeçalho fixo azul */}
            <div className="sticky top-0 z-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] px-3 py-1.5 rounded-t-xl animate-[gradientMove_6s_ease_infinite]">
              <h3 className="text-sm font-semibold text-white text-center whitespace-nowrap">
                {classe} | Turma {turma} | {disciplina} | {trimestre}º Trimestre | {mesAtual} {anoAtual}
              </h3>
            </div>

            {/* Container com scroll */}
            <div className="overflow-x-auto">
              <table className="grades-table">
                <thead>
                  {/* Linha mesclada com "Dias" */}
                  <tr>
                    <th rowSpan={2}>Usuário</th>
                    <th rowSpan={2} className="nome-coluna">Aluno</th>
                    <th colSpan={diasNoMes} className="text-center py-0.3 text-sm leading-tight"> Dias </th>

                  </tr>
                  {/* Linha dos números dos dias */}
                  <tr>
                    {Array.from({ length: diasNoMes }, (_, i) => (
                      <th key={i}>{i + 1}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {alunos.map(a => (
                    <tr key={a.id}>
                      <td>{a.usuario}</td>
                      <td className="nome">{a.nome}</td>
                      {Array.from({ length: diasNoMes }, (_, i) => {
                        const dia = i + 1;
                        const valor = a.presencas[dia] || '';
                        const habilitado = isDiaHabilitado(dia);
                        return (
                          <td key={dia}>
                            <input
                              type="text"
                              value={valor}
                              onChange={e => handlePresencaChange(a.id, dia, e.target.value)}
                              disabled={!habilitado}
                              maxLength={1}
                              className={`input-dia ${valor === 'P' ? 'presente' : valor === 'F' ? 'falta' : ''}`}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceList;
