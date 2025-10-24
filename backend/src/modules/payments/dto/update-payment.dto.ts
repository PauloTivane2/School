export interface UpdatePaymentDTO {
  aluno_id?: number;
  valor?: number;
  metodo?: string;
  referencia?: string;
  estado?: 'pago' | 'pendente' | 'cancelado';
  data_pagamento?: Date;
}
