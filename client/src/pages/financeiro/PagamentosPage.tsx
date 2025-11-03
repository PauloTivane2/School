import { useState, useEffect } from "react";
import { X, Save, Smartphone } from "lucide-react";
import MpesaPayment from "../../components/MpesaPayment";
import ConfirmDialog from "../../components/ConfirmDialog";
import mpesaLogo from "../../assets/images/mpesa.png";
import visaLogo from "../../assets/images/visa.svg";
import paypalLogo from "../../assets/images/paypal.svg";
import {
  validateAmount,
  validateMpesaNumber,
  validateCardNumber,
  validateCardExpiry,
  validateCVV,
  validateEmail,
  validateReference,
  validateStudent,
  validatePaymentMethod,
  formatCardNumber
} from '../../utils/validations';

interface Payment {
  id?: number;
  aluno_id?: number;
  aluno_nome?: string;
  valor: string | number | null; // ✅ compatível com backend
  metodo: string;
  referencia: string;
  data_pagamento?: string | null;
  estado: string;
}

interface Aluno {
  id_aluno: number;
  nome_aluno: string;
}

interface PaymentFormProps {
  payment: Payment | null;
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentForm = ({ payment, onClose, onSuccess }: PaymentFormProps) => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [alunoId, setAlunoId] = useState<number>(payment?.aluno_id || 0);
  const [valor, setValor] = useState<number>(
    payment?.valor ? Number(payment.valor) : 0
  );
  const [metodo, setMetodo] = useState<string>(payment?.metodo || '');
  const [referencia, setReferencia] = useState<string>(payment?.referencia || '');
  const [estado, setEstado] = useState<string>(payment?.estado || 'pendente');
  const [step, setStep] = useState<'form' | 'payment'>('form');
  const [msisdn, setMsisdn] = useState<string>('258');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCVV, setCardCVV] = useState<string>('');
  const [paypalEmail, setPaypalEmail] = useState<string>('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [dialog, setDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'confirm' | 'alert' | 'success' | 'error' | 'warning';
    onConfirm?: () => void;
  }>({ isOpen: false, title: '', message: '', type: 'alert' });

  useEffect(() => {
    fetchAlunos();
    if (payment) {
      setAlunoId(payment.aluno_id || 0);
      setValor(Number(payment.valor || 0));
      setMetodo(payment.metodo);
      setReferencia(payment.referencia);
      setEstado(payment.estado);
    }
  }, [payment]);

  const fetchAlunos = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/students');
      if (response.ok) {
        const data = await response.json();
        setAlunos(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Erro ao carregar alunos:', error);
    }
  };

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
          aluno_id: alunoId,
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

  const handleMpesaSuccess = (transactionId: string) => {
    console.log('✅ Pagamento M-Pesa concluído:', transactionId);
    alert(`Pagamento M-Pesa iniciado com sucesso!\n\nID: ${transactionId}`);
    onSuccess();
    onClose();
  };

  const handleMpesaCancel = () => {
    setStep('form');
  };

  // Se estiver no step de pagamento M-Pesa, mostrar o componente MpesaPayment
  if (step === 'payment' && metodo === 'M-Pesa') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
        <MpesaPayment
          amount={valor}
          alunoId={alunoId}
          onSuccess={handleMpesaSuccess}
          onCancel={handleMpesaCancel}
        />
      </div>
    );
  }

  const showDialog = (
    title: string, 
    message: string, 
    type: 'confirm' | 'alert' | 'success' | 'error' | 'warning' = 'alert',
    onConfirm?: () => void
  ) => {
    setDialog({ isOpen: true, title, message, type, onConfirm });
  };

  const closeDialog = () => {
    setDialog({ ...dialog, isOpen: false });
  };

  const handleClose = () => {
    if (alunoId || valor || metodo || referencia) {
      showDialog(
        'Cancelar Pagamento',
        'Tem certeza que deseja cancelar?\nOs dados não salvos serão perdidos.',
        'warning',
        () => onClose()
      );
    } else {
      onClose();
    }
  };

  return (
    <>
      <ConfirmDialog
        isOpen={dialog.isOpen}
        title={dialog.title}
        message={dialog.message}
        type={dialog.type}
        onConfirm={dialog.onConfirm}
        onCancel={closeDialog}
      />

      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Cabeçalho Fixo */}
        <div className="bg-primary text-white p-4 rounded-t-xl flex justify-between items-center flex-shrink-0">
          <h3 className="text-lg font-bold">
            {payment ? 'Editar Pagamento' : 'Novo Pagamento'}
          </h3>
          <button 
            onClick={handleClose}
            className="p-1 hover:bg-primary-hover rounded-lg transition-all"
            aria-label="Fechar"
          >
            <X size={24} />
          </button>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="overflow-y-auto flex-1 p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-semibold mb-2 text-text-primary">
              Aluno <span className="text-error">*</span>
            </label>
            <select
              value={alunoId}
              onChange={(e) => setAlunoId(Number(e.target.value))}
              className="w-full border rounded-lg px-3 py-2"
              required
            >
              <option value="0">
                {alunos.length === 0 ? 'Nenhum aluno cadastrado' : 'Selecione um aluno'}
              </option>
              {alunos.map((aluno) => (
                <option key={aluno.id_aluno} value={aluno.id_aluno}>
                  {aluno.nome_aluno}
                </option>
              ))}
            </select>
            {alunos.length === 0 && (
              <p className="text-xs text-warning mt-1">
                ⚠️ Cadastre alunos primeiro no menu "Alunos"
              </p>
            )}
          </div>

          <div>
            <label className="block font-semibold mb-2 text-text-primary">
              Valor (MT) <span className="text-error">*</span>
            </label>
            <input
              type="number"
              value={valor}
              onChange={(e) => {
                const newValue = Number(e.target.value);
                setValor(newValue);
                const validation = validateAmount(newValue);
                if (!validation.isValid) {
                  setErrors({...errors, valor: validation.error || ''});
                } else {
                  const {valor: _, ...rest} = errors;
                  setErrors(rest);
                }
              }}
              className={`w-full border rounded-lg px-3 py-2 ${
                errors.valor ? 'border-error' : ''
              }`}
              min="1"
              step="1"
              required
              placeholder="Ex: 1000"
            />
            {errors.valor ? (
              <p className="text-xs text-error mt-1">
                {errors.valor}
              </p>
            ) : (
              <p className="text-xs text-neutral-gray mt-1">
                Valor deve ser um número inteiro maior que 0
              </p>
            )}
          </div>

          <div>
            <label className="block font-semibold mb-3 text-text-primary">Método de Pagamento</label>
            <div className="grid grid-cols-1 gap-3">
              {/* M-Pesa */}
              <button
                type="button"
                onClick={() => setMetodo('M-Pesa')}
                className={`w-full p-4 border-2 rounded-xl transition-all flex items-center gap-4 shadow-sm hover:shadow-md ${
                  metodo === 'M-Pesa'
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                    : 'border-border-light hover:border-primary hover:bg-accent'
                }`}
              >
                <img src={mpesaLogo} alt="M-Pesa" className="w-12 h-12 object-contain" />
                <div className="text-left flex-1">
                  <p className="font-semibold text-base text-text-primary">M-Pesa</p>
                  <p className="text-xs text-neutral-gray">Pagamento móvel</p>
                </div>
                {metodo === 'M-Pesa' && (
                  <div className="bg-primary text-white rounded-full p-2">
                    <Smartphone size={20} />
                  </div>
                )}
              </button>

              {/* Visa */}
              <button
                type="button"
                onClick={() => setMetodo('Visa')}
                className={`w-full p-4 border-2 rounded-xl transition-all flex items-center gap-4 shadow-sm hover:shadow-md ${
                  metodo === 'Visa'
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                    : 'border-border-light hover:border-primary hover:bg-accent'
                }`}
              >
                <img src={visaLogo} alt="Visa" className="w-12 h-12 object-contain" />
                <div className="text-left flex-1">
                  <p className="font-semibold text-base text-text-primary">Visa / Mastercard</p>
                  <p className="text-xs text-neutral-gray">Cartão de crédito</p>
                </div>
              </button>

              {/* PayPal */}
              <button
                type="button"
                onClick={() => setMetodo('PayPal')}
                className={`w-full p-4 border-2 rounded-xl transition-all flex items-center gap-4 shadow-sm hover:shadow-md ${
                  metodo === 'PayPal'
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                    : 'border-border-light hover:border-primary hover:bg-accent'
                }`}
              >
                <img src={paypalLogo} alt="PayPal" className="w-12 h-12 object-contain" />
                <div className="text-left flex-1">
                  <p className="font-semibold text-base text-text-primary">PayPal</p>
                  <p className="text-xs text-neutral-gray">Pagamento online</p>
                </div>
              </button>

            </div>
          </div>

          {/* Campos dinâmicos baseados no método selecionado */}
          {metodo === 'M-Pesa' && (
            <div>
              <label className="block font-semibold mb-2 text-text-primary">
                Número M-Pesa <span className="text-error">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-primary font-mono font-semibold">
                  258
                </span>
                <input
                  type="tel"
                  value={msisdn.slice(3)}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    const fullNumber = '258' + value;
                    setMsisdn(fullNumber);
                    const validation = validateMpesaNumber(fullNumber);
                    if (!validation.isValid && value.length > 0) {
                      setErrors({...errors, msisdn: validation.error || ''});
                    } else {
                      const {msisdn: _, ...rest} = errors;
                      setErrors(rest);
                    }
                  }}
                  onBlur={() => {
                    const validation = validateMpesaNumber(msisdn);
                    if (!validation.isValid) {
                      setErrors({...errors, msisdn: validation.error || ''});
                    }
                  }}
                  className={`w-full border rounded-lg pl-14 pr-3 py-2 font-mono ${
                    errors.msisdn ? 'border-error' : ''
                  }`}
                  placeholder="XXXXXXXXX"
                  maxLength={9}
                  required
                />
              </div>
              {errors.msisdn ? (
                <p className="text-xs text-error mt-1">
                  {errors.msisdn}
                </p>
              ) : (
                <p className="text-xs text-neutral-gray mt-1">
                  Formato: 258 + 9 dígitos (ex: 258840000000)
                </p>
              )}
            </div>
          )}

          {metodo === 'Visa' && (
            <>
              <div>
                <label className="block font-semibold mb-2 text-text-primary">
                  Número do Cartão <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  value={formatCardNumber(cardNumber)}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setCardNumber(value);
                    const validation = validateCardNumber(value);
                    if (!validation.isValid && value.length > 0) {
                      setErrors({...errors, cardNumber: validation.error || ''});
                    } else {
                      const {cardNumber: _, ...rest} = errors;
                      setErrors(rest);
                    }
                  }}
                  onBlur={() => {
                    const validation = validateCardNumber(cardNumber);
                    if (!validation.isValid) {
                      setErrors({...errors, cardNumber: validation.error || ''});
                    }
                  }}
                  className={`w-full border rounded-lg px-3 py-2 font-mono ${
                    errors.cardNumber ? 'border-error' : ''
                  }`}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                />
                {errors.cardNumber ? (
                  <p className="text-xs text-error mt-1">
                    {errors.cardNumber}
                  </p>
                ) : (
                  <p className="text-xs text-neutral-gray mt-1">
                    16 dígitos do cartão
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-2 text-text-primary">
                    Validade <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, '');
                      if (value.length >= 2) {
                        value = value.slice(0, 2) + '/' + value.slice(2, 4);
                      }
                      setCardExpiry(value);
                      const validation = validateCardExpiry(value);
                      if (!validation.isValid && value.length > 0) {
                        setErrors({...errors, cardExpiry: validation.error || ''});
                      } else {
                        const {cardExpiry: _, ...rest} = errors;
                        setErrors(rest);
                      }
                    }}
                    placeholder="MM/AA"
                    className={`w-full border rounded-lg px-3 py-2 font-mono ${
                      errors.cardExpiry ? 'border-error' : ''
                    }`}
                    maxLength={5}
                    required
                  />
                  {errors.cardExpiry && (
                    <p className="text-xs text-error mt-1">{errors.cardExpiry}</p>
                  )}
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-text-primary">
                    CVV <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    value={cardCVV}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setCardCVV(value);
                      const validation = validateCVV(value);
                      if (!validation.isValid && value.length > 0) {
                        setErrors({...errors, cardCVV: validation.error || ''});
                      } else {
                        const {cardCVV: _, ...rest} = errors;
                        setErrors(rest);
                      }
                    }}
                    placeholder="123"
                    className={`w-full border rounded-lg px-3 py-2 font-mono ${
                      errors.cardCVV ? 'border-error' : ''
                    }`}
                    maxLength={3}
                    required
                  />
                  {errors.cardCVV && (
                    <p className="text-xs text-error mt-1">{errors.cardCVV}</p>
                  )}
                </div>
              </div>
            </>
          )}

          {metodo === 'PayPal' && (
            <div>
              <label className="block font-semibold mb-2 text-text-primary">
                Email PayPal <span className="text-error">*</span>
              </label>
              <input
                type="email"
                value={paypalEmail}
                onChange={(e) => {
                  setPaypalEmail(e.target.value);
                  const validation = validateEmail(e.target.value);
                  if (!validation.isValid && e.target.value.length > 0) {
                    setErrors({...errors, paypalEmail: validation.error || ''});
                  } else {
                    const {paypalEmail: _, ...rest} = errors;
                    setErrors(rest);
                  }
                }}
                onBlur={() => {
                  const validation = validateEmail(paypalEmail);
                  if (!validation.isValid) {
                    setErrors({...errors, paypalEmail: validation.error || ''});
                  }
                }}
                className={`w-full border rounded-lg px-3 py-2 ${
                  errors.paypalEmail ? 'border-error' : ''
                }`}
                placeholder="seu-email@exemplo.com"
                required
              />
              {errors.paypalEmail ? (
                <p className="text-xs text-error mt-1">
                  {errors.paypalEmail}
                </p>
              ) : (
                <p className="text-xs text-neutral-gray mt-1">
                  Email associado à sua conta PayPal
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block font-semibold mb-2 text-text-primary">
              Referência <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={referencia}
              onChange={(e) => {
                setReferencia(e.target.value);
                const validation = validateReference(e.target.value);
                if (!validation.isValid && e.target.value.length > 0) {
                  setErrors({...errors, referencia: validation.error || ''});
                } else {
                  const {referencia: _, ...rest} = errors;
                  setErrors(rest);
                }
              }}
              onBlur={() => {
                const validation = validateReference(referencia);
                if (!validation.isValid) {
                  setErrors({...errors, referencia: validation.error || ''});
                }
              }}
              className={`w-full border rounded-lg px-3 py-2 ${
                errors.referencia ? 'border-error' : ''
              }`}
              placeholder="Ex: PAY-001"
              required
            />
            {errors.referencia && (
              <p className="text-xs text-error mt-1">{errors.referencia}</p>
            )}
          </div>

          <div>
            <label className="block font-semibold mb-2 text-text-primary">Estado</label>
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

          </form>
        </div>

        {/* Rodapé Fixo com Botões */}
        <div className="border-t border-border-light p-4 bg-neutral-light flex-shrink-0">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 border-2 border-border-light rounded-lg hover:bg-accent transition-all font-medium"
            >
              Cancelar
            </button>
            {metodo === 'M-Pesa' && !payment ? (
              <button
                type="button"
                onClick={() => {
                  // Validar aluno
                  const studentValidation = validateStudent(alunoId);
                  if (!studentValidation.isValid) {
                    showDialog('Erro de Validação', studentValidation.error || '', 'error');
                    return;
                  }

                  // Validar valor
                  const amountValidation = validateAmount(valor);
                  if (!amountValidation.isValid) {
                    showDialog('Erro de Validação', amountValidation.error || '', 'error');
                    return;
                  }

                  // Validar número M-Pesa
                  const mpesaValidation = validateMpesaNumber(msisdn);
                  if (!mpesaValidation.isValid) {
                    showDialog('Erro de Validação', mpesaValidation.error || '', 'error');
                    return;
                  }

                  // Validar referência
                  const refValidation = validateReference(referencia);
                  if (!refValidation.isValid) {
                    showDialog('Erro de Validação', refValidation.error || '', 'error');
                    return;
                  }

                  showDialog(
                    'Confirmar Pagamento M-Pesa',
                    `Confirmar pagamento de ${valor} MZN via M-Pesa?\n\nNúmero: ${msisdn}`,
                    'confirm',
                    () => setStep('payment')
                  );
                }}
                className="flex-1 btn-primary flex items-center justify-center gap-2 py-3 font-medium"
              >
                <Smartphone size={18} />
                Pagar Agora
              </button>
            ) : (
              <button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();

                  // Validar aluno
                  const studentValidation = validateStudent(alunoId);
                  if (!studentValidation.isValid) {
                    showDialog('Erro de Validação', studentValidation.error || '', 'error');
                    return;
                  }

                  // Validar valor
                  const amountValidation = validateAmount(valor);
                  if (!amountValidation.isValid) {
                    showDialog('Erro de Validação', amountValidation.error || '', 'error');
                    return;
                  }

                  // Validar método
                  const methodValidation = validatePaymentMethod(metodo);
                  if (!methodValidation.isValid) {
                    showDialog('Erro de Validação', methodValidation.error || '', 'error');
                    return;
                  }

                  // Validar referência
                  const refValidation = validateReference(referencia);
                  if (!refValidation.isValid) {
                    showDialog('Erro de Validação', refValidation.error || '', 'error');
                    return;
                  }

                  // Validações específicas por método
                  if (metodo === 'Visa') {
                    const cardValidation = validateCardNumber(cardNumber);
                    if (!cardValidation.isValid) {
                      showDialog('Erro de Validação', cardValidation.error || '', 'error');
                      return;
                    }
                    const expiryValidation = validateCardExpiry(cardExpiry);
                    if (!expiryValidation.isValid) {
                      showDialog('Erro de Validação', expiryValidation.error || '', 'error');
                      return;
                    }
                    const cvvValidation = validateCVV(cardCVV);
                    if (!cvvValidation.isValid) {
                      showDialog('Erro de Validação', cvvValidation.error || '', 'error');
                      return;
                    }
                  } else if (metodo === 'PayPal') {
                    const emailValidation = validateEmail(paypalEmail);
                    if (!emailValidation.isValid) {
                      showDialog('Erro de Validação', emailValidation.error || '', 'error');
                      return;
                    }
                  }

                  showDialog(
                    'Confirmar Salvamento',
                    `Confirmar o salvamento deste pagamento?\n\nMétodo: ${metodo}\nValor: ${valor} MZN`,
                    'confirm',
                    () => handleSubmit(e)
                  );
                }}
                className="flex-1 btn-success flex items-center justify-center gap-2 py-3 font-medium"
              >
                <Save size={18} />
                Salvar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default PaymentForm;
