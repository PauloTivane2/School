# 🔐 Sistema de Recuperação de Senha

## Visão Geral

Sistema profissional de recuperação de senha implementado com segurança e boas práticas.

## Funcionalidades

### 1. **Solicitar Recuperação**
- Usuário insere email
- Sistema gera token único e seguro (32 bytes)
- Token expira em 1 hora
- Tokens anteriores são invalidados automaticamente

### 2. **Validar Token**
- Verifica se token existe e não expirou
- Verifica se token não foi usado
- Retorna informações do usuário

### 3. **Resetar Senha**
- Valida token novamente
- Valida nova senha (mínimo 6 caracteres)
- Hash bcrypt da nova senha
- Marca token como usado
- Atualiza senha no banco

## Endpoints Backend

### POST `/api/auth/forgot-password`
Solicita recuperação de senha.

**Request:**
```json
{
  "email": "usuario@escola.com"
}
```

**Response (Desenvolvimento):**
```json
{
  "success": true,
  "message": "Se o email existir, você receberá instruções...",
  "data": {
    "token": "abc123...",
    "expiresIn": "1 hora"
  }
}
```

### POST `/api/auth/validate-reset-token`
Valida token de recuperação.

**Request:**
```json
{
  "token": "abc123..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Token válido",
  "data": {
    "email": "usuario@escola.com"
  }
}
```

### POST `/api/auth/reset-password`
Reseta senha com token.

**Request:**
```json
{
  "token": "abc123...",
  "newPassword": "novaSenha123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Senha alterada com sucesso"
}
```

## Fluxo Frontend

### 1. Tela de Login
- Botão "Esqueceu a senha?"
- Redireciona para tela de recuperação

### 2. Tela de Recuperação - Step 1
- Input de email
- Validação de formato
- Botão "Enviar Instruções"

### 3. Tela de Recuperação - Step 2
- Input de token (em desenvolvimento)
- Input de nova senha
- Input de confirmação de senha
- Validações:
  - Token obrigatório
  - Senha mínimo 6 caracteres
  - Senhas devem coincidir

### 4. Tela de Sucesso
- Mensagem de confirmação
- Botão para voltar ao login

## Segurança

### ✅ Implementado

1. **Token Seguro**
   - Gerado com `crypto.randomBytes(32)`
   - 64 caracteres hexadecimais
   - Único e imprevisível

2. **Expiração**
   - Token expira em 1 hora
   - Verificação no banco de dados

3. **Uso Único**
   - Token marcado como usado após reset
   - Não pode ser reutilizado

4. **Invalidação Automática**
   - Tokens anteriores invalidados ao solicitar novo
   - Limpeza de tokens expirados

5. **Hash Bcrypt**
   - Nova senha com hash bcrypt (10 rounds)
   - Nunca armazenada em texto plano

6. **Validações**
   - Email válido
   - Senha mínima 6 caracteres
   - Token válido e não expirado

7. **Privacidade**
   - Não revela se email existe
   - Mensagem genérica de sucesso

### 🔒 Banco de Dados

**Tabela: `password_reset_tokens`**

```sql
CREATE TABLE password_reset_tokens (
  id_token SERIAL PRIMARY KEY,
  id_funcionario INTEGER NOT NULL REFERENCES funcionarios(id_funcionarios),
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  used_at TIMESTAMP
);
```

**Índices para Performance:**
- `idx_password_reset_tokens_token` - Busca por token
- `idx_password_reset_tokens_funcionario` - Busca por funcionário
- `idx_password_reset_tokens_expires` - Limpeza de expirados

## Uso

### Desenvolvimento

1. **Solicitar Recuperação:**
   - Acesse a tela de login
   - Clique em "Esqueceu a senha?"
   - Insira o email
   - Token será exibido no diálogo (em dev)

2. **Resetar Senha:**
   - Cole o token no campo
   - Digite nova senha (mín. 6 caracteres)
   - Confirme a senha
   - Clique em "Alterar Senha"

### Produção

Em produção, o token deve ser enviado por **email** ao invés de exibido na tela.

**Recomendações:**
- Integrar com serviço de email (SendGrid, AWS SES, etc.)
- Template de email profissional
- Link direto para reset (ex: `/reset-password?token=abc123`)
- Instruções claras no email

## Manutenção

### Limpeza de Tokens Expirados

Execute periodicamente (cron job):

```typescript
import { PasswordResetService } from './services/password-reset.service';

const service = new PasswordResetService();
await service.cleanExpiredTokens();
```

Remove:
- Tokens expirados
- Tokens usados há mais de 7 dias

## Testes

### Cenários de Teste

1. ✅ Solicitar recuperação com email válido
2. ✅ Solicitar recuperação com email inválido
3. ✅ Resetar senha com token válido
4. ✅ Resetar senha com token expirado
5. ✅ Resetar senha com token já usado
6. ✅ Resetar senha com senha fraca
7. ✅ Resetar senha com senhas diferentes
8. ✅ Múltiplas solicitações (invalida anteriores)

### Comandos de Teste

```bash
# Backend
cd server
npm run dev

# Frontend
cd client
npm run dev

# Testar endpoints
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@escola.com"}'
```

## Melhorias Futuras

- [ ] Integração com serviço de email
- [ ] Rate limiting (limitar tentativas)
- [ ] Logs de auditoria
- [ ] Notificação de alteração de senha
- [ ] 2FA (autenticação de dois fatores)
- [ ] Histórico de senhas (evitar reutilização)
- [ ] Força da senha (indicador visual)

## Suporte

Para dúvidas ou problemas:
1. Verificar logs do servidor
2. Verificar tabela `password_reset_tokens`
3. Verificar se migration foi executada
4. Verificar conexão com banco de dados
