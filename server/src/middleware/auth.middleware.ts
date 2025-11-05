import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    role: string;
    email?: string;
    funcao?: string;
  };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ message: 'Token não fornecido' });
      return;
    }

    const decoded = jwt.verify(token, (config as any).jwt?.secret || (config as any).jwtSecret) as {
      userId?: number;
      email?: string;
      funcao?: string;
      role?: string;
    };

    if (!decoded) {
      res.status(401).json({ message: 'Token inválido' });
      return;
    }

    // Normalizar role a partir de funcao
    const mapRole = (funcao?: string, role?: string): string => {
      const value = (role || funcao || '').toLowerCase();
      if (['admin', 'diretor', 'director'].includes(value)) return 'Admin';
      if (['tesouraria', 'tesoureiro', 'financeiro'].includes(value)) return 'Tesouraria';
      if (['professor', 'docente'].includes(value)) return 'Professor';
      if (['encarregado', 'guardiao', 'guardian'].includes(value)) return 'Encarregado';
      return role || funcao || 'User';
    };

    req.user = {
      userId: (decoded.userId as number) || (decoded as any).id,
      email: decoded.email,
      funcao: decoded.funcao,
      role: mapRole(decoded.funcao, decoded.role),
    };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Não autenticado' });
      return;
    }

    if (roles.length > 0 && !roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Acesso negado' });
      return;
    }

    next();
  };
};