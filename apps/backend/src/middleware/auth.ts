import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { sendError } from '../utils/response';
import { Role } from '@prisma/client';

export interface JwtPayload {
  id: number;
  loginId: string;
  name: string;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return sendError(res, 401, 'UNAUTHORIZED', 'No token provided');
  }

  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
    req.user = decoded;
    next();
  } catch {
    return sendError(res, 401, 'UNAUTHORIZED', 'Invalid or expired token');
  }
}

export function authorize(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 401, 'UNAUTHORIZED', 'Not authenticated');
    }
    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return sendError(res, 403, 'FORBIDDEN', 'Insufficient permissions');
    }
    next();
  };
}
