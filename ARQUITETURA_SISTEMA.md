# 🏗️ Arquitetura do Sistema de Gestão Escolar

## Visão Geral

Sistema completo para gestão escolar com arquitetura cliente-servidor, seguindo padrões MVC e boas práticas de desenvolvimento.

## Público-Alvo

- **Administração Escolar** (Secretaria, Direção)
- **Professores** (Lançamento de notas, presenças)
- **Encarregados de Educação** (Consulta de informações)
- **Alunos** (Acesso reduzido)
- **Equipe de TI/Manutenção**

## Arquitetura

### Frontend (React + TypeScript + Vite)

```
client/
├── src/
│   ├── components/        # Componentes reutilizáveis
│   │   ├── Dialog.tsx     # Diálogos profissionais
│   │   ├── alunosList.tsx # Lista de alunos
│   │   ├── pagamentosList.tsx # Lista de pagamentos
│   │   ├── presencasList.tsx  # Lista de presenças
│   │   └── notasList.tsx  # Lista de notas
│   ├── pages/             # Páginas principais
│   │   ├── loginView.tsx  # Tela de login
│   │   ├── ForgotPasswordView.tsx # Recuperação de senha
│   │   ├── AdminDashboard.tsx # Dashboard admin
│   │   └── professoresDashboardList.tsx # Dashboard professor
│   ├── services/          # Serviços de API
│   │   ├── api.ts         # Cliente HTTP
│   │   └── authService.ts # Autenticação
│   └── assets/            # Recursos estáticos
│       └── css/           # Estilos
```

### Backend (Node.js + Express + TypeScript + PostgreSQL)

```
server/
├── src/
│   ├── modules/           # Módulos por domínio (MVC)
│   │   ├── students/      # Alunos
│   │   │   ├── students.controller.ts
│   │   │   ├── students.service.ts
│   │   │   ├── students.repository.ts
│   │   │   ├── students.routes.ts
│   │   │   ├── student.entity.ts
│   │   │   └── dto.ts
│   │   ├── payments/      # Pagamentos
│   │   ├── attendance/    # Presenças
│   │   ├── grades/        # Notas
│   │   ├── reports/       # Relatórios
│   │   ├── guardians/     # Encarregados
│   │   ├── staff/         # Funcionários
│   │   ├── classes/       # Classes/Turmas
│   │   └── admin/         # Administração
│   ├── services/          # Serviços globais
│   │   ├── auth.service.ts
│   │   └── password-reset.service.ts
│   ├── middleware/        # Middlewares
│   │   ├── auth.middleware.ts
│   │   ├── error-handler.middleware.ts
│   │   └── validation.middleware.ts
│   ├── config/            # Configurações
│   │   └── database.ts
│   ├── database/          # Migrations
│   │   └── migrations/
│   └── routes/            # Rotas principais
│       └── index.ts
```

## Funcionalidades Principais

### 1. Gestão de Cadastros

#### RF01: Gestão de Alunos
- **CRUD completo** (Create, Read, Update, Delete)
- Dados pessoais, documentos, histórico
- Vínculo com turma e encarregado
- **Endpoints:**
  - `GET /api/students` - Listar com filtros
  - `GET /api/students/:id` - Buscar por ID
  - `POST /api/students` - Criar
  - `PUT /api/students/:id` - Atualizar
  - `DELETE /api/students/:id` - Deletar
  - `GET /api/students/dropdowns/classes` - Classes para dropdown
  - `GET /api/students/dropdowns/turmas` - Turmas para dropdown
  - `GET /api/students/dropdowns/encarregados` - Encarregados para dropdown

#### RF02: Gestão de Encarregados
- **CRUD completo**
- Dados de contato, relação com alunos
- **Endpoints:**
  - `GET /api/guardians`
  - `GET /api/guardians/:id`
  - `POST /api/guardians`
  - `PUT /api/guardians/:id`
  - `DELETE /api/guardians/:id`

#### RF03: Gestão de Funcionários/Docentes
- **CRUD completo**
- Dados profissionais, disciplinas lecionadas
- **Endpoints:**
  - `GET /api/staff`
  - `GET /api/staff/:id`
  - `POST /api/staff`
  - `PUT /api/staff/:id`
  - `DELETE /api/staff/:id`

#### RF04: Gestão de Classes, Turmas e Horários
- **CRUD completo**
- Organização por ano letivo
- **Endpoints:**
  - `GET /api/classes`
  - `GET /api/classes/:id`
  - `POST /api/classes`
  - `PUT /api/classes/:id`
  - `DELETE /api/classes/:id`

### 2. Gestão Financeira (Mensalidades)

#### RF05: Cobrança de Mensalidades
- Geração automática de cobranças
- Valores por classe/turma
- **Endpoint:** `POST /api/payments`

#### RF06: Registro de Pagamentos
- Confirmação de pagamento
- Múltiplas formas de pagamento
- **Endpoint:** `POST /api/payments`

#### RF07: Geração de Recibos
- Recibo em PDF/impressão
- Numeração sequencial
- **Endpoint:** `GET /api/payments/recibo/:id`

#### RF08: Histórico de Pagamentos
- Consulta por aluno
- Filtros por período
- **Endpoint:** `GET /api/payments/historico/:alunoId`

#### RF09: Descontos e Bolsas
- Aplicação de descontos
- Gestão de bolsas de estudo
- **Endpoint:** `POST /api/payments/desconto`

**Endpoints Adicionais:**
- `GET /api/payments` - Listar com filtros
- `GET /api/payments/pendentes` - Pagamentos pendentes
- `GET /api/payments/stats` - Estatísticas

### 3. Gestão de Presenças

#### RF10: Registro Diário de Presenças
- Marcação por turma/disciplina
- Estados: Presente, Falta, Falta Justificada
- **Endpoint:** `POST /api/attendance`

#### RF11: Relatórios de Frequência
- Por aluno, turma ou período
- Percentual de presença
- **Endpoint:** `GET /api/relatorios/frequencia?turmaId=...`

**Endpoints Adicionais:**
- `GET /api/attendance` - Listar presenças
- `GET /api/attendance/turma/:turmaId` - Por turma
- `PUT /api/attendance/:id` - Atualizar
- `DELETE /api/attendance/:id` - Deletar

### 4. Gestão de Notas

#### RF12: Lançamento de Notas Trimestrais
- Por disciplina e trimestre (1º, 2º, 3º)
- Validações de valores (0-20)
- **Endpoint:** `POST /api/grades`

#### RF13: Geração de Boletins
- Boletim individual por aluno
- Médias por trimestre
- **Endpoint:** `GET /api/relatorios/boletim/:alunoId`

#### RF14: Cálculo de Médias
- Média por disciplina
- Média geral
- **Endpoint:** `GET /api/grades/media/:alunoId`

**Endpoints Adicionais:**
- `GET /api/grades` - Listar notas
- `GET /api/grades/:id` - Buscar por ID
- `PUT /api/grades/:id` - Atualizar
- `DELETE /api/grades/:id` - Deletar

### 5. Pacotes de Candidatura a Exames

#### RF15: Inscrição para Exames
- Classes elegíveis: 3ª, 6ª, 9ª, 12ª
- Dados do candidato
- **Endpoint:** `POST /api/exames/candidatura`

#### RF16: Pagamento de Pacote
- Valor por classe
- Confirmação de pagamento
- **Endpoint:** `POST /api/exames/pagamento`

#### RF17: Geração de Listas
- Lista de candidatos por classe
- Exportação para impressão
- **Endpoint:** `GET /api/relatorios/exames?classe=...`

### 6. Relatórios

#### RF18: Relatório Financeiro
- Receitas, pendências, inadimplentes
- Filtros por período
- **Endpoint:** `GET /api/relatorios/financeiro?inicio=...&fim=...`

#### RF19: Relatório de Frequência
- Por turma ou aluno
- Percentuais de presença
- **Endpoint:** `GET /api/relatorios/frequencia?turmaId=...`

#### RF20: Relatório Acadêmico
- Notas por trimestre
- Desempenho geral
- **Endpoint:** `GET /api/relatorios/academico?trimestre=...`

#### RF21: Dashboard
- Visão geral do sistema
- Indicadores principais
- **Endpoint:** `GET /api/relatorios/dashboard`

**Endpoints Adicionais:**
- `GET /api/relatorios/inadimplentes` - Alunos inadimplentes

## Modelagem de Dados

### Principais Tabelas

#### alunos
```sql
CREATE TABLE alunos (
  id_aluno SERIAL PRIMARY KEY,
  nome_aluno VARCHAR(255) NOT NULL,
  data_nascimento DATE,
  genero VARCHAR(20),
  numero_identificacao VARCHAR(50) UNIQUE,
  id_turma INTEGER REFERENCES turmas(id_turma),
  id_encarregado INTEGER REFERENCES encarregados(id_encarregados),
  estado VARCHAR(20) DEFAULT 'ativo'
);
```

#### pagamentos
```sql
CREATE TABLE pagamentos (
  id_pagamento SERIAL PRIMARY KEY,
  id_aluno INTEGER REFERENCES alunos(id_aluno),
  valor DECIMAL(10,2) NOT NULL,
  data_vencimento DATE NOT NULL,
  data_pagamento DATE,
  estado VARCHAR(20) DEFAULT 'pendente',
  forma_pagamento VARCHAR(50),
  numero_recibo VARCHAR(50) UNIQUE
);
```

#### presencas
```sql
CREATE TABLE presencas (
  id_presenca SERIAL PRIMARY KEY,
  id_aluno INTEGER REFERENCES alunos(id_aluno),
  id_disciplina INTEGER REFERENCES disciplinas(id_disciplinas),
  data DATE NOT NULL,
  estado VARCHAR(30) DEFAULT 'presente',
  observacao TEXT
);
```

#### notas
```sql
CREATE TABLE notas (
  id_nota SERIAL PRIMARY KEY,
  id_aluno INTEGER REFERENCES alunos(id_aluno),
  id_disciplina INTEGER REFERENCES disciplinas(id_disciplinas),
  trimestre INTEGER CHECK (trimestre IN (1, 2, 3)),
  nota DECIMAL(4,2) CHECK (nota >= 0 AND nota <= 20),
  data_lancamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  observacao TEXT
);
```

#### exames_candidaturas
```sql
CREATE TABLE exames_candidaturas (
  id_candidatura SERIAL PRIMARY KEY,
  id_aluno INTEGER REFERENCES alunos(id_aluno),
  ano INTEGER NOT NULL,
  classe VARCHAR(10) NOT NULL,
  estado_candidatura VARCHAR(20) DEFAULT 'pendente',
  data_inscricao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  valor_pago DECIMAL(10,2)
);
```

#### password_reset_tokens
```sql
CREATE TABLE password_reset_tokens (
  id_token SERIAL PRIMARY KEY,
  id_funcionario INTEGER REFERENCES funcionarios(id_funcionarios),
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Segurança

### Autenticação
- **JWT (JSON Web Tokens)**
- Tokens com expiração
- Refresh tokens

### Autorização
- **RBAC (Role-Based Access Control)**
- Roles: Admin, Professor, Encarregado, Aluno
- Permissões por endpoint

### Recuperação de Senha
- Tokens únicos e seguros (crypto.randomBytes)
- Expiração de 1 hora
- Uso único
- Hash bcrypt para senhas

### Validações
- Input validation (DTO)
- SQL injection prevention (prepared statements)
- XSS protection
- CORS configurado

## Tecnologias

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Lucide React** - Icons
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT
- **ts-node-dev** - Development

## Implantação

### Desenvolvimento
```bash
# Backend
cd server
npm install
npm run dev

# Frontend
cd client
npm install
npm run dev
```

### Produção
```bash
# Backend
npm run build
npm start

# Frontend
npm run build
# Servir pasta dist/ com nginx ou similar
```

### Variáveis de Ambiente
```env
# Backend (.env)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sge_db
DB_USER=postgres
DB_PASSWORD=sua_senha
JWT_SECRET=seu_secret
PORT=3000

# Frontend (.env)
VITE_API_URL=http://localhost:3000/api
```

## Testes

### Unitários
- Jest para backend
- Vitest para frontend

### Integração
- Supertest para APIs
- React Testing Library

### E2E
- Playwright ou Cypress

## Cronograma Estimado

| Módulo | Estimativa | Status |
|--------|-----------|--------|
| Autenticação | 2 dias | ✅ Completo |
| Recuperação de Senha | 1 dia | ✅ Completo |
| Gestão de Alunos | 3 dias | ✅ Completo |
| Gestão de Pagamentos | 4 dias | 🔄 Em Progresso |
| Gestão de Presenças | 2 dias | ✅ Completo |
| Gestão de Notas | 3 dias | ✅ Completo |
| Pacotes de Exames | 2 dias | ⏳ Pendente |
| Relatórios | 3 dias | ✅ Completo |
| Testes | 3 dias | ⏳ Pendente |
| Deploy | 1 dia | ⏳ Pendente |
| **Total** | **24 dias** | **70% Completo** |

## Melhorias Futuras

- [ ] Notificações por email/SMS
- [ ] App mobile (React Native)
- [ ] Integração com sistemas de pagamento
- [ ] Backup automático
- [ ] Auditoria completa
- [ ] Relatórios em PDF
- [ ] Gráficos e dashboards avançados
- [ ] API pública com documentação Swagger
- [ ] Websockets para atualizações em tempo real
- [ ] Integração com sistemas governamentais

## Suporte

Para dúvidas ou problemas:
1. Verificar logs do servidor
2. Verificar console do navegador
3. Consultar documentação das APIs
4. Contatar equipe de TI
