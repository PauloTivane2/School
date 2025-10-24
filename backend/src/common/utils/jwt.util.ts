import * as jwt from 'jsonwebtoken';
import { config } from '@config/env';

interface TokenPayload {
  userId: number;
  email: string;
}

export class JwtUtil {
  static generateToken(payload: TokenPayload): string {
    return jwt.sign(
      payload,
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn } as jwt.SignOptions
    );
  }

  static generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(
      payload,
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiresIn } as jwt.SignOptions
    );
  }

  static verifyToken(token: string): TokenPayload {
    return jwt.verify(token, config.jwt.secret) as TokenPayload;
  }

  static verifyRefreshToken(token: string): TokenPayload {
    return jwt.verify(token, config.jwt.refreshSecret) as TokenPayload;
  }
}