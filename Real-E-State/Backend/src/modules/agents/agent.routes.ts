import { Router } from 'express';
import { authenticate, authorizeRoles } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validation.middleware';
import * as controller from './agent.controller';
import { createAgentSchema, updateAgentSchema } from './agent.validation';

const router = Router();

router.use(authenticate);
router.use(authorizeRoles('company', 'super_admin'));

router.post('/', validate(createAgentSchema), controller.createAgent);
router.get('/', controller.getAgents);
router.get('/:id', controller.getAgentById);
router.put('/:id', validate(updateAgentSchema), controller.updateAgent);
router.delete('/:id', controller.deleteAgent);

export default router;
