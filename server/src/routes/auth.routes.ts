import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const authController = new AuthController();

/**
 * POST /api/auth/login
 * Realiza login de funcionário
 */
router.post('/login', (req, res) => authController.login(req, res));

/**
 * POST /api/auth/logout
 * Realiza logout (remove token no frontend)
 */
router.post('/logout', (req, res) => authController.logout(req, res));

/**
 * GET /api/auth/me
 * Retorna dados do usuário autenticado
 */
router.get('/me', authMiddleware, (req, res) => authController.me(req, res));

/**
 * POST /api/auth/forgot-password
 * Solicita recuperação de senha
 */
router.post('/forgot-password', (req, res) => authController.forgotPassword(req, res));

/**
 * POST /api/auth/validate-reset-token
 * Valida token de recuperação
 */
router.post('/validate-reset-token', (req, res) => authController.validateResetToken(req, res));

/**
 * POST /api/auth/reset-password
 * Reseta senha com token
 */
router.post('/reset-password', (req, res) => authController.resetPassword(req, res));

export default router;
