# Configuração de Variáveis de Ambiente

## Como Configurar

### 1. Criar arquivo .env

```bash
# No diretório server/
cp .env.example .env
```

### 2. Configuração para Desenvolvimento Local

Se você vai rodar o backend **SEM Docker** (usando `npm run dev` diretamente):

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=1234
DB_NAME=sge_db
```

### 3. Configuração para Docker Compose

Se você vai rodar o backend **COM Docker Compose**:

```env
DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=1234
DB_NAME=sge_db
```

⚠️ **IMPORTANTE**: O Docker Compose já define as variáveis de ambiente automaticamente. O arquivo `.env` é necessário apenas para rodar localmente.

## Variáveis Disponíveis

| Variável | Descrição | Valor Padrão |
|----------|-----------|--------------|
| `NODE_ENV` | Ambiente de execução | `development` |
| `PORT` | Porta do servidor | `3000` |
| `DB_HOST` | Host do PostgreSQL | `db` (Docker) ou `localhost` |
| `DB_PORT` | Porta do PostgreSQL | `5432` |
| `DB_USER` | Usuário do banco | `postgres` |
| `DB_PASSWORD` | Senha do banco | `1234` |
| `DB_NAME` | Nome do banco | `sge_db` |
| `JWT_SECRET` | Chave secreta JWT | `minhachavesecreta123` |
| `JWT_EXPIRES_IN` | Expiração do token | `7d` |
| `FRONTEND_URL` | URL do frontend | `http://localhost:5173` |

## Verificação

Para verificar se as variáveis estão corretas, rode:

```bash
npm run verify
```
