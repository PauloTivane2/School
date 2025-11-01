import { pool } from '../config/database';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import config from '../config';

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: number;
    nome: string;
    email: string;
    funcao: string;
  };
  message?: string;
}

export class AuthService {
  /**
   * Realiza login de funcionário
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { email, password } = credentials;

    try {
      console.log('🔐 Tentativa de login:', { email });
      
      // Buscar funcionário por email
      const result = await pool.query(
        'SELECT id_funcionarios, nome_funcionario, email, funcao, senha_hash FROM funcionarios WHERE email = $1 AND estado = $2',
        [email, 'ativo']
      );

      console.log('📊 Usuários encontrados:', result.rows.length);

      if (result.rows.length === 0) {
        console.log('❌ Nenhum usuário encontrado com este email');
        return {
          success: false,
          message: 'Credenciais inválidas ou usuário inativo',
        };
      }

      const user = result.rows[0];
      console.log('👤 Usuário encontrado:', { 
        id: user.id_funcionarios, 
        nome: user.nome_funcionario,
        hash_length: user.senha_hash?.length,
        hash_start: user.senha_hash?.substring(0, 10)
      });

      // Verificar senha
      console.log('🔑 Verificando senha...');
      const isPasswordValid = await bcrypt.compare(password, user.senha_hash);
      console.log('✅ Senha válida:', isPasswordValid);

      if (!isPasswordValid) {
        console.log('❌ Senha incorreta');
        return {
          success: false,
          message: 'Credenciais inválidas',
        };
      }

      console.log('✅ Login bem-sucedido!');

      // Gerar token JWT
      const token = jwt.sign(
        {
          userId: user.id_funcionarios,
          email: user.email,
          funcao: user.funcao,
        },
        config.jwt.secret as string,
        { expiresIn: config.jwt.expiresIn } as SignOptions
      );

      return {
        success: true,
        token,
        user: {
          id: user.id_funcionarios,
          nome: user.nome_funcionario,
          email: user.email,
          funcao: user.funcao,
        },
      };
    } catch (error: any) {
      console.error('Erro no login:', error);
      throw new Error('Erro ao processar login');
    }
  }

  /**
   * Valida token JWT
   */
  verifyToken(token: string): any {
    try {
      return jwt.verify(token, config.jwt.secret);
    } catch (error) {
      throw new Error('Token inválido');
    }
  }
}
