import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

const TOKEN_NAME = '_____________e2p_';
const DEFAULT_SERVER_URL = 'https://e2payments.explicador.co.mz';

interface MpesaConfig {
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  SERVER_URL?: string;
}

interface PaymentParams extends MpesaConfig {
  walletId: string;
  amount: number;
  msisdn: string;
  reference?: string;
  third_party_reference?: string;
}

interface WalletParams extends MpesaConfig {
  walletId?: string;
}

interface PaymentHistoryParams extends MpesaConfig {
  perPageQtd?: number;
}

/**
 * Service para integração com M-Pesa via e2payments
 */
export class MpesaPaymentService {
  private config: MpesaConfig;
  private tokenCache: { token: string; expiresAt: Date } | null = null;

  constructor() {
    this.config = {
      CLIENT_ID: process.env.MPESA_CLIENT_ID || '9d771155-d4df-4fa9-af44-f1a4b4cc7a87',
      CLIENT_SECRET: process.env.MPESA_CLIENT_SECRET || '8UOm5XcTXNCTBsrBvCRTUbWyERwTh74EWa5SMrDt',
      SERVER_URL: process.env.MPESA_SERVER_URL || DEFAULT_SERVER_URL
    };
  }

  /**
   * Autenticar e obter Bearer Token
   */
  async authenticate(): Promise<string | null> {
    try {
      // Verificar se já temos token válido em cache
      if (this.tokenCache && this.tokenCache.expiresAt > new Date()) {
        return this.tokenCache.token;
      }

      const response = await axios.post(`${this.config.SERVER_URL}/oauth/token`, {
        grant_type: 'client_credentials',
        client_id: this.config.CLIENT_ID,
        client_secret: this.config.CLIENT_SECRET
      });

      if (response.data && response.data.access_token) {
        const token = `${response.data.token_type} ${response.data.access_token}`;
        
        // Cache token por 90 dias
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 90);
        
        this.tokenCache = { token, expiresAt };
        
        console.log('✅ M-Pesa: Token obtido com sucesso');
        return token;
      }

      return null;
    } catch (error: any) {
      console.error('❌ M-Pesa: Erro ao autenticar:', error.message);
      return null;
    }
  }

  /**
   * Compor header com autenticação
   */
  private async getAuthHeader() {
    const token = await this.authenticate();
    
    if (!token) {
      throw new Error('Falha ao obter token de autenticação M-Pesa');
    }

    return {
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };
  }

  /**
   * Processar pagamento M-Pesa C2B (Customer to Business)
   */
  async handleC2BPayment(params: {
    walletId: string;
    amount: number;
    msisdn: string;
    reference?: string;
    third_party_reference?: string;
  }) {
    try {
      const API_ENDPOINT = `${this.config.SERVER_URL}/v1/c2b/mpesa-payment/${params.walletId}`;
      
      const payload = {
        client_id: this.config.CLIENT_ID,
        amount: params.amount,
        msisdn: params.msisdn,
        reference: params.reference || `PAY-${Date.now()}`,
        third_party_reference: params.third_party_reference || `REF-${Date.now()}`
      };

      const header = await this.getAuthHeader();
      
      console.log('📱 M-Pesa: Iniciando pagamento C2B...');
      console.log('   Valor:', params.amount, 'MZN');
      console.log('   Número:', params.msisdn);

      const response = await axios.post(API_ENDPOINT, payload, header);

      console.log('✅ M-Pesa: Pagamento processado com sucesso');
      
      return {
        success: true,
        data: response.data,
        transaction_id: response.data?.transaction_id,
        status: response.data?.status
      };
    } catch (error: any) {
      console.error('❌ M-Pesa: Erro ao processar pagamento:', error.response?.data || error.message);
      
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        details: error.response?.data
      };
    }
  }

  /**
   * Obter todas as carteiras M-Pesa
   */
  async getMyWallets() {
    try {
      const API_ENDPOINT = `${this.config.SERVER_URL}/v1/wallets/mpesa/get/all`;
      
      const payload = {
        client_id: this.config.CLIENT_ID
      };

      const header = await this.getAuthHeader();
      const response = await axios.post(API_ENDPOINT, payload, header);

      console.log('✅ M-Pesa: Carteiras obtidas com sucesso');
      
      return {
        success: true,
        wallets: response.data
      };
    } catch (error: any) {
      console.error('❌ M-Pesa: Erro ao obter carteiras:', error.message);
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obter detalhes de uma carteira específica
   */
  async getWalletDetails(walletId: string) {
    try {
      const API_ENDPOINT = `${this.config.SERVER_URL}/v1/wallets/mpesa/get/${walletId}`;
      
      const payload = {
        client_id: this.config.CLIENT_ID
      };

      const header = await this.getAuthHeader();
      const response = await axios.post(API_ENDPOINT, payload, header);

      console.log('✅ M-Pesa: Detalhes da carteira obtidos');
      
      return {
        success: true,
        wallet: response.data
      };
    } catch (error: any) {
      console.error('❌ M-Pesa: Erro ao obter detalhes da carteira:', error.message);
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obter histórico de pagamentos
   */
  async getPaymentHistory() {
    try {
      const API_ENDPOINT = `${this.config.SERVER_URL}/v1/payments/mpesa/get/all`;
      
      const payload = {
        client_id: this.config.CLIENT_ID
      };

      const header = await this.getAuthHeader();
      const response = await axios.post(API_ENDPOINT, payload, header);

      console.log('✅ M-Pesa: Histórico de pagamentos obtido');
      
      return {
        success: true,
        payments: response.data
      };
    } catch (error: any) {
      console.error('❌ M-Pesa: Erro ao obter histórico:', error.message);
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obter histórico de pagamentos paginado
   */
  async getPaymentHistoryPaginated(perPage: number = 10) {
    try {
      const API_ENDPOINT = `${this.config.SERVER_URL}/v1/payments/mpesa/get/all/paginate/${perPage}`;
      
      const payload = {
        client_id: this.config.CLIENT_ID
      };

      const header = await this.getAuthHeader();
      const response = await axios.post(API_ENDPOINT, payload, header);

      console.log('✅ M-Pesa: Histórico paginado obtido');
      
      return {
        success: true,
        payments: response.data
      };
    } catch (error: any) {
      console.error('❌ M-Pesa: Erro ao obter histórico paginado:', error.message);
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Verificar status de um pagamento
   */
  async checkPaymentStatus(transactionId: string) {
    try {
      // Buscar no histórico
      const history = await this.getPaymentHistory();
      
      if (history.success && history.payments) {
        const payment = history.payments.find((p: any) => 
          p.transaction_id === transactionId || 
          p.reference === transactionId
        );
        
        if (payment) {
          return {
            success: true,
            status: payment.status,
            payment: payment
          };
        }
      }

      return {
        success: false,
        error: 'Pagamento não encontrado'
      };
    } catch (error: any) {
      console.error('❌ M-Pesa: Erro ao verificar status:', error.message);
      
      return {
        success: false,
        error: error.message
      };
    }
  }
}
