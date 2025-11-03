import { Router } from 'express';
import { MpesaController } from '../controllers/mpesa.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const controller = new MpesaController();

/**
 * Rotas de pagamento M-Pesa
 */

// Processar pagamento
router.post('/payment', authMiddleware, (req, res) => controller.processPayment(req, res));

// Obter carteiras
router.get('/wallets', authMiddleware, (req, res) => controller.getWallets(req, res));

// Obter detalhes de carteira
router.get('/wallet/:walletId', authMiddleware, (req, res) => controller.getWalletDetails(req, res));

// Histórico de pagamentos
router.get('/history', authMiddleware, (req, res) => controller.getPaymentHistory(req, res));

// Verificar status de pagamento
router.get('/status/:transactionId', authMiddleware, (req, res) => controller.checkPaymentStatus(req, res));

// Webhook (sem autenticação - chamado pelo M-Pesa)
router.post('/webhook', (req, res) => controller.handleWebhook(req, res));

export default router;
