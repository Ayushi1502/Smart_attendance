import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: 'student' | 'admin';
  };
}

/**
 * Protect middleware: Verifies bearer tokens and attaches payload to request context.
 */
export function protect(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authorization token is missing.' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'sih_hackaholics_smart_attend_secret_2026';
    const decoded = jwt.verify(token, secret) as { id: string; role: 'student' | 'admin' };
    
    req.user = {
      id: decoded.id,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token signature.' });
  }
}

/**
 * Authorize middleware: Filters requests by specific security roles.
 */
export function authorize(...roles: ('student' | 'admin')[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Forbidden: Access restricted to [${roles.join(', ')}] roles.` 
      });
    }
    next();
  };
}
