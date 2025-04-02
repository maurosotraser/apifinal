import sql from 'mssql';
import { Owner } from '../models/owner.model';
import { pool } from '../config/database';

export class OwnerService {
  async getAllOwners(): Promise<Owner[]> {
    try {
      const result = await pool.request()
        .query('SELECT * FROM [sotraser-bd-dev].seguridad.propietarios');
      return result.recordset;
    } catch (error) {
      console.error('Error in getAllOwners:', error);
      throw error;
    }
  }

  async getOwnerById(id: number): Promise<Owner | null> {
    try {
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM [sotraser-bd-dev].seguridad.propietarios WHERE id_propietario = @id');
      
      return result.recordset[0] || null;
    } catch (error) {
      console.error('Error in getOwnerById:', error);
      throw error;
    }
  }

  async createOwner(ownerData: Omit<Owner, 'id_propietario'>): Promise<Owner> {
    try {
      // Primero obtenemos el siguiente valor de la secuencia
      const sequenceResult = await pool.request()
        .query('SELECT NEXT VALUE FOR [sotraser-bd-dev].seguridad.SQ_PROPIETARIOS AS nextValue');
      
      const nextId = sequenceResult.recordset[0].nextValue;
      
      // Luego insertamos con el ID obtenido
      const result = await pool.request()
        .input('id_propietario', sql.Int, nextId)
        .input('rut_propietario', sql.Int, ownerData.rut_propietario)
        .input('run_propietario', sql.NVarChar, ownerData.run_propietario)
        .input('nombre_propietario', sql.NVarChar, ownerData.nombre_propietario)
        .input('inserted_by', sql.NVarChar, ownerData.inserted_by)
        .input('inserted_at', sql.DateTime, ownerData.inserted_at)
        .input('updated_by', sql.NVarChar, ownerData.updated_by)
        .input('updated_at', sql.DateTime, ownerData.updated_at)
        .input('ind_estado', sql.NVarChar, ownerData.ind_estado || 'A')
        .query(`
          INSERT INTO [sotraser-bd-dev].seguridad.propietarios
          (id_propietario, rut_propietario, run_propietario, nombre_propietario, inserted_by, inserted_at, updated_by, updated_at, ind_estado)
          OUTPUT INSERTED.*
          VALUES
          (@id_propietario, @rut_propietario, @run_propietario, @nombre_propietario, @inserted_by, @inserted_at, @updated_by, @updated_at, @ind_estado)
        `);
      
      return result.recordset[0];
    } catch (error) {
      console.error('Error in createOwner:', error);
      throw error;
    }
  }

  async updateOwner(id: number, ownerData: Partial<Owner>): Promise<Owner | null> {
    try {
      let updateQuery = 'UPDATE [sotraser-bd-dev].seguridad.propietarios SET ';
      const inputs: any[] = [];
      const values: any[] = [];

      if (ownerData.rut_propietario !== undefined) {
        inputs.push('rut_propietario');
        values.push(ownerData.rut_propietario);
      }

      if (ownerData.run_propietario !== undefined) {
        inputs.push('run_propietario');
        values.push(ownerData.run_propietario);
      }

      if (ownerData.nombre_propietario !== undefined) {
        inputs.push('nombre_propietario');
        values.push(ownerData.nombre_propietario);
      }

      if (ownerData.updated_by !== undefined) {
        inputs.push('updated_by');
        values.push(ownerData.updated_by);
      }

      if (ownerData.updated_at !== undefined) {
        inputs.push('updated_at');
        values.push(ownerData.updated_at);
      }

      if (ownerData.ind_estado !== undefined) {
        inputs.push('ind_estado');
        values.push(ownerData.ind_estado);
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
        } else if (input === 'rut_propietario') {
          request.input(input, sql.Int, values[index]);
        } else {
          request.input(input, sql.NVarChar, values[index]);
        }
      });

      updateQuery = updateQuery.slice(0, -2) + ' WHERE id_propietario = @id';

      const result = await request.query(updateQuery);

      if (result.rowsAffected[0] === 0) {
        return null;
      }

      return this.getOwnerById(id);
    } catch (error) {
      console.error('Error in updateOwner:', error);
      throw error;
    }
  }

  async deleteOwner(id: number): Promise<boolean> {
    try {
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query('UPDATE [sotraser-bd-dev].seguridad.propietarios SET ind_estado = \'B\' WHERE id_propietario = @id');
      
      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('Error in deleteOwner:', error);
      throw error;
    }
  }

  async searchOwners(searchTerm: string): Promise<Owner[]> {
    try {
      const result = await pool.request()
        .input('searchTerm', sql.NVarChar, `%${searchTerm}%`)
        .query(`
          SELECT * FROM [sotraser-bd-dev].seguridad.propietarios
          WHERE nombre_propietario LIKE @searchTerm
          AND ind_estado = 'A'
          ORDER BY nombre_propietario
        `);
      
      return result.recordset;
    } catch (error) {
      console.error('Error in searchOwners:', error);
      throw error;
    }
  }

  async getOwnersByMembership(membershipId: number): Promise<Owner[]> {
    try {
      const result = await pool.request()
        .input('membershipId', sql.Int, membershipId)
        .query(`
          SELECT o.*
          FROM [sotraser-bd-dev].seguridad.propietarios o
          INNER JOIN [sotraser-bd-dev].seguridad.membresias m ON o.id_propietario = m.id_propietario
          WHERE m.id_membresia = @membershipId
          AND o.ind_estado = 'A'
        `);
      
      return result.recordset;
    } catch (error) {
      console.error('Error in getOwnersByMembership:', error);
      throw error;
    }
  }
} 