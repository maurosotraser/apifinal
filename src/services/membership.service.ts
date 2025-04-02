import { BaseService } from './base.service';
import { Membership, RoleMembership } from '../types/models';
import sql from 'mssql';
import { pool } from '../config/database';

export class MembershipService extends BaseService {
  async getAllMemberships(): Promise<Membership[]> {
    try {
      const result = await pool.request()
        .query('SELECT * FROM [sotraser-bd-dev].seguridad.membresias');
      return result.recordset;
    } catch (error) {
      console.error('Error in getAllMemberships:', error);
      throw error;
    }
  }

  async getMembershipById(id: number): Promise<Membership | null> {
    try {
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM [sotraser-bd-dev].seguridad.membresias WHERE id_membresia = @id');
      
      return result.recordset[0] || null;
    } catch (error) {
      console.error('Error in getMembershipById:', error);
      throw error;
    }
  }

  async createMembership(membershipData: Omit<Membership, 'id_membresia'>): Promise<Membership> {
    try {
      // Primero obtenemos el siguiente valor de la secuencia
      const sequenceResult = await pool.request()
        .query('SELECT NEXT VALUE FOR [sotraser-bd-dev].seguridad.SQ_MEMBRESIAS AS nextValue');
      
      const nextId = sequenceResult.recordset[0].nextValue;
      
      // Luego insertamos con el ID obtenido
      const result = await pool.request()
        .input('id_membresia', sql.Int, nextId)
        .input('id_usuario', sql.Int, membershipData.id_usuario)
        .input('id_propietario', sql.Int, membershipData.id_propietario)
        .input('ind_membresia', sql.NVarChar, membershipData.ind_membresia)
        .input('fecha_vigencia', sql.DateTime, membershipData.fecha_vigencia)
        .input('inserted_by', sql.NVarChar, membershipData.inserted_by)
        .input('inserted_at', sql.DateTime, membershipData.inserted_at)
        .input('updated_by', sql.NVarChar, membershipData.updated_by)
        .input('updated_at', sql.DateTime, membershipData.updated_at)
        .query(`
          INSERT INTO [sotraser-bd-dev].seguridad.membresias
          (id_membresia, id_usuario, id_propietario, ind_membresia, fecha_vigencia, inserted_by, inserted_at, updated_by, updated_at)
          OUTPUT INSERTED.*
          VALUES
          (@id_membresia, @id_usuario, @id_propietario, @ind_membresia, @fecha_vigencia, @inserted_by, @inserted_at, @updated_by, @updated_at)
        `);
      
      return result.recordset[0];
    } catch (error) {
      console.error('Error in createMembership:', error);
      throw error;
    }
  }

  async updateMembership(id: number, membershipData: Partial<Membership>): Promise<Membership | null> {
    try {
      let updateQuery = 'UPDATE [sotraser-bd-dev].seguridad.membresias SET ';
      const inputs: any[] = [];
      const values: any[] = [];

      if (membershipData.id_usuario !== undefined) {
        inputs.push('id_usuario');
        values.push(membershipData.id_usuario);
      }

      if (membershipData.id_propietario !== undefined) {
        inputs.push('id_propietario');
        values.push(membershipData.id_propietario);
      }

      if (membershipData.ind_membresia) {
        inputs.push('ind_membresia');
        values.push(membershipData.ind_membresia);
      }

      if (membershipData.fecha_vigencia) {
        inputs.push('fecha_vigencia');
        values.push(membershipData.fecha_vigencia);
      }

      if (membershipData.updated_by) {
        inputs.push('updated_by');
        values.push(membershipData.updated_by);
      }

      if (membershipData.updated_at) {
        inputs.push('updated_at');
        values.push(membershipData.updated_at);
      }

      if (inputs.length === 0) {
        return null;
      }

      const request = pool.request();
      request.input('id', sql.Int, id);

      inputs.forEach((input, index) => {
        updateQuery += `${input} = @${input}, `;
        if (input === 'fecha_vigencia' || input === 'updated_at') {
          request.input(input, sql.DateTime, values[index]);
        } else if (input === 'id_usuario' || input === 'id_propietario') {
          request.input(input, sql.Int, values[index]);
        } else {
          request.input(input, sql.NVarChar, values[index]);
        }
      });

      updateQuery = updateQuery.slice(0, -2) + ' WHERE id_membresia = @id';

      const result = await request.query(updateQuery);

      if (result.rowsAffected[0] === 0) {
        return null;
      }

      return this.getMembershipById(id);
    } catch (error) {
      console.error('Error in updateMembership:', error);
      throw error;
    }
  }

  async deleteMembership(id: number): Promise<boolean> {
    try {
      const result = await pool.request()
        .input('id', sql.Int, id)
        .input('updated_at', sql.DateTime, new Date())
        .query(`
          UPDATE [sotraser-bd-dev].seguridad.membresias
          SET ind_membresia = 'B',
              updated_at = @updated_at
          WHERE id_membresia = @id
        `);
      
      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('Error in deleteMembership:', error);
      throw error;
    }
  }

  async getMembershipsByUser(userId: number): Promise<Membership[]> {
    const query = `
      SELECT * FROM seguridad.membresias
      WHERE id_usuario = @userId
    `;

    return this.executeQuery<Membership>(query, { userId });
  }

  async getMembershipsByOwner(ownerId: number): Promise<Membership[]> {
    const query = `
      SELECT * FROM seguridad.membresias
      WHERE id_propietario = @ownerId
    `;

    return this.executeQuery<Membership>(query, { ownerId });
  }

  async addRoleToMembership(roleMembershipData: Omit<RoleMembership, 'inserted_at' | 'updated_at'>): Promise<RoleMembership> {
    const query = `
      INSERT INTO seguridad.roles_por_membresia (
        id_membresia, id_rol, inserted_by
      )
      OUTPUT INSERTED.*
      VALUES (
        @id_membresia, @id_rol, @inserted_by
      )
    `;

    const result = await this.executeQuery<RoleMembership>(query, roleMembershipData);
    return result[0];
  }

  async removeRoleFromMembership(membershipId: number, roleId: number): Promise<boolean> {
    const query = `
      DELETE FROM seguridad.roles_por_membresia
      WHERE id_membresia = @membershipId AND id_rol = @roleId
    `;

    const result = await this.executeQuery<{ affectedRows: number }>(query, {
      membershipId,
      roleId
    });
    return result[0]?.affectedRows > 0;
  }

  async getMembershipRoles(membershipId: number): Promise<RoleMembership[]> {
    const query = `
      SELECT * FROM seguridad.roles_por_membresia
      WHERE id_membresia = @membershipId
    `;

    return this.executeQuery<RoleMembership>(query, { membershipId });
  }

  async getActiveMemberships(): Promise<Membership[]> {
    const query = `
      SELECT * FROM seguridad.membresias
      WHERE fecha_vigencia IS NULL OR fecha_vigencia >= GETDATE()
    `;

    return this.executeQuery<Membership>(query);
  }
} 