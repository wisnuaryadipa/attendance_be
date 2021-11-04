import express, { ErrorRequestHandler, Request } from 'express';
import {ConditionalExpression} from 'typescript';
import bodyParser from 'body-parser';
import cors from 'cors';
import {IError} from '../interfaces/IError';
import config from '../config';
import Logger from './logger';



export default (app: express.Application) => {
    
  /**
   * Health Check endpoints
   * @TODO Explain why they are here
   */
  
  app.get('/status', (req, res) => {
    res.send('Express + TypeScript Server')
  });
  app.head('/status', (req, res) => {
    res.status(200).end();
  });

  app.enable('trust proxy');

  app.use(cors());

  // Middleware that transforms the raw string of req.body into json
  app.use(bodyParser.json());

  /// catch 404 and forward to error handler
  app.use((req: Request, res, next) => {
    const err = new Error('Not Found') as IError ;
    err.status = 404;
    next(err);
  });
  
  /// error handlers
  app.use(((err, req, res, next) => {
    /**
     * Handle 401 thrown by express-jwt library
     */
    if (err.name === 'UnauthorizedError') {
      return res
        .status(err.status)
        .send({ message: err.message })
        .end();
    }
    return next(err);
  }) as ErrorRequestHandler);

  app.use(((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
      },
    });
  }) as ErrorRequestHandler);
};