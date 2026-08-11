import { Router } from 'express';

import { authenticate, authorizeRoles } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validation.middleware';

import * as controller from './contact.controller';
import { createContactSchema, updateContactSchema } from './contact.validation';

const router = Router();

router.use(authenticate);
router.use(authorizeRoles('company'));

router.post('/', validate(createContactSchema), controller.createContact);
router.get('/', controller.getContacts);
router.get('/:id', controller.getContactById);
router.put('/:id', validate(updateContactSchema), controller.updateContact);
router.delete('/:id', controller.deleteContact);

export default router;
