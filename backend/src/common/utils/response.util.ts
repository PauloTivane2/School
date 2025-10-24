import { Response } from 'express';

/**
 * Classe utilitária para respostas padronizadas da API
 * Garante consistência em todas as respostas do backend
 */
export class ApiResponse {
  /**
   * Resposta de sucesso padrão
   */
  static success(res: Response, data: any, message = 'Operação realizada com sucesso', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Resposta de erro padrão
   */
  static error(res: Response, message = 'Erro ao processar requisição', statusCode = 500, errors?: any) {
    return res.status(statusCode).json({
      success: false,
      error: {
        message,
        details: errors,
      },
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Resposta para criação de recurso (201)
   */
  static created(res: Response, data: any, message = 'Recurso criado com sucesso') {
    return this.success(res, data, message, 201);
  }

  /**
   * Resposta sem conteúdo (204)
   */
  static noContent(res: Response) {
    return res.status(204).send();
  }

  /**
   * Resposta para requisição inválida (400)
   */
  static badRequest(res: Response, message = 'Requisição inválida', errors?: any) {
    return this.error(res, message, 400, errors);
  }

  /**
   * Resposta para não autenticado (401)
   */
  static unauthorized(res: Response, message = 'Não autenticado') {
    return this.error(res, message, 401);
  }

  /**
   * Resposta para sem permissão (403)
   */
  static forbidden(res: Response, message = 'Sem permissão para acessar este recurso') {
    return this.error(res, message, 403);
  }

  /**
   * Resposta para recurso não encontrado (404)
   */
  static notFound(res: Response, message = 'Recurso não encontrado') {
    return this.error(res, message, 404);
  }

  /**
   * Resposta para conflito (409)
   */
  static conflict(res: Response, message = 'Conflito ao processar requisição', errors?: any) {
    return this.error(res, message, 409, errors);
  }

  /**
   * Resposta paginada
   */
  static paginated(
    res: Response, 
    data: any[], 
    total: number, 
    page: number, 
    limit: number, 
    message = 'Dados recuperados com sucesso'
  ) {
    return res.status(200).json({
      success: true,
      message,
      data,
      metadata: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        timestamp: new Date().toISOString(),
      },
    });
  }
}