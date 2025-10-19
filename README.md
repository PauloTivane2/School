# Sistema de Gestão Escolar

Sistema completo de gestão escolar com controle de alunos, pagamentos, presenças, notas e exames.

## 🚀 Tecnologias

### Backend
- Node.js + TypeScript
- Express.js
- PostgreSQL
- Redis
- JWT Authentication
- Knex.js (Query Builder)

### Frontend
- React + TypeScript
- Vite
- TailwindCSS
- React Router
- Axios

## 📋 Pré-requisitos

- Node.js 18+ 
- PostgreSQL 15+
- Redis 7+
- npm ou yarn

## 🔧 Instalação

### 1. Clone o repositório
```bash
git clone <seu-repositorio>
cd school-management-system

# Clone o repositório
git clone <seu-repositorio>
cd school-management-system

# Inicie os containers
docker-compose up -d

# Acesse:
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
# PgAdmin: http://localhost:5050


cd backend

# Instalar dependências
npm install

# Configurar .env
cp .env.example .env
# Edite o .env com suas configurações

# Criar database no PostgreSQL
createdb sge_db

# Executar migrations
npm run migration:run

# Iniciar servidor
npm run dev


cd backend

# Instalar dependências
npm install

# Configurar .env
cp .env.example .env
# Edite o .env com suas configurações

# Criar database no PostgreSQL
createdb sge_db

# Executar migrations
npm run migration:run

# Iniciar servidor
npm run dev

cd frontend

# Instalar dependências
npm install

# Configurar .env
cp .env.example .env

# Iniciar aplicação
npm run dev

psql -U postgres -d sge_db -f backend/src/database/migrations/001_create_tables.sql

NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_NAME=sge_db
JWT_SECRET=sua_chave_secreta
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173

VITE_API_URL=http://localhost:3000/api

Authorization: Bearer <seu_token>

# Backend
cd backend
npm test

# Frontend
cd frontend
npm test

# Frontend
cd frontend
npm run build

# Backend
cd backend
npm run build
npm start