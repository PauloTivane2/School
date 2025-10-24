import * as bcrypt from 'bcryptjs';
import config from '../../config';

export async function hashPassword(password: string): Promise<string> {
  if (!config.bcryptRounds) {
    throw new Error('BCRYPT_ROUNDS não configurado');
  }
  return bcrypt.hash(password, config.bcryptRounds);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}