import { StaffRole, StaffStatus } from '../staff.entity';

/**
 * DTOs para o módulo de Funcionários
 * RF03: Validação de dados de funcionários/docentes
 */

export interface CreateStaffDTO {
  nome_funcionario: string;
  bi?: string;
  nuit?: string;
  nivel_academico?: string;
  funcao: StaffRole;
  email?: string;
  estado?: StaffStatus;
  senha?: string;
  contacto1: string;
  contacto2?: string;
  contacto3?: string;
}

export interface UpdateStaffDTO {
  nome_funcionario?: string;
  bi?: string;
  nuit?: string;
  nivel_academico?: string;
  funcao?: StaffRole;
  email?: string;
  estado?: StaffStatus;
  senha?: string;
  contacto1?: string;
  contacto2?: string;
  contacto3?: string;
}

export interface StaffFilters {
  q?: string;              // Pesquisa por nome, email, BI ou NUIT
  funcao?: StaffRole;      // Filtro por função
  estado?: StaffStatus;    // Filtro por estado
  email?: string;
}
