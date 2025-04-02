import { Router } from 'express';
import { MembershipController } from '../controllers/membership.controller';
import { authenticateToken, checkRole } from '../middleware/auth.middleware';

const router = Router();
const membershipController = new MembershipController();

/**
 * @swagger
 * /api/memberships:
 *   post:
 *     summary: Create a new membership
 *     tags: [Memberships]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Membership'
 *     responses:
 *       201:
 *         description: Membership created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Membership'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       500:
 *         description: Internal server error
 */
router.post('/', authenticateToken, checkRole(['admin']), membershipController.createMembership);

/**
 * @swagger
 * /api/memberships/{id}:
 *   get:
 *     summary: Get a membership by ID
 *     tags: [Memberships]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Membership ID
 *     responses:
 *       200:
 *         description: Membership found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Membership'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Membership not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', authenticateToken, membershipController.getMembershipById);

/**
 * @swagger
 * /api/memberships/{id}:
 *   put:
 *     summary: Update a membership
 *     tags: [Memberships]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Membership ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_usuario:
 *                 type: integer
 *               id_propietario:
 *                 type: integer
 *               ind_membresia:
 *                 type: string
 *               updated_by:
 *                 type: string
 *     responses:
 *       200:
 *         description: Membership updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Membership'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: Membership not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', authenticateToken, checkRole(['admin']), membershipController.updateMembership);

/**
 * @swagger
 * /api/memberships/{id}:
 *   delete:
 *     summary: Delete a membership
 *     tags: [Memberships]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Membership ID
 *     responses:
 *       204:
 *         description: Membership deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: Membership not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authenticateToken, checkRole(['admin']), membershipController.deleteMembership);

/**
 * @swagger
 * /api/memberships/user/{userId}:
 *   get:
 *     summary: Get memberships by user ID
 *     tags: [Memberships]
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
 *         description: Memberships retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Membership'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/user/:userId', authenticateToken, membershipController.getMembershipsByUser);

/**
 * @swagger
 * /api/memberships/owner/{ownerId}:
 *   get:
 *     summary: Get memberships by owner ID
 *     tags: [Memberships]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ownerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Owner ID
 *     responses:
 *       200:
 *         description: Memberships retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Membership'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Owner not found
 *       500:
 *         description: Internal server error
 */
router.get('/owner/:ownerId', authenticateToken, membershipController.getMembershipsByOwner);

/**
 * @swagger
 * /api/memberships/role:
 *   post:
 *     summary: Add a role to a membership
 *     tags: [Memberships]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               membershipId:
 *                 type: integer
 *               roleId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Role added to membership successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: Membership or role not found
 *       500:
 *         description: Internal server error
 */
router.post('/role', authenticateToken, checkRole(['admin']), membershipController.addRoleToMembership);

/**
 * @swagger
 * /api/memberships/role/{membershipId}/{roleId}:
 *   delete:
 *     summary: Remove a role from a membership
 *     tags: [Memberships]
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
 *         name: roleId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Role ID
 *     responses:
 *       204:
 *         description: Role removed from membership successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: Membership or role not found
 *       500:
 *         description: Internal server error
 */
router.delete('/role/:membershipId/:roleId', authenticateToken, checkRole(['admin']), membershipController.removeRoleFromMembership);

/**
 * @swagger
 * /api/memberships/{membershipId}/roles:
 *   get:
 *     summary: Get roles for a membership
 *     tags: [Memberships]
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
 *         description: Roles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Membership not found
 *       500:
 *         description: Internal server error
 */
router.get('/:membershipId/roles', authenticateToken, membershipController.getMembershipRoles);

/**
 * @swagger
 * /api/memberships/active:
 *   get:
 *     summary: Get all active memberships
 *     tags: [Memberships]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active memberships retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Membership'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/active', authenticateToken, membershipController.getActiveMemberships);

export default router; 