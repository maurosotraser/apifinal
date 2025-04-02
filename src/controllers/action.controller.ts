import { Request, Response } from 'express';
import { ActionService } from '../services/action.service';
import { z } from 'zod';

const actionService = new ActionService();

// Validation schemas
const createActionSchema = z.object({
  nombre: z.string().min(1),
  cod_tipo: z.string().min(1),
  htmlcode: z.string().nullable(),
  inserted_by: z.string().min(1),
  inserted_at: z.string().min(1),
  updated_at: z.string().min(1),
  updated_by: z.string().min(1)
});

const updateActionSchema = z.object({
  nombre: z.string().min(1).optional(),
  cod_tipo: z.string().min(1).optional(),
  htmlcode: z.string().nullable().optional(),
  updated_by: z.string().min(1)
});

const createActionMembershipSchema = z.object({
  id_membresia: z.number(),
  id_accion: z.number(),
  inserted_by: z.string().min(1),
  updated_by: z.string().min(1)
});

export class ActionController {
  async createAction(req: Request, res: Response) {
    try {
      const actionData = createActionSchema.parse(req.body);
      const action = await actionService.createAction(actionData);
      res.status(201).json(action);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getActionById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const action = await actionService.getActionById(id);
      
      if (!action) {
        res.status(404).json({ error: 'Action not found' });
        return;
      }
      
      res.json(action);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateAction(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const actionData = updateActionSchema.parse(req.body);
      const action = await actionService.updateAction(id, actionData);
      
      if (!action) {
        res.status(404).json({ error: 'Action not found' });
        return;
      }
      
      res.json(action);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteAction(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const deleted = await actionService.deleteAction(id);
      
      if (!deleted) {
        res.status(404).json({ error: 'Action not found' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getActionsByMembership(req: Request, res: Response) {
    try {
      const membershipId = parseInt(req.params.membershipId);
      const actions = await actionService.getActionsByMembership(membershipId);
      res.json(actions);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async addActionToMembership(req: Request, res: Response) {
    try {
      const actionMembershipData = createActionMembershipSchema.parse(req.body);
      const actionMembership = await actionService.addActionToMembership(actionMembershipData);
      res.status(201).json(actionMembership);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async removeActionFromMembership(req: Request, res: Response) {
    try {
      const membershipId = parseInt(req.params.membershipId);
      const actionId = parseInt(req.params.actionId);
      const removed = await actionService.removeActionFromMembership(membershipId, actionId);
      
      if (!removed) {
        res.status(404).json({ error: 'Action membership not found' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getActionsByType(req: Request, res: Response) {
    try {
      const { codTipo } = req.params;
      const actions = await actionService.getActionsByType(codTipo);
      res.json(actions);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
} 