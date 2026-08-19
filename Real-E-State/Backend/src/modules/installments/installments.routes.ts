import { Router } from 'express';

const router = Router();

// TODO: Implement installments routes
router.get('/', (req, res) => {
  res.json({ message: 'installments route working' });
});

export default router;
