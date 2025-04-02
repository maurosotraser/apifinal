import { Router } from 'express';
import { OwnerController } from '../controllers/owner.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { checkRole } from '../middleware/role.middleware';

const router = Router();
const ownerController = new OwnerController();

/**
 * @swagger
 * /api/owners:
 *   post:
 *     summary: Create a new owner
 *     tags: [Owners]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Owner'
 *     responses:
 *       201:
 *         description: Owner created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Owner'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       500:
 *         description: Internal server error
 */
router.post('/', authenticateToken, checkRole('admin'), ownerController.createOwner);

/**
 * @swagger
 * /api/owners/{id}:
 *   get:
 *     summary: Get an owner by ID
 *     tags: [Owners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Owner ID
 *     responses:
 *       200:
 *         description: Owner found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Owner'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Owner not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', authenticateToken, ownerController.getOwnerById);

/**
 * @swagger
 * /api/owners/{id}:
 *   put:
 *     summary: Update an owner
 *     tags: [Owners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Owner ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rut_propietario:
 *                 type: integer
 *               run_propietario:
 *                 type: string
 *               nombre_propietario:
 *                 type: string
 *               apellido_propietario:
 *                 type: string
 *               email_propietario:
 *                 type: string
 *                 format: email
 *               telefono_propietario:
 *                 type: string
 *               direccion_propietario:
 *                 type: string
 *               updated_by:
 *                 type: string
 *     responses:
 *       200:
 *         description: Owner updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Owner'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: Owner not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', authenticateToken, checkRole('admin'), ownerController.updateOwner);

/**
 * @swagger
 * /api/owners/{id}:
 *   delete:
 *     summary: Delete an owner
 *     tags: [Owners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Owner ID
 *     responses:
 *       204:
 *         description: Owner deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: Owner not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authenticateToken, checkRole('admin'), ownerController.deleteOwner);

/**
 * @swagger
 * /api/owners/search:
 *   get:
 *     summary: Search owners
 *     tags: [Owners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search query string
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Owner'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/search', authenticateToken, ownerController.searchOwners);

/**
 * @swagger
 * /api/owners/membership/{membershipId}:
 *   get:
 *     summary: Get owners by membership ID
 *     tags: [Owners]
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
 *         description: Owners retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Owner'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Membership not found
 *       500:
 *         description: Internal server error
 */
router.get('/membership/:membershipId', authenticateToken, ownerController.getOwnersByMembership);

export default router; 