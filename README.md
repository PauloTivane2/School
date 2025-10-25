# Sistema de Gestão Escolar

Sistema de gestão escolar completo desenvolvido com React (frontend) e Node.js/TypeScript (backend).

## 📁 Estrutura do Projeto

```
projeto/
│
├── server/                              # Backend / Servidor
│   ├── src/                             # Código-fonte do servidor
│   │   ├── modules/                     # Módulos organizados por domínio (MVC)
│   │   │   ├── students/                # Módulo de estudantes
│   │   │   │   ├── students.controller.ts
│   │   │   │   ├── students.service.ts
│   │   │   │   ├── students.repository.ts
│   │   │   │   ├── students.routes.ts
│   │   │   │   ├── student.entity.ts
│   │   │   │   └── dto/                 # Data Transfer Objects
│   │   │   │       └── index.ts
│   │   │   │
│   │   │   ├── classes/                 # Módulo de classes/turmas
│   │   │   │   ├── classes.controller.ts
│   │   │   │   ├── classes.service.ts
│   │   │   │   ├── classes.repository.ts
│   │   │   │   ├── classes.routes.ts
│   │   │   │   └── class.entity.ts
│   │   │   │
│   │   │   ├── payments/                # Módulo de pagamentos
│   │   │   │   ├── payments.controller.ts
│   │   │   │   ├── payments.service.ts
│   │   │   │   ├── payments.repository.ts
│   │   │   │   ├── payments.routes.ts
│   │   │   │   └── payment.entity.ts
│   │   │   │
│   │   │   ├── attendance/              # Módulo de presenças
│   │   │   │   ├── attendance.controller.ts
│   │   │   │   ├── attendance.service.ts
│   │   │   │   ├── attendance.repository.ts
│   │   │   │   ├── attendance.routes.ts
│   │   │   │   └── attendance.entity.ts
│   │   │   │
│   │   │   ├── grades/                  # Módulo de notas
│   │   │   │   ├── grades.controller.ts
│   │   │   │   ├── grades.service.ts
│   │   │   │   ├── grades.repository.ts
│   │   │   │   ├── grades.routes.ts
│   │   │   │   └── grade.entity.ts
│   │   │   │
│   │   │   └── admin/                   # Módulo administrativo
│   │   │       ├── admin.controller.ts
│   │   │       └── admin.routes.ts
│   │   │
│   │   ├── core/                        # Núcleo da aplicação
│   │   │   └── middleware/              # Middlewares globais
│   │   │       └── error-handler.middleware.ts
│   │   │
│   │   ├── common/                      # Recursos compartilhados
│   │   │   └── utils/                   # Utilitários
│   │   │       └── response.util.ts     # Respostas padronizadas
│   │   │
│   │   ├── config/                      # Configurações gerais
│   │   │   ├── database.ts              # Configuração do banco de dados
│   │   │   ├── env.ts                   # Variáveis de ambiente
│   │   │   └── ormconfig.ts             # Configuração ORM
│   │   │
│   │   ├── middleware/                  # Middlewares legados
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error-handler.middleware.ts
│   │   │   └── validation.middleware.ts
│   │   │
│   │   ├── database/                    # Conexão e scripts do banco
│   │   │   └── migrations/              # Migrações do banco
│   │   │
│   │   ├── controllers/                 # Controllers legados (compatibilidade)
│   │   │   └── *.controller.ts
│   │   │
│   │   ├── models/                      # Models legados (compatibilidade)
│   │   │   ├── *.entity.ts
│   │   │   └── *.repository.ts
│   │   │
│   │   ├── services/                    # Services legados (compatibilidade)
│   │   │   └── *.service.ts
│   │   │
│   │   ├── routes/                      # Rotas centralizadas
│   │   │   ├── index.ts                 # Centralizador de rotas
│   │   │   └── *.routes.ts              # Rotas específicas
│   │   │
│   │   ├── interfaces/                  # Interfaces TypeScript
│   │   │   └── *.interface.ts
│   │   │
│   │   ├── utils/                       # Utilitários
│   │   │   ├── bcrypt.util.ts
│   │   │   └── jwt.util.ts
│   │   │
│   │   ├── app.ts                       # Configuração da aplicação Express
│   │   ├── server.ts                    # Inicialização do servidor
│   │   ├── index.ts                     # Ponto de entrada principal
│   │   └── db.ts                        # Conexão com banco de dados
│   │
│   ├── scripts/                         # Scripts auxiliares
│   │   └── dados_teste.sql              # Script de seed
│   │
│   ├── Dockerfile/                      # Imagem Docker
│   │   └── Dockerfile.txt
│   │
│   ├── .env.example                     # Exemplo de variáveis de ambiente
│   ├── package.json                     # Dependências do backend
│   ├── tsconfig.json                    # Configuração TypeScript
│   ├── nodemon.json                     # Configuração Nodemon
│   └── verify-setup.js                  # Script de verificação
│
├── client/                     # Frontend / Cliente
│   ├── src/
│   │   ├── components/         # Componentes reutilizáveis (React)
│   │   │   ├── alunosList.tsx
│   │   │   ├── encarregadosList.tsx
│   │   │   ├── funcionariosList.tsx
│   │   │   ├── notasList.tsx
│   │   │   ├── pagamentosList.tsx
│   │   │   ├── presencasList.tsx
│   │   │   └── turmasList.tsx
│   │   │
│   │   ├── pages/              # Páginas ou telas da aplicação
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── DashboardView.tsx
│   │   │   ├── loginView.tsx
│   │   │   ├── alunosView.tsx
│   │   │   ├── funcionariosView.tsx
│   │   │   ├── encarregadosView.tsx
│   │   │   ├── notasView.tsx
│   │   │   ├── pagamentosView.tsx
│   │   │   ├── presencasView.tsx
│   │   │   ├── turmasView.tsx
│   │   │   └── ...
│   │   │
│   │   ├── assets/             # Arquivos estáticos
│   │   │   ├── css/            # Estilos CSS
│   │   │   │   └── index.css
│   │   │   ├── js/             # Scripts JavaScript
│   │   │   └── images/         # Imagens e ícones
│   │   │
│   │   ├── services/           # Chamadas à API
│   │   │   ├── api.ts         # Configuração Axios
│   │   │   ├── authService.js # Serviço de autenticação
│   │   │   └── *.service.ts   # Outros serviços
│   │   │
│   │   ├── context/            # Context API
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── App.tsx             # Componente principal
│   │   └── main.tsx            # Ponto de entrada
│   │
│   ├── public/                 # Arquivos públicos
│   ├── index.html              # HTML principal
│   ├── vite.config.ts          # Configuração Vite
│   ├── tailwind.config.js      # Configuração Tailwind
│   └── package.json            # Dependências do frontend
│
├── scripts/                    # Scripts auxiliares
│   └── dados_teste.sql        # Script de seed do banco
│
├── .gitignore                 # Arquivos ignorados pelo Git
└── README.md                  # Documentação do projeto
```

## 🚀 Tecnologias

### Backend
- Node.js
- TypeScript
- Express.js
- PostgreSQL
- JWT para autenticação

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- Axios
- React Router

## 📦 Instalação

### Backend
```bash
cd server
npm install
```

### Frontend
```bash
cd client
npm install
```

## 🔧 Configuração

### Backend
1. Copie `.env.example` para `.env`
2. Configure as variáveis de ambiente
3. Execute as migrações do banco de dados

### Frontend
1. Copie `.env.example` para `.env`
2. Configure a URL da API

## ▶️ Executando

### Opção 1: Docker Compose (Recomendado)
```bash
# Subir toda a aplicação (banco + servidor)
docker-compose up

# Parar os serviços
docker-compose down
```

### Opção 2: Desenvolvimento Local

#### Backend
```bash
cd server
npm install
npm run dev
```

#### Frontend
```bash
cd client
npm install
npm run dev
```

### URLs
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Health Check**: http://localhost:3000/health
- **Banco de Dados**: localhost:5432

## 📝 Funcionalidades

- ✅ Gestão de alunos
- ✅ Gestão de professores
- ✅ Gestão de funcionários
- ✅ Gestão de turmas
- ✅ Gestão de notas
- ✅ Gestão de presenças
- ✅ Gestão de pagamentos
- ✅ Dashboard administrativo
- ✅ Autenticação e autorização
- ✅ Relatórios

## 👥 Roles

- **Admin**: Acesso total ao sistema
- **Professor**: Gestão de notas e presenças
- **Encarregado**: Visualização de informações dos alunos
- **Contabilista**: Gestão financeira

## 📄 Licença

Este projeto é privado e de uso interno.
