import { Request, Response } from 'express';
import { MembershipService } from '../services/membership.service';
import { Membership } from '../models/membership.model';
import { z } from 'zod';

const membershipService = new MembershipService();

// Validation schemas
const createMembershipSchema = z.object({
  id_usuario: z.number(),
  id_propietario: z.number(),
  ind_membresia: z.string(),
  fecha_vigencia: z.string().datetime().transform(str => new Date(str)),
  inserted_by: z.string().optional().default('system')
});

const updateMembershipSchema = z.object({
  id_usuario: z.number().optional(),
  id_propietario: z.number().optional(),
  ind_membresia: z.string().optional(),
  fecha_vigencia: z.string().datetime().transform(str => new Date(str)).optional(),
  updated_by: z.string().min(1)
});

const createRoleMembershipSchema = z.object({
  id_membresia: z.number(),
  id_rol: z.number(),
  inserted_by: z.string().min(1),
  inserted_at: z.string().min(1),
  updated_at: z.string().min(1),
  updated_by: z.string().min(1)
});

export class MembershipController {
  async getAllMemberships(_req: Request, res: Response): Promise<void> {
    try {
      const memberships = await membershipService.getAllMemberships();
      res.status(200).json({
        status: 'success',
        data: memberships
      });
    } catch (error) {
      console.error('Error getting memberships:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error al obtener las membresías',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async createMembership(req: Request, res: Response): Promise<void> {
    try {
      if (!req.body) {
        res.status(400).json({
          status: 'error',
          message: 'No se proporcionaron datos para crear la membresía'
        });
        return;
      }

      const validatedData = createMembershipSchema.parse(req.body);
      
      const membershipData: Omit<Membership, 'id_membresia'> = {
        id_usuario: validatedData.id_usuario,
        id_propietario: validatedData.id_propietario,
        ind_membresia: validatedData.ind_membresia,
        fecha_vigencia: validatedData.fecha_vigencia,
        inserted_by: validatedData.inserted_by,
        inserted_at: new Date(),
        updated_by: null,
        updated_at: null
      };

      const membership = await membershipService.createMembership(membershipData);
      
      res.status(201).json({
        status: 'success',
        data: membership
      });
    } catch (error) {
      console.error('Error creating membership:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({
          status: 'error',
          message: 'Datos de membresía inválidos',
          errors: error.errors
        });
      } else {
        res.status(500).json({
          status: 'error',
          message: 'Error al crear la membresía',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  }

  async getMembershipById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({
          status: 'error',
          message: 'ID de membresía inválido'
        });
        return;
      }

      const membership = await membershipService.getMembershipById(id);
      
      if (!membership) {
        res.status(404).json({
          status: 'error',
          message: 'Membresía no encontrada'
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        data: membership
      });
    } catch (error) {
      console.error('Error getting membership:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error al obtener la membresía',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async updateMembership(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({
          status: 'error',
          message: 'ID de membresía inválido'
        });
        return;
      }

      if (!req.body) {
        res.status(400).json({
          status: 'error',
          message: 'No se proporcionaron datos para actualizar la membresía'
        });
        return;
      }

      const validatedData = updateMembershipSchema.parse(req.body);
      
      const membershipData: Partial<Membership> = {
        ...validatedData,
        updated_at: new Date()
      };

      const membership = await membershipService.updateMembership(id, membershipData);
      
      if (!membership) {
        res.status(404).json({
          status: 'error',
          message: 'Membresía no encontrada'
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        data: membership
      });
    } catch (error) {
      console.error('Error updating membership:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({
          status: 'error',
          message: 'Datos de membresía inválidos',
          errors: error.errors
        });
      } else {
        res.status(500).json({
          status: 'error',
          message: 'Error al actualizar la membresía',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  }

  async deleteMembership(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({
          status: 'error',
          message: 'ID de membresía inválido'
        });
        return;
      }

      const success = await membershipService.deleteMembership(id);
      
      if (!success) {
        res.status(404).json({
          status: 'error',
          message: 'Membresía no encontrada'
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        message: 'Membresía marcada como baja correctamente'
      });
    } catch (error) {
      console.error('Error deleting membership:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error al marcar la membresía como baja',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getMembershipsByUser(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      const memberships = await membershipService.getMembershipsByUser(userId);
      res.json(memberships);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getMembershipsByOwner(req: Request, res: Response) {
    try {
      const ownerId = parseInt(req.params.ownerId);
      const memberships = await membershipService.getMembershipsByOwner(ownerId);
      res.json(memberships);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async addRoleToMembership(req: Request, res: Response) {
    try {
      const roleMembershipData = createRoleMembershipSchema.parse(req.body);
      const roleMembership = await membershipService.addRoleToMembership(roleMembershipData);
      res.status(201).json(roleMembership);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async removeRoleFromMembership(req: Request, res: Response) {
    try {
      const membershipId = parseInt(req.params.membershipId);
      const roleId = parseInt(req.params.roleId);
      const removed = await membershipService.removeRoleFromMembership(membershipId, roleId);
      
      if (!removed) {
        res.status(404).json({ error: 'Role membership not found' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getMembershipRoles(req: Request, res: Response) {
    try {
      const membershipId = parseInt(req.params.membershipId);
      const roles = await membershipService.getMembershipRoles(membershipId);
      res.json(roles);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getActiveMemberships(_req: Request, res: Response) {
    try {
      const memberships = await membershipService.getActiveMemberships();
      res.json(memberships);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
} 