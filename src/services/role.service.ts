import { BaseService } from './base.service';
import { Role, RoleSub } from '../types/models';

export class RoleService extends BaseService {
  async createRole(roleData: Omit<Role, 'id_rol' | 'inserted_at' | 'updated_at'>): Promise<Role> {
    const query = `
      INSERT INTO seguridad.roles (
        nombre, inserted_by
      )
      OUTPUT INSERTED.*
      VALUES (
        @nombre, @inserted_by
      )
    `;

    const result = await this.executeQuery<Role>(query, {
      nombre: roleData.nombre,
      inserted_by: roleData.inserted_by
    });

    return result[0];
  }

  async getRoleById(id: number): Promise<Role | null> {
    const query = `
      SELECT * FROM seguridad.roles
      WHERE id_rol = @id AND (deleted IS NULL OR deleted = 0)
    `;

    const result = await this.executeQuery<Role>(query, { id });
    return result[0] || null;
  }

  async updateRole(id: number, roleData: Partial<Role>): Promise<Role | null> {
    const query = `
      UPDATE seguridad.roles
      SET 
        nombre = COALESCE(@nombre, nombre),
        updated_by = @updated_by,
        updated_at = GETDATE()
      OUTPUT INSERTED.*
      WHERE id_rol = @id
    `;

    const result = await this.executeQuery<Role>(query, {
      id,
      ...roleData,
      updated_by: roleData.updated_by || 'system'
    });

    return result[0] || null;
  }

  async deleteRole(id: number): Promise<boolean> {
    const query = `
      UPDATE seguridad.roles
      SET 
        deleted = 1,
        updated_at = GETDATE(),
        updated_by = 'system'
      WHERE id_rol = @id
    `;

    const result = await this.executeQuery<{ affectedRows: number }>(query, { id });
    return result[0]?.affectedRows > 0;
  }

  async getRoleSubs(roleId: number): Promise<RoleSub[]> {
    const query = `
      SELECT * FROM seguridad.roles_sub
      WHERE id_rol = @roleId AND (deleted IS NULL OR deleted = 0)
    `;

    return this.executeQuery<RoleSub>(query, { roleId });
  }

  async addRoleSub(roleSubData: Omit<RoleSub, 'id_rol_sub' | 'inserted_at' | 'updated_at'>): Promise<RoleSub> {
    const query = `
      INSERT INTO seguridad.roles_sub (
        id_rol, id_accion, can_salect, can_insert, can_update, can_delete, inserted_by
      )
      OUTPUT INSERTED.*
      VALUES (
        @id_rol, @id_accion, @can_salect, @can_insert, @can_update, @can_delete, @inserted_by
      )
    `;

    const result = await this.executeQuery<RoleSub>(query, roleSubData);
    return result[0];
  }

  async updateRoleSub(id: number, roleSubData: Partial<RoleSub>): Promise<RoleSub | null> {
    const query = `
      UPDATE seguridad.roles_sub
      SET 
        can_salect = COALESCE(@can_salect, can_salect),
        can_insert = COALESCE(@can_insert, can_insert),
        can_update = COALESCE(@can_update, can_update),
        can_delete = COALESCE(@can_delete, can_delete),
        updated_by = @updated_by,
        updated_at = GETDATE()
      OUTPUT INSERTED.*
      WHERE id_rol_sub = @id
    `;

    const result = await this.executeQuery<RoleSub>(query, {
      id,
      ...roleSubData,
      updated_by: roleSubData.updated_by || 'system'
    });

    return result[0] || null;
  }

  async deleteRoleSub(id: number): Promise<boolean> {
    const query = `
      UPDATE seguridad.roles_sub
      SET 
        deleted = 1,
        updated_at = GETDATE(),
        updated_by = 'system'
      WHERE id_rol_sub = @id
    `;

    const result = await this.executeQuery<{ affectedRows: number }>(query, { id });
    return result[0]?.affectedRows > 0;
  }
} 