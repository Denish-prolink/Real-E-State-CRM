import { Router } from 'express';

import { authenticate, authorizeRoles } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validation.middleware';

import * as controller from './employee.controller';
import { createEmployeeSchema, updateEmployeeSchema } from './employee.validation';

const router = Router();

router.use(authenticate);
router.use(authorizeRoles('company'));

router.post('/', validate(createEmployeeSchema), controller.createEmployee);
router.get('/', controller.getEmployees);
router.get('/:id', controller.getEmployeeById);
router.put('/:id', validate(updateEmployeeSchema), controller.updateEmployee);
router.delete('/:id', controller.deleteEmployee);

export default router;
