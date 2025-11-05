import { GuardiansRepository } from './guardians.repository';
import { Guardian, GuardianWithRelations } from './guardian.entity';
import { CreateGuardianDTO, UpdateGuardianDTO, GuardianFilters } from './dto';
import { pool } from '../../config/database';
import { PDFService } from '../../services/pdf.service';
import { MpesaPaymentService } from '../../services/mpesa-payment.service';
import { Response } from 'express';

/**
 * Service para lógica de negócio relacionada a Encarregados
 * RF02: Criar/editar/eliminar encarregado
 */
export class GuardiansService {
  private repository: GuardiansRepository;

  constructor() {
    this.repository = new GuardiansRepository();
  }

  /**
   * Listar todos os encarregados com filtros
   */
  async findAll(filters: GuardianFilters): Promise<GuardianWithRelations[]> {
    return await this.repository.findAll(filters);
  }

  /**
   * Buscar encarregado por ID
   */
  async findById(id: number): Promise<Guardian> {
    const guardian = await this.repository.findById(id);

    if (!guardian) {
      throw new Error(`Encarregado com ID ${id} não encontrado`);
    }

    return guardian;
  }

  /**
   * Criar novo encarregado
   */
  async create(data: CreateGuardianDTO): Promise<Guardian> {
    // Validações
    if (!data.nome || data.nome.trim() === '') {
      throw new Error('Nome do encarregado é obrigatório');
    }

    if (!data.contacto1 || data.contacto1.trim() === '') {
      throw new Error('Pelo menos um contacto é obrigatório');
    }

    // Validar email se fornecido
    if (data.email && !this.isValidEmail(data.email)) {
      throw new Error('Email inválido');
    }

    // Verificar se email já existe
    if (data.email) {
      const existingGuardians = await this.repository.findAll({ email: data.email });
      if (existingGuardians.length > 0) {
        throw new Error('Email já cadastrado para outro encarregado');
      }
    }

    return await this.repository.create(data);
  }

  /**
   * Atualizar encarregado existente
   */
  async update(id: number, data: UpdateGuardianDTO): Promise<Guardian> {
    // Verificar se encarregado existe
    await this.findById(id);

    // Validações
    if (data.nome !== undefined && data.nome.trim() === '') {
      throw new Error('Nome do encarregado não pode ser vazio');
    }

    // Validar email se fornecido
    if (data.email && !this.isValidEmail(data.email)) {
      throw new Error('Email inválido');
    }

    // Verificar se email já existe (exceto para o próprio encarregado)
    if (data.email) {
      const existingGuardians = await this.repository.findAll({ email: data.email });
      const duplicate = existingGuardians.find(g => g.id_encarregados !== id);
      if (duplicate) {
        throw new Error('Email já cadastrado para outro encarregado');
      }
    }

    const updated = await this.repository.update(id, data);

    if (!updated) {
      throw new Error(`Erro ao atualizar encarregado ${id}`);
    }

    return updated;
  }

  /**
   * Deletar encarregado
   */
  async delete(id: number): Promise<void> {
    // Verificar se encarregado existe
    await this.findById(id);

    const deleted = await this.repository.delete(id);

    if (!deleted) {
      throw new Error(`Erro ao deletar encarregado ${id}`);
    }
  }

  /**
   * Contar encarregados
   */
  async count(filters: GuardianFilters = {}): Promise<number> {
    return await this.repository.count(filters);
  }

  /**
   * Validar formato de email
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Mapear ID do funcionário para ID do encarregado (via email)
   * @param funcionarioId - ID do funcionário (tabela funcionarios)
   * @returns ID do encarregado (tabela encarregados)
   */
  private async mapFuncionarioToEncarregado(funcionarioId: number): Promise<number> {
    // Buscar email do funcionário
    const funcionario = await pool.query(
      'SELECT email FROM funcionarios WHERE id_funcionarios = $1',
      [funcionarioId]
    );
    
    if (funcionario.rows.length === 0) {
      throw new Error('Funcionário não encontrado');
    }
    
    const email = funcionario.rows[0].email;
    
    // Buscar encarregado pelo email
    const encarregado = await pool.query(
      'SELECT id_encarregados FROM encarregados WHERE email = $1',
      [email]
    );
    
    if (encarregado.rows.length === 0) {
      throw new Error('Encarregado não encontrado no sistema. Verifique se o cadastro está completo.');
    }
    
    return encarregado.rows[0].id_encarregados;
  }

  /**
   * Obter alunos de um encarregado específico
   * RN: Encarregado só vê seus próprios educandos
   */
  async getGuardianStudents(guardianId: number): Promise<any[]> {
    return await this.repository.getGuardianStudents(guardianId);
  }

  /**
   * Obter dashboard do encarregado
   * Contém: resumo dos alunos, alertas, próximos eventos
   * @param funcionarioId - ID do funcionário (login)
   */
  async getGuardianDashboard(funcionarioId: number): Promise<any> {
    const guardianId = await this.mapFuncionarioToEncarregado(funcionarioId);
    return await this.repository.getGuardianDashboard(guardianId);
  }

  /**
   * Obter notas de um aluno (verificando se é educando do encarregado)
   */
  async getStudentGrades(guardianId: number, studentId: number): Promise<any[]> {
    // Verificar se o aluno pertence ao encarregado
    await this.verifyStudentOwnership(guardianId, studentId);
    return await this.repository.getStudentGrades(studentId);
  }

  /**
   * Obter presenças de um aluno (verificando se é educando do encarregado)
   */
  async getStudentAttendance(guardianId: number, studentId: number): Promise<any[]> {
    await this.verifyStudentOwnership(guardianId, studentId);
    return await this.repository.getStudentAttendance(studentId);
  }

  /**
   * Obter pagamentos de um aluno (verificando se é educando do encarregado)
   */
  async getStudentPayments(guardianId: number, studentId: number): Promise<any[]> {
    await this.verifyStudentOwnership(guardianId, studentId);
    return await this.repository.getStudentPayments(studentId);
  }

  /**
   * Obter exames de um aluno (verificando se é educando do encarregado)
   */
  async getStudentExams(guardianId: number, studentId: number): Promise<any[]> {
    await this.verifyStudentOwnership(guardianId, studentId);
    return await this.repository.getStudentExams(studentId);
  }

  /**
   * Exportar relatório de um aluno em PDF
   */
  async exportStudentReport(
    funcionarioId: number,
    studentId: number,
    type: 'completo' | 'presencas' | 'pagamentos',
    res: Response
  ): Promise<void> {
    // Mapear funcionario para encarregado
    const guardianId = await this.mapFuncionarioToEncarregado(funcionarioId);
    
    // Verificar se o aluno pertence ao encarregado
    await this.verifyStudentOwnership(guardianId, studentId);
    
    // Buscar dados do aluno
    const students = await this.repository.getGuardianStudents(guardianId);
    const student = students.find(s => s.id_aluno === studentId);
    
    if (!student) {
      throw new Error('Aluno não encontrado');
    }
    
    // Buscar dados baseados no tipo de relatório
    const payments = type === 'completo' || type === 'pagamentos' 
      ? await this.repository.getStudentPayments(studentId)
      : [];
    
    const attendance = type === 'completo' || type === 'presencas'
      ? await this.repository.getStudentAttendance(studentId)
      : [];
    
    // Gerar PDF
    switch (type) {
      case 'completo':
        await PDFService.generateCompleteReport(student, payments, attendance, res);
        break;
      case 'pagamentos':
        await PDFService.generatePaymentsReport(student, payments, res);
        break;
      case 'presencas':
        await PDFService.generateAttendanceReport(student, attendance, res);
        break;
    }
  }

  /**
   * Processar pagamento M-Pesa para mensalidade
   */
  async processMpesaPayment(
    funcionarioId: number,
    studentId: number,
    amount: number,
    msisdn: string,
    walletId: string,
    reference?: string
  ): Promise<any> {
    // Mapear funcionario para encarregado
    const guardianId = await this.mapFuncionarioToEncarregado(funcionarioId);
    
    // Verificar se o aluno pertence ao encarregado
    await this.verifyStudentOwnership(guardianId, studentId);
    
    // Processar pagamento M-Pesa
    const mpesaService = new MpesaPaymentService();
    
    const paymentResult = await mpesaService.handleC2BPayment({
      walletId,
      amount,
      msisdn,
      reference: reference || `MENSALIDADE-${studentId}-${Date.now()}`,
      third_party_reference: `ALUNO-${studentId}`
    });
    
    if (paymentResult.success) {
      // Registrar pagamento no banco de dados
      try {
        await pool.query(
          `INSERT INTO pagamentos (aluno_id, valor, data_pagamento, estado, metodo_pagamento, referencia)
           VALUES ($1, $2, NOW(), $3, 'M-Pesa', $4)`,
          [studentId, amount, 'pago', paymentResult.transaction_id]
        );
      } catch (dbError) {
        console.error('Erro ao registrar pagamento no BD:', dbError);
      }
    }
    
    return paymentResult;
  }

  /**
   * Obter carteiras M-Pesa disponíveis
   */
  async getMpesaWallets(): Promise<any> {
    const mpesaService = new MpesaPaymentService();
    const result = await mpesaService.getMyWallets();
    
    // Se falhar, retornar carteira de teste para desenvolvimento
    if (!result.success || !result.wallets || result.wallets.length === 0) {
      console.warn('⚠️ Usando carteira de teste (API M-Pesa não disponível)');
      return {
        success: true,
        wallets: [
          {
            id: 'test-wallet-1',
            name: 'Carteira Teste',
            number: '258840000000',
            balance: 0
          }
        ]
      };
    }
    
    return result;
  }

  /**
   * Verificar se o aluno pertence ao encarregado
   * Lança erro se não pertencer
   */
  private async verifyStudentOwnership(guardianId: number, studentId: number): Promise<void> {
    const isOwner = await this.repository.isStudentOwnedByGuardian(guardianId, studentId);
    if (!isOwner) {
      throw new Error('Você não tem permissão para acessar dados deste aluno');
    }
  }
}
