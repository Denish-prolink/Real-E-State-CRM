import { Router } from 'express';

import { authenticate, authorizeRoles } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validation.middleware';

import * as controller from './site-visit.controller';
import { createSiteVisitSchema, updateSiteVisitSchema } from './site-visit.validation';

const router = Router();

router.use(authenticate);
router.use(authorizeRoles('agency', 'super_admin'));

router.post('/', validate(createSiteVisitSchema), controller.createSiteVisit);
router.get('/', controller.getSiteVisits);
router.get('/:id', controller.getSiteVisitById);
router.put('/:id', validate(updateSiteVisitSchema), controller.updateSiteVisit);
router.delete('/:id', controller.deleteSiteVisit);

export default router;
