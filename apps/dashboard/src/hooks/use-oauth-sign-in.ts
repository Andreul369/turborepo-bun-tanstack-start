import { useState } from "react";
import { useSearch } from "@tanstack/react-router";
import { createClient } from "@monorepo/supabase/client";
import type { Provider } from "@supabase/supabase-js";
import { getUrl } from "@/utils/environment";

export type OAuthProvider = "google" | "apple" | "github";

type ProviderConfig = {
  name: string;
  icon: "Google" | "Apple" | "Github";
  scopes?: string;
  queryParams?: Record<string, string>;
  variant: "primary" | "secondary";
  supportsReturnTo: boolean;
};

const OAUTH_PROVIDERS: Record<OAuthProvider, ProviderConfig> = {
  google: {
    name: "Google",
    icon: "Google",
    queryParams: { prompt: "select_account" },
    variant: "secondary",
    supportsReturnTo: true,
  },
  apple: {
    name: "Apple",
    icon: "Apple",
    variant: "secondary",
    supportsReturnTo: false,
  },
  github: {
    name: "Github",
    icon: "Github",
    variant: "secondary",
    supportsReturnTo: true,
  },
};

export function useOAuthSignIn(provider: OAuthProvider) {
  const [isLoading, setLoading] = useState(false);
  const supabase = createClient();
  const search = useSearch({ from: "/login" });

  const config = OAUTH_PROVIDERS[provider];

  const handleSignIn = async () => {
    setLoading(true);

    const returnTo = search.return_to;

    const redirectTo = new URL("/api/auth", getUrl());
    redirectTo.searchParams.append("provider", provider);
    redirectTo.searchParams.append("return_to", returnTo ?? "");

    const queryParams = config.queryParams;

    await supabase.auth.signInWithOAuth({
      provider: provider as Provider,
      options: {
        redirectTo: redirectTo.toString(),
        scopes: config.scopes,
        queryParams,
      },
    });

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return { handleSignIn, isLoading, config };
}
