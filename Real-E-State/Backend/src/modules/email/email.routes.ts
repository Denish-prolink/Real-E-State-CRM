import { Router } from 'express';

const router = Router();

// TODO: Implement email routes
router.get('/', (req, res) => {
  res.json({ message: 'email route working' });
});

export default router;
