import { Request, Response } from 'express';
import { OwnerService } from '../services/owner.service';
import { Owner } from '../models/owner.model';

export class OwnerController {
  private ownerService: OwnerService;

  constructor() {
    this.ownerService = new OwnerService();
  }

  async getAllOwners(_req: Request, res: Response): Promise<void> {
    try {
      const owners = await this.ownerService.getAllOwners();
      res.json(owners);
    } catch (error) {
      console.error('Error in getAllOwners controller:', error);
      res.status(500).json({ message: 'Error al obtener los propietarios' });
    }
  }

  async getOwnerById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const owner = await this.ownerService.getOwnerById(id);
      
      if (!owner) {
        res.status(404).json({ message: 'Propietario no encontrado' });
        return;
      }
      
      res.json(owner);
    } catch (error) {
      console.error('Error in getOwnerById controller:', error);
      res.status(500).json({ message: 'Error al obtener el propietario' });
    }
  }

  async createOwner(req: Request, res: Response): Promise<void> {
    try {
      const ownerData: Omit<Owner, 'id_propietario'> = {
        rut_propietario: req.body.rut_propietario,
        run_propietario: req.body.run_propietario,
        nombre_propietario: req.body.nombre_propietario,
        inserted_by: req.body.inserted_by,
        inserted_at: new Date(),
        updated_by: null,
        updated_at: null,
        ind_estado: 'A'
      };

      const newOwner = await this.ownerService.createOwner(ownerData);
      res.status(201).json(newOwner);
    } catch (error) {
      console.error('Error in createOwner controller:', error);
      res.status(500).json({ message: 'Error al crear el propietario' });
    }
  }

  async updateOwner(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const ownerData: Partial<Owner> = {
        rut_propietario: req.body.rut_propietario,
        run_propietario: req.body.run_propietario,
        nombre_propietario: req.body.nombre_propietario,
        updated_by: req.body.updated_by,
        updated_at: new Date(),
        ind_estado: req.body.ind_estado
      };

      const updatedOwner = await this.ownerService.updateOwner(id, ownerData);
      
      if (!updatedOwner) {
        res.status(404).json({ message: 'Propietario no encontrado' });
        return;
      }
      
      res.json(updatedOwner);
    } catch (error) {
      console.error('Error in updateOwner controller:', error);
      res.status(500).json({ message: 'Error al actualizar el propietario' });
    }
  }

  async deleteOwner(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const success = await this.ownerService.deleteOwner(id);
      
      if (!success) {
        res.status(404).json({ message: 'Propietario no encontrado' });
        return;
      }
      
      res.json({ message: 'Propietario marcado como inactivo correctamente' });
    } catch (error) {
      console.error('Error in deleteOwner controller:', error);
      res.status(500).json({ message: 'Error al marcar el propietario como inactivo' });
    }
  }

  async searchOwners(req: Request, res: Response) {
    try {
      const searchTerm = req.query.q as string;
      if (!searchTerm) {
        res.status(400).json({ error: 'Search term is required' });
        return;
      }

      const owners = await this.ownerService.searchOwners(searchTerm);
      res.json(owners);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getOwnersByMembership(req: Request, res: Response) {
    try {
      const membershipId = parseInt(req.params.membershipId);
      const owners = await this.ownerService.getOwnersByMembership(membershipId);
      res.json(owners);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
} 