/**
 * Interface padronizada para respostas da API
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  metadata?: {
    total?: number;
    page?: number;
    limit?: number;
    timestamp?: string;
  };
}

/**
 * Interface para respostas paginadas
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  metadata: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    timestamp: string;
  };
}
