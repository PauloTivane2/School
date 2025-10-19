 import { Request, Response, NextFunction } from 'express';

export const logger = (req: Request, _res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const path = req.path;
  const ip = req.ip || req.socket.remoteAddress;
  
  console.log(`[${timestamp}] ${method} ${path} - IP: ${ip}`);
  
  next();
};