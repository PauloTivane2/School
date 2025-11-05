import { Request, Response, NextFunction } from 'express';
import { pool } from '../config/database';

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    role: string;
    email?: string;
    funcao?: string;
  };
}

/**
 * RN02: Age Validation Middleware
 * Blocks minor students from accessing the system
 */
export const ageValidationMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: 'Não autenticado' });
      return;
    }

    // Check if user is a student
    const studentCheck = await pool.query(
      'SELECT id_alunos, data_nascimento FROM alunos WHERE id_alunos = $1',
      [userId]
    );

    if (studentCheck.rows.length > 0) {
      const student = studentCheck.rows[0];
      const birthDate = new Date(student.data_nascimento);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      // Calculate exact age
      const exactAge =
        monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())
          ? age - 1
          : age;

      // RN02: Block students under 18
      if (exactAge < 18) {
        // Log blocked access attempt
        try {
          await pool.query(
            'INSERT INTO auth_logs (user_id, email, status, motivo, details) VALUES ($1, $2, $3, $4, $5)',
            [
              userId,
              req.user?.email,
              'bloqueado',
              'estudante_menor_idade',
              JSON.stringify({ idade: exactAge }),
            ]
          );
        } catch (logError) {
          console.error('Erro ao registrar log de bloqueio:', logError);
        }

        res.status(403).json({
          message: 'Acesso negado para estudantes menores de idade',
          code: 'MINOR_STUDENT_BLOCKED',
        });
        return;
      }
    }

    next();
  } catch (error) {
    console.error('Erro na validação de idade:', error);
    res.status(500).json({ message: 'Erro ao validar permissões' });
  }
};

/**
 * RN01: Principle of Least Privilege
 * Enhanced role-based authorization with granular permissions
 */
export const authorize = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Não autenticado' });
      return;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
      // Log unauthorized access attempt
      pool
        .query(
          'INSERT INTO auth_logs (user_id, email, status, motivo, details) VALUES ($1, $2, $3, $4, $5)',
          [
            req.user.userId,
            req.user.email,
            'negado',
            'permissao_insuficiente',
            JSON.stringify({
              role: req.user.role,
              required: allowedRoles,
              path: req.path,
              method: req.method,
            }),
          ]
        )
        .catch((err) => console.error('Erro ao registrar log de acesso negado:', err));

      res.status(403).json({
        message: 'Acesso negado',
        code: 'INSUFFICIENT_PERMISSIONS',
      });
      return;
    }

    next();
  };
};

/**
 * RN04: Teacher Scope Middleware
 * Ensures teachers can only access their own classes and students
 */
export const teacherScopeMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.user?.role !== 'Professor') {
      // Admin can access everything
      next();
      return;
    }

    const teacherId = req.user.userId;
    const requestedClassId = req.params.classId || req.query.classId || req.body.classId;
    const requestedStudentId = req.params.studentId || req.query.studentId || req.body.studentId;

    // If accessing a specific class, verify teacher teaches that class
    if (requestedClassId) {
      const classCheck = await pool.query(
        `SELECT COUNT(*) as count 
         FROM turmas 
         WHERE id_turma = $1 AND id_professor = $2`,
        [requestedClassId, teacherId]
      );

      if (parseInt(classCheck.rows[0].count) === 0) {
        res.status(403).json({
          message: 'Acesso negado: Você não leciona esta turma',
          code: 'CLASS_ACCESS_DENIED',
        });
        return;
      }
    }

    // If accessing a specific student, verify student is in teacher's classes
    if (requestedStudentId) {
      const studentCheck = await pool.query(
        `SELECT COUNT(*) as count 
         FROM alunos a
         JOIN turmas t ON a.id_turma = t.id_turma
         WHERE a.id_alunos = $1 AND t.id_professor = $2`,
        [requestedStudentId, teacherId]
      );

      if (parseInt(studentCheck.rows[0].count) === 0) {
        res.status(403).json({
          message: 'Acesso negado: Este aluno não está em suas turmas',
          code: 'STUDENT_ACCESS_DENIED',
        });
        return;
      }
    }

    next();
  } catch (error) {
    console.error('Erro no middleware de escopo de professor:', error);
    res.status(500).json({ message: 'Erro ao validar permissões' });
  }
};

/**
 * Guardian Scope Middleware
 * Ensures guardians can only access their own wards
 */
export const guardianScopeMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.user?.role !== 'Encarregado') {
      // Admin and staff can access everything
      next();
      return;
    }

    const guardianId = req.user.userId;
    const requestedStudentId = req.params.studentId || req.query.studentId || req.body.studentId;

    if (requestedStudentId) {
      const wardCheck = await pool.query(
        `SELECT COUNT(*) as count 
         FROM alunos 
         WHERE id_alunos = $1 AND id_encarregado = $2`,
        [requestedStudentId, guardianId]
      );

      if (parseInt(wardCheck.rows[0].count) === 0) {
        res.status(403).json({
          message: 'Acesso negado: Você não é responsável por este aluno',
          code: 'WARD_ACCESS_DENIED',
        });
        return;
      }
    }

    next();
  } catch (error) {
    console.error('Erro no middleware de escopo de encarregado:', error);
    res.status(500).json({ message: 'Erro ao validar permissões' });
  }
};

/**
 * Resource-based permission checker
 * Maps resources to allowed actions per role
 */
interface ResourcePermission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete';
  roles: string[];
}

const resourcePermissions: ResourcePermission[] = [
  // Students
  { resource: 'students', action: 'create', roles: ['Admin'] },
  { resource: 'students', action: 'read', roles: ['Admin', 'Professor', 'Tesouraria', 'Encarregado'] },
  { resource: 'students', action: 'update', roles: ['Admin'] },
  { resource: 'students', action: 'delete', roles: ['Admin'] },

  // Guardians
  { resource: 'guardians', action: 'create', roles: ['Admin'] },
  { resource: 'guardians', action: 'read', roles: ['Admin', 'Tesouraria', 'Encarregado'] },
  { resource: 'guardians', action: 'update', roles: ['Admin'] },
  { resource: 'guardians', action: 'delete', roles: ['Admin'] },

  // Staff
  { resource: 'staff', action: 'create', roles: ['Admin'] },
  { resource: 'staff', action: 'read', roles: ['Admin'] },
  { resource: 'staff', action: 'update', roles: ['Admin'] },
  { resource: 'staff', action: 'delete', roles: ['Admin'] },

  // Classes
  { resource: 'classes', action: 'create', roles: ['Admin'] },
  { resource: 'classes', action: 'read', roles: ['Admin', 'Professor'] },
  { resource: 'classes', action: 'update', roles: ['Admin'] },
  { resource: 'classes', action: 'delete', roles: ['Admin'] },

  // Payments
  { resource: 'payments', action: 'create', roles: ['Admin', 'Tesouraria'] },
  { resource: 'payments', action: 'read', roles: ['Admin', 'Tesouraria', 'Encarregado'] },
  { resource: 'payments', action: 'update', roles: ['Admin', 'Tesouraria'] },
  { resource: 'payments', action: 'delete', roles: ['Admin'] },

  // Attendance
  { resource: 'attendance', action: 'create', roles: ['Admin', 'Professor'] },
  { resource: 'attendance', action: 'read', roles: ['Admin', 'Professor', 'Encarregado'] },
  { resource: 'attendance', action: 'update', roles: ['Admin', 'Professor'] },
  { resource: 'attendance', action: 'delete', roles: ['Admin'] },

  // Grades
  { resource: 'grades', action: 'create', roles: ['Admin', 'Professor'] },
  { resource: 'grades', action: 'read', roles: ['Admin', 'Professor', 'Encarregado'] },
  { resource: 'grades', action: 'update', roles: ['Admin', 'Professor'] },
  { resource: 'grades', action: 'delete', roles: ['Admin'] },

  // Exams
  { resource: 'exams', action: 'create', roles: ['Admin'] },
  { resource: 'exams', action: 'read', roles: ['Admin', 'Encarregado'] },
  { resource: 'exams', action: 'update', roles: ['Admin'] },
  { resource: 'exams', action: 'delete', roles: ['Admin'] },

  // Reports
  { resource: 'reports', action: 'read', roles: ['Admin', 'Professor', 'Tesouraria'] },
];

export const checkResourcePermission = (resource: string, action: 'create' | 'read' | 'update' | 'delete') => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Não autenticado' });
      return;
    }

    const permission = resourcePermissions.find(
      (p) => p.resource === resource && p.action === action
    );

    if (!permission || !permission.roles.includes(req.user.role)) {
      res.status(403).json({
        message: `Permissão negada para ${action} em ${resource}`,
        code: 'RESOURCE_PERMISSION_DENIED',
      });
      return;
    }

    next();
  };
};
