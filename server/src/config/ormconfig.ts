// src/config/ormconfig.ts
import { DataSource } from 'typeorm';
import { config } from '@config/env';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  entities: ['src/modules/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: config.nodeEnv === 'development', // Não usar em produção
});