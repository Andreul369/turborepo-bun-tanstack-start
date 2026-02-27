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

// So how would I use the JWT Signing Key?

// To use the JWT Signing Key with ECC (P-256), you need to get the public key in JWK (JSON Web Key) format and use it with jose.
// Here's how:
// 1. Get the Public Key from Supabase:
// Click on that current key in the JWT Keys section to see if there's a "View Public Key" or similar option. You're looking for either:
// A JWK (JSON Web Key) format
// A PEM-encoded public key
// 2. Update your verifyAccessToken function:
// import { importJWK, jwtVerify } from "jose";// Store this in your environment or configconst SUPABASE_JWK = {  kty: "EC",  crv: "P-256",  x: "...", // You'll get these values from Supabase  y: "...",  alg: "ES256"};export async function verifyAccessToken(accessToken?: string): Promise<Session | null> {  if (!accessToken) return null;  try {    // Import the public key from JWK format    const publicKey = await importJWK(SUPABASE_JWK, 'ES256');        // Verify the JWT with the ECC public key    const { payload } = await jwtVerify(accessToken, publicKey, {      algorithms: ['ES256']    });    const supabasePayload = payload as SupabaseJWTPayload;    return {      user: {        id: supabasePayload.sub!,        email: supabasePayload.user_metadata?.email,        full_name: supabasePayload.user_metadata?.full_name,      },    };  } catch (error) {    console.log("JWT verification FAILED:", error.message);    return null;  }}
// HOWEVER, this is complex because:
// You need to extract the public key from Supabase
// You need to handle key rotation when Supabase rotates keys
// ECC keys are more complex than simple secrets
// The much simpler approach (recommended for production):
// Use Supabase's SDK which handles all of this automatically:
// import { createClient } from "@supabase/supabase-js";export async function verifyAccessToken(accessToken?: string): Promise<Session | null> {  if (!accessToken) return null;  try {    const supabase = createClient(      process.env.SUPABASE_URL!,      process.env.SUPABASE_PUBLISHABLE_KEY! // The anon key from your first screenshot    );    // This internally verifies the JWT using Supabase's public keys    const { data: { user }, error } = await supabase.auth.getUser(accessToken);    if (error || !user) {      console.log("Supabase verification failed:", error?.message);      return null;    }    return {      user: {        id: user.id,        email: user.email,        full_name: user.user_metadata?.full_name,      },    };  } catch (error) {    console.log("Verification error:", error);    return null;  }}
// Why the SDK approach is better:
// Supabase SDK automatically fetches and caches the public keys
// Handles key rotation automatically
// No need to manually manage JWKs
// One API call that does everything
// More secure and maintained by Supabase
// The SDK approach is what Supabase officially recommends for server-side token verification. Would you like to go with that approach?
