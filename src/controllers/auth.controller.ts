import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { User } from '../types/user.types';
import { validateRegistration, validateLogin } from '../validators/auth.validator';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async register(req: Request, res: Response): Promise<Response> {
    try {
      const validatedData = validateRegistration(req.body);
      const userData: Omit<User, 'id_usuario'> = {
        ...validatedData,
        telefono: '',
        inserted_by: 'system',
        inserted_at: new Date(),
        updated_by: 'system',
        updated_at: new Date(),
        ultimo_acceso: new Date()
      };
      
      const user = await this.authService.register(userData);
      return res.status(201).json(user);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('already exists')) {
          return res.status(409).json({ message: error.message });
        }
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const validatedData = validateLogin(req.body);
      const { token, user } = await this.authService.login(validatedData);
      return res.json({ token, user });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(401).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getCurrentUser(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id_usuario;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const user = await this.authService.getCurrentUser(userId);
      return res.json(user);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
} 