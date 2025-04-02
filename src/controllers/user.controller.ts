import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { z } from 'zod';

const userService = new UserService();

// Validation schemas
const createUserSchema = z.object({
  username: z.string().min(1),
  hash_password: z.string().min(6),
  nombre_usuario: z.string().min(1),
  correo: z.string().email(),
  telefono: z.string().nullable(),
  ind_estado: z.enum(['S', 'N']),
  inserted_by: z.string().min(1),
  ultimo_acceso: z.string().datetime().transform(str => new Date(str))
});

const updateUserSchema = z.object({
  username: z.string().min(1).optional(),
  hash_password: z.string().min(6).optional(),
  nombre_usuario: z.string().min(1).optional(),
  correo: z.string().email().optional(),
  telefono: z.string().nullable().optional(),
  ind_estado: z.enum(['S', 'N']).optional(),
  updated_by: z.string().min(1)
});

export class UserController {
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const userData = createUserSchema.parse(req.body);
      // Add current timestamp for inserted_at and updated_at
      const userToCreate = {
        ...userData,
        inserted_at: new Date(),
        updated_at: new Date(),
        updated_by: userData.inserted_by // Using the same user for inserted_by and updated_by
      };
      const user = await userService.createUser(userToCreate);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const user = await userService.getUserById(id);
      
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const userData = updateUserSchema.parse(req.body);
      const user = await userService.updateUser(id, userData);
      
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      
      res.json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const deleted = await userService.deleteUser(id);
      
      if (!deleted) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
} 