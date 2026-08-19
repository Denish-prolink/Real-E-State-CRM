import { Router } from 'express';

const router = Router();

// TODO: Implement calls routes
router.get('/', (req, res) => {
  res.json({ message: 'calls route working' });
});

export default router;
