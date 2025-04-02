import { BaseService } from './base.service';
import { Audit } from '../types/models';

export class AuditService extends BaseService {
  async createAudit(auditData: Omit<Audit, 'id_audit' | 'fecha_audit'>): Promise<Audit> {
    const query = `
      INSERT INTO auditoria (
        id_usuario,
        accion,
        tabla,
        registro_id,
        datos_anteriores,
        datos_nuevos,
        ip_address,
        user_agent
      )
      OUTPUT INSERTED.*
      VALUES (
        @id_usuario,
        @accion,
        @tabla,
        @registro_id,
        @datos_anteriores,
        @datos_nuevos,
        @ip_address,
        @user_agent
      )
    `;

    const result = await this.executeQuery<Audit>(query, auditData);
    return result[0];
  }

  async getAuditById(id: number): Promise<Audit | null> {
    const query = `
      SELECT * FROM auditoria
      WHERE id_audit = @id
    `;

    const result = await this.executeQuery<Audit>(query, { id });
    return result[0] || null;
  }

  async getAuditsByUser(userId: number): Promise<Audit[]> {
    const query = `
      SELECT * FROM auditoria
      WHERE id_usuario = @userId
      ORDER BY fecha_audit DESC
    `;

    return this.executeQuery<Audit>(query, { userId });
  }

  async getAuditsByTable(table: string): Promise<Audit[]> {
    const query = `
      SELECT * FROM auditoria
      WHERE tabla = @table
      ORDER BY fecha_audit DESC
    `;

    return this.executeQuery<Audit>(query, { table });
  }

  async getAuditsByDateRange(startDate: Date, endDate: Date): Promise<Audit[]> {
    const query = `
      SELECT * FROM auditoria
      WHERE fecha_audit BETWEEN @startDate AND @endDate
      ORDER BY fecha_audit DESC
    `;

    return this.executeQuery<Audit>(query, { startDate, endDate });
  }

  async getAuditsByAction(action: string): Promise<Audit[]> {
    const query = `
      SELECT * FROM auditoria
      WHERE accion = @action
      ORDER BY fecha_audit DESC
    `;

    return this.executeQuery<Audit>(query, { action });
  }

  async getAuditsByRecord(table: string, recordId: number): Promise<Audit[]> {
    const query = `
      SELECT * FROM auditoria
      WHERE tabla = @table AND registro_id = @recordId
      ORDER BY fecha_audit DESC
    `;

    return this.executeQuery<Audit>(query, { table, recordId });
  }

  async searchAudits(searchTerm: string): Promise<Audit[]> {
    const query = `
      SELECT * FROM auditoria
      WHERE 
        accion LIKE @searchTerm OR
        tabla LIKE @searchTerm OR
        datos_anteriores LIKE @searchTerm OR
        datos_nuevos LIKE @searchTerm
      ORDER BY fecha_audit DESC
    `;

    return this.executeQuery<Audit>(query, { searchTerm: `%${searchTerm}%` });
  }
} 