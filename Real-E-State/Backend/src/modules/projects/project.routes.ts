import { Router } from 'express';

import { authenticate, authorizeRoles } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validation.middleware';

import * as controller from './project.controller';
import { createProjectSchema, updateProjectSchema } from './project.validation';

const router = Router();

router.use(authenticate);
router.use(authorizeRoles('agency', 'super_admin'));

router.post('/', validate(createProjectSchema), controller.createProject);
router.get('/', controller.getProjects);
router.get('/:id', controller.getProjectById);
router.put('/:id', validate(updateProjectSchema), controller.updateProject);
router.delete('/:id', controller.deleteProject);

export default router;
