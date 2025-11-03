import { Request, Response } from 'express';
import { MpesaPaymentService } from '../services/mpesa-payment.service';
import { pool } from '../config/database';

/**
 * Controller para pagamentos M-Pesa
 */
export class MpesaController {
  private mpesaService: MpesaPaymentService;

  constructor() {
    this.mpesaService = new MpesaPaymentService();
  }

  /**
   * POST /api/mpesa/payment
   * Processar pagamento M-Pesa
   */
  async processPayment(req: Request, res: Response): Promise<void> {
    try {
      const { 
        aluno_id, 
        pagamento_id,
        amount, 
        msisdn, 
        walletId,
        reference 
      } = req.body;

      // Validações
      if (!amount || !msisdn || !walletId) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Campos obrigatórios: amount, msisdn, walletId',
            code: 'MISSING_FIELDS'
          }
        });
        return;
      }

      // Validar número de telefone (formato: 258XXXXXXXXX)
      const phoneRegex = /^258\d{9}$/;
      if (!phoneRegex.test(msisdn)) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Número de telefone inválido. Use formato: 258XXXXXXXXX',
            code: 'INVALID_PHONE'
          }
        });
        return;
      }

      // Processar pagamento via M-Pesa
      const result = await this.mpesaService.handleC2BPayment({
        walletId,
        amount: parseFloat(amount),
        msisdn,
        reference: reference || `PAY-${aluno_id || Date.now()}`,
        third_party_reference: pagamento_id ? `PGTO-${pagamento_id}` : undefined
      });

      if (!result.success) {
        res.status(400).json({
          success: false,
          error: {
            message: result.error || 'Erro ao processar pagamento',
            code: 'PAYMENT_FAILED',
            details: result.details
          }
        });
        return;
      }

      // Se temos pagamento_id, atualizar no banco
      if (pagamento_id) {
        await pool.query(
          `UPDATE pagamentos 
           SET estado = $1, 
               forma_pagamento = $2, 
               data_pagamento = CURRENT_TIMESTAMP,
               mpesa_transaction_id = $3
           WHERE id_pagamento = $4`,
          ['processando', 'M-Pesa', result.transaction_id, pagamento_id]
        );
      }

      res.status(200).json({
        success: true,
        message: 'Pagamento M-Pesa iniciado com sucesso',
        data: {
          transaction_id: result.transaction_id,
          status: result.status,
          reference: reference,
          amount: amount,
          msisdn: msisdn
        }
      });
    } catch (error: any) {
      console.error('Erro ao processar pagamento M-Pesa:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Erro interno ao processar pagamento',
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  }

  /**
   * GET /api/mpesa/wallets
   * Obter carteiras M-Pesa disponíveis
   */
  async getWallets(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.mpesaService.getMyWallets();

      if (!result.success) {
        res.status(400).json({
          success: false,
          error: {
            message: result.error || 'Erro ao obter carteiras',
            code: 'WALLETS_FETCH_FAILED'
          }
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: result.wallets
      });
    } catch (error: any) {
      console.error('Erro ao obter carteiras:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Erro interno ao obter carteiras',
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  }

  /**
   * GET /api/mpesa/wallet/:walletId
   * Obter detalhes de uma carteira
   */
  async getWalletDetails(req: Request, res: Response): Promise<void> {
    try {
      const { walletId } = req.params;

      const result = await this.mpesaService.getWalletDetails(walletId);

      if (!result.success) {
        res.status(400).json({
          success: false,
          error: {
            message: result.error || 'Erro ao obter detalhes da carteira',
            code: 'WALLET_FETCH_FAILED'
          }
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: result.wallet
      });
    } catch (error: any) {
      console.error('Erro ao obter detalhes da carteira:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Erro interno ao obter detalhes',
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  }

  /**
   * GET /api/mpesa/history
   * Obter histórico de pagamentos M-Pesa
   */
  async getPaymentHistory(req: Request, res: Response): Promise<void> {
    try {
      const { paginated, perPage } = req.query;

      const result = paginated === 'true'
        ? await this.mpesaService.getPaymentHistoryPaginated(parseInt(perPage as string) || 10)
        : await this.mpesaService.getPaymentHistory();

      if (!result.success) {
        res.status(400).json({
          success: false,
          error: {
            message: result.error || 'Erro ao obter histórico',
            code: 'HISTORY_FETCH_FAILED'
          }
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: result.payments
      });
    } catch (error: any) {
      console.error('Erro ao obter histórico:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Erro interno ao obter histórico',
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  }

  /**
   * GET /api/mpesa/status/:transactionId
   * Verificar status de um pagamento
   */
  async checkPaymentStatus(req: Request, res: Response): Promise<void> {
    try {
      const { transactionId } = req.params;

      const result = await this.mpesaService.checkPaymentStatus(transactionId);

      if (!result.success) {
        res.status(404).json({
          success: false,
          error: {
            message: result.error || 'Pagamento não encontrado',
            code: 'PAYMENT_NOT_FOUND'
          }
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          status: result.status,
          payment: result.payment
        }
      });
    } catch (error: any) {
      console.error('Erro ao verificar status:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Erro interno ao verificar status',
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  }

  /**
   * POST /api/mpesa/webhook
   * Webhook para receber notificações do M-Pesa
   */
  async handleWebhook(req: Request, res: Response): Promise<void> {
    try {
      const webhookData = req.body;

      console.log('📩 M-Pesa Webhook recebido:', JSON.stringify(webhookData, null, 2));

      // Processar webhook (atualizar status do pagamento no banco)
      if (webhookData.transaction_id && webhookData.status) {
        await pool.query(
          `UPDATE pagamentos 
           SET estado = $1
           WHERE mpesa_transaction_id = $2`,
          [webhookData.status === 'completed' ? 'pago' : 'falhou', webhookData.transaction_id]
        );

        console.log('✅ Pagamento atualizado via webhook');
      }

      res.status(200).json({
        success: true,
        message: 'Webhook processado'
      });
    } catch (error: any) {
      console.error('Erro ao processar webhook:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao processar webhook'
      });
    }
  }
}
