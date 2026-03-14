import { trpcServer } from "@hono/trpc-server";
import { OpenAPIHono } from "@hono/zod-openapi";
import { createLoggerWithContext, logger } from "@monorepo/logger";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { createTRPCContext } from "./trpc/init";
import { appRouter } from "./trpc/routers/_app";
import { httpLogger } from "./utils/logger";
import { getRequestTrace } from "./utils/request-trace";

const app = new OpenAPIHono();

app.use(httpLogger());
app.use(
  secureHeaders({
    crossOriginResourcePolicy: "cross-origin",
  }),
);

app.use(
  "*",
  cors({
    origin: process.env.ALLOWED_API_ORIGINS?.split(",") ?? [],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowHeaders: ["Authorization", "Content-Type", "User-Agent", "accept-language"],
    exposeHeaders: [
      "Content-Length",
      "Content-Type",
      "Cache-Control",
      "Cross-Origin-Resource-Policy",
    ],
    maxAge: 86400,
  }),
);

// Always emit Server-Timing so the browser Network tab shows server-side duration.
// When DEBUG_PERF is on, also log structured details to stdout.
const debugPerf = process.env.DEBUG_PERF === "true";
const perfLoggerHono = debugPerf ? createLoggerWithContext("perf:trpc") : null;

app.use("/trpc/*", async (c, next) => {
  const start = performance.now();
  await next();
  const elapsed = performance.now() - start;
  const procedures = c.req.path.replace("/trpc/", "").split(",");

  c.header(
    "Server-Timing",
    `total;dur=${elapsed.toFixed(1)},procedures;desc="${procedures.join(",")}"`,
  );

  if (perfLoggerHono) {
    const { requestId, cfRay } = getRequestTrace(c.req);
    perfLoggerHono.info("request", {
      totalMs: +elapsed.toFixed(2),
      procedureCount: procedures.length,
      procedures,
      status: c.res.status,
      requestId,
      cfRay,
    });
  }
});

app.use(
  "/trpc/*",
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

app.get("/favicon.ico", (c) => c.body(null, 204));
app.get("/robots.txt", (c) => c.body(null, 204));

export default {
  port: process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3000,
  fetch: app.fetch,
  host: "0.0.0.0", // Listen on all interfaces
  idleTimeout: 60,
};
