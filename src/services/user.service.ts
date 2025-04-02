import { User } from '../types/models';
import { pool } from '../config/database';
import bcrypt from 'bcryptjs';

export class UserService {
  async getUserById(id: number): Promise<User | null> {
    const request = pool.request();
    const result = await request
      .input('id', id)
      .query<User>('SELECT * FROM usuarios WHERE id_usuario = @id');
    return result.recordset[0] || null;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const request = pool.request();
    const result = await request
      .input('username', username)
      .query<User>('SELECT * FROM usuarios WHERE username = @username');
    return result.recordset[0] || null;
  }

  async createUser(userData: Omit<User, 'id_usuario' | 'inserted_at' | 'updated_at'>): Promise<User> {
    const request = pool.request();
    const result = await request
      .input('username', userData.username)
      .input('hash_password', userData.hash_password)
      .input('nombre_usuario', userData.nombre_usuario)
      .input('correo', userData.correo)
      .input('telefono', userData.telefono)
      .input('ind_estado', userData.ind_estado)
      .input('inserted_by', userData.inserted_by)
      .input('updated_by', userData.updated_by)
      .input('ultimo_acceso', userData.ultimo_acceso)
      .query<{ id_usuario: number }>(`
        INSERT INTO usuarios (
          username, hash_password, nombre_usuario, correo, telefono,
          ind_estado, inserted_by, updated_by, ultimo_acceso
        ) 
        OUTPUT INSERTED.id_usuario
        VALUES (
          @username, @hash_password, @nombre_usuario, @correo, @telefono,
          @ind_estado, @inserted_by, @updated_by, @ultimo_acceso
        )
      `);

    const newUserId = result.recordset[0].id_usuario;
    const newUser = await this.getUserById(newUserId);
    if (!newUser) {
      throw new Error('Failed to create user');
    }
    return newUser;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | null> {
    const request = pool.request();
    const updates: string[] = [];
    const params: { [key: string]: any } = {};

    Object.entries(userData).forEach(([key, value]) => {
      if (value !== undefined) {
        updates.push(`${key} = @${key}`);
        params[key] = value;
      }
    });

    if (updates.length === 0) {
      return null;
    }

    params.id = id;
    request.input('id', id);

    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value);
    });

    await request.query(`
      UPDATE usuarios 
      SET ${updates.join(', ')} 
      WHERE id_usuario = @id
    `);

    return this.getUserById(id);
  }

  async deleteUser(id: number): Promise<boolean> {
    const request = pool.request();
    const result = await request
      .input('id', id)
      .query<{ rowsAffected: number }>('DELETE FROM usuarios WHERE id_usuario = @id');
    return result.rowsAffected[0] > 0;
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.hash_password);
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async updateLastAccess(id: number): Promise<void> {
    const request = pool.request();
    await request
      .input('id', id)
      .query('UPDATE usuarios SET ultimo_acceso = GETDATE() WHERE id_usuario = @id');
  }

  async getUserRoles(userId: number): Promise<string[]> {
    const request = pool.request();
    const result = await request
      .input('userId', userId)
      .query<{ nombre: string }>(`
        SELECT r.nombre 
        FROM usuarios_roles ur 
        JOIN roles r ON ur.id_rol = r.id_rol 
        WHERE ur.id_usuario = @userId
      `);
    
    return result.recordset.map(row => row.nombre);
  }
} 

