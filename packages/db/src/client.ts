import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { NodePgQueryResultHKT } from 'drizzle-orm/node-postgres';
import { drizzle } from 'drizzle-orm/node-postgres';
import type { PgTransaction } from 'drizzle-orm/pg-core';
import { Pool } from 'pg';
import * as schema from './schema';

const isDevelopment = process.env.NODE_ENV === 'development';

const connectionConfig = {
  max: isDevelopment ? 8 : 12,
  idleTimeoutMillis: isDevelopment ? 5000 : 60000,
  connectionTimeoutMillis: 5000,
  maxUses: isDevelopment ? 100 : 0,
  allowExitOnIdle: true,
  ssl: isDevelopment ? false : { rejectUnauthorized: false },
};

// Primary pool — DATABASE_URL should point to the Supabase pooler
const primaryPool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  ...connectionConfig,
});

export const db = drizzle(primaryPool, {
  schema,
  casing: 'snake_case',
});

export type Database = typeof db;

export type TransactionClient = PgTransaction<
  NodePgQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;

/** Use in query functions that should work both standalone and within transactions */
export type DatabaseOrTransaction = Database | TransactionClient;

export const closeDb = async (): Promise<void> => {
  await primaryPool.end();
};
