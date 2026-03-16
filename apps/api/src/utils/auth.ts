import { createRemoteJWKSet, type JWTPayload, jwtVerify } from "jose";

export type Session = {
  user: {
    id: string;
    email?: string;
    full_name?: string;
  };
};

type SupabaseJWTPayload = JWTPayload & {
  user_metadata?: {
    email?: string;
    full_name?: string;
    [key: string]: string | undefined;
  };
};

// Verify via JWKS (asymmetric ES256/RS256). jose caches the
// keyset in memory so only the first call hits the network.
const JWKS = createRemoteJWKSet(
  new URL(`${process.env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`),
);

function extractSession(payload: JWTPayload): Session {
  const p = payload as SupabaseJWTPayload;
  return {
    user: {
      id: p.sub!,
      email: p.user_metadata?.email,
      full_name: p.user_metadata?.full_name,
    },
  };
}

export async function verifyAccessToken(accessToken?: string): Promise<Session | null> {
  if (!accessToken) return null;

  try {
    const { payload } = await jwtVerify(accessToken, JWKS);
    return extractSession(payload);
  } catch {
    // JWKS verification failed
  }

  return null;
}
