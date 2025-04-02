import { Router } from 'express';
import { MembershipController } from '../controllers/membership.controller';

const router = Router();
const membershipController = new MembershipController();

/**
 * @swagger
 * /api/memberships:
 *   get:
 *     summary: Get all memberships
 *     tags: [Memberships]
 *     responses:
 *       200:
 *         description: List of memberships
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Membership'
 *       500:
 *         description: Internal server error
 */
router.get('/', membershipController.getAllMemberships.bind(membershipController));

/**
 * @swagger
 * /api/memberships:
 *   post:
 *     summary: Create a new membership
 *     tags: [Memberships]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_usuario
 *               - id_propietario
 *               - ind_membresia
 *               - fecha_vigencia
 *             properties:
 *               id_usuario:
 *                 type: number
 *               id_propietario:
 *                 type: number
 *               ind_membresia:
 *                 type: string
 *               fecha_vigencia:
 *                 type: string
 *                 format: date-time
 *               inserted_by:
 *                 type: string
 *     responses:
 *       201:
 *         description: Membership created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Membership'
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal server error
 */
router.post('/', membershipController.createMembership.bind(membershipController));

/**
 * @swagger
 * /api/memberships/{id}:
 *   get:
 *     summary: Get a membership by ID
 *     tags: [Memberships]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Membership details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Membership'
 *       404:
 *         description: Membership not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', membershipController.getMembershipById.bind(membershipController));

/**
 * @swagger
 * /api/memberships/{id}:
 *   put:
 *     summary: Update a membership
 *     tags: [Memberships]
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
 *               id_usuario:
 *                 type: number
 *               id_propietario:
 *                 type: number
 *               ind_membresia:
 *                 type: string
 *               fecha_vigencia:
 *                 type: string
 *                 format: date-time
 *               updated_by:
 *                 type: string
 *     responses:
 *       200:
 *         description: Membership updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Membership'
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Membership not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', membershipController.updateMembership.bind(membershipController));

/**
 * @swagger
 * /api/memberships/{id}:
 *   delete:
 *     summary: Delete a membership
 *     tags: [Memberships]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Membership deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Membresía eliminada correctamente
 *       404:
 *         description: Membership not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', membershipController.deleteMembership.bind(membershipController));

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
router.get('/user/:userId', membershipController.getMembershipsByUser.bind(membershipController));

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
router.get('/owner/:ownerId', membershipController.getMembershipsByOwner.bind(membershipController));

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
router.post('/role', membershipController.addRoleToMembership.bind(membershipController));

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
router.delete('/role/:membershipId/:roleId', membershipController.removeRoleFromMembership.bind(membershipController));

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
router.get('/:membershipId/roles', membershipController.getMembershipRoles.bind(membershipController));

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
router.get('/active', membershipController.getActiveMemberships.bind(membershipController));

export default router; 