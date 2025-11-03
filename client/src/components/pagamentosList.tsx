// frontend/src/components/pagamentos/pagamentosList.tsx
import { useState, useEffect } from 'react';
import { DollarSign, Plus, Edit, Trash2, Search, Filter, Smartphone } from 'lucide-react';
import PaymentForm from '../pages/pagamentosView';
import MpesaPayment from './MpesaPayment';

interface Payment {
  id: number;
  aluno_id?: number;
  aluno_nome: string;
  valor: number | string | null; // aceitar string também (só para robustez)
  metodo: string;
  referencia: string;
  data_pagamento: string | null;
  estado: string;
}

const PaymentsList = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showMpesaPayment, setShowMpesaPayment] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/payments');
      if (!response.ok) throw new Error('Falha ao buscar pagamentos');
      const data = await response.json();
      setPayments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao buscar pagamentos:', error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja eliminar este pagamento?')) return;

    try {
      const res = await fetch(`http://localhost:3000/api/payments/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao eliminar pagamento');
      fetchPayments();
    } catch (error) {
      console.error('Erro ao eliminar pagamento:', error);
      alert('Erro ao eliminar pagamento');
    }
  };

  const handleEdit = (payment: Payment) => {
    if (payment.estado === 'pago') return; // ❌ não permite editar pagos
    setEditingPayment(payment);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPayment(null);
    fetchPayments();
  };

  const handleAdd = () => {
    setEditingPayment(null);
    setShowForm(true);
  };

  const handlePayWithMpesa = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowMpesaPayment(true);
  };

  const handleMpesaSuccess = (transactionId: string) => {
    console.log('✅ Pagamento M-Pesa iniciado:', transactionId);
    alert(`Pagamento M-Pesa iniciado com sucesso!\n\nID da Transação: ${transactionId}\n\nVerifique seu telefone para confirmar o pagamento.`);
    setShowMpesaPayment(false);
    setSelectedPayment(null);
    fetchPayments(); // Recarregar lista
  };

  const handleMpesaCancel = () => {
    setShowMpesaPayment(false);
    setSelectedPayment(null);
  };

  const toNumber = (v: number | string | null | undefined) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      (payment.aluno_nome || '').toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payment.referencia || '').toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payment.metodo || '').toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payment.estado || '').toString().toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || payment.estado === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalPago = payments
    .filter((p) => p.estado === 'pago')
    .reduce((sum, p) => sum + toNumber(p.valor), 0);

  const totalPendente = payments
    .filter((p) => p.estado === 'pendente')
    .reduce((sum, p) => sum + toNumber(p.valor), 0);

  if (loading) {
    return <div className="card text-center text-neutral-gray">Carregando pagamentos...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card border-l-4 border-success">
          <p className="text-sm text-neutral-gray font-medium">Total Recebido</p>
          <p className="text-2xl font-semibold text-text-primary mt-2">{totalPago.toFixed(2)} MT</p>
        </div>
        <div className="card border-l-4 border-warning">
          <p className="text-sm text-neutral-gray font-medium">Pendentes</p>
          <p className="text-2xl font-semibold text-text-primary mt-2">{totalPendente.toFixed(2)} MT</p>
        </div>
        <div className="card border-l-4 border-primary">
          <p className="text-sm text-neutral-gray font-medium">Total Pagamentos</p>
          <p className="text-2xl font-semibold text-text-primary mt-2">{payments.length}</p>
        </div>
      </div>

      {/* Cabeçalho */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
              <DollarSign size={24} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-primary">Gestão de Pagamentos</h2>
              <p className="text-sm text-neutral-gray mt-1">Gerir mensalidades e pagamentos</p>
            </div>
          </div>
          <button
            onClick={handleAdd}
            className="btn-primary flex items-center gap-2"
            aria-label="Registrar pagamento"
          >
            <Plus size={18} />
            Novo Pagamento
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Pesquisar:</label>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-gray"
                size={18}
              />
              <input
                type="text"
                placeholder="Aluno, método, estado ou referência"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
                aria-label="Pesquisar pagamento"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Filtrar por estado:</label>
            <div className="relative">
              <Filter
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-gray"
                size={18}
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field pl-10"
                aria-label="Filtrar por estado"
              >
                <option value="all">Todos</option>
                <option value="pago">Pagos</option>
                <option value="pendente">Pendentes</option>
                <option value="cancelado">Cancelados</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border-light">
            <thead className="table-header">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Aluno</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Valor</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Método</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Referência</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Data</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Estado</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light bg-white">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="table-row">
                    <td className="px-4 py-3 text-sm text-text-primary">{p.aluno_nome}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-text-primary">{toNumber(p.valor).toFixed(2)} MT</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{p.metodo}</td>
                    <td className="px-4 py-3 text-sm text-neutral-gray">{p.referencia}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">
                      {p.data_pagamento ? new Date(p.data_pagamento).toLocaleDateString('pt-BR') : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          p.estado === 'pago'
                            ? 'bg-success-light text-success'
                            : p.estado === 'pendente'
                            ? 'bg-warning-light text-warning'
                            : 'bg-error-light text-error'
                        }`}
                      >
                        {p.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        {/* Botão Pagar com M-Pesa (apenas para pendentes) */}
                        {p.estado === 'pendente' && (
                          <button
                            onClick={() => handlePayWithMpesa(p)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all duration-150 flex items-center gap-1"
                            title="Pagar com M-Pesa"
                            aria-label="Pagar com M-Pesa"
                          >
                            <Smartphone size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(p)}
                          className={`p-2 rounded-lg transition-all duration-150 ${
                            p.estado === 'pago'
                              ? 'text-neutral-gray cursor-not-allowed'
                              : 'text-primary hover:bg-accent'
                          }`}
                          disabled={p.estado === 'pago'}
                          aria-label="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-2 text-error hover:bg-accent rounded-lg transition-all duration-150"
                          aria-label="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center text-neutral-gray py-8">
                    Nenhum pagamento encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <PaymentForm payment={editingPayment} onClose={handleCloseForm} onSuccess={fetchPayments} />
      )}

      {/* Modal de Pagamento M-Pesa */}
      {showMpesaPayment && selectedPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="relative max-w-md w-full">
            <MpesaPayment
              amount={toNumber(selectedPayment.valor)}
              alunoId={selectedPayment.aluno_id}
              pagamentoId={selectedPayment.id}
              onSuccess={handleMpesaSuccess}
              onCancel={handleMpesaCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsList;


