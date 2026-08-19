import { Router } from 'express';
import { authenticate, authorizeRoles } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validation.middleware';
import * as controller from './tower.controller';
import { createTowerSchema, updateTowerSchema } from './tower.validation';

const router = Router();

router.use(authenticate);
router.use(authorizeRoles('agency', 'super_admin'));

router.post('/', validate(createTowerSchema), controller.createTower);
router.get('/', controller.getTowers);
router.get('/:id', controller.getTowerById);
router.put('/:id', validate(updateTowerSchema), controller.updateTower);
router.delete('/:id', controller.deleteTower);

export default router;
