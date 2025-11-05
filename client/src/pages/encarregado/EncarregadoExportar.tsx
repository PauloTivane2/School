import { useState, useEffect } from 'react';
import { Download, FileText, Calendar, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';
import guardianService from '../../services/guardian.service';
import Dialog from '../../components/Dialog';

export default function EncarregadoExportar() {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [dialog, setDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'error' | 'success' | 'info' | 'warning';
  }>({ isOpen: false, title: '', message: '', type: 'info' });

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const dashboard = await guardianService.getDashboard();
      setStudents(dashboard.students || []);
      if (dashboard.students && dashboard.students.length > 0) {
        setSelectedStudent(dashboard.students[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar alunos:', error);
    } finally {
      setLoading(false);
    }
  };

  const showDialog = (title: string, message: string, type: 'error' | 'success' | 'info' | 'warning' = 'info') => {
    setDialog({ isOpen: true, title, message, type });
  };

  const closeDialog = () => {
    setDialog({ ...dialog, isOpen: false });
  };

  const handleExport = async (type: 'completo' | 'presencas' | 'pagamentos') => {
    if (!selectedStudent) {
      showDialog('Selecione um Aluno', 'Por favor, selecione um educando primeiro.', 'warning');
      return;
    }

    setExporting(true);
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/guardians/aluno/${selectedStudent.id_aluno}/exportar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ type })
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar PDF');
      }

      // Baixar o PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_${selectedStudent.nome.replace(/\s/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      const typeLabels = {
        completo: 'Relatório Completo',
        presencas: 'Relatório de Presenças',
        pagamentos: 'Relatório de Pagamentos'
      };
      
      showDialog(
        'Exportação Concluída!',
        `${typeLabels[type]} de ${selectedStudent.nome} foi gerado e baixado com sucesso.`,
        'success'
      );
    } catch (error) {
      console.error('Erro na exportação:', error);
      showDialog(
        'Erro na Exportação',
        'Não foi possível gerar o relatório. Tente novamente.',
        'error'
      );
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Download className="animate-bounce mx-auto mb-4 text-primary" size={48} />
          <p className="text-neutral-gray">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Dialog
        isOpen={dialog.isOpen}
        onClose={closeDialog}
        title={dialog.title}
        message={dialog.message}
        type={dialog.type}
      />
      
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Exportar Informações</h1>
          <p className="text-neutral-gray mt-1">Baixe relatórios em PDF dos seus educandos</p>
        </div>

        {/* Seletor de Aluno */}
        {students.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-border-light p-4">
            <label className="block text-sm font-medium text-text-primary mb-3">
              Selecione o Educando
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {students.map((student) => (
                <button
                  key={student.id_aluno}
                  onClick={() => setSelectedStudent(student)}
                  className={`p-4 border rounded-lg transition-colors text-left ${
                    selectedStudent?.id_aluno === student.id_aluno
                      ? 'border-primary bg-accent'
                      : 'border-border-light hover:border-primary hover:bg-accent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                      {student.nome.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">{student.nome}</p>
                      <p className="text-xs text-neutral-gray">
                        {student.classe} - {student.nome_turma}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Opções de Exportação */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Relatório Completo */}
          <div className="bg-white rounded-xl shadow-sm border border-border-light p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <FileText className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">Relatório Completo</h3>
                <p className="text-sm text-neutral-gray">Todas as informações</p>
              </div>
            </div>
            <p className="text-sm text-neutral-gray mb-4">
              Inclui presenças, pagamentos e informações gerais do educando.
            </p>
            <button
              onClick={() => handleExport('completo')}
              disabled={!selectedStudent || exporting}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Download size={20} />
              <span>Exportar PDF</span>
            </button>
          </div>

          {/* Relatório de Presenças */}
          <div className="bg-white rounded-xl shadow-sm border border-border-light p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-success/10 rounded-lg">
                <Calendar className="text-success" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">Relatório de Presenças</h3>
                <p className="text-sm text-neutral-gray">Frequência escolar</p>
              </div>
            </div>
            <p className="text-sm text-neutral-gray mb-4">
              Histórico completo de presenças e faltas com percentagem de frequência.
            </p>
            <button
              onClick={() => handleExport('presencas')}
              disabled={!selectedStudent || exporting}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Download size={20} />
              <span>Exportar PDF</span>
            </button>
          </div>

          {/* Relatório de Pagamentos */}
          <div className="bg-white rounded-xl shadow-sm border border-border-light p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-warning/10 rounded-lg">
                <DollarSign className="text-warning" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">Relatório Financeiro</h3>
                <p className="text-sm text-neutral-gray">Histórico de pagamentos</p>
              </div>
            </div>
            <p className="text-sm text-neutral-gray mb-4">
              Resumo de todas as mensalidades pagas e pendentes do educando.
            </p>
            <button
              onClick={() => handleExport('pagamentos')}
              disabled={!selectedStudent || exporting}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Download size={20} />
              <span>Exportar PDF</span>
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="bg-accent border border-border-light rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-primary flex-shrink-0" size={20} />
            <div>
              <p className="text-sm text-text-primary font-medium">Formato dos Relatórios</p>
              <p className="text-sm text-neutral-gray mt-1">
                Todos os relatórios são gerados em formato PDF, prontos para imprimir ou guardar. 
                Os dados são atualizados em tempo real.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
