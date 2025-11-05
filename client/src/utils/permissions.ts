/**
 * Sistema de Permissões RBAC
 * Helpers para controle de acesso granular por perfil
 */

import type { Role } from '../context/auth/AuthContext';

/**
 * Mapa de permissões por perfil (RN01, RN04)
 * Define quais ações cada perfil pode executar
 */
export const PERMISSIONS = {
  // Gestão de Alunos
  alunos: {
    view: ['Admin', 'Tesouraria', 'Professor', 'Encarregado'] as Role[],
    create: ['Admin'] as Role[],
    edit: ['Admin'] as Role[],
    delete: ['Admin'] as Role[],
    viewFinancial: ['Admin', 'Tesouraria', 'Encarregado'] as Role[],
  },
  
  // Gestão de Encarregados
  encarregados: {
    view: ['Admin', 'Tesouraria'] as Role[],
    create: ['Admin'] as Role[],
    edit: ['Admin'] as Role[],
    delete: ['Admin'] as Role[],
  },
  
  // Gestão de Funcionários
  funcionarios: {
    view: ['Admin'] as Role[],
    create: ['Admin'] as Role[],
    edit: ['Admin'] as Role[],
    delete: ['Admin'] as Role[],
  },
  
  // Gestão de Turmas
  turmas: {
    view: ['Admin', 'Professor'] as Role[],
    create: ['Admin'] as Role[],
    edit: ['Admin'] as Role[],
    delete: ['Admin'] as Role[],
    viewOwn: ['Professor'] as Role[], // Professor vê apenas suas turmas (RN04)
  },
  
  // Gestão Financeira
  financeiro: {
    view: ['Admin', 'Tesouraria', 'Encarregado'] as Role[],
    create: ['Admin', 'Tesouraria'] as Role[],
    edit: ['Admin', 'Tesouraria'] as Role[],
    delete: ['Admin'] as Role[],
    viewOwn: ['Encarregado'] as Role[], // Encarregado vê apenas seus educandos (RN01)
  },
  
  // Gestão de Presenças
  presencas: {
    view: ['Admin', 'Professor', 'Encarregado'] as Role[],
    create: ['Admin', 'Professor'] as Role[],
    edit: ['Admin', 'Professor'] as Role[],
    delete: ['Admin'] as Role[],
    viewOwn: ['Professor', 'Encarregado'] as Role[], // RN04
  },
  
  // Gestão de Notas
  notas: {
    view: ['Admin', 'Professor', 'Encarregado'] as Role[],
    create: ['Admin', 'Professor'] as Role[],
    edit: ['Admin', 'Professor'] as Role[],
    delete: ['Admin'] as Role[],
    viewOwn: ['Professor', 'Encarregado'] as Role[], // RN04
  },
  
  // Gestão de Exames
  exames: {
    view: ['Admin', 'Encarregado'] as Role[], // Admin: gestão; Encarregado: view educandos (BLOQUEADO: Professor, Tesouraria)
    create: ['Admin'] as Role[],
    edit: ['Admin'] as Role[],
    delete: ['Admin'] as Role[],
  },
  
  // Relatórios
  relatorios: {
    viewAll: ['Admin'] as Role[],
    viewFinancial: ['Admin', 'Tesouraria'] as Role[],
    viewPedagogical: ['Admin', 'Professor'] as Role[],
    viewOwn: ['Encarregado'] as Role[],
  },
  
  // Configurações do Sistema
  settings: {
    view: ['Admin'] as Role[],
    edit: ['Admin'] as Role[],
  },
} as const;

/**
 * Verifica se um perfil tem permissão para uma ação específica
 * @param userRole - Perfil do usuário atual
 * @param module - Módulo do sistema
 * @param action - Ação a ser verificada
 * @returns boolean indicando se tem permissão
 */
export function hasPermission(
  userRole: Role | null | undefined,
  module: keyof typeof PERMISSIONS,
  action: string
): boolean {
  if (!userRole) return false;
  
  const modulePermissions = PERMISSIONS[module];
  if (!modulePermissions) return false;
  
  const actionRoles = modulePermissions[action as keyof typeof modulePermissions] as readonly Role[] | undefined;
  if (!actionRoles || !Array.isArray(actionRoles)) return false;
  
  return (actionRoles as Role[]).includes(userRole);
}

/**
 * Filtra uma lista de ações baseado nas permissões do usuário
 * @param userRole - Perfil do usuário atual
 * @param module - Módulo do sistema
 * @param actions - Lista de ações possíveis
 * @returns Lista de ações permitidas
 */
export function filterActions(
  userRole: Role | null | undefined,
  module: keyof typeof PERMISSIONS,
  actions: string[]
): string[] {
  if (!userRole) return [];
  return actions.filter(action => hasPermission(userRole, module, action));
}

/**
 * Verifica se o usuário tem acesso apenas aos seus próprios dados (RN01, RN04)
 * @param userRole - Perfil do usuário atual
 * @returns boolean indicando se tem acesso restrito
 */
export function hasRestrictedAccess(userRole: Role | null | undefined): boolean {
  if (!userRole) return true;
  return ['Professor', 'Encarregado'].includes(userRole);
}

/**
 * Retorna mensagem de erro apropriada para acesso negado
 * @param userRole - Perfil do usuário atual
 * @returns Mensagem de erro
 */
export function getAccessDeniedMessage(userRole: Role | null | undefined): string {
  if (!userRole) return 'Você precisa estar autenticado para acessar este recurso.';
  
  switch (userRole) {
    case 'Professor':
      return 'Professores podem acessar apenas suas próprias turmas e alunos (RN04).';
    case 'Encarregado':
      return 'Encarregados podem visualizar apenas informações dos seus educandos (RN01).';
    case 'Tesouraria':
      return 'Tesouraria tem acesso apenas ao módulo financeiro.';
    default:
      return 'Você não tem permissão para acessar este recurso.';
  }
}

/**
 * Componente de verificação de permissão
 * Pode ser usado como wrapper para renderizar condicionalmente
 */
export interface PermissionGuardProps {
  userRole: Role | null | undefined;
  module: keyof typeof PERMISSIONS;
  action: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Helper para gerar descrição de permissões de um módulo
 * Útil para documentação e debugging
 */
export function describeModulePermissions(module: keyof typeof PERMISSIONS): Record<string, Role[]> {
  return PERMISSIONS[module] as Record<string, Role[]>;
}
