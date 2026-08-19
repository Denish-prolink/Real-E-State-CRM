import { Router } from 'express';

const router = Router();

// TODO: Implement settings routes
router.get('/', (req, res) => {
  res.json({ message: 'settings route working' });
});

export default router;
