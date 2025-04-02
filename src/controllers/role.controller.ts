import { Request, Response } from 'express';
import { RoleService } from '../services/role.service';
import { z } from 'zod';

const roleService = new RoleService();

// Validation schemas
const createRoleSchema = z.object({
  nombre: z.string().min(1),
  inserted_by: z.string().min(1),
  updated_by: z.string().min(1),
  inserted_at: z.string().min(1),
  updated_at: z.string().min(1)
});

const updateRoleSchema = z.object({
  nombre: z.string().min(1).optional(),
  updated_by: z.string().min(1)
});

const createRoleSubSchema = z.object({
  id_rol: z.number(),
  id_accion: z.number(),
  can_salect: z.enum(['S', 'N']),
  can_insert: z.enum(['S', 'N']),
  can_update: z.enum(['S', 'N']),
  can_delete: z.enum(['S', 'N']),
  inserted_by: z.string().min(1),
  inserted_at: z.string().min(1),
  updated_at: z.string().min(1),
  updated_by: z.string().min(1)
});

const updateRoleSubSchema = z.object({
  can_salect: z.enum(['S', 'N']).optional(),
  can_insert: z.enum(['S', 'N']).optional(),
  can_update: z.enum(['S', 'N']).optional(),
  can_delete: z.enum(['S', 'N']).optional(),
  updated_by: z.string().min(1)
});

export class RoleController {
  async createRole(req: Request, res: Response): Promise<void> {
    try {
      const roleData = createRoleSchema.parse(req.body);
      const role = await roleService.createRole(roleData);
      res.status(201).json(role);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getRoleById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const role = await roleService.getRoleById(id);
      
      if (!role) {
        res.status(404).json({ error: 'Role not found' });
        return;
      }
      
      res.json(role);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateRole(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const roleData = updateRoleSchema.parse(req.body);
      const role = await roleService.updateRole(id, roleData);
      
      if (!role) {
        res.status(404).json({ error: 'Role not found' });
        return;
      }
      
      res.json(role);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteRole(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const deleted = await roleService.deleteRole(id);
      
      if (!deleted) {
        res.status(404).json({ error: 'Role not found' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getRoleSubs(req: Request, res: Response): Promise<void> {
    try {
      const roleId = parseInt(req.params.roleId);
      const roleSubs = await roleService.getRoleSubs(roleId);
      res.json(roleSubs);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async addRoleSub(req: Request, res: Response): Promise<void> {
    try {
      const roleSubData = createRoleSubSchema.parse(req.body);
      const roleSub = await roleService.addRoleSub(roleSubData);
      res.status(201).json(roleSub);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateRoleSub(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const roleSubData = updateRoleSubSchema.parse(req.body);
      const roleSub = await roleService.updateRoleSub(id, roleSubData);
      
      if (!roleSub) {
        res.status(404).json({ error: 'Role sub not found' });
        return;
      }
      
      res.json(roleSub);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteRoleSub(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const deleted = await roleService.deleteRoleSub(id);
      
      if (!deleted) {
        res.status(404).json({ error: 'Role sub not found' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
} 