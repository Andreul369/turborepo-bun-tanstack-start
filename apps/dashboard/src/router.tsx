// import { deLocalizeUrl, localizeUrl } from '@monorepo/i18n/runtime';
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { getContext } from "@/providers/trpc-query-provider";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
export const getRouter = () => {
  const router = createTanStackRouter({
    routeTree,

    context: getContext(),

    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,

    // rewrite: {
    //   input: ({ url }) => deLocalizeUrl(url),
    //   output: ({ url }) => localizeUrl(url),
    // },
  });

  return router;
};

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
