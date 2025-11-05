import { useState, useEffect } from 'react';
import { Smartphone, CheckCircle, XCircle, Loader } from 'lucide-react';
import Dialog from './Dialog';
import mpesaLogo from '../assets/images/mpesa.png';
import visaLogo from '../assets/images/visa.svg';
import paypalLogo from '../assets/images/paypal.svg';

interface MpesaPaymentProps {
  amount: number;
  alunoId?: number;
  onSuccess?: (transactionId: string) => void;
  onCancel?: () => void;
}

interface Wallet {
  id: string;
  name: string;
  number: string;
}

export default function MpesaPayment({ 
  amount, 
  alunoId, 
  onSuccess, 
  onCancel 
}: MpesaPaymentProps) {
  const [step, setStep] = useState<'method' | 'mpesa' | 'processing' | 'success' | 'error'>('method');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'visa' | 'paypal' | null>(null);
  const [msisdn, setMsisdn] = useState('258');
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedWallet, setSelectedWallet] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [dialog, setDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'error' | 'success' | 'info' | 'warning';
  }>({ isOpen: false, title: '', message: '', type: 'info' });

  const showDialog = (title: string, message: string, type: 'error' | 'success' | 'info' | 'warning' = 'info') => {
    setDialog({ isOpen: true, title, message, type });
  };

  const closeDialog = () => {
    setDialog({ ...dialog, isOpen: false });
  };

  // Carregar carteiras M-Pesa
  useEffect(() => {
    console.log('🔄 useEffect chamado. paymentMethod:', paymentMethod);
    if (paymentMethod === 'mpesa') {
      console.log('📱 Método M-Pesa selecionado, carregando carteiras...');
      loadWallets();
    }
  }, [paymentMethod]);

  const loadWallets = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('🔑 Token:', token ? 'Existe' : 'Não existe');
      
      const response = await fetch('/api/guardians/pagamento/carteiras', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📡 Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📦 Dados completos recebidos:', data);
        console.log('📦 data.data:', data.data);
        console.log('📦 data.success:', data.success);
        
        // A resposta vem em data.data (do ApiResponse)
        const walletsList = data.data || [];
        console.log('💼 Lista de carteiras:', walletsList);
        
        if (walletsList.length > 0) {
          setWallets(walletsList);
          setSelectedWallet(walletsList[0].id);
          console.log('✅ Carteiras carregadas com sucesso:', walletsList);
          console.log('✅ Primeira carteira selecionada:', walletsList[0].id);
        } else {
          console.warn('⚠️ Array de carteiras vazio');
        }
      } else {
        const errorText = await response.text();
        console.error('❌ Erro HTTP:', response.status, errorText);
      }
    } catch (error) {
      console.error('❌ Exceção ao carregar carteiras:', error);
    }
  };

  const handleMethodSelect = (method: 'mpesa' | 'visa' | 'paypal') => {
    setPaymentMethod(method);
    
    if (method === 'mpesa') {
      setStep('mpesa');
    } else {
      showDialog(
        'Em Desenvolvimento',
        `Pagamento via ${method === 'visa' ? 'Visa' : 'PayPal'} estará disponível em breve.`,
        'info'
      );
    }
  };

  const handleMpesaPayment = async () => {
    // Validações
    if (!msisdn || msisdn.length !== 12) {
      showDialog('Número Inválido', 'Insira um número válido (258XXXXXXXXX)', 'warning');
      return;
    }

    if (!selectedWallet) {
      showDialog('Carteira Obrigatória', 'Selecione uma carteira M-Pesa', 'warning');
      return;
    }

    setIsLoading(true);
    setStep('processing');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/guardians/pagamento/mpesa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          studentId: alunoId,
          amount: amount,
          msisdn: msisdn,
          walletId: selectedWallet,
          reference: `MENSALIDADE-${alunoId || Date.now()}`
        })
      });

      const data = await response.json();

      if (data.success) {
        const txId = data.data?.transaction_id || data.data?.data?.transaction_id;
        setTransactionId(txId);
        setStep('success');
        
        if (onSuccess) {
          onSuccess(txId);
        }
      } else {
        setErrorMessage(data.message || 'Erro ao processar pagamento');
        setStep('error');
      }
    } catch (error: any) {
      console.error('Erro ao processar pagamento:', error);
      setErrorMessage('Erro de conexão. Tente novamente.');
      setStep('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog
        isOpen={dialog.isOpen}
        onClose={closeDialog}
        title={dialog.title}
        message={dialog.message}
        type={dialog.type}
      />

      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto">
        {/* Cabeçalho */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-text-primary">Pagamento</h2>
          <p className="text-3xl font-bold text-primary mt-2">
            {amount.toLocaleString('pt-MZ')} MZN
          </p>
        </div>

        {/* Step 1: Escolher Método */}
        {step === 'method' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-text-primary mb-4">Escolha o método de pagamento:</h3>
            
            {/* M-Pesa */}
            <button
              onClick={() => handleMethodSelect('mpesa')}
              className="w-full p-4 border-2 border-border-light rounded-lg hover:border-primary hover:bg-accent transition-all flex items-center gap-4"
            >
              <img 
                src={mpesaLogo} 
                alt="M-Pesa" 
                className="w-12 h-12 object-contain"
              />
              <div className="text-left flex-1">
                <p className="font-semibold">M-Pesa</p>
                <p className="text-sm text-neutral-gray">Pagamento via M-Pesa</p>
              </div>
              <Smartphone className="text-primary" />
            </button>

            {/* Visa (Em breve) */}
            <button
              onClick={() => handleMethodSelect('visa')}
              className="w-full p-4 border-2 border-border-light rounded-lg hover:border-primary hover:bg-accent transition-all flex items-center gap-4 opacity-60"
            >
              <img 
                src={visaLogo} 
                alt="Visa" 
                className="w-12 h-12 object-contain"
              />
              <div className="text-left flex-1">
                <p className="font-semibold">Visa / Mastercard</p>
                <p className="text-sm text-neutral-gray">Em breve</p>
              </div>
            </button>

            {/* PayPal (Em breve) */}
            <button
              onClick={() => handleMethodSelect('paypal')}
              className="w-full p-4 border-2 border-border-light rounded-lg hover:border-primary hover:bg-accent transition-all flex items-center gap-4 opacity-60"
            >
              <img 
                src={paypalLogo} 
                alt="PayPal" 
                className="w-12 h-12 object-contain"
              />
              <div className="text-left flex-1">
                <p className="font-semibold">PayPal</p>
                <p className="text-sm text-neutral-gray">Em breve</p>
              </div>
            </button>

            {onCancel && (
              <button
                onClick={onCancel}
                className="w-full mt-4 px-4 py-2 border-2 border-border-light rounded-lg hover:bg-accent transition-all"
              >
                Cancelar
              </button>
            )}
          </div>
        )}

        {/* Step 2: Formulário M-Pesa */}
        {step === 'mpesa' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={mpesaLogo} 
                alt="M-Pesa" 
                className="w-10 h-10 object-contain"
              />
              <h3 className="font-semibold text-text-primary">Pagamento M-Pesa</h3>
            </div>

            {/* Carteira */}
            <div>
              <label className="block mb-2 text-sm font-medium">Carteira M-Pesa</label>
              {wallets.length > 0 ? (
                <select
                  value={selectedWallet}
                  onChange={(e) => setSelectedWallet(e.target.value)}
                  className="input-field"
                >
                  {wallets.map(wallet => (
                    <option key={wallet.id} value={wallet.id}>
                      {wallet.name} - {wallet.number}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-3 bg-warning-light border border-warning rounded-lg">
                  <p className="text-sm text-warning">
                    ⚠️ Nenhuma carteira M-Pesa configurada. Entre em contacto com o administrador.
                  </p>
                </div>
              )}
            </div>

            {/* Número de Telefone */}
            <div>
              <label className="block mb-2 text-sm font-medium">Número M-Pesa</label>
              <input
                type="tel"
                value={msisdn}
                onChange={(e) => setMsisdn(e.target.value)}
                placeholder="258XXXXXXXXX"
                maxLength={12}
                className="input-field font-mono"
              />
              <p className="text-xs text-neutral-gray mt-1">
                Formato: 258 + 9 dígitos (ex: 258840000000)
              </p>
            </div>

            {/* Botões */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep('method')}
                className="flex-1 px-4 py-2 border-2 border-border-light rounded-lg hover:bg-accent transition-all"
              >
                Voltar
              </button>
              <button
                onClick={handleMpesaPayment}
                disabled={isLoading}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                {isLoading ? 'Processando...' : 'Pagar'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Processando */}
        {step === 'processing' && (
          <div className="text-center py-8">
            <Loader className="w-16 h-16 text-primary mx-auto animate-spin mb-4" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              Processando Pagamento
            </h3>
            <p className="text-neutral-gray">
              Aguarde enquanto processamos seu pagamento M-Pesa...
            </p>
          </div>
        )}

        {/* Step 4: Sucesso */}
        {step === 'success' && (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              Pagamento Iniciado!
            </h3>
            <p className="text-neutral-gray mb-4">
              Verifique seu telefone para confirmar o pagamento M-Pesa.
            </p>
            <div className="bg-accent p-4 rounded-lg mb-4">
              <p className="text-sm text-neutral-gray">ID da Transação:</p>
              <p className="font-mono text-sm font-semibold">{transactionId}</p>
            </div>
            <button
              onClick={onCancel || (() => setStep('method'))}
              className="btn-primary w-full"
            >
              Concluir
            </button>
          </div>
        )}

        {/* Step 5: Erro */}
        {step === 'error' && (
          <div className="text-center py-8">
            <XCircle className="w-16 h-16 text-danger mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              Erro no Pagamento
            </h3>
            <p className="text-neutral-gray mb-4">{errorMessage}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setStep('method')}
                className="flex-1 px-4 py-2 border-2 border-border-light rounded-lg hover:bg-accent transition-all"
              >
                Voltar
              </button>
              <button
                onClick={() => setStep('mpesa')}
                className="flex-1 btn-primary"
              >
                Tentar Novamente
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
