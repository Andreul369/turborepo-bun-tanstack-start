import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/jobs")({
  component: JobsPage,
});

function JobsPage() {
  return (
    <>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="flex aspect-video items-center justify-center rounded-xl bg-muted">
          <h1 className="font-semibold text-3xl">Jobs Page</h1>
        </div>
        <div className="flex aspect-video items-center justify-center rounded-xl bg-muted">
          <h1 className="font-semibold text-3xl">Jobs Page</h1>
        </div>
        <div className="flex aspect-video items-center justify-center rounded-xl bg-muted">
          <h1 className="font-semibold text-3xl">Jobs Page</h1>
        </div>
      </div>
      <div className="min-h-screen flex-1 rounded-xl bg-muted md:min-h-min" />
      <div className="min-h-screen flex-1 rounded-xl bg-muted md:min-h-min" />
    </>
  );
}
