import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  return res.json({
    message: 'Welcome to the API backend for the TCG Machines full stack demo'
  });
});

router.get('/search', (req, res) => {
  const query = req.query['q'];
  return res.json({
    message: `You searcged for ${query}`
  });
});

export default router;

