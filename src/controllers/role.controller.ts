import { Request, Response } from 'express';
import { RoleService } from '../services/role.service';
import { Role } from '../models/role.model';

export class RoleController {
  private roleService: RoleService;

  constructor() {
    this.roleService = new RoleService();
  }

  async getAllRoles(_req: Request, res: Response): Promise<void> {
    try {
      const roles = await this.roleService.getAllRoles();
      res.json(roles);
    } catch (error) {
      console.error('Error in getAllRoles controller:', error);
      res.status(500).json({ message: 'Error al obtener los roles' });
    }
  }

  async getRoleById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const role = await this.roleService.getRoleById(id);
      
      if (!role) {
        res.status(404).json({ message: 'Rol no encontrado' });
        return;
      }
      
      res.json(role);
    } catch (error) {
      console.error('Error in getRoleById controller:', error);
      res.status(500).json({ message: 'Error al obtener el rol' });
    }
  }

  async createRole(req: Request, res: Response): Promise<void> {
    try {
      const roleData: Omit<Role, 'id_rol'> = {
        nombre: req.body.nombre,
        inserted_by: req.body.inserted_by,
        inserted_at: new Date(),
        updated_by: null,
        updated_at: null
      };

      const newRole = await this.roleService.createRole(roleData);
      res.status(201).json(newRole);
    } catch (error) {
      console.error('Error in createRole controller:', error);
      res.status(500).json({ message: 'Error al crear el rol' });
    }
  }

  async updateRole(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const roleData: Partial<Role> = {
        nombre: req.body.nombre,
        updated_by: req.body.updated_by,
        updated_at: new Date()
      };

      const updatedRole = await this.roleService.updateRole(id, roleData);
      
      if (!updatedRole) {
        res.status(404).json({ message: 'Rol no encontrado' });
        return;
      }
      
      res.json(updatedRole);
    } catch (error) {
      console.error('Error in updateRole controller:', error);
      res.status(500).json({ message: 'Error al actualizar el rol' });
    }
  }

  async deleteRole(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const success = await this.roleService.deleteRole(id);
      
      if (!success) {
        res.status(404).json({ message: 'Rol no encontrado' });
        return;
      }
      
      res.json({ message: 'Rol eliminado correctamente' });
    } catch (error) {
      console.error('Error in deleteRole controller:', error);
      res.status(500).json({ message: 'Error al eliminar el rol' });
    }
  }

  async getRoleSubs(req: Request, res: Response): Promise<void> {
    try {
      const roleId = parseInt(req.params.roleId);
      const roleSubs = await this.roleService.getRoleSubs(roleId);
      res.json(roleSubs);
    } catch (error) {
      console.error('Error in getRoleSubs controller:', error);
      res.status(500).json({ message: 'Error al obtener los subroles' });
    }
  }

  async addRoleSub(req: Request, res: Response): Promise<void> {
    try {
      const roleId = parseInt(req.params.roleId);
      const { id_accion, can_salect, can_insert, can_update, can_delete, inserted_by } = req.body;
      
      const success = await this.roleService.addRoleSub(
        roleId,
        id_accion,
        can_salect,
        can_insert,
        can_update,
        can_delete,
        inserted_by
      );
      
      if (success) {
        res.status(201).json({ message: 'Subrol agregado correctamente' });
      } else {
        res.status(400).json({ message: 'Error al agregar el subrol' });
      }
    } catch (error) {
      console.error('Error in addRoleSub controller:', error);
      res.status(500).json({ message: 'Error al agregar el subrol' });
    }
  }
} 