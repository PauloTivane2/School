import { useState, useEffect } from 'react';
import { Users, DollarSign, CheckCircle, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/auth/AuthContext';
import guardianService, { GuardianDashboard as DashboardData } from '../../services/guardian.service';
import StudentSelector from '../../components/StudentSelector';
import EncarregadoPayment from '../../components/EncarregadoPayment';

export default function EncarregadoDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await guardianService.getDashboard();
      setDashboardData(data);
      
      // Selecionar o primeiro aluno automaticamente
      if (data.students && data.students.length > 0 && !selectedStudent) {
        setSelectedStudent(data.students[0]);
      }
    } catch (error: any) {
      console.error('Erro ao carregar dashboard:', error);
      setError(error.response?.data?.message || 'Erro ao carregar informações');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboard();
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    handleRefresh();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto mb-4 text-primary" size={48} />
          <p className="text-neutral-gray">Carregando informações...</p>
        </div>
      </div>
    );
  }

  const students = dashboardData?.students || [];
  const stats = dashboardData?.stats || { total_alunos: 0, pagamentos_pendentes: 0, media_geral: 0, total_faltas: 0 };
  const alerts = dashboardData?.alerts || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Área do Encarregado</h1>
          <p className="text-neutral-gray mt-1">Bem-vindo, {user?.nome || 'Encarregado'}. Acompanhe seus educandos.</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-border-light rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          <span className="text-sm font-medium">Atualizar</span>
        </button>
      </div>

      {/* Seletor de Aluno */}
      {students.length > 0 && (
        <StudentSelector
          students={students}
          selectedStudent={selectedStudent}
          onSelectStudent={setSelectedStudent}
        />
      )}

      {/* Mensagem de Erro */}
      {error && (
        <div className="bg-error-light border border-error rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-error flex-shrink-0" size={20} />
            <div>
              <p className="text-sm text-error font-medium">Erro ao carregar dados</p>
              <p className="text-sm text-error mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-border-light p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-gray">Total de Educandos</p>
              <p className="text-3xl font-bold text-text-primary mt-2">{stats.total_alunos}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <Users className="text-primary" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-border-light p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-gray">Pagamentos Pendentes</p>
              <p className="text-3xl font-bold text-warning mt-2">{stats.pagamentos_pendentes}</p>
            </div>
            <div className="p-3 bg-warning-light rounded-lg">
              <DollarSign className="text-warning" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-border-light p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-gray">Média Geral</p>
              <p className="text-3xl font-bold text-primary mt-2">{stats.media_geral.toFixed(1)}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <BookOpen className="text-primary" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-border-light p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-gray">Total de Faltas</p>
              <p className="text-3xl font-bold text-error mt-2">{stats.total_faltas}</p>
            </div>
            <div className="p-3 bg-error-light rounded-lg">
              <AlertCircle className="text-error" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Alertas */}
      {alerts.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-border-light">
          <div className="p-6 border-b border-border-light">
            <h2 className="text-xl font-semibold text-text-primary">Alertas Importantes</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    alert.tipo === 'pagamento'
                      ? 'border-warning bg-warning-light'
                      : alert.tipo === 'falta'
                      ? 'border-error bg-error-light'
                      : 'border-primary bg-primary/5'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle
                      size={20}
                      className={`flex-shrink-0 ${
                        alert.tipo === 'pagamento'
                          ? 'text-warning'
                          : alert.tipo === 'falta'
                          ? 'text-error'
                          : 'text-primary'
                      }`}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-text-primary">{alert.aluno_nome}</p>
                      <p className="text-sm text-neutral-gray mt-1">{alert.mensagem}</p>
                      <p className="text-xs text-neutral-gray mt-1">
                        {new Date(alert.data).toLocaleDateString('pt-PT')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lista de Educandos */}
      <div className="bg-white rounded-xl shadow-sm border border-border-light">
        <div className="p-6 border-b border-border-light">
          <h2 className="text-xl font-semibold text-text-primary">Meus Educandos</h2>
        </div>
        <div className="p-6">
          {students.length === 0 ? (
            <div className="text-center py-8">
              <Users className="mx-auto text-neutral-gray mb-4" size={48} />
              <p className="text-neutral-gray">Nenhum educando encontrado</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {students.map((student) => (
                <div
                  key={student.id_aluno}
                  className={`p-4 border rounded-lg hover:border-primary transition-colors cursor-pointer ${
                    selectedStudent?.id_aluno === student.id_aluno
                      ? 'border-primary bg-accent'
                      : 'border-border-light'
                  }`}
                  onClick={() => setSelectedStudent(student)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                      {student.nome.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-text-primary">{student.nome}</h3>
                      {student.nome_turma && (
                        <p className="text-xs text-neutral-gray">
                          {student.classe} - {student.nome_turma}
                        </p>
                      )}
                    </div>
                  </div>
                  {student.estado && (
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      student.estado === 'ativo' ? 'bg-success-light text-success' : 'bg-neutral-light text-neutral-gray'
                    }`}>
                      {student.estado}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Informação do Aluno Selecionado */}
      {selectedStudent && (
        <div className="bg-white rounded-xl shadow-sm border border-border-light p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            📋 Informações de {selectedStudent.nome}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informações Básicas */}
            <div className="space-y-3">
              <div>
                <p className="text-sm text-neutral-gray">Turma</p>
                <p className="font-medium text-text-primary">{selectedStudent.classe} - {selectedStudent.nome_turma || 'Não atribuída'}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-gray">Data de Nascimento</p>
                <p className="font-medium text-text-primary">
                  {selectedStudent.data_nascimento ? new Date(selectedStudent.data_nascimento).toLocaleDateString('pt-PT') : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-gray">Género</p>
                <p className="font-medium text-text-primary">{selectedStudent.genero || 'N/A'}</p>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-3">
              <div>
                <p className="text-sm text-neutral-gray">Estado</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  selectedStudent.estado === 'ativo' ? 'bg-success-light text-success' : 'bg-neutral-light text-neutral-gray'
                }`}>
                  {selectedStudent.estado}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-sm text-neutral-gray mb-2">📊 Acesso aos Dados</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen size={16} className="text-primary" />
                    <span>Notas e boletins</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle size={16} className="text-success" />
                    <span>Presenças e faltas</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign size={16} className="text-warning" />
                    <span>Pagamentos e mensalidades</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Botão de Pagamento */}
          <div className="mt-6">
            <button
              onClick={() => setShowPayment(true)}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              <DollarSign size={20} />
              <span>Pagar Mensalidade</span>
            </button>
          </div>
          
          <div className="mt-4 p-4 bg-accent rounded-lg border border-border-light">
            <p className="text-sm text-neutral-gray">
              💡 <strong>Nota:</strong> Os dados detalhados de notas, presenças e pagamentos são fornecidos pelos alertas acima e pelo resumo estatístico.
            </p>
          </div>
        </div>
      )}

      {/* Modal de Pagamento */}
      {showPayment && selectedStudent && (
        <EncarregadoPayment
          student={selectedStudent}
          onClose={() => setShowPayment(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* Aviso RN01/RN04 */}
      <div className="bg-accent border border-border-light rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-primary flex-shrink-0" size={20} />
          <div>
            <p className="text-sm text-text-primary font-medium">Privacidade e Segurança</p>
            <p className="text-sm text-neutral-gray mt-1">
              Conforme política de privacidade (RN01/RN04), você visualiza apenas informações dos seus educandos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
