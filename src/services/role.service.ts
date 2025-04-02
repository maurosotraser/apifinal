import sql from 'mssql';
import { Role } from '../models/role.model';
import { pool } from '../config/database';

export class RoleService {
  private convertBufferToString(record: any): any {
    if (record && record.nombre) {
      if (record.nombre.type === 'Buffer') {
        record.nombre = Buffer.from(record.nombre.data).toString('utf8');
      } else if (Buffer.isBuffer(record.nombre)) {
        record.nombre = record.nombre.toString('utf8');
      }
    }
    return record;
  }

  async getAllRoles(): Promise<Role[]> {
    try {
      const result = await pool.request()
        .query('SELECT * FROM [sotraser-bd-dev].seguridad.roles');
      return result.recordset.map(record => this.convertBufferToString(record));
    } catch (error) {
      console.error('Error in getAllRoles:', error);
      throw error;
    }
  }

  async getRoleById(id: number): Promise<Role | null> {
    try {
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM [sotraser-bd-dev].seguridad.roles WHERE id_rol = @id');
      
      const role = result.recordset[0];
      return role ? this.convertBufferToString(role) : null;
    } catch (error) {
      console.error('Error in getRoleById:', error);
      throw error;
    }
  }

  async createRole(roleData: Omit<Role, 'id_rol'>): Promise<Role> {
    try {
      const result = await pool.request()
        .input('nombre', sql.VarBinary(50), Buffer.from(roleData.nombre))
        .input('inserted_by', sql.VarChar(50), roleData.inserted_by)
        .input('inserted_at', sql.DateTime, new Date())
        .input('updated_by', sql.VarChar(50), null)
        .input('updated_at', sql.DateTime, null)
        .query(`
          INSERT INTO [sotraser-bd-dev].seguridad.roles
          (nombre, inserted_by, inserted_at, updated_by, updated_at)
          OUTPUT INSERTED.*
          VALUES
          (@nombre, @inserted_by, @inserted_at, @updated_by, @updated_at)
        `);
      
      return this.convertBufferToString(result.recordset[0]);
    } catch (error) {
      console.error('Error in createRole:', error);
      throw error;
    }
  }

  async updateRole(id: number, roleData: Partial<Role>): Promise<Role | null> {
    try {
      let updateQuery = 'UPDATE [sotraser-bd-dev].seguridad.roles SET ';
      const inputs: any[] = [];
      const values: any[] = [];

      if (roleData.nombre !== undefined) {
        inputs.push('nombre');
        values.push(Buffer.from(roleData.nombre));
      }

      if (roleData.updated_by !== undefined) {
        inputs.push('updated_by');
        values.push(roleData.updated_by);
      }

      if (roleData.updated_at !== undefined) {
        inputs.push('updated_at');
        values.push(roleData.updated_at);
      }

      if (inputs.length === 0) {
        return null;
      }

      const request = pool.request();
      request.input('id', sql.Int, id);

      inputs.forEach((input, index) => {
        updateQuery += `${input} = @${input}, `;
        if (input === 'updated_at') {
          request.input(input, sql.DateTime, values[index]);
        } else if (input === 'nombre') {
          request.input(input, sql.VarBinary(50), values[index]);
        } else {
          request.input(input, sql.VarChar(50), values[index]);
        }
      });

      updateQuery = updateQuery.slice(0, -2) + ' WHERE id_rol = @id';

      const result = await request.query(updateQuery);

      if (result.rowsAffected[0] === 0) {
        return null;
      }

      return this.getRoleById(id);
    } catch (error) {
      console.error('Error in updateRole:', error);
      throw error;
    }
  }

  async deleteRole(id: number): Promise<boolean> {
    try {
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM [sotraser-bd-dev].seguridad.roles WHERE id_rol = @id');
      
      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('Error in deleteRole:', error);
      throw error;
    }
  }

  async getRoleSubs(roleId: number): Promise<any[]> {
    try {
      const result = await pool.request()
        .input('roleId', sql.Int, roleId)
        .query(`
          SELECT * FROM [sotraser-bd-dev].seguridad.roles_sub 
          WHERE id_rol = @roleId
        `);
      return result.recordset;
    } catch (error) {
      console.error('Error in getRoleSubs:', error);
      throw error;
    }
  }

  async addRoleSub(roleId: number, id_accion: number, can_salect: string, can_insert: string, can_update: string, can_delete: string, inserted_by: string): Promise<boolean> {
    try {
      const result = await pool.request()
        .input('roleId', sql.Int, roleId)
        .input('id_accion', sql.Int, id_accion)
        .input('can_salect', sql.VarChar(1), can_salect)
        .input('can_insert', sql.VarChar(1), can_insert)
        .input('can_update', sql.VarChar(1), can_update)
        .input('can_delete', sql.VarChar(1), can_delete)
        .input('inserted_by', sql.VarChar(50), inserted_by)
        .query(`
          INSERT INTO [sotraser-bd-dev].seguridad.roles_sub
          (id_rol, id_accion, can_salect, can_insert, can_update, can_delete, inserted_by, inserted_at)
          VALUES
          (@roleId, @id_accion, @can_salect, @can_insert, @can_update, @can_delete, @inserted_by, GETDATE())
        `);
      
      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('Error in addRoleSub:', error);
      throw error;
    }
  }
} 