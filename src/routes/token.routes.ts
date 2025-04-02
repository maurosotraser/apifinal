import { Router } from 'express';
import { TokenController } from '../controllers/token.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { checkRole } from '../middleware/role.middleware';

const router = Router();
const tokenController = new TokenController();

/**
 * @swagger
 * /api/tokens:
 *   post:
 *     summary: Create a new token
 *     tags: [Tokens]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Token'
 *     responses:
 *       201:
 *         description: Token created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Token'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       500:
 *         description: Internal server error
 */
router.post('/', authenticateToken, checkRole('admin'), tokenController.createToken);

/**
 * @swagger
 * /api/tokens/{id}:
 *   get:
 *     summary: Get a token by ID
 *     tags: [Tokens]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Token ID
 *     responses:
 *       200:
 *         description: Token found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Token'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Token not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', authenticateToken, tokenController.getTokenById);

/**
 * @swagger
 * /api/tokens/value/{token}:
 *   get:
 *     summary: Get a token by its value
 *     tags: [Tokens]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token value
 *     responses:
 *       200:
 *         description: Token found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Token'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Token not found
 *       500:
 *         description: Internal server error
 */
router.get('/value/:token', authenticateToken, tokenController.getTokenByValue);

/**
 * @swagger
 * /api/tokens/{id}:
 *   put:
 *     summary: Update a token
 *     tags: [Tokens]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Token ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_usuario:
 *                 type: integer
 *               token:
 *                 type: string
 *               fecha_creacion:
 *                 type: string
 *                 format: date-time
 *               fecha_expiracion:
 *                 type: string
 *                 format: date-time
 *               ind_validado:
 *                 type: boolean
 *               updated_by:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Token'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: Token not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', authenticateToken, checkRole('admin'), tokenController.updateToken);

/**
 * @swagger
 * /api/tokens/{id}:
 *   delete:
 *     summary: Delete a token
 *     tags: [Tokens]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Token ID
 *     responses:
 *       204:
 *         description: Token deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: Token not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authenticateToken, checkRole('admin'), tokenController.deleteToken);

/**
 * @swagger
 * /api/tokens/expired:
 *   delete:
 *     summary: Delete all expired tokens
 *     tags: [Tokens]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Expired tokens deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       500:
 *         description: Internal server error
 */
router.delete('/expired', authenticateToken, checkRole('admin'), tokenController.deleteExpiredTokens);

/**
 * @swagger
 * /api/tokens/user/{userId}:
 *   get:
 *     summary: Get tokens by user ID
 *     tags: [Tokens]
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
 *         description: Tokens retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Token'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/user/:userId', authenticateToken, tokenController.getTokensByUser);

/**
 * @swagger
 * /api/tokens/validate/{token}:
 *   get:
 *     summary: Validate a token
 *     tags: [Tokens]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token value to validate
 *     responses:
 *       200:
 *         description: Token validation result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Token not found
 *       500:
 *         description: Internal server error
 */
router.get('/validate/:token', authenticateToken, tokenController.validateToken);

export default router; 