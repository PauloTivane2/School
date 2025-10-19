import { useState } from 'react';
import { Award, Save } from 'lucide-react';
import './gradesList.css'; // mantém o CSS auxiliar

interface Aluno {
  id: number;
  usuario: string;
  nome: string;
  teste1: number | null;
  teste2: number | null;
  teste3: number | null;
  trabalho: number | null;
  notaFrequencia: number | null;
  resultadoFrequencia: string;
  exame: number | null;
  mediaFinal: number | null;
  resultadoFinal: string;
}

const GradesList = () => {
  const [classe, setClasse] = useState('');
  const [turma, setTurma] = useState('');
  const [disciplina, setDisciplina] = useState('');
  const [trimestre, setTrimestre] = useState('1');
  const [avaliacao, setAvaliacao] = useState('');
  const [showTable, setShowTable] = useState(false);
  const [exameSelecionado, setExameSelecionado] = useState(false);
  const [formula, setFormula] = useState('');
  const [erros, setErros] = useState<Record<string, string>>({});

  const [alunos, setAlunos] = useState<Aluno[]>([
    { id: 1, usuario: 'ALU001', nome: 'João Pedro Machado', teste1: null, teste2: null, teste3: null, trabalho: null, notaFrequencia: null, resultadoFrequencia: '-', exame: null, mediaFinal: null, resultadoFinal: '-' },
    { id: 2, usuario: 'ALU002', nome: 'Maria Francisca Costa', teste1: null, teste2: null, teste3: null, trabalho: null, notaFrequencia: null, resultadoFrequencia: '-', exame: null, mediaFinal: null, resultadoFinal: '-' },
    { id: 3, usuario: 'ALU003', nome: 'Carlos Eduardo Santos', teste1: null, teste2: null, teste3: null, trabalho: null, notaFrequencia: null, resultadoFrequencia: '-', exame: null, mediaFinal: null, resultadoFinal: '-' },
    { id: 4, usuario: 'ALU004', nome: 'Ana Beatriz Oliveira', teste1: null, teste2: null, teste3: null, trabalho: null, notaFrequencia: null, resultadoFrequencia: '-', exame: null, mediaFinal: null, resultadoFinal: '-' },
  ]);

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

  const isValidNotaString = (valor: string) => {
    if (valor === '') return true;
    const regex = /^(?:\d|[1]\d|20)(?:\.\d)?$/;
    if (!regex.test(valor)) return false;
    const n = parseFloat(valor);
    return n >= 0 && n <= 20;
  };

  const setErroCampo = (alunoId: number, campo: string, mensagem?: string) => {
    const key = `${alunoId}_${campo}`;
    setErros(prev => {
      const copy = { ...prev };
      if (!mensagem) delete copy[key];
      else copy[key] = mensagem;
      return copy;
    });
  };

  const handleNotaChange = (alunoId: number, campo: string, valor: string | boolean) => {
    if (typeof valor === 'string' && valor !== '' && !/^\d{1,2}(\.\d)?$/.test(valor)) {
      setErroCampo(alunoId, campo, 'Nota inválida');
      return;
    }
    const nota = valor === '' ? null : (typeof valor === 'string' ? parseFloat(valor) : null);
    if (typeof valor === 'string' && valor !== '') {
      if (!isValidNotaString(valor)) {
        setErroCampo(alunoId, campo, 'Nota inválida');
        return;
      } else setErroCampo(alunoId, campo);
    } else setErroCampo(alunoId, campo);

    setAlunos(prev =>
      prev.map(a => {
        if (a.id !== alunoId) return a;
        const updated: Aluno = { ...a, [campo]: nota } as Aluno;
        const t1 = updated.teste1 ?? 0;
        const t2 = updated.teste2 ?? 0;
        const t3 = updated.teste3 ?? 0;
        const trab = updated.trabalho ?? 0;
        updated.notaFrequencia = (t1 + t2 + t3 + trab) / 4;

        if (!exameSelecionado) {
          updated.resultadoFrequencia = isNaN(updated.notaFrequencia)
            ? '-'
            : updated.notaFrequencia >= 10 ? 'Aprovado' : 'Reprovado';
        } else {
          if (isNaN(updated.notaFrequencia)) updated.resultadoFrequencia = '-';
          else if (updated.notaFrequencia < 10) updated.resultadoFrequencia = 'Excluído';
          else if (updated.notaFrequencia < 14) updated.resultadoFrequencia = 'Admitido';
          else updated.resultadoFrequencia = 'Dispensado';
        }

        updated.mediaFinal = (updated.exame !== null && !isNaN(updated.exame))
          ? ((updated.notaFrequencia ?? 0) + updated.exame) / 2
          : updated.notaFrequencia;
        updated.resultadoFinal = (updated.mediaFinal ?? 0) < 10 ? 'Reprovado' : 'Aprovado';
        return updated;
      })
    );
  };

  const isFieldEnabled = (campo: string, aluno?: Aluno) => {
    if (campo === 'teste1' && avaliacao === 'teste1') return true;
    if (campo === 'teste2' && avaliacao === 'teste2') return true;
    if (campo === 'teste3' && avaliacao === 'teste3') return true;
    if (campo === 'trabalho' && avaliacao === 'trabalho') return true;
    if (campo === 'exame' && avaliacao === 'exame' && exameSelecionado && aluno?.resultadoFrequencia === 'Admitido')
      return true;
    return false;
  };

  const handleSave = () => alert('Notas salvas com sucesso!');

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
              <h2 className="text-2xl font-bold text-gray-800">Gestão de Notas</h2>
              <p className="text-gray-500 text-sm">Lançamento e acompanhamento de avaliações</p>
            </div>
          </div>

          {/* Campo de introdução de fórmula (parte inferior direita) */}
          <div className="absolute bottom-3 right-4 flex items-center gap-2">
            {/* Ícone de somatório */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg px-1 py-0.2 rounded-md shadow-md flex items-center justify-center">
              Σ
            </div>

            {/* Input da fórmula */}
            <input
              type="text"
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              placeholder="Introduzir fórmula..."
              className="px-3 py-1 border-2 border-indigo-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500"
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
                <label className="block text-sm font-bold text-gray-800 mb-1">{f.label}</label>
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

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1">Exame</label>
              <button
                onClick={() => setExameSelecionado(!exameSelecionado)}
                className={`w-full h-[30px] flex items-center justify-center rounded-md text-xs font-semibold transition ${exameSelecionado ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}
              >
                {exameSelecionado ? 'Ativo' : 'Inativo'}
              </button>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1">Avaliação *</label>
              <select
                value={avaliacao}
                onChange={e => setAvaliacao(e.target.value)}
                disabled={!showTable}
                className="w-full px-2 py-[6px] border-2 border-indigo-300 rounded-md bg-white text-xs font-medium disabled:bg-gray-100"
              >
                <option value="">Selecione...</option>
                <option value="teste1">Teste 1</option>
                <option value="teste2">Teste 2</option>
                <option value="teste3">Teste 3</option>
                <option value="trabalho">Trabalho</option>
                <option value="exame" disabled={!exameSelecionado}>Exame</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleSave}
                disabled={!showTable || !avaliacao}
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
            {/* Cabeçalho fixo azul - FORA do overflow */}
            <div className="sticky top-0 z-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] px-3 py-1.5 rounded-t-xl animate-[gradientMove_6s_ease_infinite]">
              <h3 className="text-sm font-semibold text-white text-center whitespace-nowrap">
                {classe} | Turma {turma} | {disciplina} | {trimestre}º Trimestre
              </h3>
            </div>
            
            {/* Container com scroll apenas para a tabela */}
            <div className="overflow-x-auto">
                    <table className="min-w-[1200px] w-full text-xs">
                      <thead className="bg-gray-50 border-b-2 border-indigo-200 text-[11px]">
                        <tr>
                          <th className="px-3 py-1 text-left">Usuário</th>
                          <th className="px-3 py-1 text-left w-64">Aluno</th>
                          {['Teste 1','Teste 2','Teste 3','Trabalho','Nota de Freq.','Resultado Freq.','Exame','Média','Final'].map(h=>(
                            <th key={h} className="px-2 py-1 text-center">{h}</th>
                          ))}
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-200">
                        {alunos.map(a=>(
                          <tr key={a.id} className="hover:bg-gray-50">
                            <td className="px-3 py-1 text-center font-medium">{a.usuario}</td>
                            <td className="px-3 py-1 font-semibold">{a.nome}</td>

                            {/* Testes e Trabalho */}
                            {['teste1','teste2','teste3','trabalho'].map(c=>(
                              <td key={c} className="px-2 py-1 text-center">
                                <div className="relative inline-block">
                                  <input
                                    type="text"
                                    inputMode="decimal"
                                    pattern="\d*"
                                    value={(a as any)[c] ?? ''}
                                    onChange={e=>handleNotaChange(a.id,c,e.target.value)}
                                    disabled={!isFieldEnabled(c)}
                                    className={`w-12 px-1 py-0.5 text-center rounded text-[11px] focus:outline-none focus:ring-1 ${
                                      isFieldEnabled(c) ? 'border border-transparent bg-white' : 'bg-gray-100 border border-transparent'
                                    } ${
                                      (a as any)[c] !== null
                                        ? ((a as any)[c] ?? 0) >= 10
                                          ? 'text-indigo-700 font-semibold'
                                          : 'text-red-600 font-semibold'
                                        : 'text-gray-400'
                                    } ${erros[`${a.id}_${c}`] ? 'border-red-500' : ''}`}
                                  />
                                  {erros[`${a.id}_${c}`] && (
                                    <div className="absolute left-1/2 -translate-x-1/2 -top-5 text-[11px] text-red-700 bg-red-50 px-2 py-0.5 rounded shadow-sm whitespace-nowrap">
                                      {erros[`${a.id}_${c}`]}
                                    </div>
                                  )}
                                </div>
                              </td>
                            ))}

                            {/* Nota de Frequência */}
                            <td className={`px-3 py-1 text-center font-bold ${
                              (a.notaFrequencia ?? 0) >= 10 ? 'text-indigo-700' : 'text-red-600'
                            }`}>
                              {a.notaFrequencia !== null && !isNaN(a.notaFrequencia) ? a.notaFrequencia.toFixed(1) : '-'}
                            </td>

                            {/* Resultado Frequência */}
                            <td className="px-3 py-1 text-center">
                              <div
                                className={`text-[11px] font-semibold ${
                                  a.resultadoFrequencia === 'Excluído' || a.resultadoFrequencia === 'Reprovado'
                                    ? 'text-red-600'
                                    : 'text-indigo-700'
                                }`}
                              >
                                {a.resultadoFrequencia}
                              </div>
                            </td>

                            {/* Exame */}
                            <td className="px-2 py-1 text-center">
                              <input
                                type="text"
                                inputMode="decimal"
                                value={a.exame ?? ''}
                                onChange={e=>handleNotaChange(a.id,'exame',e.target.value)}
                                disabled={!isFieldEnabled('exame', a)}
                                className={`w-12 px-1 py-0.5 text-center rounded text-[11px] focus:outline-none ${
                                  (a.exame ?? 0) >= 10 ? 'text-indigo-700 font-semibold' : 'text-red-600 font-semibold'
                                } ${isFieldEnabled('exame', a) ? 'border border-transparent bg-white' : 'bg-gray-100 border border-transparent'} ${
                                  erros[`${a.id}_exame`] ? 'border-red-500' : ''
                                }`}
                              />
                              {erros[`${a.id}_exame`] && (
                                <div className="absolute left-1/2 -translate-x-1/2 -top-5 text-[11px] text-red-700 bg-red-50 px-2 py-0.5 rounded shadow-sm whitespace-nowrap">
                                  {erros[`${a.id}_exame`]}
                                </div>
                              )}
                            </td>

                            {/* Média */}
                            <td className={`px-3 py-1 text-center font-bold ${
                              (a.mediaFinal ?? 0) >= 10 ? 'text-indigo-700' : 'text-red-600'
                            }`}>
                              {a.mediaFinal !== null && !isNaN(a.mediaFinal) ? a.mediaFinal.toFixed(1) : '-'}
                            </td>

                            {/* Resultado Final */}
                            <td className="px-3 py-1 text-center">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                a.resultadoFinal === 'Reprovado'
                                  ? 'bg-red-200 text-red-800'
                                  : 'bg-green-200 text-green-800'
                              }`}>
                                {a.resultadoFinal}
                              </span>
                            </td>
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

export default GradesList;
