import { Router } from 'express';

const router = Router();

// TODO: Implement documents routes
router.get('/', (req, res) => {
  res.json({ message: 'documents route working' });
});

export default router;
