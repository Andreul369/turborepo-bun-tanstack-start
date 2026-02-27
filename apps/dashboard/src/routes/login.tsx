import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createIsomorphicFn } from "@tanstack/react-start";
import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "@/components/forms/login-form";
import { SignupForm } from "@/components/forms/signup-form";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    return_to: (search.return_to as string) || undefined,
  }),
  component: RouteComponent,
});

function RouteComponent() {
  // Manual: You handle the logic
  function logMessageManual(msg: string) {
    if (typeof window === "undefined") {
      console.log(`[SERVER]: ${msg}`);
    } else {
      console.log(`[CLIENT]: ${msg}`);
    }
  }
  logMessageManual("Hello from the login page. Manual handling it");

  // API: Framework handles it
  const logMessageFramework = createIsomorphicFn()
    .server((msg) => console.log(`[SERVER]: ${msg}`))
    .client((msg) => console.log(`[CLIENT]: ${msg}`));
  logMessageFramework("Hello from the login page. Framework handles it");

  const [isSignup, setIsSignup] = useState(true);

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link to="/login" className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Acme Inc.
          </Link>
        </div>
        <div className="flex w-full flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            {isSignup ? (
              <SignupForm onToggle={() => setIsSignup(false)} />
            ) : (
              <LoginForm onToggle={() => setIsSignup(true)} />
            )}
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/images/post-1.webp"
          alt="Login page"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
