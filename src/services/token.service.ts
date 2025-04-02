import { BaseService } from './base.service';
import { Token } from '../types/models';

export class TokenService extends BaseService {
  async createToken(tokenData: Omit<Token, 'id_token' | 'inserted_at' | 'updated_at'>): Promise<Token> {
    const query = `
      INSERT INTO tokens (
        id_usuario,
        token,
        fecha_expiracion,
        inserted_by
      )
      OUTPUT INSERTED.*
      VALUES (
        @id_usuario,
        @token,
        @fecha_expiracion,
        @inserted_by
      )
    `;

    const result = await this.executeQuery<Token>(query, {
      id_usuario: tokenData.id_usuario,
      token: tokenData.token,
      fecha_expiracion: tokenData.fecha_expiracion,
      inserted_by: tokenData.inserted_by
    });

    return result[0];
  }

  async getTokenById(id: number): Promise<Token | null> {
    const query = `
      SELECT * FROM tokens
      WHERE id_token = @id
    `;

    const result = await this.executeQuery<Token>(query, { id });
    return result[0] || null;
  }

  async getTokenByValue(token: string): Promise<Token | null> {
    const query = `
      SELECT * FROM tokens
      WHERE token = @token
    `;

    const result = await this.executeQuery<Token>(query, { token });
    return result[0] || null;
  }

  async updateToken(id: number, tokenData: Partial<Omit<Token, 'id_token' | 'inserted_at' | 'updated_at'>>): Promise<Token | null> {
    const query = `
      UPDATE tokens
      SET 
        token = COALESCE(@token, token),
        fecha_expiracion = COALESCE(@fecha_expiracion, fecha_expiracion),
        updated_by = @updated_by,
        updated_at = GETDATE()
      OUTPUT INSERTED.*
      WHERE id_token = @id
    `;

    const result = await this.executeQuery<Token>(query, {
      id,
      token: tokenData.token,
      fecha_expiracion: tokenData.fecha_expiracion,
      updated_by: tokenData.updated_by
    });

    return result[0] || null;
  }

  async deleteToken(id: number): Promise<boolean> {
    const query = `
      DELETE FROM tokens
      WHERE id_token = @id
    `;

    const result = await this.executeQuery<Token>(query, { id });
    return result.length > 0;
  }

  async deleteExpiredTokens(): Promise<number> {
    const query = `
      DELETE FROM tokens
      WHERE fecha_expiracion < GETDATE()
    `;

    const result = await this.executeQuery<Token>(query);
    return result.length;
  }

  async getTokensByUser(userId: number): Promise<Token[]> {
    const query = `
      SELECT * FROM tokens
      WHERE id_usuario = @userId
      ORDER BY fecha_expiracion DESC
    `;

    return this.executeQuery<Token>(query, { userId });
  }

  async validateToken(token: string): Promise<boolean> {
    const query = `
      SELECT COUNT(*) as count
      FROM tokens
      WHERE token = @token
      AND fecha_expiracion > GETDATE()
    `;

    const result = await this.executeQuery<{ count: number }>(query, { token });
    return result[0].count > 0;
  }
} 