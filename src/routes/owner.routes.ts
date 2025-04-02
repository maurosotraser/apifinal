import { Router } from 'express';
import { OwnerController } from '../controllers/owner.controller';

const router = Router();
const ownerController = new OwnerController();

// Rutas públicas (sin autenticación)
router.get('/:id', ownerController.getOwnerById.bind(ownerController));
router.post('/', ownerController.createOwner.bind(ownerController));
router.put('/:id', ownerController.updateOwner.bind(ownerController));
router.delete('/:id', ownerController.deleteOwner.bind(ownerController));

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
router.get('/search', ownerController.searchOwners.bind(ownerController));

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
router.get('/membership/:membershipId', ownerController.getOwnersByMembership.bind(ownerController));

export default router; 