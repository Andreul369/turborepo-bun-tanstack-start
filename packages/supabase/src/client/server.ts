import { createServerClient } from '@supabase/ssr';
import { getCookies, setCookie } from '@tanstack/react-start/server';
import type { Database } from '../types';

const conWarn = console.warn;
const conLog = console.log;

const IGNORE_WARNINGS = ['Using the user object as returned from supabase.auth.getSession()'];

console.warn = (...args) => {
  const match = args.find((arg) =>
    typeof arg === 'string' ? IGNORE_WARNINGS.find((warning) => arg.includes(warning)) : false,
  );
  if (!match) {
    conWarn(...args);
  }
};

console.log = (...args) => {
  const match = args.find((arg) =>
    typeof arg === 'string' ? IGNORE_WARNINGS.find((warning) => arg.includes(warning)) : false,
  );
  if (!match) {
    conLog(...args);
  }
};

type CreateClientOptions = {
  admin?: boolean;
  schema?: 'public' | 'storage';
};

export async function createClient(options?: CreateClientOptions) {
  const { admin = false, ...rest } = options ?? {};

  const key = admin ? process.env.SUPABASE_SECRET_KEY! : process.env.SUPABASE_PUBLISHABLE_KEY!;

  const auth = admin
    ? {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      }
    : {};

  return createServerClient<Database>(process.env.SUPABASE_URL!, key, {
    ...rest,
    cookies: {
      getAll() {
        return Object.entries(getCookies()).map(([name, value]) => ({
          name,
          value,
        }));
      },
      setAll(cookies) {
        cookies.forEach((cookie) => {
          setCookie(cookie.name, cookie.value);
        });
      },
    },
    auth,
  });
}
