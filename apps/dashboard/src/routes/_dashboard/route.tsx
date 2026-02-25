import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@monorepo/ui/breadcrumb";
import { Separator } from "@monorepo/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@monorepo/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

export const Route = createFileRoute("/_dashboard")({
  component: DashboardWrapper,
});

function DashboardWrapper() {
  // const trpc = useTRPC();
  // const userLoaderData = Route.useLoaderData();
  // const user = useQuery(trpc.users.me.queryOptions());

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset className="shadow-md dark:shadow-none">
        <header className="flex h-16 shrink-0 items-center justify-between border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:my-auto data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Build Your Application</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="px-4">
            <ThemeToggle />
          </div>
        </header>
        {/* <div className="flex flex-1 flex-col gap-4 p-4 pt-0"> */}
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
