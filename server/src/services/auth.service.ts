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
    role?: string;
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
        // RN05: log de autenticação (falha)
        try { await pool.query('INSERT INTO auth_logs (email, status, motivo) VALUES ($1, $2, $3)', [email, 'falha', 'email_nao_encontrado']); } catch {}
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
        // RN05: log de autenticação (falha)
        try { await pool.query('INSERT INTO auth_logs (email, status, motivo, user_id) VALUES ($1, $2, $3, $4)', [email, 'falha', 'senha_incorreta', user.id_funcionarios]); } catch {}
        return {
          success: false,
          message: 'Credenciais inválidas',
        };
      }

      // Mapear função para role padronizado
      const mapRole = (funcao: string): string => {
        const v = (funcao || '').toLowerCase();
        if (['admin', 'diretor', 'director'].includes(v)) return 'Admin';
        if (['tesouraria', 'tesoureiro', 'financeiro'].includes(v)) return 'Tesouraria';
        if (['professor', 'docente'].includes(v)) return 'Professor';
        if (['encarregado', 'guardiao', 'guardian'].includes(v)) return 'Encarregado';
        if (['aluno', 'estudante', 'student'].includes(v)) return 'Aluno';
        return funcao;
      };

      const role = mapRole(user.funcao);

      // RN02: Bloquear acesso a alunos (menores não têm acesso)
      if (role === 'Aluno') {
        // Verificar se é um aluno no banco de dados
        const studentCheck = await pool.query(
          'SELECT id_alunos, data_nascimento FROM alunos WHERE email = $1',
          [email]
        );

        if (studentCheck.rows.length > 0) {
          const student = studentCheck.rows[0];
          const birthDate = new Date(student.data_nascimento);
          const today = new Date();
          const age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          
          // Calculate exact age
          const exactAge = (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) 
            ? age - 1 
            : age;

          // RN05: log de autenticação (bloqueado)
          try { 
            await pool.query(
              'INSERT INTO auth_logs (email, status, motivo, user_id, details) VALUES ($1, $2, $3, $4, $5)', 
              [
                email, 
                'bloqueado', 
                exactAge < 18 ? 'estudante_menor_idade' : 'aluno_sem_acesso', 
                user.id_funcionarios,
                JSON.stringify({ idade: exactAge, data_nascimento: birthDate })
              ]
            ); 
          } catch {}
          
          return {
            success: false,
            message: exactAge < 18 
              ? `Acesso bloqueado para estudantes menores de idade (${exactAge} anos)` 
              : 'Acesso bloqueado para alunos',
          };
        }

        // If not found as student, still block
        try { await pool.query('INSERT INTO auth_logs (email, status, motivo, user_id) VALUES ($1, $2, $3, $4)', [email, 'bloqueado', 'aluno_sem_acesso', user.id_funcionarios]); } catch {}
        return {
          success: false,
          message: 'Acesso bloqueado para alunos',
        };
      }

      console.log('✅ Login bem-sucedido!');

      // Gerar token JWT
      const token = jwt.sign(
        {
          userId: user.id_funcionarios,
          email: user.email,
          funcao: user.funcao,
          role,
        },
        config.jwt.secret as string,
        { expiresIn: config.jwt.expiresIn } as SignOptions
      );

      // RN05: log de autenticação (sucesso)
      try { await pool.query('INSERT INTO auth_logs (email, status, user_id) VALUES ($1, $2, $3)', [email, 'sucesso', user.id_funcionarios]); } catch {}

      return {
        success: true,
        token,
        user: {
          id: user.id_funcionarios,
          nome: user.nome_funcionario,
          email: user.email,
          funcao: user.funcao,
          role, // Incluir role padronizado para uso no frontend
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

