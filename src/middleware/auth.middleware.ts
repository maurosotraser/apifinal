import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/user.service';

interface JwtPayload {
  id: number;
  username: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id_usuario: number;
        username: string;
        roles?: string[];
      };
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const secretKey = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, secretKey) as JwtPayload;

    const userService = new UserService();
    const user = await userService.getUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = {
      id_usuario: user.id_usuario,
      username: user.username,
      
    };

    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const checkRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const hasRole = roles.some(role => req.user?.roles?.includes(role));
    if (!hasRole) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    return next();
  };
};