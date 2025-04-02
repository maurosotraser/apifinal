import { Router } from 'express';
import { AuditController } from '../controllers/audit.controller';

const router = Router();
const auditController = new AuditController();

// Rutas públicas (sin autenticación)
router.get('/:id', auditController.getAuditById.bind(auditController));
router.post('/', auditController.createAudit.bind(auditController));
router.get('/user/:userId', auditController.getAuditsByUser.bind(auditController));
router.get('/action/:actionId', auditController.getAuditsByAction.bind(auditController));
router.get('/date-range', auditController.getAuditsByDateRange.bind(auditController));

export default router; 