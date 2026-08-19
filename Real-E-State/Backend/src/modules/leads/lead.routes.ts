import { Router } from 'express';

import { authenticate, authorizeModule } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validation.middleware';

import * as controller from './lead.controller';
import { createLeadSchema, updateLeadSchema } from './lead.validation';

const router = Router();

router.use(authenticate);
router.use(authorizeModule('Leads'));

router.post('/', validate(createLeadSchema), controller.createLead);
router.get('/', controller.getLeads);
router.get('/:id', controller.getLeadById);
router.put('/:id', validate(updateLeadSchema), controller.updateLead);
router.delete('/:id', controller.deleteLead);

export default router;
