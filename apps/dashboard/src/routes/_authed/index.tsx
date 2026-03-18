import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useTRPC } from "@/trpc/client";

export const Route = createFileRoute("/_authed/")({
  // Server-side prefetch in the loader
  loader: async ({ context: { trpc, queryClient } }) => {
    await queryClient.ensureQueryData(trpc.users.me.queryOptions());
  },
  component: OverviewPage,
});

function OverviewPage() {
  const trpc = useTRPC();
  const { data: user } = useQuery(trpc.users.me.queryOptions());
  const username = user?.fullName;

  return (
    <>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="flex aspect-video items-center justify-center rounded-xl bg-muted">
          <h1 className="font-semibold text-3xl">Overview Page</h1>
          <p>{username}</p>
        </div>
        <div className="flex aspect-video items-center justify-center rounded-xl bg-muted">
          <h1 className="font-semibold text-3xl">Overview Page</h1>
        </div>
        <div className="flex aspect-video items-center justify-center rounded-xl bg-muted">
          <h1 className="font-semibold text-3xl">Overview Page</h1>
        </div>
      </div>
      <div className="min-h-screen flex-1 rounded-xl bg-muted md:min-h-min" />
      <div className="min-h-screen flex-1 rounded-xl bg-muted md:min-h-min" />
    </>
  );
}
