import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createIsomorphicFn, createServerFn } from "@tanstack/react-start";
import type { AppRouter } from "@monorepo/api/trpc/routers/_app";
import { createClient as createBrowserClient } from "@monorepo/supabase/client";
import { createClient } from "@monorepo/supabase/server";
import { createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import superjson from "superjson";
import { TRPCProvider } from "@/trpc/client";

const getUrl = createIsomorphicFn()
  .server(() => {
    const base = process.env.API_URL || "http://localhost:3003";
    return `${base}/trpc`;
  })
  .client(() => {
    const base = import.meta.env.VITE_API_URL || "";
    return `${base}/trpc`;
  });

const getHeaders = createIsomorphicFn()
  .server(async () => {
    const supabase = await createClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const result: Record<string, string> = {
      Authorization: `Bearer ${session?.access_token}`,
    };

    return result;
  })
  .client(async () => {
    const supabase = createBrowserClient();

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
      async headers() {
        const headers = await getHeaders();
        console.log("SENDING HEADERS:", headers);
        return headers;
      },
    }),
    loggerLink({
      enabled: (opts) =>
        process.env.NODE_ENV === "development" ||
        (opts.direction === "down" && opts.result instanceof Error),
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
