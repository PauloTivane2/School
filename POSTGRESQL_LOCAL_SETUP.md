# Configuração PostgreSQL 17 Local

## 1. Instalação do PostgreSQL 17

Se ainda não instalou, baixe em: https://www.postgresql.org/download/windows/

## 2. Configuração do Banco de Dados

Após instalar o PostgreSQL 17, você precisa criar o banco de dados:

### Opção 1: Usando pgAdmin (Interface Gráfica)
1. Abra o pgAdmin que foi instalado junto com o PostgreSQL
2. Conecte ao servidor local (geralmente com o usuário `postgres`)
3. Clique com botão direito em "Databases" → "Create" → "Database"
4. Nome do banco: `sge_db`
5. Clique em "Save"

### Opção 2: Usando linha de comando (psql)
```bash
# Abra o terminal SQL do PostgreSQL (psql)
psql -U postgres

# Dentro do psql, execute:
CREATE DATABASE sge_db;

# Para sair:
\q
```

## 3. Verificar Configurações do .env

O arquivo `server/.env` já foi configurado com:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=1234
DB_NAME=sge_db
```

**IMPORTANTE:** Se você definiu uma senha diferente durante a instalação do PostgreSQL, atualize `DB_PASSWORD` no arquivo `.env`

## 4. Executar Migrações

Depois de criar o banco de dados, rode as migrações para criar as tabelas:

```bash
cd server
npm run migrate
```

## 5. (Opcional) Popular com dados iniciais

Para adicionar dados de teste:

```bash
npm run seed
```

## 6. Iniciar o Servidor

```bash
npm run dev
```

## Verificação de Conexão

Se tudo estiver correto, você verá no console:
```
✅ Conexão com PostgreSQL estabelecida com sucesso
```

## Resolução de Problemas

### Erro: "role 'postgres' does not exist"
- Durante a instalação, você pode ter criado um usuário diferente
- Atualize `DB_USER` no arquivo `.env` com o usuário correto

### Erro: "database 'sge_db' does not exist"
- Execute o passo 2 novamente para criar o banco de dados

### Erro: "password authentication failed"
- Verifique se a senha no `.env` corresponde à senha que você definiu na instalação
- Caminho do arquivo: `server/.env` → `DB_PASSWORD`

### Erro: "ECONNREFUSED 127.0.0.1:5432"
- O serviço PostgreSQL não está rodando
- Windows: Abra "Services" (services.msc) e inicie o serviço "postgresql-x64-17"
- Ou use o pgAdmin para iniciar o servidor

## Comandos Úteis

```bash
# Ver status das migrações
npm run migrate:status

# Reverter última migração
npm run migrate:rollback

# Limpar e recriar banco (CUIDADO: apaga todos os dados!)
# Primeiro, no psql:
DROP DATABASE sge_db;
CREATE DATABASE sge_db;
# Depois rode as migrações novamente
npm run migrate
```
