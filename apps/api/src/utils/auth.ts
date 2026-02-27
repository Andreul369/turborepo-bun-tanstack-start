import { createRemoteJWKSet, importJWK, type JWTPayload, jwtVerify } from "jose";

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

const jwk = JSON.parse(process.env.SUPABASE_JWT_PUBLIC_KEY!);
const publicKey = await importJWK(jwk, "ES256");

export async function verifyAccessToken(accessToken?: string): Promise<Session | null> {
  if (!accessToken) return null;

  try {
    const { payload } = await jwtVerify(accessToken, publicKey, {
      issuer: `${process.env.SUPABASE_URL}/auth/v1`,
    });

    const supabasePayload = payload as SupabaseJWTPayload;

    return {
      user: {
        id: supabasePayload.sub!,
        email: supabasePayload.user_metadata?.email,
        full_name: supabasePayload.user_metadata?.full_name,
      },
    };
  } catch (_error) {
    return null;
  }
}