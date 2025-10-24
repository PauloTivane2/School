import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../shared/utils/response.util';

/**
 * Interface para esquemas de validação
 */
export interface ValidationSchema {
  body?: any;
  query?: any;
  params?: any;
}

/**
 * Middleware de validação genérico
 * Valida body, query e params da requisição
 */
export const validate = (schema: ValidationSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors: any = {};

      // Validar body
      if (schema.body) {
        const { error } = schema.body.validate(req.body, { abortEarly: false });
        if (error) {
          errors.body = error.details.map((detail: any) => ({
            field: detail.path.join('.'),
            message: detail.message,
          }));
        }
      }

      // Validar query
      if (schema.query) {
        const { error } = schema.query.validate(req.query, { abortEarly: false });
        if (error) {
          errors.query = error.details.map((detail: any) => ({
            field: detail.path.join('.'),
            message: detail.message,
          }));
        }
      }

      // Validar params
      if (schema.params) {
        const { error } = schema.params.validate(req.params, { abortEarly: false });
        if (error) {
          errors.params = error.details.map((detail: any) => ({
            field: detail.path.join('.'),
            message: detail.message,
          }));
        }
      }

      // Se houver erros, retornar
      if (Object.keys(errors).length > 0) {
        return ApiResponse.badRequest(res, 'Erro de validação', errors);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Validação simples de ID numérico
 */
export const validateId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  
  if (!id || isNaN(Number(id))) {
    return ApiResponse.badRequest(res, 'ID inválido');
  }
  
  next();
};
