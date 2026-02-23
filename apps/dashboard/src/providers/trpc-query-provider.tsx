import type { AppRouter } from '@monorepo/api/trpc/routers/_app';
import { createClient } from '@monorepo/supabase/server';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createServerFn } from '@tanstack/react-start';
import { createTRPCClient, httpBatchLink, loggerLink } from '@trpc/client';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import type { ReactNode } from 'react';
import superjson from 'superjson';
import { TRPCProvider } from '@/trpc/client';

function getUrl() {
  const base = (() => {
    if (typeof window !== 'undefined') return '';
    return `http://localhost:${process.env.PORT ?? 3000}`;
  })();
  return `${base}/api/trpc`;
}

const getHeaders = createServerFn({ method: 'GET' }).handler(async () => {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const result: Record<string, string> = {
    Authorization: `Bearer ${session?.access_token}`,
  };

  return result;
});


export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: getUrl(),
      transformer: superjson,
      headers: getHeaders(),
    }),
    loggerLink({
      enabled: (opts) =>
        process.env.NODE_ENV === 'development' ||
        (opts.direction === 'down' && opts.result instanceof Error),
    }),
  ],
});

let context:
  | {
    queryClient: QueryClient;
    trpc: ReturnType<typeof createTRPCOptionsProxy<AppRouter>>;
  }
  | undefined;

export function getContext() {
  if (context) {
    return context;
  }

  const queryClient = new QueryClient({
    defaultOptions: {
      dehydrate: { serializeData: superjson.serialize },
      hydrate: { deserializeData: superjson.deserialize },
    },
  });

  const serverHelpers = createTRPCOptionsProxy({
    queryClient: queryClient,
    client: trpcClient,
  });
  context = {
    queryClient,
    trpc: serverHelpers,
  };

  return context;
}

export function TanStackQueryProvider({ children }: { children: ReactNode }) {
  const { queryClient } = getContext();

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}
