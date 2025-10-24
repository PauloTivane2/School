import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

interface Payment {
  id?: number;
  aluno_nome?: string;
  valor: string | number | null; // ✅ compatível com backend
  metodo: string;
  referencia: string;
  data_pagamento?: string | null;
  estado: string;
}

interface PaymentFormProps {
  payment: Payment | null;
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentForm = ({ payment, onClose, onSuccess }: PaymentFormProps) => {
  const [valor, setValor] = useState<number>(
    payment?.valor ? Number(payment.valor) : 0
  );
  const [metodo, setMetodo] = useState<string>(payment?.metodo || '');
  const [referencia, setReferencia] = useState<string>(payment?.referencia || '');
  const [estado, setEstado] = useState<string>(payment?.estado || 'pendente');

  useEffect(() => {
    if (payment) {
      setValor(Number(payment.valor || 0));
      setMetodo(payment.metodo);
      setReferencia(payment.referencia);
      setEstado(payment.estado);
    }
  }, [payment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = payment
      ? `http://localhost:3000/api/payments/${payment.id}`
      : 'http://localhost:3000/api/payments';
    const method = payment ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          valor: Number(valor), // ✅ garante número no envio
          metodo,
          referencia,
          estado,
        }),
      });

      if (!res.ok) throw new Error('Erro ao salvar pagamento');
      alert(payment ? 'Pagamento atualizado com sucesso!' : 'Pagamento criado com sucesso!');
      onSuccess();
      onClose();
    } catch (err) {
      alert('Falha ao comunicar com o servidor.');
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div className="bg-secondary text-white p-4 rounded-t-xl flex justify-between">
          <h3 className="font-bold">
            {payment ? 'Editar Pagamento' : 'Novo Pagamento'}
          </h3>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block font-semibold mb-1">Valor (MT)</label>
            <input
              type="number"
              value={valor}
              onChange={(e) => setValor(Number(e.target.value))}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Método</label>
            <input
              type="text"
              value={metodo}
              onChange={(e) => setMetodo(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Referência</label>
            <input
              type="text"
              value={referencia}
              onChange={(e) => setReferencia(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Estado</label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="pago">Pago</option>
              <option value="pendente">Pendente</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-secondary text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition"
          >
            <Save size={18} />
            Salvar
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
