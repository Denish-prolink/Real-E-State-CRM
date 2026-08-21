import { Router } from 'express';

import { authenticate, authorizeRoles } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validation.middleware';

import * as controller from './document.controller';
import { createDocumentSchema, updateDocumentSchema } from './document.validation';

const router = Router();

router.use(authenticate);
router.use(authorizeRoles('company', 'super_admin'));

router.post('/', validate(createDocumentSchema), controller.createDocument);
router.get('/', controller.getDocuments);
router.get('/:id', controller.getDocumentById);
router.put('/:id', validate(updateDocumentSchema), controller.updateDocument);
router.delete('/:id', controller.deleteDocument);

export default router;
