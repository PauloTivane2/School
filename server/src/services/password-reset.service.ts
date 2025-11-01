import { pool } from '../config/database';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

interface PasswordResetToken {
  id_token: number;
  id_funcionario: number;
  token: string;
  expires_at: Date;
  used: boolean;
}

/**
 * Service para gerenciar recuperação de senha
 */
export class PasswordResetService {
  /**
   * Gerar token de recuperação de senha
   * @param email Email do funcionário
   * @returns Token gerado e informações do funcionário
   */
  async requestPasswordReset(email: string): Promise<{ token: string; nome: string; email: string } | null> {
    const client = await pool.connect();
    
    try {
      // Buscar funcionário por email
      const userResult = await client.query(
        'SELECT id_funcionarios, nome_funcionario, email FROM funcionarios WHERE email = $1 AND estado = $2',
        [email, 'ativo']
      );

      if (userResult.rows.length === 0) {
        console.log('⚠️ Email não encontrado:', email);
        // Por segurança, não revelar se o email existe ou não
        return null;
      }

      const user = userResult.rows[0];

      // Gerar token único e seguro
      const token = crypto.randomBytes(32).toString('hex');
      
      // Token expira em 1 hora
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);

      // Invalidar tokens anteriores não usados
      await client.query(
        'UPDATE password_reset_tokens SET used = TRUE WHERE id_funcionario = $1 AND used = FALSE',
        [user.id_funcionarios]
      );

      // Criar novo token
      await client.query(
        'INSERT INTO password_reset_tokens (id_funcionario, token, expires_at) VALUES ($1, $2, $3)',
        [user.id_funcionarios, token, expiresAt]
      );

      console.log('✅ Token de recuperação gerado para:', email);

      return {
        token,
        nome: user.nome_funcionario,
        email: user.email
      };
    } catch (error) {
      console.error('❌ Erro ao solicitar recuperação de senha:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Validar token de recuperação
   * @param token Token a ser validado
   * @returns Informações do token se válido
   */
  async validateToken(token: string): Promise<{ valid: boolean; id_funcionario?: number; email?: string }> {
    try {
      const result = await pool.query(
        `SELECT prt.*, f.email, f.nome_funcionario 
         FROM password_reset_tokens prt
         JOIN funcionarios f ON f.id_funcionarios = prt.id_funcionario
         WHERE prt.token = $1 AND prt.used = FALSE AND prt.expires_at > NOW()`,
        [token]
      );

      if (result.rows.length === 0) {
        console.log('⚠️ Token inválido ou expirado');
        return { valid: false };
      }

      const tokenData = result.rows[0];

      return {
        valid: true,
        id_funcionario: tokenData.id_funcionario,
        email: tokenData.email
      };
    } catch (error) {
      console.error('❌ Erro ao validar token:', error);
      return { valid: false };
    }
  }

  /**
   * Resetar senha usando token
   * @param token Token de recuperação
   * @param newPassword Nova senha
   * @returns Sucesso ou falha
   */
  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Validar token
      const tokenResult = await client.query(
        `SELECT prt.*, f.email 
         FROM password_reset_tokens prt
         JOIN funcionarios f ON f.id_funcionarios = prt.id_funcionario
         WHERE prt.token = $1 AND prt.used = FALSE AND prt.expires_at > NOW()`,
        [token]
      );

      if (tokenResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return { success: false, message: 'Token inválido ou expirado' };
      }

      const tokenData = tokenResult.rows[0];

      // Validar senha
      if (!newPassword || newPassword.length < 6) {
        await client.query('ROLLBACK');
        return { success: false, message: 'A senha deve ter no mínimo 6 caracteres' };
      }

      // Hash da nova senha
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Atualizar senha do funcionário
      await client.query(
        'UPDATE funcionarios SET senha_hash = $1 WHERE id_funcionarios = $2',
        [hashedPassword, tokenData.id_funcionario]
      );

      // Marcar token como usado
      await client.query(
        'UPDATE password_reset_tokens SET used = TRUE, used_at = NOW() WHERE token = $1',
        [token]
      );

      await client.query('COMMIT');

      console.log('✅ Senha resetada com sucesso para:', tokenData.email);

      return { success: true, message: 'Senha alterada com sucesso' };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Erro ao resetar senha:', error);
      return { success: false, message: 'Erro ao resetar senha' };
    } finally {
      client.release();
    }
  }

  /**
   * Limpar tokens expirados (executar periodicamente)
   */
  async cleanExpiredTokens(): Promise<number> {
    try {
      const result = await pool.query(
        'DELETE FROM password_reset_tokens WHERE expires_at < NOW() OR (used = TRUE AND used_at < NOW() - INTERVAL \'7 days\')'
      );

      console.log(`🧹 ${result.rowCount} tokens expirados removidos`);
      return result.rowCount || 0;
    } catch (error) {
      console.error('❌ Erro ao limpar tokens expirados:', error);
      return 0;
    }
  }
}
