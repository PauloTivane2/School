// frontend/src/components/pagamentos/pagamentosList.tsx
import { useState, useEffect } from 'react';
import { DollarSign, Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import PaymentForm from './pagamentosView';

interface Payment {
  id: number;
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
    return <div className="p-6 text-center text-gray-600">Carregando pagamentos...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-600 p-6 rounded-xl shadow-lg text-white">
          <p className="text-sm text-green-100">Total Recebido</p>
          <p className="text-3xl font-bold mt-1">{totalPago.toFixed(2)} MT</p>
        </div>
        <div className="bg-yellow-600 p-6 rounded-xl shadow-lg text-white">
          <p className="text-sm text-yellow-100">Pendentes</p>
          <p className="text-3xl font-bold mt-1">{totalPendente.toFixed(2)} MT</p>
        </div>
        <div className="bg-blue-600 p-6 rounded-xl shadow-lg text-white">
          <p className="text-sm text-blue-100">Total Pagamentos</p>
          <p className="text-3xl font-bold mt-1">{payments.length}</p>
        </div>
      </div>

      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <DollarSign size={28} className="text-green-600" />
            Gestão de Pagamentos
          </h2>
          <p className="text-gray-500 mt-1">Gerir mensalidades e pagamentos</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2 shadow-md"
        >
          <Plus size={20} />
          Registrar Pagamento
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="relative">
            <label className="block text-gray-600 font-medium mb-1">Pesquisar:</label>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Por aluno, método, estado ou referência..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-gray-600 font-medium mb-1">Filtrar por estado:</label>
            <div className="relative">
              <Filter
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aluno</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Método</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Referência</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm">{p.aluno_nome}</td>
                    <td className="px-6 py-4 text-sm font-bold">{toNumber(p.valor).toFixed(2)} MT</td>
                    <td className="px-6 py-4 text-sm">{p.metodo}</td>
                    <td className="px-6 py-4 text-sm">{p.referencia}</td>
                    <td className="px-6 py-4 text-sm">
                      {p.data_pagamento ? new Date(p.data_pagamento).toLocaleDateString('pt-BR') : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          p.estado === 'pago'
                            ? 'bg-green-100 text-green-700'
                            : p.estado === 'pendente'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {p.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm flex gap-3">
                      <button
                        onClick={() => handleEdit(p)}
                        className={`flex items-center justify-center ${
                          p.estado === 'pago'
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-blue-600 hover:text-blue-800'
                        }`}
                        disabled={p.estado === 'pago'}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center text-gray-500 py-4">
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
    </div>
  );
};

export default PaymentsList;


