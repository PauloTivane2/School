export interface Payment {
  id: number;
  aluno_id: number;
  valor: number;
  metodo: string;
  referencia: string;
  estado: 'pago' | 'pendente' | 'cancelado';
  data_pagamento: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface PaymentWithStudent extends Payment {
  nome_aluno?: string;
  turma_nome?: string;
}
