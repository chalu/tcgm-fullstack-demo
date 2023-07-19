import type { Request, Response, NextFunction } from 'express';
type MWFunction = (req: Request, res: Response, next: NextFunction) => void;

import express, { Router }  from 'express';
import cors from 'cors';
import log from 'logger';

import morgan from './config/morgan';

const randomPort = (min = 3000, max = 6000) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  // The maximum is exclusive and the minimum is inclusive
  return Math.floor(Math.random() * (max - min) + min);
}

const expressApp = (router: Router, preRouteMWs: MWFunction[]) => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(morgan);

  for (const mw of preRouteMWs) {
    app.use('/', mw);
  }
  app.use('/', router);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    // format error
    const error = err || {};
    err.status = err.status || 500;
    if (err.errors) {
      
    }

    res.status(error.status).json({
      message: err.message,
      errors: err.errors,
    });
  });

  const port = process.env['PORT'] || randomPort();
  app.listen(port, () => {
    log.info(`Listening: http://localhost:${port}`);
  });
};

export default expressApp;