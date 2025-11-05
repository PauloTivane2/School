import { useState } from 'react';
import { DollarSign, CreditCard, X, CheckCircle, AlertCircle } from 'lucide-react';
import MpesaPayment from './MpesaPayment';

interface EncarregadoPaymentProps {
  student: {
    id_aluno: number;
    nome: string;
    classe?: string;
    nome_turma?: string;
  };
  onClose: () => void;
  onPaymentSuccess: () => void;
}

export default function EncarregadoPayment({ student, onClose, onPaymentSuccess }: EncarregadoPaymentProps) {
  const [showPayment, setShowPayment] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  
  // Valores padrão de mensalidades
  const mensalidadeOptions = [
    { label: 'Mensalidade 1º Trimestre', value: 3000 },
    { label: 'Mensalidade 2º Trimestre', value: 3000 },
    { label: 'Mensalidade 3º Trimestre', value: 3000 },
    { label: 'Material Escolar', value: 1500 },
    { label: 'Uniforme', value: 2000 },
  ];

  const handleSelectAmount = (amount: number) => {
    setSelectedAmount(amount);
    setShowPayment(true);
  };

  const handlePaymentSuccess = (transactionId: string) => {
    console.log('Pagamento realizado:', transactionId);
    setShowPayment(false);
    onPaymentSuccess();
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
    setSelectedAmount(null);
  };

  if (showPayment && selectedAmount) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-border-light p-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-text-primary">Pagamento de Mensalidade</h2>
              <p className="text-sm text-neutral-gray mt-1">
                {student.nome} - {student.classe} {student.nome_turma}
              </p>
            </div>
            <button
              onClick={handlePaymentCancel}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6">
            <MpesaPayment
              amount={selectedAmount}
              alunoId={student.id_aluno}
              onSuccess={handlePaymentSuccess}
              onCancel={handlePaymentCancel}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border-light p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Pagar Mensalidade</h2>
            <p className="text-sm text-neutral-gray mt-1">
              {student.nome} - {student.classe} {student.nome_turma}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Aviso */}
          <div className="bg-accent border border-border-light rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-primary flex-shrink-0" size={20} />
              <div>
                <p className="text-sm text-text-primary font-medium">Pagamento Seguro</p>
                <p className="text-sm text-neutral-gray mt-1">
                  Escolha o tipo de pagamento abaixo. Todos os pagamentos são processados de forma segura.
                </p>
              </div>
            </div>
          </div>

          {/* Opções de Pagamento */}
          <h3 className="text-lg font-semibold text-text-primary mb-4">Selecione o que deseja pagar:</h3>
          <div className="space-y-3">
            {mensalidadeOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelectAmount(option.value)}
                className="w-full p-4 border border-border-light rounded-lg hover:border-primary hover:bg-accent transition-colors text-left group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <DollarSign className="text-primary" size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">{option.label}</p>
                      <p className="text-sm text-neutral-gray">
                        Aluno: {student.nome}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">{option.value.toLocaleString('pt-PT')} MT</p>
                    <p className="text-xs text-neutral-gray">Clique para pagar</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Métodos de Pagamento */}
          <div className="mt-6 p-4 bg-accent rounded-lg">
            <h4 className="text-sm font-medium text-text-primary mb-2">Métodos de pagamento disponíveis:</h4>
            <div className="flex items-center gap-4 text-sm text-neutral-gray">
              <div className="flex items-center gap-2">
                <CreditCard size={16} />
                <span>M-Pesa</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard size={16} />
                <span>Visa/Mastercard</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard size={16} />
                <span>PayPal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border-light p-6 bg-accent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-neutral-gray">
              <CheckCircle size={16} className="text-success" />
              <span>Pagamentos processados com segurança</span>
            </div>
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
