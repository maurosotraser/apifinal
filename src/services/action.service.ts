import sql from 'mssql';
import { Action } from '../models/action.model';
import { pool } from '../config/database';

export class ActionService {
  async getAllActions(): Promise<Action[]> {
    try {
      const result = await pool.request()
        .query('SELECT * FROM [sotraser-bd-dev].seguridad.acciones');
      return result.recordset;
    } catch (error) {
      console.error('Error in getAllActions:', error);
      throw error;
    }
  }

  async getActionById(id: number): Promise<Action | null> {
    try {
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM [sotraser-bd-dev].seguridad.acciones WHERE id_accion = @id');
      
      return result.recordset[0] || null;
    } catch (error) {
      console.error('Error in getActionById:', error);
      throw error;
    }
  }

  async createAction(actionData: Omit<Action, 'id_accion'>): Promise<Action> {
    try {
      const result = await pool.request()
        .input('nombre', sql.NVarChar, actionData.nombre)
        .input('cod_tipo', sql.NVarChar, actionData.cod_tipo)
        .input('htmlcode', sql.NVarChar, actionData.htmlcode)
        .input('inserted_by', sql.NVarChar, actionData.inserted_by)
        .input('inserted_at', sql.DateTime, actionData.inserted_at)
        .input('updated_by', sql.NVarChar, actionData.updated_by)
        .input('updated_at', sql.DateTime, actionData.updated_at)
        .query(`
          INSERT INTO [sotraser-bd-dev].seguridad.acciones
          (nombre, cod_tipo, htmlcode, inserted_by, inserted_at, updated_by, updated_at)
          OUTPUT INSERTED.*
          VALUES
          (@nombre, @cod_tipo, @htmlcode, @inserted_by, @inserted_at, @updated_by, @updated_at)
        `);
      
      return result.recordset[0];
    } catch (error) {
      console.error('Error in createAction:', error);
      throw error;
    }
  }

  async updateAction(id: number, actionData: Partial<Action>): Promise<Action | null> {
    try {
      let updateQuery = 'UPDATE [sotraser-bd-dev].seguridad.acciones SET ';
      const inputs: any[] = [];
      const values: any[] = [];

      if (actionData.nombre !== undefined) {
        inputs.push('nombre');
        values.push(actionData.nombre);
      }

      if (actionData.cod_tipo !== undefined) {
        inputs.push('cod_tipo');
        values.push(actionData.cod_tipo);
      }

      if (actionData.htmlcode !== undefined) {
        inputs.push('htmlcode');
        values.push(actionData.htmlcode);
      }

      if (actionData.updated_by !== undefined) {
        inputs.push('updated_by');
        values.push(actionData.updated_by);
      }

      if (actionData.updated_at !== undefined) {
        inputs.push('updated_at');
        values.push(actionData.updated_at);
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
        } else {
          request.input(input, sql.NVarChar, values[index]);
        }
      });

      updateQuery = updateQuery.slice(0, -2) + ' WHERE id_accion = @id';

      const result = await request.query(updateQuery);

      if (result.rowsAffected[0] === 0) {
        return null;
      }

      return this.getActionById(id);
    } catch (error) {
      console.error('Error in updateAction:', error);
      throw error;
    }
  }

  async deleteAction(id: number): Promise<boolean> {
    try {
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM [sotraser-bd-dev].seguridad.acciones WHERE id_accion = @id');
      
      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('Error in deleteAction:', error);
      throw error;
    }
  }

  async getActionsByMembership(membershipId: number): Promise<Action[]> {
    try {
      const result = await pool.request()
        .input('membershipId', sql.Int, membershipId)
        .query(`
          SELECT a.*
          FROM [sotraser-bd-dev].seguridad.acciones a
          INNER JOIN [sotraser-bd-dev].seguridad.acciones_por_membresia am ON a.id_accion = am.id_accion
          WHERE am.id_membresia = @membershipId
        `);
      return result.recordset;
    } catch (error) {
      console.error('Error in getActionsByMembership:', error);
      throw error;
    }
  }

  async addActionToMembership(membershipId: number, actionId: number, insertedBy: string): Promise<boolean> {
    try {
      const result = await pool.request()
        .input('membershipId', sql.Int, membershipId)
        .input('actionId', sql.Int, actionId)
        .input('insertedBy', sql.NVarChar, insertedBy)
        .input('insertedAt', sql.DateTime, new Date())
        .query(`
          INSERT INTO [sotraser-bd-dev].seguridad.acciones_por_membresia 
          (id_membresia, id_accion, inserted_by, inserted_at)
          VALUES (@membershipId, @actionId, @insertedBy, @insertedAt)
        `);
      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('Error in addActionToMembership:', error);
      throw error;
    }
  }

  async removeActionFromMembership(membershipId: number, actionId: number): Promise<boolean> {
    try {
      const result = await pool.request()
        .input('membershipId', sql.Int, membershipId)
        .input('actionId', sql.Int, actionId)
        .query(`
          DELETE FROM [sotraser-bd-dev].seguridad.acciones_por_membresia
          WHERE id_membresia = @membershipId AND id_accion = @actionId
        `);
      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('Error in removeActionFromMembership:', error);
      throw error;
    }
  }

  async getActionsByType(codTipo: string): Promise<Action[]> {
    try {
      const result = await pool.request()
        .input('codTipo', sql.NVarChar, codTipo)
        .query(`
          SELECT * FROM [sotraser-bd-dev].seguridad.acciones
          WHERE cod_tipo = @codTipo
        `);
      return result.recordset;
    } catch (error) {
      console.error('Error in getActionsByType:', error);
      throw error;
    }
  }
} 