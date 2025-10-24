export interface CreatePaymentDTO {
  aluno_id: number;
  valor: number;
  metodo: string;
  referencia: string;
  estado: 'pago' | 'pendente' | 'cancelado';
  data_pagamento?: Date;
}

export const validateCreatePaymentDTO = (data: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.aluno_id || typeof data.aluno_id !== 'number') {
    errors.push('ID do aluno é obrigatório');
  }

  if (!data.valor || typeof data.valor !== 'number' || data.valor <= 0) {
    errors.push('Valor deve ser maior que zero');
  }

  if (!data.metodo || typeof data.metodo !== 'string') {
    errors.push('Método de pagamento é obrigatório');
  }

  if (!data.referencia || typeof data.referencia !== 'string') {
    errors.push('Referência é obrigatória');
  }

  if (data.estado && !['pago', 'pendente', 'cancelado'].includes(data.estado)) {
    errors.push('Estado deve ser: pago, pendente ou cancelado');
  }

  return { valid: errors.length === 0, errors };
};
