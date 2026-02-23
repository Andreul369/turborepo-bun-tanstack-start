// import { useTRPC } from '@/trpc/client';

// import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from "@tanstack/react-router";
import { getLocale, locales, setLocale } from "@monorepo/i18n/runtime";
import { t } from "@monorepo/i18n/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@monorepo/ui/breadcrumb";
import { Button } from "@monorepo/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@monorepo/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@monorepo/ui/dropdown-menu";
import { Separator } from "@monorepo/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@monorepo/ui/sidebar";
import { toast } from "sonner";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

export const Route = createFileRoute("/")({
  component: App,
  // loader: async ({ context }) =>
  //   await context.queryClient.prefetchQuery(context.trpc.users.me.queryOptions()),
});

function App({ children }: { children: React.ReactNode }) {
  // const trpc = useTRPC();
  // const userLoaderData = Route.useLoaderData();
  // const user = useQuery(trpc.users.me.queryOptions());

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
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
        </header>
        {/* <div className="flex flex-1 flex-col gap-4 p-4 pt-0"> */}
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted" />
            <div className="aspect-video rounded-xl bg-muted" />
            <div className="aspect-video rounded-xl bg-muted" />
          </div>
          <div className="min-h-screen flex-1 rounded-xl bg-muted md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
