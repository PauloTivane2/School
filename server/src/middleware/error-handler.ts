// backend/src/shared/middlewares/error-handler.ts
import { Response } from 'express';

interface CustomError extends Error {
  status?: number;
}

export const errorHandler = (err: CustomError, _req: any, res: Response, _next: any) => {
  const statusCode = err.status || 500;
  const message = err.message || 'Erro interno do servidor';

  console.error(`Erro: ${message}`, err.stack);

  res.status(statusCode).json({
    error: 'Erro interno',
    message,
    timestamp: new Date().toISOString(),
  });
};