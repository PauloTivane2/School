import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../shared/utils/response.util';

/**
 * Classe personalizada para erros da aplicação
 */
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true,
    public details?: any
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Middleware global de tratamento de erros
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Log do erro
  console.error('❌ Erro capturado:', {
    name: err.name,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  // Se for um erro da aplicação
  if (err instanceof AppError) {
    return ApiResponse.error(res, err.message, err.statusCode, err.details);
  }

  // Erros de validação
  if (err.name === 'ValidationError') {
    return ApiResponse.badRequest(res, 'Erro de validação', err.message);
  }

  // Erro de sintaxe JSON
  if (err instanceof SyntaxError && 'body' in err) {
    return ApiResponse.badRequest(res, 'JSON inválido');
  }

  // Erro genérico
  return ApiResponse.error(
    res,
    process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'Erro interno do servidor',
    500,
    process.env.NODE_ENV === 'development' ? err.stack : undefined
  );
};

/**
 * Middleware para capturar erros assíncronos
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
