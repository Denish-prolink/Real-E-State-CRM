import { Router } from 'express';

const router = Router();

// TODO: Implement audit-logs routes
router.get('/', (req, res) => {
  res.json({ message: 'audit-logs route working' });
});

export default router;
