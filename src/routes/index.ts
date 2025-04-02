import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import roleRoutes from './role.routes';
import actionRoutes from './action.routes';
import ownerRoutes from './owner.routes';
import membershipRoutes from './membership.routes';
import tokenRoutes from './token.routes';
import auditRoutes from './audit.routes';

const router = Router();

// Auth routes
router.use('/auth', authRoutes);

// Protected routes
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/actions', actionRoutes);
router.use('/owners', ownerRoutes);
router.use('/memberships', membershipRoutes);
router.use('/tokens', tokenRoutes);
router.use('/audits', auditRoutes);

export default router; 