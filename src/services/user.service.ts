import sql from 'mssql';
import { User } from '../models/user.model';
import { pool } from '../config/database';
import bcrypt from 'bcryptjs';

export class UserService {
  async getAllUsers(): Promise<User[]> {
    try {
      const result = await pool.request()
        .query('SELECT * FROM [sotraser-bd-dev].seguridad.usuarios');
      return result.recordset;
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      throw error;
    }
  }

  async getUserById(id: number): Promise<User | null> {
    try {
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM [sotraser-bd-dev].seguridad.usuarios WHERE id_usuario = @id');
      
      return result.recordset[0] || null;
    } catch (error) {
      console.error('Error in getUserById:', error);
      throw error;
    }
  }

  async getUserByUsername(username: string): Promise<User | null> {
    try {
      const result = await pool.request()
        .input('username', sql.NVarChar, username)
        .query('SELECT * FROM [sotraser-bd-dev].seguridad.usuarios WHERE username = @username');
      
      return result.recordset[0] || null;
    } catch (error) {
      console.error('Error in getUserByUsername:', error);
      throw error;
    }
  }

  async createUser(userData: Omit<User, 'id_usuario'>): Promise<User> {
    try {
      const result = await pool.request()
        .input('username', sql.NVarChar, userData.username)
        .input('hash_password', sql.NVarChar, userData.hash_password)
        .input('nombre_usuario', sql.NVarChar, userData.nombre_usuario)
        .input('correo', sql.NVarChar, userData.correo)
        .input('telefono', sql.NVarChar, userData.telefono)
        .input('ind_estado', sql.Char(1), userData.ind_estado)
        .input('inserted_by', sql.NVarChar, userData.inserted_by)
        .input('inserted_at', sql.DateTime, userData.inserted_at)
        .input('updated_by', sql.NVarChar, userData.updated_by)
        .input('updated_at', sql.DateTime, userData.updated_at)
        .query(`
          INSERT INTO [sotraser-bd-dev].seguridad.usuarios
          (id_usuario, username, hash_password, nombre_usuario, correo, telefono, ind_estado, inserted_by, inserted_at, updated_by, updated_at)
          OUTPUT INSERTED.*
          VALUES
          (NEXT VALUE FOR [sotraser-bd-dev].seguridad.SQ_USUARIOS, @username, @hash_password, @nombre_usuario, @correo, @telefono, @ind_estado, @inserted_by, @inserted_at, @updated_by, @updated_at)
        `);
      
      return result.recordset[0];
    } catch (error) {
      console.error('Error in createUser:', error);
      throw error;
    }
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | null> {
    try {
      let updateQuery = 'UPDATE [sotraser-bd-dev].seguridad.usuarios SET ';
      const inputs: any[] = [];
      const values: any[] = [];

      if (userData.username) {
        inputs.push('username');
        values.push(userData.username);
      }

      if (userData.hash_password) {
        inputs.push('hash_password');
        values.push(userData.hash_password);
      }

      if (userData.nombre_usuario) {
        inputs.push('nombre_usuario');
        values.push(userData.nombre_usuario);
      }

      if (userData.correo) {
        inputs.push('correo');
        values.push(userData.correo);
      }

      if (userData.telefono !== undefined) {
        inputs.push('telefono');
        values.push(userData.telefono);
      }

      if (userData.ind_estado) {
        inputs.push('ind_estado');
        values.push(userData.ind_estado);
      }

      if (userData.updated_by) {
        inputs.push('updated_by');
        values.push(userData.updated_by);
      }

      if (userData.updated_at) {
        inputs.push('updated_at');
        values.push(userData.updated_at);
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

      updateQuery = updateQuery.slice(0, -2) + ' WHERE id_usuario = @id';

      const result = await request.query(updateQuery);

      if (result.rowsAffected[0] === 0) {
        return null;
      }

      return this.getUserById(id);
    } catch (error) {
      console.error('Error in updateUser:', error);
      throw error;
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`
          UPDATE [sotraser-bd-dev].seguridad.usuarios
          SET ind_estado = 'B',
              updated_by = 'system',
              updated_at = GETDATE()
          WHERE id_usuario = @id
        `);
      
      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('Error in deleteUser:', error);
      throw error;
    }
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.hash_password);
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}

