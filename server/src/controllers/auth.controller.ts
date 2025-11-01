import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { PasswordResetService } from '../services/password-reset.service';

const authService = new AuthService();
const passwordResetService = new PasswordResetService();

export class AuthController {
  /**
   * POST /api/auth/login
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Email e senha são obrigatórios',
            code: 'MISSING_CREDENTIALS',
          },
        });
        return;
      }

      const result = await authService.login({ email, password });

      if (!result.success) {
        res.status(401).json({
          success: false,
          error: {
            message: result.message,
            code: 'INVALID_CREDENTIALS',
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          token: result.token,
          user: result.user,
        },
      });
    } catch (error: any) {
      console.error('Erro no controller de login:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Erro interno do servidor',
          code: 'INTERNAL_SERVER_ERROR',
        },
      });
    }
  }

  /**
   * POST /api/auth/logout
   */
  async logout(req: Request, res: Response): Promise<void> {
    // Em JWT stateless, o logout é feito no frontend removendo o token
    res.status(200).json({
      success: true,
      message: 'Logout realizado com sucesso',
    });
  }

  /**
   * GET /api/auth/me
   */
  async me(req: Request, res: Response): Promise<void> {
    try {
      // O middleware de autenticação já anexou o usuário na request
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: {
            message: 'Não autorizado',
            code: 'UNAUTHORIZED',
          },
        });
        return;
      }

      // Buscar dados atualizados do usuário
      const { pool } = await import('../config/database');
      const result = await pool.query(
        'SELECT id_funcionarios, nome_funcionario, email, funcao FROM funcionarios WHERE id_funcionarios = $1',
        [userId]
      );

      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          error: {
            message: 'Usuário não encontrado',
            code: 'USER_NOT_FOUND',
          },
        });
        return;
      }

      const user = result.rows[0];

      res.status(200).json({
        success: true,
        data: {
          id: user.id_funcionarios,
          nome: user.nome_funcionario,
          email: user.email,
          funcao: user.funcao,
        },
      });
    } catch (error: any) {
      console.error('Erro ao buscar dados do usuário:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Erro interno do servidor',
          code: 'INTERNAL_SERVER_ERROR',
        },
      });
    }
  }

  /**
   * POST /api/auth/forgot-password
   * Solicita recuperação de senha
   */
  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Email é obrigatório',
            code: 'MISSING_EMAIL',
          },
        });
        return;
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Email inválido',
            code: 'INVALID_EMAIL',
          },
        });
        return;
      }

      const result = await passwordResetService.requestPasswordReset(email);

      // Por segurança, sempre retornar sucesso mesmo se email não existir
      res.status(200).json({
        success: true,
        message: 'Se o email existir, você receberá instruções para recuperar sua senha',
        data: result ? {
          token: result.token, // Em produção, enviar por email
          expiresIn: '1 hora'
        } : null
      });
    } catch (error: any) {
      console.error('Erro ao solicitar recuperação de senha:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Erro ao processar solicitação',
          code: 'INTERNAL_SERVER_ERROR',
        },
      });
    }
  }

  /**
   * POST /api/auth/validate-reset-token
   * Valida token de recuperação
   */
  async validateResetToken(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.body;

      if (!token) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Token é obrigatório',
            code: 'MISSING_TOKEN',
          },
        });
        return;
      }

      const validation = await passwordResetService.validateToken(token);

      if (!validation.valid) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Token inválido ou expirado',
            code: 'INVALID_TOKEN',
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Token válido',
        data: {
          email: validation.email
        }
      });
    } catch (error: any) {
      console.error('Erro ao validar token:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Erro ao validar token',
          code: 'INTERNAL_SERVER_ERROR',
        },
      });
    }
  }

  /**
   * POST /api/auth/reset-password
   * Reseta senha com token
   */
  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Token e nova senha são obrigatórios',
            code: 'MISSING_FIELDS',
          },
        });
        return;
      }

      if (newPassword.length < 6) {
        res.status(400).json({
          success: false,
          error: {
            message: 'A senha deve ter no mínimo 6 caracteres',
            code: 'WEAK_PASSWORD',
          },
        });
        return;
      }

      const result = await passwordResetService.resetPassword(token, newPassword);

      if (!result.success) {
        res.status(400).json({
          success: false,
          error: {
            message: result.message,
            code: 'RESET_FAILED',
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      console.error('Erro ao resetar senha:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Erro ao resetar senha',
          code: 'INTERNAL_SERVER_ERROR',
        },
      });
    }
  }
}
