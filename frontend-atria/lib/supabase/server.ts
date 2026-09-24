import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseCookieOptions } from "./cookie-options";
import { getSupabaseAnonKey, getSupabaseUrl } from "./env";

export async function createSupabaseServerClient(): Promise<SupabaseClient> {
  const cookieStore = await cookies();

  return createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, getSupabaseCookieOptions(options));
          });
        } catch {
          /* ignore when called from a Server Component */
        }
      },
    },
  });
}
