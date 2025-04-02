import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { z } from 'zod';

const userService = new UserService();

// Validation schemas
const createUserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(6),
  nombre_usuario: z.string().min(1),
  correo: z.string().email(),
  telefono: z.string().nullable(),
  ind_estado: z.enum(['A', 'B']),
  inserted_by: z.string().min(1),
  ultimo_acceso: z.string().datetime().transform(str => new Date(str))
});

const updateUserSchema = z.object({
  username: z.string().min(1).optional(),
  password: z.string().min(6).optional(),
  nombre_usuario: z.string().min(1).optional(),
  correo: z.string().email().optional(),
  telefono: z.string().nullable().optional(),
  ind_estado: z.enum(['A', 'B']).optional(),
  updated_by: z.string().min(1)
});

export class UserController {
  async getAllUsers(_req: Request, res: Response): Promise<void> {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json({
        status: 'success',
        data: users
      });
    } catch (error) {
      console.error('Error getting users:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error al obtener los usuarios',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      if (!req.body) {
        res.status(400).json({
          status: 'error',
          message: 'El cuerpo de la petición no puede estar vacío'
        });
        return;
      }

      const userData = createUserSchema.parse(req.body);
      const userToCreate = {
        ...userData,
        inserted_at: new Date(),
        updated_at: new Date(),
        updated_by: userData.inserted_by
      };
      const user = await userService.createUser(userToCreate);
      res.status(201).json({
        status: 'success',
        data: user
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          status: 'error',
          message: 'Datos de usuario inválidos',
          errors: error.errors
        });
        return;
      }
      console.error('Error creating user:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error al crear el usuario',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({
          status: 'error',
          message: 'ID de usuario inválido'
        });
        return;
      }

      const user = await userService.getUserById(id);
      
      if (!user) {
        res.status(404).json({
          status: 'error',
          message: 'Usuario no encontrado'
        });
        return;
      }
      
      res.status(200).json({
        status: 'success',
        data: user
      });
    } catch (error) {
      console.error('Error getting user:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error al obtener el usuario',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      if (!req.body) {
        res.status(400).json({
          status: 'error',
          message: 'El cuerpo de la petición no puede estar vacío'
        });
        return;
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({
          status: 'error',
          message: 'ID de usuario inválido'
        });
        return;
      }

      const userData = updateUserSchema.parse(req.body);
      const user = await userService.updateUser(id, userData);
      
      if (!user) {
        res.status(404).json({
          status: 'error',
          message: 'Usuario no encontrado'
        });
        return;
      }
      
      res.status(200).json({
        status: 'success',
        data: user
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          status: 'error',
          message: 'Datos de usuario inválidos',
          errors: error.errors
        });
        return;
      }
      console.error('Error updating user:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error al actualizar el usuario',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({
          status: 'error',
          message: 'ID de usuario inválido'
        });
        return;
      }

      const deleted = await userService.deleteUser(id);
      
      if (!deleted) {
        res.status(404).json({
          status: 'error',
          message: 'Usuario no encontrado'
        });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error al eliminar el usuario',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
} 