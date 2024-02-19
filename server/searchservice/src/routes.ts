import { Router, Request, Response } from 'express';

import searchEndpoint from './search.route';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  return res.json({
    message: 'Welcome to the API backend for the TCG full stack demo'
  });
});

router.get('/search', searchEndpoint);

export default router;

