import { Router } from 'express';
import { ActionController } from '../controllers/action.controller';
import { authenticateToken, checkRole } from '../middleware/auth.middleware';

const router = Router();
const actionController = new ActionController();

/**
 * @swagger
 * /api/actions:
 *   post:
 *     summary: Create a new action
 *     tags: [Actions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Action'
 *     responses:
 *       201:
 *         description: Action created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Action'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       500:
 *         description: Internal server error
 */
router.post('/', authenticateToken, checkRole(['ADMIN']), actionController.createAction.bind(actionController));

/**
 * @swagger
 * /api/actions/{id}:
 *   get:
 *     summary: Get an action by ID
 *     tags: [Actions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Action ID
 *     responses:
 *       200:
 *         description: Action found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Action'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Action not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', authenticateToken, actionController.getActionById.bind(actionController));

/**
 * @swagger
 * /api/actions/{id}:
 *   put:
 *     summary: Update an action
 *     tags: [Actions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Action ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               cod_tipo:
 *                 type: string
 *               htmlcode:
 *                 type: string
 *                 nullable: true
 *               updated_by:
 *                 type: string
 *     responses:
 *       200:
 *         description: Action updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Action'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: Action not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', authenticateToken, checkRole(['ADMIN']), actionController.updateAction.bind(actionController));

/**
 * @swagger
 * /api/actions/{id}:
 *   delete:
 *     summary: Delete an action
 *     tags: [Actions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Action ID
 *     responses:
 *       204:
 *         description: Action deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: Action not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authenticateToken, checkRole(['ADMIN']), actionController.deleteAction.bind(actionController));

/**
 * @swagger
 * /api/actions/membership/{membershipId}:
 *   get:
 *     summary: Get actions by membership ID
 *     tags: [Actions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: membershipId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Membership ID
 *     responses:
 *       200:
 *         description: Actions retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Membership not found
 *       500:
 *         description: Internal server error
 */
router.get('/membership/:membershipId', authenticateToken, actionController.getActionsByMembership.bind(actionController));

/**
 * @swagger
 * /api/actions/membership:
 *   post:
 *     summary: Add an action to a membership
 *     tags: [Actions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_membresia:
 *                 type: integer
 *               id_accion:
 *                 type: integer
 *               inserted_by:
 *                 type: string
 *     responses:
 *       201:
 *         description: Action added to membership successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: Membership or Action not found
 *       500:
 *         description: Internal server error
 */
router.post('/membership', authenticateToken, checkRole(['ADMIN']), actionController.addActionToMembership.bind(actionController));

/**
 * @swagger
 * /api/actions/membership/{membershipId}/{actionId}:
 *   delete:
 *     summary: Remove an action from a membership
 *     tags: [Actions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: membershipId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Membership ID
 *       - in: path
 *         name: actionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Action ID
 *     responses:
 *       204:
 *         description: Action removed from membership successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: Membership or Action not found
 *       500:
 *         description: Internal server error
 */
router.delete('/membership/:membershipId/:actionId', authenticateToken, checkRole(['ADMIN']), actionController.removeActionFromMembership.bind(actionController));

/**
 * @swagger
 * /api/actions/type/{codTipo}:
 *   get:
 *     summary: Get actions by type code
 *     tags: [Actions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: codTipo
 *         required: true
 *         schema:
 *           type: string
 *         description: Action type code
 *     responses:
 *       200:
 *         description: Actions retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/type/:codTipo', authenticateToken, actionController.getActionsByType.bind(actionController));

export default router; 