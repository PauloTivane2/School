import api from './api';

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  date: string;
  method: 'cash' | 'transfer' | 'mpesa' | 'card';
  reference?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface CreatePaymentDTO {
  studentId: string;
  amount: number;
  method: string;
  reference?: string;
}

class PaymentService {
  async getAll(filters?: { startDate?: string; endDate?: string; status?: string }): Promise<Payment[]> {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.status) params.append('status', filters.status);
    
    const response = await api.get(`/payments?${params.toString()}`);
    return response.data.data;
  }

  async getByStudent(studentId: string): Promise<Payment[]> {
    const response = await api.get(`/payments/student/${studentId}`);
    return response.data.data;
  }

  async create(data: CreatePaymentDTO): Promise<Payment> {
    const response = await api.post('/payments', data);
    return response.data.data;
  }

  async updateStatus(id: string, status: string): Promise<Payment> {
    const response = await api.patch(`/payments/${id}/status`, { status });
    return response.data.data;
  }

  async getFinancialReport(startDate: string, endDate: string) {
    const response = await api.get(`/payments/report?startDate=${startDate}&endDate=${endDate}`);
    return response.data.data;
  }
}

export default new PaymentService();