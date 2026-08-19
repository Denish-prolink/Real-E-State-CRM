import { Router } from 'express';

const router = Router();

// TODO: Implement payments routes
router.get('/', (req, res) => {
  res.json({ message: 'payments route working' });
});

export default router;
