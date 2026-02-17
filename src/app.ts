import express from 'express';
import { registerRoutes } from './routes/routes';

const app = express();

app.use(express.json());

registerRoutes(app);

export default app; // default export for testing purposes
