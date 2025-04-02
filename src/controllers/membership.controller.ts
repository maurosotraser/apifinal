import { Request, Response } from 'express';
import { MembershipService } from '../services/membership.service';
import { z } from 'zod';

const membershipService = new MembershipService();

// Validation schemas
const createMembershipSchema = z.object({
  id_usuario: z.number(),
  id_propietario: z.number(),
  ind_membresia: z.enum(['T', 'C', 'P']),
  fecha_vigencia: z.date().nullable(),
  inserted_by: z.string().min(1),
  inserted_at: z.string().min(1),
  updated_at: z.string().min(1),
  updated_by: z.string().min(1)
});

const updateMembershipSchema = z.object({
  ind_membresia: z.enum(['T', 'C', 'P']).optional(),
  fecha_vigencia: z.date().nullable().optional(),
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
  async createMembership(req: Request, res: Response) {
    try {
      const membershipData = createMembershipSchema.parse(req.body);
      const membership = await membershipService.createMembership(membershipData);
      res.status(201).json(membership);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getMembershipById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const membership = await membershipService.getMembershipById(id);
      
      if (!membership) {
        res.status(404).json({ error: 'Membership not found' });
        return;
      }
      
      res.json(membership);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateMembership(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const membershipData = updateMembershipSchema.parse(req.body);
      const membership = await membershipService.updateMembership(id, membershipData);
      
      if (!membership) {
        res.status(404).json({ error: 'Membership not found' });
        return;
      }
      
      res.json(membership);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteMembership(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const deleted = await membershipService.deleteMembership(id);
      
      if (!deleted) {
        res.status(404).json({ error: 'Membership not found' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
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