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

export default router;
