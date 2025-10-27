import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

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
}
