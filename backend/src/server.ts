import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { Pool } from 'pg';

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 3000);
const frontendOrigin = process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

app.use(cors({ origin: frontendOrigin }));
app.use(express.json());

app.get('/health', (_request, response) => {
  response.json({ status: 'ok', service: 'backend' });
});

app.get('/health/db', async (_request, response) => {
  try {
    await pool.query('SELECT 1');
    response.json({ status: 'ok', service: 'postgresql' });
  } catch (error) {
    console.error('Database healthcheck failed', error);
    response.status(503).json({ status: 'error', service: 'postgresql' });
  }
});

const server = app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});

const shutdown = async () => {
  await pool.end();
  server.close(() => process.exit(0));
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
