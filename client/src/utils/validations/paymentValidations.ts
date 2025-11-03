/**
 * Validações para Pagamentos
 * Validações robustas para formulário de pagamentos
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Valida se o valor é um número inteiro maior que 0
 */
export const validateAmount = (value: number): ValidationResult => {
  // Verifica se é um número válido
  if (isNaN(value) || value === null || value === undefined) {
    return {
      isValid: false,
      error: 'Por favor, insira um valor válido.'
    };
  }

  // Verifica se é maior que 0
  if (value <= 0) {
    return {
      isValid: false,
      error: 'O valor deve ser maior que 0.'
    };
  }

  // Verifica se é um número inteiro
  if (!Number.isInteger(value)) {
    return {
      isValid: false,
      error: 'O valor deve ser um número inteiro (sem centavos).'
    };
  }

  // Verifica se não é muito grande (máximo 1 bilhão)
  if (value > 1000000000) {
    return {
      isValid: false,
      error: 'O valor é muito grande. Máximo: 1.000.000.000 MZN.'
    };
  }

  return { isValid: true };
};

/**
 * Valida número de telefone M-Pesa (Moçambique)
 * Formato: 258 + 9 dígitos
 */
export const validateMpesaNumber = (msisdn: string): ValidationResult => {
  // Remove espaços e caracteres especiais
  const cleanNumber = msisdn.replace(/\s+/g, '').replace(/[^0-9]/g, '');

  // Verifica se está vazio
  if (!cleanNumber) {
    return {
      isValid: false,
      error: 'Por favor, insira o número M-Pesa.'
    };
  }

  // Verifica se começa com 258
  if (!cleanNumber.startsWith('258')) {
    return {
      isValid: false,
      error: 'O número deve começar com 258 (código de Moçambique).'
    };
  }

  // Verifica se tem exatamente 12 dígitos (258 + 9)
  if (cleanNumber.length !== 12) {
    return {
      isValid: false,
      error: 'O número M-Pesa deve ter 12 dígitos (258XXXXXXXXX).'
    };
  }

  // Verifica se o terceiro dígito após 258 é válido (8 ou 9)
  const thirdDigit = cleanNumber.charAt(3);
  if (thirdDigit !== '8' && thirdDigit !== '9') {
    return {
      isValid: false,
      error: 'Número inválido. Deve ser 258 8X... ou 258 9X...'
    };
  }

  return { isValid: true };
};

/**
 * Valida número de cartão de crédito (Visa/Mastercard)
 * Usa algoritmo de Luhn
 */
export const validateCardNumber = (cardNumber: string): ValidationResult => {
  // Remove espaços e caracteres especiais
  const cleanNumber = cardNumber.replace(/\s+/g, '').replace(/[^0-9]/g, '');

  // Verifica se está vazio
  if (!cleanNumber) {
    return {
      isValid: false,
      error: 'Por favor, insira o número do cartão.'
    };
  }

  // Verifica se tem 16 dígitos
  if (cleanNumber.length !== 16) {
    return {
      isValid: false,
      error: 'O número do cartão deve ter 16 dígitos.'
    };
  }

  // Algoritmo de Luhn para validar cartão
  let sum = 0;
  let isEven = false;

  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber.charAt(i), 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  if (sum % 10 !== 0) {
    return {
      isValid: false,
      error: 'Número de cartão inválido.'
    };
  }

  return { isValid: true };
};

/**
 * Valida data de validade do cartão (MM/AA)
 */
export const validateCardExpiry = (expiry: string): ValidationResult => {
  // Remove espaços
  const cleanExpiry = expiry.trim();

  // Verifica se está vazio
  if (!cleanExpiry) {
    return {
      isValid: false,
      error: 'Por favor, insira a data de validade.'
    };
  }

  // Verifica formato MM/AA
  const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
  if (!expiryRegex.test(cleanExpiry)) {
    return {
      isValid: false,
      error: 'Formato inválido. Use MM/AA (ex: 12/25).'
    };
  }

  // Extrai mês e ano
  const [month, year] = cleanExpiry.split('/');
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100; // Últimos 2 dígitos
  const currentMonth = currentDate.getMonth() + 1;

  const expiryYear = parseInt(year, 10);
  const expiryMonth = parseInt(month, 10);

  // Verifica se o cartão não está expirado
  if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
    return {
      isValid: false,
      error: 'Cartão expirado.'
    };
  }

  // Verifica se não é muito no futuro (máximo 10 anos)
  if (expiryYear > currentYear + 10) {
    return {
      isValid: false,
      error: 'Data de validade muito distante.'
    };
  }

  return { isValid: true };
};

/**
 * Valida CVV do cartão (3 dígitos)
 */
export const validateCVV = (cvv: string): ValidationResult => {
  // Remove espaços
  const cleanCVV = cvv.trim();

  // Verifica se está vazio
  if (!cleanCVV) {
    return {
      isValid: false,
      error: 'Por favor, insira o CVV.'
    };
  }

  // Verifica se tem 3 dígitos
  const cvvRegex = /^[0-9]{3}$/;
  if (!cvvRegex.test(cleanCVV)) {
    return {
      isValid: false,
      error: 'CVV deve ter 3 dígitos.'
    };
  }

  return { isValid: true };
};

/**
 * Valida email (PayPal)
 */
export const validateEmail = (email: string): ValidationResult => {
  // Remove espaços
  const cleanEmail = email.trim();

  // Verifica se está vazio
  if (!cleanEmail) {
    return {
      isValid: false,
      error: 'Por favor, insira o email.'
    };
  }

  // Regex para validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return {
      isValid: false,
      error: 'Email inválido.'
    };
  }

  // Verifica comprimento
  if (cleanEmail.length > 100) {
    return {
      isValid: false,
      error: 'Email muito longo (máximo 100 caracteres).'
    };
  }

  return { isValid: true };
};

/**
 * Valida referência de pagamento
 */
export const validateReference = (reference: string): ValidationResult => {
  // Remove espaços extras
  const cleanReference = reference.trim();

  // Verifica se está vazio
  if (!cleanReference) {
    return {
      isValid: false,
      error: 'Por favor, insira a referência.'
    };
  }

  // Verifica comprimento mínimo
  if (cleanReference.length < 3) {
    return {
      isValid: false,
      error: 'Referência muito curta (mínimo 3 caracteres).'
    };
  }

  // Verifica comprimento máximo
  if (cleanReference.length > 50) {
    return {
      isValid: false,
      error: 'Referência muito longa (máximo 50 caracteres).'
    };
  }

  // Verifica se contém apenas caracteres válidos (letras, números, hífen, underscore)
  const referenceRegex = /^[a-zA-Z0-9\-_]+$/;
  if (!referenceRegex.test(cleanReference)) {
    return {
      isValid: false,
      error: 'Referência deve conter apenas letras, números, hífen ou underscore.'
    };
  }

  return { isValid: true };
};

/**
 * Valida seleção de aluno
 */
export const validateStudent = (studentId: number): ValidationResult => {
  if (!studentId || studentId === 0) {
    return {
      isValid: false,
      error: 'Por favor, selecione um aluno.'
    };
  }

  return { isValid: true };
};

/**
 * Valida método de pagamento
 */
export const validatePaymentMethod = (method: string): ValidationResult => {
  const validMethods = ['M-Pesa', 'Visa', 'PayPal'];

  if (!method) {
    return {
      isValid: false,
      error: 'Por favor, selecione um método de pagamento.'
    };
  }

  if (!validMethods.includes(method)) {
    return {
      isValid: false,
      error: 'Método de pagamento inválido.'
    };
  }

  return { isValid: true };
};

/**
 * Formata número de telefone para exibição
 */
export const formatPhoneNumber = (phone: string): string => {
  const clean = phone.replace(/\D/g, '');
  if (clean.length === 12) {
    return `${clean.slice(0, 3)} ${clean.slice(3, 5)} ${clean.slice(5, 8)} ${clean.slice(8)}`;
  }
  return phone;
};

/**
 * Formata número de cartão para exibição
 */
export const formatCardNumber = (card: string): string => {
  const clean = card.replace(/\D/g, '');
  const groups = clean.match(/.{1,4}/g);
  return groups ? groups.join(' ') : card;
};
