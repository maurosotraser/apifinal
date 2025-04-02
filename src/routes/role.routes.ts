import express from 'express';
import { RoleController } from '../controllers/role.controller';

const router = express.Router();
const roleController = new RoleController();

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Obtiene todos los roles
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: Lista de roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 */
router.get('/', roleController.getAllRoles.bind(roleController));

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Crea un nuevo rol
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - inserted_by
 *             properties:
 *               nombre:
 *                 type: string
 *               inserted_by:
 *                 type: string
 *     responses:
 *       201:
 *         description: Rol creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 */
router.post('/', roleController.createRole.bind(roleController));

/**
 * @swagger
 * /api/roles/{roleId}/subs:
 *   get:
 *     summary: Obtiene los subroles de un rol
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de subroles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 */
router.get('/:roleId/subs', roleController.getRoleSubs.bind(roleController));

/**
 * @swagger
 * /api/roles/{roleId}/subs:
 *   post:
 *     summary: Crea un nuevo subrol
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - inserted_by
 *             properties:
 *               nombre:
 *                 type: string
 *               inserted_by:
 *                 type: string
 *     responses:
 *       201:
 *         description: Subrol creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 */
router.post('/:roleId/subs', roleController.addRoleSub.bind(roleController));

/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     summary: Obtiene un rol por ID
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Rol encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       404:
 *         description: Rol no encontrado
 */
router.get('/:id', roleController.getRoleById.bind(roleController));

/**
 * @swagger
 * /api/roles/{id}:
 *   put:
 *     summary: Actualiza un rol existente
 *     tags: [Roles]
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
 *               updated_by:
 *                 type: string
 *     responses:
 *       200:
 *         description: Rol actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       404:
 *         description: Rol no encontrado
 */
router.put('/:id', roleController.updateRole.bind(roleController));

/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     summary: Elimina un rol
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Rol eliminado exitosamente
 *       404:
 *         description: Rol no encontrado
 */
router.delete('/:id', roleController.deleteRole.bind(roleController));

export default router; 