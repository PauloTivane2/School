/**
 * RecentPayments Component
 * Lista dos últimos pagamentos realizados
 */

import { DollarSign, ArrowRight } from 'lucide-react';
import type { RecentPayment } from '../../types/dashboard.types';

interface RecentPaymentsProps {
  payments: RecentPayment[];
  onViewAll?: () => void;
}

export default function RecentPayments({ payments, onViewAll }: RecentPaymentsProps) {
  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'pago':
        return 'bg-success-light text-success';
      case 'pendente':
        return 'bg-warning-light text-warning';
      case 'atrasado':
        return 'bg-error-light text-error';
      default:
        return 'bg-neutral-gray text-white';
    }
  };

  const getMetodoIcon = (metodo: string) => {
    const icons: Record<string, string> = {
      'M-Pesa': '📱',
      'Transferência': '🏦',
      'Efectivo': '💵',
      'Cartão': '💳'
    };
    return icons[metodo] || '💰';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border-light">
      <div className="p-6 border-b border-border-light">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Últimos Pagamentos</h3>
            <p className="text-sm text-neutral-gray mt-1">Pagamentos recentes</p>
          </div>
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="text-sm text-primary hover:text-primary-hover font-medium flex items-center gap-1 transition-colors"
            >
              Ver todos
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
      
      <div className="divide-y divide-border-light">
        {payments.length === 0 ? (
          <div className="p-8 text-center text-neutral-gray">
            <DollarSign size={48} className="mx-auto mb-2 opacity-20" />
            <p>Nenhum pagamento recente</p>
          </div>
        ) : (
          payments.map((payment) => (
            <div key={payment.id} className="p-4 hover:bg-accent transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                    {getMetodoIcon(payment.metodo)}
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">{payment.alunoNome}</p>
                    <p className="text-sm text-neutral-gray">{payment.tipo} • {payment.metodo}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-text-primary">
                    {payment.valor.toLocaleString('pt-PT')} MT
                  </p>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${getStatusColor(payment.estado)}`}>
                    {payment.estado.charAt(0).toUpperCase() + payment.estado.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
