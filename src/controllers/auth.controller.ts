import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { AuthResponse } from '../types/models';

const userService = new UserService();

// Validation schemas
const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(6)
});

const registerSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(6),
  nombre_usuario: z.string().min(1),
  correo: z.string().email(),
  telefono: z.string().nullable(),
  inserted_by: z.string().min(1)
});

export class AuthController {
  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { username, password } = loginSchema.parse(req.body);
      const user = await userService.getUserByUsername(username);

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValidPassword = await userService.validatePassword(user, password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user.id_usuario, username: user.username },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1h' }
      );

      // Update last access
      await userService.updateLastAccess(user.id_usuario);

      const response: AuthResponse = {
        token,
        user: {
          id_usuario: user.id_usuario,
          username: user.username,
          nombre_usuario: user.nombre_usuario,
          correo: user.correo,
          telefono: user.telefono,
          ind_estado: user.ind_estado,
          inserted_by: user.inserted_by,
          inserted_at: user.inserted_at,
          updated_by: user.updated_by,
          updated_at: user.updated_at,
          ultimo_acceso: user.ultimo_acceso
        }
      };

      return res.json(response);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async register(req: Request, res: Response): Promise<Response> {
    try {
      const userData = registerSchema.parse(req.body);
      
      // Check if username exists
      const existingUser = await userService.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(409).json({ error: 'Username already exists' });
      }

      // Hash password
      const hashedPassword = await userService.hashPassword(userData.password);

      // Create user
      const user = await userService.createUser({
        ...userData,
        hash_password: hashedPassword,
        ind_estado: 'S',
        ultimo_acceso: new Date(),
        updated_by: userData.inserted_by
      });

      return res.status(201).json({
        id_usuario: user.id_usuario,
        username: user.username,
        nombre_usuario: user.nombre_usuario,
        correo: user.correo,
        telefono: user.telefono,
        ind_estado: user.ind_estado
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getCurrentUser(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const user = await userService.getUserById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.json({
        id_usuario: user.id_usuario,
        username: user.username,
        nombre_usuario: user.nombre_usuario,
        correo: user.correo,
        telefono: user.telefono,
        ind_estado: user.ind_estado
      });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async refreshToken(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = jwt.sign(
        { userId: req.user.id, username: req.user.username },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1h' }
      );

      return res.json({ token });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async logout(_req: Request, res: Response): Promise<Response> {
    try {
      return res.json({ message: 'Logged out successfully' });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
} 