import { BaseService } from './base.service';
import { Action, ActionMembership } from '../types/models';

export class ActionService extends BaseService {
  async createAction(actionData: Omit<Action, 'id_accion' | 'inserted_at' | 'updated_at'>): Promise<Action> {
    const query = `
      INSERT INTO seguridad.acciones (
        nombre, cod_tipo, htmlcode, inserted_by
      )
      OUTPUT INSERTED.*
      VALUES (
        @nombre, @cod_tipo, @htmlcode, @inserted_by
      )
    `;

    const result = await this.executeQuery<Action>(query, actionData);
    return result[0];
  }

  async getActionById(id: number): Promise<Action | null> {
    const query = `
      SELECT * FROM seguridad.acciones
      WHERE id_accion = @id
    `;

    const result = await this.executeQuery<Action>(query, { id });
    return result[0] || null;
  }

  async updateAction(id: number, actionData: Partial<Action>): Promise<Action | null> {
    const query = `
      UPDATE seguridad.acciones
      SET 
        nombre = COALESCE(@nombre, nombre),
        cod_tipo = COALESCE(@cod_tipo, cod_tipo),
        htmlcode = COALESCE(@htmlcode, htmlcode),
        updated_by = @updated_by,
        updated_at = GETDATE()
      OUTPUT INSERTED.*
      WHERE id_accion = @id
    `;

    const result = await this.executeQuery<Action>(query, {
      id,
      ...actionData,
      updated_by: actionData.updated_by || 'system'
    });

    return result[0] || null;
  }

  async deleteAction(id: number): Promise<boolean> {
    const query = `
      DELETE FROM seguridad.acciones
      WHERE id_accion = @id
    `;

    const result = await this.executeQuery<{ affectedRows: number }>(query, { id });
    return result[0]?.affectedRows > 0;
  }

  async getActionsByMembership(membershipId: number): Promise<Action[]> {
    const query = `
      SELECT a.*
      FROM seguridad.acciones a
      INNER JOIN seguridad.acciones_por_membresia am ON a.id_accion = am.id_accion
      WHERE am.id_membresia = @membershipId
    `;

    return this.executeQuery<Action>(query, { membershipId });
  }

  async addActionToMembership(actionMembershipData: Omit<ActionMembership, 'inserted_at' | 'updated_at'>): Promise<ActionMembership> {
    const query = `
      INSERT INTO seguridad.acciones_por_membresia (
        id_membresia, id_accion, inserted_by
      )
      OUTPUT INSERTED.*
      VALUES (
        @id_membresia, @id_accion, @inserted_by
      )
    `;

    const result = await this.executeQuery<ActionMembership>(query, actionMembershipData);
    return result[0];
  }

  async removeActionFromMembership(membershipId: number, actionId: number): Promise<boolean> {
    const query = `
      DELETE FROM seguridad.acciones_por_membresia
      WHERE id_membresia = @membershipId AND id_accion = @actionId
    `;

    const result = await this.executeQuery<{ affectedRows: number }>(query, {
      membershipId,
      actionId
    });
    return result[0]?.affectedRows > 0;
  }

  async getActionsByType(codTipo: string): Promise<Action[]> {
    const query = `
      SELECT * FROM seguridad.acciones
      WHERE cod_tipo = @codTipo
    `;

    return this.executeQuery<Action>(query, { codTipo });
  }
} 