import type { Database } from "@monorepo/db/client";
import { db } from "@monorepo/db/client";
import { initTRPC, TRPCError } from "@trpc/server";
import type { Context } from "hono";
import superjson from "superjson";
import { verifyAccessToken, type Session } from "@api/utils/auth";
import { createClient } from "@api/services/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";

type TRPCContext = {
  session: Session | null 
  supabase: SupabaseClient;
  db: Database;
};

export const createTRPCContext = async (_: unknown, ctx: Context): Promise<TRPCContext> => {
  const accessToken = ctx.req.header("Authorization")?.split(" ")[1];
  const session = await verifyAccessToken(accessToken);

    const supabase = await createClient(accessToken);

  return {
    session,
    supabase,
    db,
  };
};

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
});

// When to add more middleware?
// Timing – if you want request timing logs
// Team permission – if you have teams and need teamId / team-scoped access
// DB selection – if you have multiple DBs and need to pick one per request
const withAuthMiddleware = t.middleware(async (opts) => {
  const { session } = opts.ctx;
  if (!session) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
  }
  return opts.next({
    ctx: {
      ...opts.ctx,
      session,
    },
  });
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(withAuthMiddleware);
