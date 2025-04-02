import { Router } from 'express';
import { ActionController } from '../controllers/action.controller';

const router = Router();
const actionController = new ActionController();

// Rutas públicas (sin autenticación)
router.get('/:id', actionController.getActionById.bind(actionController));
router.post('/', actionController.createAction.bind(actionController));
router.put('/:id', actionController.updateAction.bind(actionController));
router.delete('/:id', actionController.deleteAction.bind(actionController));

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
router.get('/membership/:membershipId', actionController.getActionsByMembership.bind(actionController));

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
router.post('/membership', actionController.addActionToMembership.bind(actionController));

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
router.delete('/membership/:membershipId/:actionId', actionController.removeActionFromMembership.bind(actionController));

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
router.get('/type/:codTipo', actionController.getActionsByType.bind(actionController));

export default router; 