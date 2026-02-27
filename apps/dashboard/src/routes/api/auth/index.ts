import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@monorepo/supabase/server";
import { getUrl } from "@/utils/environment";
import { sanitizeRedirectPath } from "@/utils/sanitize-redirect";

export const Route = createFileRoute("/api/auth/")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const requestUrl = new URL(request.url);
        const origin = getUrl();
        const code = requestUrl.searchParams.get("code");
        const returnTo = requestUrl.searchParams.get("return_to");

        if (code) {
          const supabase = await createClient();
          await supabase.auth.exchangeCodeForSession(code);
          if (returnTo) {
            // The middleware strips the leading "/" (e.g. "settings/accounts"),
            // but sanitizeRedirectPath requires a root-relative path starting with "/".
            const normalized = returnTo.startsWith("/") ? returnTo : `/${returnTo}`;
            const safePath = sanitizeRedirectPath(normalized);

            return new Response(null, {
              status: 302,
              headers: { Location: `${origin}${safePath}` },
            });
          }
        }

        return new Response(null, {
          status: 302,
          headers: { Location: `${origin}/` },
        });
      },
    },
  },
});
