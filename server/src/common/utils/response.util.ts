import { Response } from 'express';

/**
 * Utilitário para respostas padronizadas da API
 */
export class ApiResponse {
  /**
   * Resposta de sucesso (200)
   */
  static success(res: Response, data: any, message: string = 'Operação realizada com sucesso') {
    return res.status(200).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Resposta de criação (201)
   */
  static created(res: Response, data: any, message: string = 'Recurso criado com sucesso') {
    return res.status(201).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Resposta de erro (personalizado)
   */
  static error(res: Response, message: string, statusCode: number = 500, errors?: any) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Resposta não encontrado (404)
   */
  static notFound(res: Response, message: string = 'Recurso não encontrado') {
    return res.status(404).json({
      success: false,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
