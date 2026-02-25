import { createTRPCRouter, protectedProcedure } from "@api/trpc/init";
import { getUserById } from "@monorepo/db/queries";

export const usersRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx: { db, session } }) => {
    const result = await getUserById(db, session.user.id);

    if (!result) {
      return undefined;
    }
    return result;
  }),
});
