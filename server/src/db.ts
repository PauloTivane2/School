// src/db.ts
import { Pool } from 'pg';

export const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'escola_db',
  password: 'postgres',
  port: 5432,
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
