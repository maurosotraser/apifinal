import { BaseService } from './base.service';
import { Owner } from '../types/models';

export class OwnerService extends BaseService {
  async createOwner(ownerData: Omit<Owner, 'id_propietario' | 'inserted_at' | 'updated_at'>): Promise<Owner> {
    const query = `
      INSERT INTO propietarios (
        nombre_propietario,
        apellido_propietario,
        email_propietario,
        telefono_propietario,
        direccion_propietario,
        inserted_by
      )
      OUTPUT INSERTED.*
      VALUES (
        @nombre_propietario,
        @apellido_propietario,
        @email_propietario,
        @telefono_propietario,
        @direccion_propietario,
        @inserted_by
      )
    `;

    const result = await this.executeQuery<Owner>(query, {
      nombre_propietario: ownerData.nombre_propietario,
      apellido_propietario: ownerData.apellido_propietario,
      email_propietario: ownerData.email_propietario,
      telefono_propietario: ownerData.telefono_propietario,
      direccion_propietario: ownerData.direccion_propietario,
      inserted_by: ownerData.inserted_by
    });

    return result[0];
  }

  async getOwnerById(id: number): Promise<Owner | null> {
    const query = `
      SELECT * FROM propietarios
      WHERE id_propietario = @id
    `;

    const result = await this.executeQuery<Owner>(query, { id });
    return result[0] || null;
  }

  async updateOwner(id: number, ownerData: Partial<Omit<Owner, 'id_propietario' | 'inserted_at' | 'updated_at'>>): Promise<Owner | null> {
    const query = `
      UPDATE propietarios
      SET 
        nombre_propietario = COALESCE(@nombre_propietario, nombre_propietario),
        apellido_propietario = COALESCE(@apellido_propietario, apellido_propietario),
        email_propietario = COALESCE(@email_propietario, email_propietario),
        telefono_propietario = COALESCE(@telefono_propietario, telefono_propietario),
        direccion_propietario = COALESCE(@direccion_propietario, direccion_propietario),
        updated_by = @updated_by,
        updated_at = GETDATE()
      OUTPUT INSERTED.*
      WHERE id_propietario = @id
    `;

    const result = await this.executeQuery<Owner>(query, {
      id,
      nombre_propietario: ownerData.nombre_propietario,
      apellido_propietario: ownerData.apellido_propietario,
      email_propietario: ownerData.email_propietario,
      telefono_propietario: ownerData.telefono_propietario,
      direccion_propietario: ownerData.direccion_propietario,
      updated_by: ownerData.updated_by
    });

    return result[0] || null;
  }

  async deleteOwner(id: number): Promise<boolean> {
    const query = `
      DELETE FROM propietarios
      WHERE id_propietario = @id
    `;

    const result = await this.executeQuery<Owner>(query, { id });
    return result.length > 0;
  }

  async searchOwners(searchTerm: string): Promise<Owner[]> {
    const query = `
      SELECT * FROM propietarios
      WHERE 
        nombre_propietario LIKE @searchTerm OR
        apellido_propietario LIKE @searchTerm OR
        email_propietario LIKE @searchTerm OR
        telefono_propietario LIKE @searchTerm
      ORDER BY nombre_propietario, apellido_propietario
    `;

    return this.executeQuery<Owner>(query, { searchTerm: `%${searchTerm}%` });
  }

  async getOwnersByMembership(membershipId: number): Promise<Owner[]> {
    const query = `
      SELECT o.*
      FROM propietarios o
      INNER JOIN membresias m ON o.id_propietario = m.id_propietario
      WHERE m.id_membresia = @membershipId
    `;

    return this.executeQuery<Owner>(query, { membershipId });
  }
} 