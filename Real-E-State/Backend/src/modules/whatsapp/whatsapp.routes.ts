import { Router } from 'express';

const router = Router();

// TODO: Implement whatsapp routes
router.get('/', (req, res) => {
  res.json({ message: 'whatsapp route working' });
});

export default router;
