import { BaseService } from './base.service';
import { Membership, RoleMembership } from '../types/models';

export class MembershipService extends BaseService {
  async createMembership(membershipData: Omit<Membership, 'id_membresia' | 'inserted_at' | 'updated_at'>): Promise<Membership> {
    const query = `
      INSERT INTO seguridad.membresias (
        id_usuario, id_propietario, ind_membresia, fecha_vigencia, inserted_by
      )
      OUTPUT INSERTED.*
      VALUES (
        @id_usuario, @id_propietario, @ind_membresia, @fecha_vigencia, @inserted_by
      )
    `;

    const result = await this.executeQuery<Membership>(query, membershipData);
    return result[0];
  }

  async getMembershipById(id: number): Promise<Membership | null> {
    const query = `
      SELECT * FROM seguridad.membresias
      WHERE id_membresia = @id
    `;

    const result = await this.executeQuery<Membership>(query, { id });
    return result[0] || null;
  }

  async updateMembership(id: number, membershipData: Partial<Membership>): Promise<Membership | null> {
    const query = `
      UPDATE seguridad.membresias
      SET 
        ind_membresia = COALESCE(@ind_membresia, ind_membresia),
        fecha_vigencia = COALESCE(@fecha_vigencia, fecha_vigencia),
        updated_by = @updated_by,
        updated_at = GETDATE()
      OUTPUT INSERTED.*
      WHERE id_membresia = @id
    `;

    const result = await this.executeQuery<Membership>(query, {
      id,
      ...membershipData,
      updated_by: membershipData.updated_by || 'system'
    });

    return result[0] || null;
  }

  async deleteMembership(id: number): Promise<boolean> {
    const query = `
      DELETE FROM seguridad.membresias
      WHERE id_membresia = @id
    `;

    const result = await this.executeQuery<{ affectedRows: number }>(query, { id });
    return result[0]?.affectedRows > 0;
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