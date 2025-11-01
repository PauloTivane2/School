export interface CreatePaymentDTO {
  aluno_id: number;
  valor: number;
  metodo?: string;
  referencia?: string;
  estado?: 'pago' | 'pendente' | 'cancelado';
  data_pagamento?: Date;
}

export interface UpdatePaymentDTO {
  valor?: number;
  metodo?: string;
  referencia?: string;
  estado?: 'pago' | 'pendente' | 'cancelado';
  data_pagamento?: Date;
}

export function validateCreatePaymentDTO(data: any): CreatePaymentDTO {
  if (!data.aluno_id || typeof data.aluno_id !== 'number') {
    throw new Error('ID do aluno é obrigatório e deve ser um número');
  }
  if (!data.valor || typeof data.valor !== 'number' || data.valor <= 0) {
    throw new Error('Valor é obrigatório e deve ser um número positivo');
  }
  return data as CreatePaymentDTO;
}
