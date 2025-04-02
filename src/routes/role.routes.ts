import { Router } from 'express';
import { RoleController } from '../controllers/role.controller';

const router = Router();
const roleController = new RoleController();

// Rutas públicas (sin autenticación)
router.get('/:id', roleController.getRoleById.bind(roleController));
router.post('/', roleController.createRole.bind(roleController));
router.put('/:id', roleController.updateRole.bind(roleController));
router.delete('/:id', roleController.deleteRole.bind(roleController));
router.get('/:roleId/subs', roleController.getRoleSubs.bind(roleController));
router.post('/:roleId/subs', roleController.addRoleSub.bind(roleController));
router.put('/subs/:id', roleController.updateRoleSub.bind(roleController));
router.delete('/subs/:id', roleController.deleteRoleSub.bind(roleController));

export default router; 