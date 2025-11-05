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
 * RN05: Comprehensive Audit Logging Middleware
 * Logs all critical operations for compliance and security
 */

interface AuditLogEntry {
  user_id?: number;
  user_email?: string;
  user_role?: string;
  action: string;
  resource: string;
  resource_id?: string;
  method: string;
  path: string;
  status_code?: number;
  ip_address?: string;
  user_agent?: string;
  request_body?: any;
  response_data?: any;
  changes?: any;
  error_message?: string;
}

/**
 * Resources that require audit logging
 */
const AUDITED_RESOURCES = [
  '/api/payments',
  '/api/grades',
  '/api/students',
  '/api/guardians',
  '/api/staff',
  '/api/funcionarios',
  '/api/attendance',
  '/api/exams',
  '/api/auth',
];

/**
 * Sensitive fields that should be redacted from logs
 */
const SENSITIVE_FIELDS = ['password', 'senha', 'senha_hash', 'token', 'api_key'];

/**
 * Redact sensitive information from objects
 */
const redactSensitiveData = (obj: any): any => {
  if (!obj || typeof obj !== 'object') return obj;

  const redacted = Array.isArray(obj) ? [...obj] : { ...obj };

  for (const key in redacted) {
    if (SENSITIVE_FIELDS.some((field) => key.toLowerCase().includes(field))) {
      redacted[key] = '***REDACTED***';
    } else if (typeof redacted[key] === 'object') {
      redacted[key] = redactSensitiveData(redacted[key]);
    }
  }

  return redacted;
};

/**
 * Determine if a request should be audited
 */
const shouldAudit = (path: string, method: string): boolean => {
  // Always audit modifications (POST, PUT, PATCH, DELETE)
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    return AUDITED_RESOURCES.some((resource) => path.startsWith(resource));
  }

  // Audit sensitive GET requests
  if (method === 'GET') {
    return (
      path.includes('/payments') ||
      path.includes('/grades') ||
      path.includes('/staff') ||
      path.includes('/funcionarios')
    );
  }

  return false;
};

/**
 * Extract resource name and ID from path
 */
const extractResourceInfo = (path: string): { resource: string; resourceId?: string } => {
  const parts = path.split('/').filter(Boolean);
  const resource = parts[1] || 'unknown'; // api/[resource]
  const resourceId = parts[2] && !isNaN(Number(parts[2])) ? parts[2] : undefined;
  return { resource, resourceId };
};

/**
 * Create audit log entry in database
 */
const createAuditLog = async (entry: AuditLogEntry): Promise<void> => {
  try {
    await pool.query(
      `INSERT INTO audit_logs 
       (user_id, user_email, user_role, action, resource, resource_id, method, path, 
        status_code, ip_address, user_agent, request_body, response_data, changes, error_message, timestamp)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW())`,
      [
        entry.user_id,
        entry.user_email,
        entry.user_role,
        entry.action,
        entry.resource,
        entry.resource_id,
        entry.method,
        entry.path,
        entry.status_code,
        entry.ip_address,
        entry.user_agent,
        entry.request_body ? JSON.stringify(redactSensitiveData(entry.request_body)) : null,
        entry.response_data ? JSON.stringify(redactSensitiveData(entry.response_data)) : null,
        entry.changes ? JSON.stringify(entry.changes) : null,
        entry.error_message,
      ]
    );
  } catch (error) {
    console.error('❌ Erro ao criar log de auditoria:', error);
    // Don't throw - audit logging failure shouldn't break the request
  }
};

/**
 * Audit logging middleware
 */
export const auditLogMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const startTime = Date.now();

  // Check if this request should be audited
  if (!shouldAudit(req.path, req.method)) {
    next();
    return;
  }

  const { resource, resourceId } = extractResourceInfo(req.path);

  // Capture original res.json to intercept response
  const originalJson = res.json.bind(res);
  let responseData: any = null;

  res.json = function (data: any) {
    responseData = data;
    return originalJson(data);
  };

  // After response is sent
  res.on('finish', async () => {
    const duration = Date.now() - startTime;

    const action = getActionFromMethod(req.method);
    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    const logEntry: AuditLogEntry = {
      user_id: req.user?.userId,
      user_email: req.user?.email,
      user_role: req.user?.role,
      action,
      resource,
      resource_id: resourceId,
      method: req.method,
      path: req.path,
      status_code: res.statusCode,
      ip_address: ipAddress,
      user_agent: userAgent,
      request_body: req.body,
      response_data: responseData,
    };

    // Add error message for failed requests
    if (res.statusCode >= 400) {
      logEntry.error_message = responseData?.error?.message || responseData?.message || 'Request failed';
    }

    await createAuditLog(logEntry);

    // Console log for important operations
    if (res.statusCode >= 400 || ['DELETE', 'PUT', 'PATCH'].includes(req.method)) {
      console.log(
        `🔍 AUDIT LOG [${res.statusCode}] ${req.method} ${req.path} | User: ${req.user?.email} (${req.user?.role}) | Duration: ${duration}ms`
      );
    }
  });

  next();
};

/**
 * Get action description from HTTP method
 */
const getActionFromMethod = (method: string): string => {
  const actionMap: Record<string, string> = {
    POST: 'create',
    GET: 'read',
    PUT: 'update',
    PATCH: 'update',
    DELETE: 'delete',
  };
  return actionMap[method] || 'unknown';
};

/**
 * Financial operations audit middleware
 * RN05: Special audit trail for financial operations
 */
export const financialAuditMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Only for financial operations
  if (!req.path.includes('/payments') && !req.path.includes('/pagamentos')) {
    next();
    return;
  }

  const originalJson = res.json.bind(res);

  res.json = function (data: any) {
    // Log financial operation details
    if (res.statusCode >= 200 && res.statusCode < 300) {
      pool
        .query(
          `INSERT INTO financial_audit_logs 
           (user_id, operation_type, amount, payment_id, student_id, description, timestamp)
           VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
          [
            req.user?.userId,
            req.method,
            req.body?.valor || req.body?.amount,
            req.body?.id_pagamento || data?.data?.id,
            req.body?.id_aluno || req.body?.student_id,
            `${req.method} ${req.path}`,
          ]
        )
        .catch((err) => console.error('Erro ao criar log financeiro:', err));
    }

    return originalJson(data);
  };

  next();
};

/**
 * Grade changes audit middleware
 * RN05: Track all modifications to student grades
 */
export const gradeAuditMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Only for grade operations
  if (!req.path.includes('/grades') && !req.path.includes('/notas')) {
    next();
    return;
  }

  // For updates, fetch old values before modification
  let oldGrade: any = null;
  if (req.method === 'PUT' || req.method === 'PATCH') {
    const gradeId = req.params.id || req.body.id;
    if (gradeId) {
      try {
        const result = await pool.query('SELECT * FROM notas WHERE id_nota = $1', [gradeId]);
        oldGrade = result.rows[0];
      } catch (error) {
        console.error('Erro ao buscar nota antiga:', error);
      }
    }
  }

  const originalJson = res.json.bind(res);

  res.json = function (data: any) {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      // Log grade changes with before/after values
      const changes = oldGrade
        ? {
            before: oldGrade,
            after: req.body,
            modified_by: req.user?.userId,
            modified_at: new Date().toISOString(),
          }
        : null;

      pool
        .query(
          `INSERT INTO grade_audit_logs 
           (user_id, operation_type, grade_id, student_id, subject_id, old_value, new_value, changes, timestamp)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
          [
            req.user?.userId,
            req.method,
            req.params.id || req.body.id,
            req.body.id_aluno || oldGrade?.id_aluno,
            req.body.id_disciplina || oldGrade?.id_disciplina,
            oldGrade?.nota,
            req.body.nota,
            changes ? JSON.stringify(changes) : null,
          ]
        )
        .catch((err) => console.error('Erro ao criar log de notas:', err));
    }

    return originalJson(data);
  };

  next();
};

/**
 * Authentication audit middleware
 * Already implemented in auth.service.ts, but this provides additional logging
 */
export const authAuditMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.path.includes('/auth')) {
    next();
    return;
  }

  const originalJson = res.json.bind(res);

  res.json = function (data: any) {
    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;

    // Log authentication attempts
    console.log(
      `🔐 AUTH LOG [${res.statusCode}] ${req.method} ${req.path} | IP: ${ipAddress} | Status: ${
        res.statusCode >= 200 && res.statusCode < 300 ? 'SUCCESS' : 'FAILED'
      }`
    );

    return originalJson(data);
  };

  next();
};
