import { Router } from 'express';

const router = Router();

// TODO: Implement bookings routes
router.get('/', (req, res) => {
  res.json({ message: 'bookings route working' });
});

export default router;
