import { createFileRoute, redirect } from "@tanstack/react-router";
import { createIsomorphicFn, createServerFn } from "@tanstack/react-start";
import { createClient as createBrowserClient } from "@monorepo/supabase/client";
import { createClient } from "@monorepo/supabase/server";
import { DashboardWrapper } from "@/components/dashboard-wrapper";
import { loginSchema } from "@/components/forms/login-form";

const checkAuth = createIsomorphicFn()
  .server(async () => {
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return !!session; // Returns true if session exists
  })
  .client(async () => {
    const supabase = createBrowserClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return !!session;
  });

export const loginFn = createServerFn({ method: "POST" })
  .inputValidator(loginSchema)
  .handler(async ({ data }) => {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      return {
        error: true,
        message: error.message,
      };
    }
  });

export const Route = createFileRoute("/_authed")({
  beforeLoad: ({ context, location }) => {
    if (!context.user) {
      throw redirect({
        to: "/login",
        search: {
          // adds return_to to the search params
          return_to: location.href, // or pathname??
        },
      });
    }
  },
  component: DashboardWrapper,
});

// location.href vs location.pathname:
// Scenario 1: Simple path
// User tries to access: http://localhost:3001/finance
// location.pathname: /finance
// location.href: /finance
// Result: Both are the same when there are no query params or hash

// Scenario 2: Path with query parameters
// User tries to access: http://localhost:3001/finance?tab=expenses&month=january
// location.pathname: /finance
// location.href: /finance?tab=expenses&month=january
// Result: href preserves the query parameters

// Scenario 3: Path with hash
// User tries to access: http://localhost:3001/finance#section-2
// location.pathname: /finance
// location.href: /finance#section-2
// Result: href preserves the hash fragment

// Scenario 4: Nested path with query params and hash
// User tries to access: http://localhost:3001/dashboard/settings?view=profile&edit=true#personal-info
// location.pathname: /dashboard/settings
// location.href: /dashboard/settings?view=profile&edit=true#personal-info
// Result: href preserves everything after the domain
