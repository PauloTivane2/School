/**
 * EXEMPLO: Como aplicar middlewares RBAC nas rotas
 * 
 * Este arquivo demonstra como proteger rotas usando:
 * - authMiddleware: Valida token JWT
 * - authorize(...roles): Valida se usuário tem role permitido
 * - teacherScope: Valida escopo de professor (RN04)
 * - guardianScope: Valida escopo de encarregado (RN01)
 */

import { Router } from 'express';
import { authMiddleware, authorize } from '../middleware/auth.middleware';
import { teacherScope } from '../middleware/teacher-scope.middleware';
import { guardianScope } from '../middleware/guardian-scope.middleware';

const router = Router();

// ==================== ALUNOS ====================

/**
 * GET /alunos
 * Todos os perfis podem visualizar alunos (com filtros por escopo)
 */
router.get('/alunos',
  authMiddleware,
  authorize('Admin', 'Tesouraria', 'Professor', 'Encarregado'),
  guardianScope.filterStudents(), // Filtra apenas educandos do encarregado
  // Controller aqui
  (req, res) => res.json({ message: 'Lista de alunos' })
);

/**
 * GET /alunos/:alunoId
 * Detalhes de um aluno específico
 * - Admin: todos os alunos
 * - Professor: apenas alunos de suas turmas
 * - Encarregado: apenas seus educandos
 */
router.get('/alunos/:alunoId',
  authMiddleware,
  authorize('Admin', 'Professor', 'Encarregado'),
  teacherScope.byStudent(),    // Valida se é aluno do professor
  guardianScope.byStudent(),   // Valida se é educando do encarregado
  // Controller aqui
  (req, res) => res.json({ message: 'Detalhes do aluno' })
);

/**
 * POST /alunos
 * Criar novo aluno - apenas Admin
 */
router.post('/alunos',
  authMiddleware,
  authorize('Admin'),
  // Controller aqui
  (req, res) => res.json({ message: 'Aluno criado' })
);

/**
 * PUT /alunos/:alunoId
 * Editar aluno - apenas Admin
 */
router.put('/alunos/:alunoId',
  authMiddleware,
  authorize('Admin'),
  // Controller aqui
  (req, res) => res.json({ message: 'Aluno atualizado' })
);

/**
 * DELETE /alunos/:alunoId
 * Excluir aluno - apenas Admin
 */
router.delete('/alunos/:alunoId',
  authMiddleware,
  authorize('Admin'),
  // Controller aqui
  (req, res) => res.json({ message: 'Aluno excluído' })
);

// ==================== TURMAS ====================

/**
 * GET /turmas
 * Listar turmas
 * - Admin: todas as turmas
 * - Professor: apenas suas turmas
 */
router.get('/turmas',
  authMiddleware,
  authorize('Admin', 'Professor'),
  // Adicionar filtro no controller para professor
  (req, res) => res.json({ message: 'Lista de turmas' })
);

/**
 * GET /turmas/:turmaId
 * Detalhes da turma
 * - Admin: qualquer turma
 * - Professor: apenas suas turmas (RN04)
 */
router.get('/turmas/:turmaId',
  authMiddleware,
  authorize('Admin', 'Professor'),
  teacherScope.byTurma(), // Valida se é turma do professor
  // Controller aqui
  (req, res) => res.json({ message: 'Detalhes da turma' })
);

/**
 * POST /turmas
 * Criar turma - apenas Admin
 */
router.post('/turmas',
  authMiddleware,
  authorize('Admin'),
  // Controller aqui
  (req, res) => res.json({ message: 'Turma criada' })
);

// ==================== PRESENÇAS ====================

/**
 * GET /presencas
 * Listar presenças
 * - Admin: todas
 * - Professor: suas turmas
 * - Encarregado: seus educandos
 */
router.get('/presencas',
  authMiddleware,
  authorize('Admin', 'Professor', 'Encarregado'),
  // Filtrar por escopo no controller
  (req, res) => res.json({ message: 'Lista de presenças' })
);

/**
 * POST /presencas
 * Registrar presença
 * - Admin: qualquer turma
 * - Professor: apenas suas turmas (RN04)
 */
router.post('/presencas',
  authMiddleware,
  authorize('Admin', 'Professor'),
  teacherScope.byTurma(), // Valida turma do professor
  // Controller aqui
  (req, res) => res.json({ message: 'Presença registrada' })
);

// ==================== NOTAS ====================

/**
 * GET /notas
 * Listar notas
 * - Admin: todas
 * - Professor: suas disciplinas
 * - Encarregado: seus educandos
 */
router.get('/notas',
  authMiddleware,
  authorize('Admin', 'Professor', 'Encarregado'),
  // Filtrar por escopo no controller
  (req, res) => res.json({ message: 'Lista de notas' })
);

/**
 * POST /notas
 * Lançar nota
 * - Admin: qualquer aluno
 * - Professor: apenas alunos de suas turmas (RN04)
 */
router.post('/notas',
  authMiddleware,
  authorize('Admin', 'Professor'),
  teacherScope.byStudent(), // Valida se aluno pertence à turma do professor
  // Controller aqui
  (req, res) => res.json({ message: 'Nota lançada' })
);

// ==================== FINANCEIRO ====================

/**
 * GET /pagamentos
 * Listar pagamentos
 * - Admin: todos
 * - Tesouraria: todos
 * - Encarregado: apenas seus educandos (RN01)
 */
router.get('/pagamentos',
  authMiddleware,
  authorize('Admin', 'Tesouraria', 'Encarregado'),
  guardianScope.filterStudents(), // Filtra por educandos
  // Controller aqui
  (req, res) => res.json({ message: 'Lista de pagamentos' })
);

/**
 * GET /pagamentos/:alunoId
 * Pagamentos de um aluno específico
 * - Admin: qualquer aluno
 * - Tesouraria: qualquer aluno
 * - Encarregado: apenas seus educandos
 */
router.get('/pagamentos/:alunoId',
  authMiddleware,
  authorize('Admin', 'Tesouraria', 'Encarregado'),
  guardianScope.byPayment(), // Valida acesso financeiro do encarregado
  // Controller aqui
  (req, res) => res.json({ message: 'Pagamentos do aluno' })
);

/**
 * POST /pagamentos
 * Registrar pagamento
 * - Admin: sim
 * - Tesouraria: sim
 */
router.post('/pagamentos',
  authMiddleware,
  authorize('Admin', 'Tesouraria'),
  // Controller aqui
  (req, res) => res.json({ message: 'Pagamento registrado' })
);

// ==================== FUNCIONÁRIOS ====================

/**
 * GET /funcionarios
 * Listar funcionários - apenas Admin
 */
router.get('/funcionarios',
  authMiddleware,
  authorize('Admin'),
  // Controller aqui
  (req, res) => res.json({ message: 'Lista de funcionários' })
);

/**
 * POST /funcionarios
 * Criar funcionário - apenas Admin
 */
router.post('/funcionarios',
  authMiddleware,
  authorize('Admin'),
  // Controller aqui
  (req, res) => res.json({ message: 'Funcionário criado' })
);

// ==================== RELATÓRIOS ====================

/**
 * GET /relatorios/geral
 * Relatório geral - apenas Admin
 */
router.get('/relatorios/geral',
  authMiddleware,
  authorize('Admin'),
  // Controller aqui
  (req, res) => res.json({ message: 'Relatório geral' })
);

/**
 * GET /relatorios/financeiro
 * Relatório financeiro
 * - Admin: sim
 * - Tesouraria: sim
 */
router.get('/relatorios/financeiro',
  authMiddleware,
  authorize('Admin', 'Tesouraria'),
  // Controller aqui
  (req, res) => res.json({ message: 'Relatório financeiro' })
);

/**
 * GET /relatorios/pedagogico
 * Relatório pedagógico
 * - Admin: todos os dados
 * - Professor: apenas suas turmas
 */
router.get('/relatorios/pedagogico',
  authMiddleware,
  authorize('Admin', 'Professor'),
  // Filtrar por turmas do professor no controller
  (req, res) => res.json({ message: 'Relatório pedagógico' })
);

// ==================== CONFIGURAÇÕES ====================

/**
 * GET /settings
 * Ver configurações - apenas Admin
 */
router.get('/settings',
  authMiddleware,
  authorize('Admin'),
  // Controller aqui
  (req, res) => res.json({ message: 'Configurações' })
);

/**
 * PUT /settings
 * Alterar configurações - apenas Admin
 */
router.put('/settings',
  authMiddleware,
  authorize('Admin'),
  // Controller aqui
  (req, res) => res.json({ message: 'Configurações atualizadas' })
);

// ==================== DASHBOARD ====================

/**
 * GET /dashboard/stats
 * Estatísticas do dashboard
 * - Cada perfil vê dados apropriados ao seu escopo
 */
router.get('/dashboard/stats',
  authMiddleware,
  authorize('Admin', 'Tesouraria', 'Professor', 'Encarregado'),
  // Controller filtra dados baseado no role
  (req, res) => {
    const { role } = req.user!;
    
    switch (role) {
      case 'Admin':
        return res.json({ message: 'Stats completas' });
      case 'Tesouraria':
        return res.json({ message: 'Stats financeiras' });
      case 'Professor':
        return res.json({ message: 'Stats das suas turmas' });
      case 'Encarregado':
        return res.json({ message: 'Stats dos seus educandos' });
      default:
        return res.status(403).json({ message: 'Acesso negado' });
    }
  }
);

export default router;

/**
 * DICAS DE USO:
 * 
 * 1. authMiddleware SEMPRE primeiro - valida token
 * 2. authorize(...) logo após - valida roles
 * 3. Scope middlewares por último - validações específicas
 * 4. Controller implementa lógica final com filtros adicionais se necessário
 * 
 * ORDEM TÍPICA:
 * authMiddleware → authorize → scope → controller
 * 
 * EXEMPLO COMPLETO:
 * router.get('/turmas/:turmaId/alunos',
 *   authMiddleware,              // 1. Valida token
 *   authorize('Admin', 'Professor'), // 2. Valida role
 *   teacherScope.byTurma(),      // 3. Valida escopo
 *   getAlunosDaTurma             // 4. Controller
 * );
 */
