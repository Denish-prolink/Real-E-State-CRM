import { Router } from 'express';

import authRoutes from '../modules/auth/auth.routes';

const router = Router();

router.use('/auth', authRoutes);

router.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Real-E-State CRM Backend Running',
  });
});

export default router;
