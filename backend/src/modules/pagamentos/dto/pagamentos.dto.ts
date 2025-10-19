export interface PaymentDto {
  id: string;
  amount: number;
  date: Date;
  description?: string;
  studentId: string;
  status: 'pending' | 'paid' | 'cancelled';
}

export interface CreatePaymentDto {
  amount: number;
  date: Date;
  description?: string;
  studentId: string;
  status?: 'pending' | 'paid' | 'cancelled';
}

export interface UpdatePaymentDto {
  amount?: number;
  date?: Date;
  description?: string;
  status?: 'pending' | 'paid' | 'cancelled';
}