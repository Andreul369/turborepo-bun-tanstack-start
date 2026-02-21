import { trpcServer } from '@hono/trpc-server';
import { OpenAPIHono } from '@hono/zod-openapi';
import { logger } from '@monorepo/logger';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { createTRPCContext } from './trpc/init';
import { appRouter } from './trpc/routers/_app';
import { httpLogger } from './utils/logger';

const app = new OpenAPIHono();

app.use(httpLogger());
app.use(
  secureHeaders({
    crossOriginResourcePolicy: 'cross-origin',
  }),
);

app.use(
  '*',
  cors({
    origin: process.env.ALLOWED_API_ORIGINS?.split(',') ?? [],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowHeaders: ['Authorization', 'Content-Type', 'User-Agent', 'accept-language'],
    exposeHeaders: ['Content-Length', 'Content-Type', 'Cache-Control', 'Cross-Origin-Resource-Policy'],
    maxAge: 86400,
  }),
);

app.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
    createContext: createTRPCContext,
    onError: ({ error, path }) => {
      logger.error(`[tRPC] ${path}`, {
        message: error.message,
        code: error.code,
        cause: error.cause instanceof Error ? error.cause.message : undefined,
        stack: error.stack,
      });
    },
  }),
);

app.get('/favicon.ico', (c) => c.body(null, 204));
app.get('/robots.txt', (c) => c.body(null, 204));

export default {
  port: process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3000,
  fetch: app.fetch,
  host: '0.0.0.0', // Listen on all interfaces
  idleTimeout: 60,
};
