import { Router } from 'express';
import { RoleController } from '../controllers/role.controller';
import { authenticateToken, checkRole } from '../middleware/auth.middleware';

const router = Router();
const roleController = new RoleController();

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Create a new role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Role'
 *     responses:
 *       201:
 *         description: Role created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       500:
 *         description: Internal server error
 */
router.post('/', authenticateToken, checkRole(['ADMIN']), roleController.createRole.bind(roleController));

/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     summary: Get a role by ID
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Role ID
 *     responses:
 *       200:
 *         description: Role found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Role not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', authenticateToken, roleController.getRoleById.bind(roleController));

/**
 * @swagger
 * /api/roles/{id}:
 *   put:
 *     summary: Update a role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Role ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               updated_by:
 *                 type: string
 *     responses:
 *       200:
 *         description: Role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: Role not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', authenticateToken, checkRole(['ADMIN']), roleController.updateRole.bind(roleController));

/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     summary: Delete a role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Role ID
 *     responses:
 *       204:
 *         description: Role deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: Role not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authenticateToken, checkRole(['ADMIN']), roleController.deleteRole.bind(roleController));

/**
 * @swagger
 * /api/roles/{roleId}/subs:
 *   get:
 *     summary: Get role subscriptions
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Role ID
 *     responses:
 *       200:
 *         description: Role subscriptions retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Role not found
 *       500:
 *         description: Internal server error
 */
router.get('/:roleId/subs', authenticateToken, roleController.getRoleSubs.bind(roleController));

/**
 * @swagger
 * /api/roles/{roleId}/subs:
 *   post:
 *     summary: Add a role subscription
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Role ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_accion:
 *                 type: integer
 *               can_salect:
 *                 type: string
 *               can_insert:
 *                 type: string
 *               can_update:
 *                 type: string
 *               can_delete:
 *                 type: string
 *               inserted_by:
 *                 type: string
 *     responses:
 *       201:
 *         description: Role subscription added successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: Role not found
 *       500:
 *         description: Internal server error
 */
router.post('/:roleId/subs', authenticateToken, checkRole(['ADMIN']), roleController.addRoleSub.bind(roleController));

/**
 * @swagger
 * /api/roles/subs/{id}:
 *   put:
 *     summary: Update a role subscription
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Role subscription ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               can_salect:
 *                 type: string
 *               can_insert:
 *                 type: string
 *               can_update:
 *                 type: string
 *               can_delete:
 *                 type: string
 *               updated_by:
 *                 type: string
 *     responses:
 *       200:
 *         description: Role subscription updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: Role subscription not found
 *       500:
 *         description: Internal server error
 */
router.put('/subs/:id', authenticateToken, checkRole(['ADMIN']), roleController.updateRoleSub.bind(roleController));

/**
 * @swagger
 * /api/roles/subs/{id}:
 *   delete:
 *     summary: Delete a role subscription
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Role subscription ID
 *     responses:
 *       204:
 *         description: Role subscription deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: Role subscription not found
 *       500:
 *         description: Internal server error
 */
router.delete('/subs/:id', authenticateToken, checkRole(['ADMIN']), roleController.deleteRoleSub.bind(roleController));

export default router; 