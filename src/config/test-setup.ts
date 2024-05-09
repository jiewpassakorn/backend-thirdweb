import supertest from 'supertest';
import express, { Application } from 'express';
import { apiRouter } from '../routes';
import { errorHandler } from '../middlewares/errorHandler.middleware';
import { connect, closeDatabase } from '../config/test-db';

let app: Application;

beforeAll(async () => {
  await connect();
  app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use('/', apiRouter);
  app.use(errorHandler);
});

afterAll(async () => {
  await closeDatabase();
});

export { supertest, app };
