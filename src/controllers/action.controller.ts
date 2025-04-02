import { Request, Response } from 'express';
import { ActionService } from '../services/action.service';
import { Action } from '../models/action.model';

export class ActionController {
  private actionService: ActionService;

  constructor() {
    this.actionService = new ActionService();
  }

  async getAllActions(_req: Request, res: Response): Promise<void> {
    try {
      const actions = await this.actionService.getAllActions();
      res.json(actions);
    } catch (error) {
      console.error('Error in getAllActions controller:', error);
      res.status(500).json({ message: 'Error al obtener las acciones' });
    }
  }

  async getActionById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const action = await this.actionService.getActionById(id);
      
      if (!action) {
        res.status(404).json({ message: 'Acción no encontrada' });
        return;
      }
      
      res.json(action);
    } catch (error) {
      console.error('Error in getActionById controller:', error);
      res.status(500).json({ message: 'Error al obtener la acción' });
    }
  }

  async createAction(req: Request, res: Response): Promise<void> {
    try {
      const actionData: Omit<Action, 'id_accion'> = {
        nombre: req.body.nombre,
        cod_tipo: req.body.cod_tipo,
        htmlcode: req.body.htmlcode,
        inserted_by: req.body.inserted_by,
        inserted_at: new Date(),
        updated_by: null,
        updated_at: null
      };

      const newAction = await this.actionService.createAction(actionData);
      res.status(201).json(newAction);
    } catch (error) {
      console.error('Error in createAction controller:', error);
      res.status(500).json({ message: 'Error al crear la acción' });
    }
  }

  async updateAction(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const actionData: Partial<Action> = {
        nombre: req.body.nombre,
        cod_tipo: req.body.cod_tipo,
        htmlcode: req.body.htmlcode,
        updated_by: req.body.updated_by,
        updated_at: new Date()
      };

      const updatedAction = await this.actionService.updateAction(id, actionData);
      
      if (!updatedAction) {
        res.status(404).json({ message: 'Acción no encontrada' });
        return;
      }
      
      res.json(updatedAction);
    } catch (error) {
      console.error('Error in updateAction controller:', error);
      res.status(500).json({ message: 'Error al actualizar la acción' });
    }
  }

  async deleteAction(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const success = await this.actionService.deleteAction(id);
      
      if (!success) {
        res.status(404).json({ message: 'Acción no encontrada' });
        return;
      }
      
      res.json({ message: 'Acción eliminada correctamente' });
    } catch (error) {
      console.error('Error in deleteAction controller:', error);
      res.status(500).json({ message: 'Error al eliminar la acción' });
    }
  }

  async getActionsByMembership(req: Request, res: Response): Promise<void> {
    try {
      const membershipId = parseInt(req.params.membershipId);
      const actions = await this.actionService.getActionsByMembership(membershipId);
      res.json(actions);
    } catch (error) {
      console.error('Error in getActionsByMembership controller:', error);
      res.status(500).json({ message: 'Error al obtener las acciones de la membresía' });
    }
  }

  async addActionToMembership(req: Request, res: Response): Promise<void> {
    try {
      const { id_membresia, id_accion, inserted_by } = req.body;
      const success = await this.actionService.addActionToMembership(id_membresia, id_accion, inserted_by);
      
      if (success) {
        res.status(201).json({ message: 'Acción agregada a la membresía correctamente' });
      } else {
        res.status(400).json({ message: 'Error al agregar la acción a la membresía' });
      }
    } catch (error) {
      console.error('Error in addActionToMembership controller:', error);
      res.status(500).json({ message: 'Error al agregar la acción a la membresía' });
    }
  }

  async removeActionFromMembership(req: Request, res: Response): Promise<void> {
    try {
      const membershipId = parseInt(req.params.membershipId);
      const actionId = parseInt(req.params.actionId);
      const success = await this.actionService.removeActionFromMembership(membershipId, actionId);
      
      if (success) {
        res.status(200).json({ message: 'Acción removida de la membresía correctamente' });
      } else {
        res.status(404).json({ message: 'No se encontró la relación entre la acción y la membresía' });
      }
    } catch (error) {
      console.error('Error in removeActionFromMembership controller:', error);
      res.status(500).json({ message: 'Error al remover la acción de la membresía' });
    }
  }

  async getActionsByType(req: Request, res: Response): Promise<void> {
    try {
      const codTipo = req.params.codTipo;
      const actions = await this.actionService.getActionsByType(codTipo);
      res.json(actions);
    } catch (error) {
      console.error('Error in getActionsByType controller:', error);
      res.status(500).json({ message: 'Error al obtener las acciones por tipo' });
    }
  }
} 