import { Router } from 'express';
import { ActionController } from '../controllers/action.controller';

const router = Router();
const actionController = new ActionController();

/**
 * @swagger
 * /api/actions:
 *   get:
 *     summary: Obtiene todas las acciones
 *     tags: [Actions]
 *     responses:
 *       200:
 *         description: Lista de acciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Action'
 */
router.get('/', actionController.getAllActions.bind(actionController));

/**
 * @swagger
 * /api/actions/{id}:
 *   get:
 *     summary: Obtiene una acción por ID
 *     tags: [Actions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Acción encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Action'
 *       404:
 *         description: Acción no encontrada
 */
router.get('/:id', actionController.getActionById.bind(actionController));

/**
 * @swagger
 * /api/actions:
 *   post:
 *     summary: Crea una nueva acción
 *     tags: [Actions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - cod_tipo
 *               - inserted_by
 *             properties:
 *               nombre:
 *                 type: string
 *               cod_tipo:
 *                 type: string
 *               htmlcode:
 *                 type: string
 *               inserted_by:
 *                 type: string
 *     responses:
 *       201:
 *         description: Acción creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Action'
 */
router.post('/', actionController.createAction.bind(actionController));

/**
 * @swagger
 * /api/actions/{id}:
 *   put:
 *     summary: Actualiza una acción existente
 *     tags: [Actions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
 *               updated_by:
 *                 type: string
 *     responses:
 *       200:
 *         description: Acción actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Action'
 *       404:
 *         description: Acción no encontrada
 */
router.put('/:id', actionController.updateAction.bind(actionController));

/**
 * @swagger
 * /api/actions/{id}:
 *   delete:
 *     summary: Elimina una acción
 *     tags: [Actions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Acción eliminada exitosamente
 *       404:
 *         description: Acción no encontrada
 */
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