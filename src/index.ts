import express, { Application, Request, Response } from 'express';
import connectDB from './config/db';
import dotenv from 'dotenv';
import { apiRouter } from './routes';
import swaggerDocs from './utils/swagger';
import YAML from 'yaml';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import { errorHandler } from './middlewares/errorHandler.middleware';

dotenv.config();

export const app: Application = express();

app.get('/', (_req: Request, res: Response) => {
  return res.status(200).json({
    message: 'gm'
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', apiRouter);
app.use(errorHandler);

const file = fs.readFileSync('./swagger.yaml', 'utf8');
const swaggerDocument = YAML.parse(file);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = process.env.PORT || 3000;

app.listen(port, async () => {
  console.log(`The server is up and running at http://localhost:${port}.`);
  console.log(
    `The Swagger api docs and running at http://localhost:${port}/api-docs.`
  );
  await connectDB();
  // swaggerDocs(app, port);
});
