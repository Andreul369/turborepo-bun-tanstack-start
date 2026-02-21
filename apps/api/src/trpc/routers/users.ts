import { createTRPCRouter, protectedProcedure } from '@api/trpc/init';

export const usersRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx }) => {
    const result = await getUserById(ctx.db, ctx.session.user.id);

    if (!result) {
      return undefined;
    }

    return result;
  }),
});
