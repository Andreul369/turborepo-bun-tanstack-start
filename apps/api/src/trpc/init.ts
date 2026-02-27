import { createClient } from "@api/services/supabase";
import { type Session, verifyAccessToken } from "@api/utils/auth";
import type { Database } from "@monorepo/db/client";
import { db } from "@monorepo/db/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import { initTRPC, TRPCError } from "@trpc/server";
import type { Context } from "hono";
import superjson from "superjson";

interface TRPCContext {
  session: Session | null;
  supabase: SupabaseClient;
  db: Database;
}

export const createTRPCContext = async (_: unknown, ctx: Context): Promise<TRPCContext> => {
  const accessToken = ctx.req.header("Authorization")?.split(" ")[1];
  console.log("ACCESS TOKEN FROM HEADER:", accessToken);
  const session = await verifyAccessToken(accessToken);
  console.log("SESSION::createTRPCContext", session);

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

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(async (opts) => {
  const { session } = opts.ctx;
  console.log("SESSSSSION::::", session);
  if (!session) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Protected procedure called now" });
  }

  return opts.next({
    ctx: {
      session,
    },
  });
});
