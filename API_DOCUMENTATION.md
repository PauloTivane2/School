# 📚 Documentação das APIs - Sistema de Gestão Escolar

## Base URL
```
http://localhost:3000/api
```

## Autenticação

Todas as rotas (exceto login e recuperação de senha) requerem autenticação via JWT.

**Header:**
```
Authorization: Bearer {token}
```

---

## 🔐 Autenticação

### POST /auth/login
Realiza login no sistema.

**Request:**
```json
{
  "email": "admin@escola.com",
  "password": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "nome": "Admin Sistema",
      "email": "admin@escola.com",
      "funcao": "Admin"
    }
  }
}
```

### POST /auth/forgot-password
Solicita recuperação de senha.

**Request:**
```json
{
  "email": "usuario@escola.com"
}
```

**Response (200):**
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

### POST /auth/reset-password
Reseta senha com token.

**Request:**
```json
{
  "token": "abc123...",
  "newPassword": "novaSenha123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Senha alterada com sucesso"
}
```

---

## 👨‍🎓 Alunos

### GET /students
Lista alunos com filtros opcionais.

**Query Parameters:**
- `q` - Busca por nome
- `ano` - Filtrar por ano
- `turma_id` - Filtrar por turma
- `classe_id` - Filtrar por classe
- `estado` - Filtrar por estado (ativo/inativo)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nome": "João Silva",
      "data_nascimento": "2010-05-15",
      "genero": "Masculino",
      "numero_identificacao": "123456789",
      "turma": "A",
      "classe": "10ª Classe",
      "encarregado": "Maria Silva",
      "estado": "ativo"
    }
  ]
}
```

### GET /students/:id
Busca aluno por ID.

### POST /students
Cria novo aluno.

**Request:**
```json
{
  "nome_aluno": "João Silva",
  "data_nascimento": "2010-05-15",
  "genero": "Masculino",
  "numero_identificacao": "123456789",
  "id_turma": 1,
  "id_encarregado": 1
}
```

### PUT /students/:id
Atualiza aluno.

### DELETE /students/:id
Deleta aluno.

### GET /students/dropdowns/classes
Lista classes para dropdown.

**Response (200):**
```json
{
  "success": true,
  "data": [
    { "id_classes": 1, "nome_classe": "10ª Classe" },
    { "id_classes": 2, "nome_classe": "11ª Classe" }
  ]
}
```

### GET /students/dropdowns/turmas
Lista turmas para dropdown.

**Query Parameters:**
- `ano` - Filtrar por ano (opcional)

### GET /students/dropdowns/encarregados
Lista encarregados para dropdown.

---

## 💰 Pagamentos

### GET /payments
Lista pagamentos com filtros.

**Query Parameters:**
- `aluno_id` - Filtrar por aluno
- `estado` - Filtrar por estado (pago/pendente/atrasado)
- `data_inicio` - Data inicial
- `data_fim` - Data final

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id_pagamento": 1,
      "aluno": "João Silva",
      "valor": 5000.00,
      "data_vencimento": "2025-01-31",
      "data_pagamento": "2025-01-25",
      "estado": "pago",
      "forma_pagamento": "Transferência",
      "numero_recibo": "REC-2025-001"
    }
  ]
}
```

### POST /payments
Registra novo pagamento.

**Request:**
```json
{
  "id_aluno": 1,
  "valor": 5000.00,
  "data_vencimento": "2025-02-28",
  "forma_pagamento": "Dinheiro"
}
```

### GET /payments/recibo/:id
Gera recibo de pagamento.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "numero_recibo": "REC-2025-001",
    "aluno": "João Silva",
    "valor": 5000.00,
    "data_pagamento": "2025-01-25",
    "forma_pagamento": "Transferência",
    "responsavel": "Admin Sistema"
  }
}
```

### GET /payments/historico/:alunoId
Histórico de pagamentos do aluno.

### POST /payments/desconto
Aplica desconto ou bolsa.

**Request:**
```json
{
  "aluno_id": 1,
  "tipo": "bolsa",
  "valor": 2500.00,
  "motivo": "Bolsa de mérito acadêmico"
}
```

### GET /payments/pendentes
Lista pagamentos pendentes.

**Query Parameters:**
- `turma_id` - Filtrar por turma
- `mes` - Filtrar por mês

### GET /payments/stats
Estatísticas de pagamentos.

**Query Parameters:**
- `data_inicio` - Data inicial
- `data_fim` - Data final

---

## 📅 Presenças

### GET /attendance
Lista presenças com filtros.

**Query Parameters:**
- `turma_id` - Filtrar por turma
- `data_inicio` - Data inicial
- `data_fim` - Data final
- `aluno_id` - Filtrar por aluno

### POST /attendance
Registra presença.

**Request:**
```json
{
  "id_aluno": 1,
  "id_disciplina": 1,
  "data": "2025-11-01",
  "estado": "presente",
  "observacao": ""
}
```

**Estados possíveis:**
- `presente`
- `falta`
- `falta_justificada`

### PUT /attendance/:id
Atualiza presença.

### DELETE /attendance/:id
Deleta presença.

### GET /attendance/turma/:turmaId
Presenças por turma.

---

## 📝 Notas

### GET /grades
Lista notas com filtros.

**Query Parameters:**
- `aluno_id` - Filtrar por aluno
- `trimestre` - Filtrar por trimestre (1, 2, 3)
- `disciplina_id` - Filtrar por disciplina

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id_nota": 1,
      "aluno": "João Silva",
      "disciplina": "Matemática",
      "trimestre": 1,
      "nota": 15.5,
      "data_lancamento": "2025-04-15",
      "observacao": "Bom desempenho"
    }
  ]
}
```

### POST /grades
Lança nova nota.

**Request:**
```json
{
  "id_aluno": 1,
  "id_disciplina": 1,
  "trimestre": 1,
  "nota": 15.5,
  "observacao": "Bom desempenho"
}
```

**Validações:**
- `trimestre`: 1, 2 ou 3
- `nota`: 0 a 20

### PUT /grades/:id
Atualiza nota.

### DELETE /grades/:id
Deleta nota.

### GET /grades/media/:alunoId
Calcula médias do aluno.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "media_geral": 14.8,
    "por_trimestre": [
      { "trimestre": 1, "media": 15.2 },
      { "trimestre": 2, "media": 14.5 },
      { "trimestre": 3, "media": 14.7 }
    ],
    "por_disciplina": [
      { "disciplina": "Matemática", "media": 15.0 },
      { "disciplina": "Português", "media": 14.5 }
    ]
  }
}
```

---

## 📊 Relatórios

### GET /relatorios/financeiro
Relatório financeiro.

**Query Parameters (obrigatórios):**
- `inicio` - Data inicial (YYYY-MM-DD)
- `fim` - Data final (YYYY-MM-DD)
- `turma_id` - Filtrar por turma (opcional)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "resumo": {
      "total_pagamentos": 150,
      "total_recebido": 650000.00,
      "total_pendente": 100000.00,
      "total_atrasado": 50000.00,
      "total_geral": 800000.00,
      "alunos_em_dia": 120,
      "alunos_inadimplentes": 30
    },
    "por_mes": [
      {
        "mes": "2025-01",
        "recebido": 300000.00,
        "pendente": 50000.00
      }
    ],
    "periodo": {
      "inicio": "2025-01-01",
      "fim": "2025-03-31"
    }
  }
}
```

### GET /relatorios/frequencia
Relatório de frequência.

**Query Parameters (obrigatórios):**
- `turmaId` - ID da turma

**Query Parameters (opcionais):**
- `inicio` - Data inicial
- `fim` - Data final

**Response (200):**
```json
{
  "success": true,
  "data": {
    "alunos": [
      {
        "id_aluno": 1,
        "nome_aluno": "João Silva",
        "presencas": 45,
        "faltas": 3,
        "faltas_justificadas": 2,
        "total_aulas": 50,
        "percentual_presenca": 90.00
      }
    ],
    "turma_id": 1,
    "periodo": {
      "inicio": "2025-01-01",
      "fim": "2025-03-31"
    }
  }
}
```

### GET /relatorios/academico
Relatório acadêmico.

**Query Parameters (opcionais):**
- `trimestre` - Filtrar por trimestre
- `turma_id` - Filtrar por turma
- `classe_id` - Filtrar por classe

**Response (200):**
```json
{
  "success": true,
  "data": {
    "notas": [
      {
        "id_aluno": 1,
        "nome_aluno": "João Silva",
        "turma": "A",
        "nome_classe": "10ª Classe",
        "nome_disciplina": "Matemática",
        "nota": 15.5,
        "trimestre": 1,
        "situacao": "Aprovado"
      }
    ],
    "estatisticas": {
      "total_alunos": 30,
      "media_geral": 14.5,
      "aprovados": 25,
      "reprovados": 5
    },
    "filtros": {
      "trimestre": 1
    }
  }
}
```

### GET /relatorios/boletim/:alunoId
Boletim individual do aluno.

**Query Parameters:**
- `ano` - Ano letivo (padrão: ano atual)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "aluno": {
      "nome": "João Silva",
      "numero_identificacao": "123456789",
      "turma": "A",
      "classe": "10ª Classe"
    },
    "notas": [
      {
        "disciplina": "Matemática",
        "trimestre": 1,
        "nota": 15.5,
        "observacao": "Bom desempenho"
      }
    ],
    "medias_trimestre": [
      { "trimestre": 1, "media": 15.2 },
      { "trimestre": 2, "media": 14.5 },
      { "trimestre": 3, "media": 14.7 }
    ],
    "ano": 2025
  }
}
```

### GET /relatorios/inadimplentes
Relatório de alunos inadimplentes.

**Query Parameters:**
- `meses_atraso` - Mínimo de meses em atraso (padrão: 1)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "inadimplentes": [
      {
        "id_aluno": 1,
        "nome_aluno": "João Silva",
        "numero_identificacao": "123456789",
        "turma": "A",
        "nome_classe": "10ª Classe",
        "meses_em_atraso": 3,
        "valor_total_devido": 15000.00,
        "primeira_pendencia": "2024-11-30"
      }
    ],
    "total_alunos": 15,
    "total_devido": 225000.00,
    "meses_minimo": 1
  }
}
```

### GET /relatorios/exames
Relatório de candidatos a exames.

**Query Parameters:**
- `classe` - Classe (3ª, 6ª, 9ª, 12ª)
- `ano` - Ano letivo (padrão: ano atual)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "candidatos": [
      {
        "id_aluno": 1,
        "nome_aluno": "João Silva",
        "numero_identificacao": "123456789",
        "data_nascimento": "2007-05-15",
        "turma": "A",
        "nome_classe": "12ª Classe",
        "estado_candidatura": "confirmado",
        "data_inscricao": "2025-01-15",
        "valor_pago": 3000.00,
        "status": "Confirmado"
      }
    ],
    "estatisticas": {
      "total_alunos": 50,
      "confirmados": 45,
      "pendentes": 3,
      "nao_inscritos": 2
    },
    "classe": "12ª",
    "ano": 2025
  }
}
```

### GET /relatorios/dashboard
Dados para dashboard.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "total_alunos": 500,
    "total_funcionarios": 45,
    "total_turmas": 20,
    "financeiro_mes": {
      "recebido": 2500000.00,
      "pendente": 500000.00
    },
    "presencas_hoje": {
      "presentes": 450,
      "faltas": 50
    }
  }
}
```

---

## 📋 Códigos de Status HTTP

| Código | Significado |
|--------|-------------|
| 200 | OK - Sucesso |
| 201 | Created - Recurso criado |
| 400 | Bad Request - Dados inválidos |
| 401 | Unauthorized - Não autenticado |
| 403 | Forbidden - Sem permissão |
| 404 | Not Found - Recurso não encontrado |
| 409 | Conflict - Conflito (ex: duplicado) |
| 500 | Internal Server Error - Erro do servidor |

## 🔒 Permissões por Role

| Endpoint | Admin | Professor | Encarregado | Aluno |
|----------|-------|-----------|-------------|-------|
| /students | ✅ CRUD | 👁️ Read | 👁️ Own | 👁️ Own |
| /payments | ✅ CRUD | 👁️ Read | 👁️ Own | 👁️ Own |
| /attendance | ✅ CRUD | ✅ CRUD | 👁️ Own | 👁️ Own |
| /grades | ✅ CRUD | ✅ CRUD | 👁️ Own | 👁️ Own |
| /relatorios | ✅ All | 👁️ Limited | 👁️ Own | 👁️ Own |

**Legenda:**
- ✅ CRUD - Create, Read, Update, Delete
- 👁️ Read - Apenas leitura
- 👁️ Own - Apenas seus próprios dados
- 👁️ Limited - Acesso limitado

## 📝 Exemplos de Uso

### Exemplo 1: Registrar Pagamento
```javascript
const response = await fetch('http://localhost:3000/api/payments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    id_aluno: 1,
    valor: 5000.00,
    data_vencimento: '2025-02-28',
    forma_pagamento: 'Dinheiro'
  })
});

const data = await response.json();
console.log(data);
```

### Exemplo 2: Lançar Nota
```javascript
const response = await fetch('http://localhost:3000/api/grades', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    id_aluno: 1,
    id_disciplina: 1,
    trimestre: 1,
    nota: 15.5,
    observacao: 'Bom desempenho'
  })
});

const data = await response.json();
console.log(data);
```

### Exemplo 3: Gerar Relatório Financeiro
```javascript
const params = new URLSearchParams({
  inicio: '2025-01-01',
  fim: '2025-03-31'
});

const response = await fetch(`http://localhost:3000/api/relatorios/financeiro?${params}`, {
  headers: {
    'Authorization': 'Bearer ' + token
  }
});

const data = await response.json();
console.log(data);
```

## 🚀 Próximos Passos

- [ ] Documentação Swagger/OpenAPI
- [ ] Postman Collection
- [ ] Rate Limiting
- [ ] Versionamento de API (v2)
- [ ] Webhooks
- [ ] GraphQL endpoint
