import { Request, Response } from 'express';
import { OwnerService } from '../services/owner.service';
import { z } from 'zod';

const ownerService = new OwnerService();

// Validation schemas
const createOwnerSchema = z.object({
  rut_propietario: z.number(),
  run_propietario: z.string().min(1),
  nombre_propietario: z.string().min(1),
  apellido_propietario: z.string().min(1),
  email_propietario: z.string().email(),
  telefono_propietario: z.string().min(1),
  direccion_propietario: z.string().min(1),
  inserted_by: z.string().min(1),
  inserted_at: z.string().min(1),
  updated_at: z.string().min(1),
  updated_by: z.string().min(1)
});

const updateOwnerSchema = z.object({
  nombre_propietario: z.string().min(1).optional(),
  apellido_propietario: z.string().min(1).optional(),
  email_propietario: z.string().email().optional(),
  telefono_propietario: z.string().min(1).optional(),
  direccion_propietario: z.string().min(1).optional(),
  updated_by: z.string().min(1)
});

export class OwnerController {
  async createOwner(req: Request, res: Response) {
    try {
      const ownerData = createOwnerSchema.parse(req.body);
      const owner = await ownerService.createOwner(ownerData);
      res.status(201).json(owner);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getOwnerById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const owner = await ownerService.getOwnerById(id);
      
      if (!owner) {
        res.status(404).json({ error: 'Owner not found' });
        return;
      }
      
      res.json(owner);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateOwner(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const ownerData = updateOwnerSchema.parse(req.body);
      const owner = await ownerService.updateOwner(id, ownerData);
      
      if (!owner) {
        res.status(404).json({ error: 'Owner not found' });
        return;
      }
      
      res.json(owner);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteOwner(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const deleted = await ownerService.deleteOwner(id);
      
      if (!deleted) {
        res.status(404).json({ error: 'Owner not found' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async searchOwners(req: Request, res: Response) {
    try {
      const searchTerm = req.query.q as string;
      if (!searchTerm) {
        res.status(400).json({ error: 'Search term is required' });
        return;
      }

      const owners = await ownerService.searchOwners(searchTerm);
      res.json(owners);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getOwnersByMembership(req: Request, res: Response) {
    try {
      const membershipId = parseInt(req.params.membershipId);
      const owners = await ownerService.getOwnersByMembership(membershipId);
      res.json(owners);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
} 