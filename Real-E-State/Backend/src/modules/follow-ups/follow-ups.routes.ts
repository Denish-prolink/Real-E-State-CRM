import { Router } from 'express';

const router = Router();

// TODO: Implement follow-ups routes
router.get('/', (req, res) => {
  res.json({ message: 'follow-ups route working' });
});

export default router;
