import { Router } from 'express';
import { AuditController } from '../controllers/audit.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { checkRole } from '../middleware/role.middleware';

const router = Router();
const auditController = new AuditController();

/**
 * @swagger
 * /api/audits:
 *   post:
 *     summary: Create a new audit record
 *     tags: [Audits]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Audit'
 *     responses:
 *       201:
 *         description: Audit record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Audit'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       500:
 *         description: Internal server error
 */
router.post('/', authenticateToken, checkRole('admin'), auditController.createAudit);

/**
 * @swagger
 * /api/audits/{id}:
 *   get:
 *     summary: Get an audit record by ID
 *     tags: [Audits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Audit record ID
 *     responses:
 *       200:
 *         description: Audit record found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Audit'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: Audit record not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', authenticateToken, checkRole('admin'), auditController.getAuditById);

/**
 * @swagger
 * /api/audits/user/{userId}:
 *   get:
 *     summary: Get audit records by user ID
 *     tags: [Audits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: Audit records retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Audit'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/user/:userId', authenticateToken, checkRole('admin'), auditController.getAuditsByUser);

/**
 * @swagger
 * /api/audits/table/{table}:
 *   get:
 *     summary: Get audit records by table name
 *     tags: [Audits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: table
 *         required: true
 *         schema:
 *           type: string
 *         description: Table name
 *     responses:
 *       200:
 *         description: Audit records retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Audit'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       500:
 *         description: Internal server error
 */
router.get('/table/:table', authenticateToken, checkRole('admin'), auditController.getAuditsByTable);

/**
 * @swagger
 * /api/audits/action/{action}:
 *   get:
 *     summary: Get audit records by action type
 *     tags: [Audits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: action
 *         required: true
 *         schema:
 *           type: string
 *         description: Action type (e.g., CREATE, UPDATE, DELETE)
 *     responses:
 *       200:
 *         description: Audit records retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Audit'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       500:
 *         description: Internal server error
 */
router.get('/action/:action', authenticateToken, checkRole('admin'), auditController.getAuditsByAction);

/**
 * @swagger
 * /api/audits/record/{table}/{recordId}:
 *   get:
 *     summary: Get audit records for a specific record in a table
 *     tags: [Audits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: table
 *         required: true
 *         schema:
 *           type: string
 *         description: Table name
 *       - in: path
 *         name: recordId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Record ID
 *     responses:
 *       200:
 *         description: Audit records retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Audit'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       500:
 *         description: Internal server error
 */
router.get('/record/:table/:recordId', authenticateToken, checkRole('admin'), auditController.getAuditsByRecord);

/**
 * @swagger
 * /api/audits/search:
 *   get:
 *     summary: Search audit records with filters
 *     tags: [Audits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: Filter by user ID
 *       - in: query
 *         name: table
 *         schema:
 *           type: string
 *         description: Filter by table name
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *         description: Filter by action type
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter by start date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter by end date
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Audit'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       500:
 *         description: Internal server error
 */
router.get('/search', authenticateToken, checkRole('admin'), auditController.searchAudits);

/**
 * @swagger
 * /api/audits/date-range:
 *   get:
 *     summary: Get audit records within a date range
 *     tags: [Audits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date
 *     responses:
 *       200:
 *         description: Audit records retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Audit'
 *       400:
 *         description: Invalid date range
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       500:
 *         description: Internal server error
 */
router.get('/date-range', authenticateToken, checkRole('admin'), auditController.getAuditsByDateRange);

export default router; 