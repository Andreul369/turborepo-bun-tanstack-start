import type { AppRouter } from '@monorepo/api/trpc/routers/_app';
import { createTRPCContext } from '@trpc/tanstack-react-query';

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();
