import { createTRPCRouter } from "@api/trpc/init";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { todosRouter } from "./todos";
import { usersRouter } from "./users";

export const appRouter = createTRPCRouter({
  todos: todosRouter,
  users: usersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
