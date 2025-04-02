import { Request, Response } from 'express';
import { AuditService } from '../services/audit.service';
import { z } from 'zod';

const auditService = new AuditService();

// Validation schemas
const createAuditSchema = z.object({
  id_usuario: z.number(),
  accion: z.string().min(1),
  tabla: z.string().min(1),
  registro_id: z.number(),
  datos_anteriores: z.string().nullable(),
  datos_nuevos: z.string().nullable(),
  ip_address: z.string().min(1),
  user_agent: z.string().min(1)
});

export class AuditController {
  async createAudit(req: Request, res: Response) {
    try {
      const auditData = createAuditSchema.parse(req.body);
      const audit = await auditService.createAudit(auditData);
      res.status(201).json(audit);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getAuditById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const audit = await auditService.getAuditById(id);
      
      if (!audit) {
        res.status(404).json({ error: 'Audit not found' });
        return;
      }
      
      res.json(audit);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getAuditsByUser(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      const audits = await auditService.getAuditsByUser(userId);
      res.json(audits);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getAuditsByTable(req: Request, res: Response) {
    try {
      const table = req.params.table;
      const audits = await auditService.getAuditsByTable(table);
      res.json(audits);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getAuditsByDateRange(req: Request, res: Response) {
    try {
      const startDate = new Date(req.query.startDate as string);
      const endDate = new Date(req.query.endDate as string);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        res.status(400).json({ error: 'Invalid date format' });
        return;
      }

      const audits = await auditService.getAuditsByDateRange(startDate, endDate);
      res.json(audits);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getAuditsByAction(req: Request, res: Response) {
    try {
      const action = req.params.action;
      const audits = await auditService.getAuditsByAction(action);
      res.json(audits);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getAuditsByRecord(req: Request, res: Response) {
    try {
      const table = req.params.table;
      const recordId = parseInt(req.params.recordId);
      const audits = await auditService.getAuditsByRecord(table, recordId);
      res.json(audits);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async searchAudits(req: Request, res: Response) {
    try {
      const searchTerm = req.query.q as string;
      if (!searchTerm) {
        res.status(400).json({ error: 'Search term is required' });
        return;
      }

      const audits = await auditService.searchAudits(searchTerm);
      res.json(audits);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
} 