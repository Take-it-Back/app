import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component; the middleware refreshes sessions.
          }
        },
      },
    }
  );
}

export type SessionUser = { id: string; email: string | null };

/**
 * Signed-in user for this request. Verifies the session token locally (no network round trip
 * with asymmetric signing keys) and is shared by the layout and page of the same request.
 */
export const getSessionUser = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const c = data?.claims;
  const user: SessionUser | null = c?.sub ? { id: c.sub, email: (c.email as string | undefined) ?? null } : null;
  return { supabase, user };
});

/** Returns a client and the signed-in user, or redirects to /login. */
export async function requireUser() {
  const { supabase, user } = await getSessionUser();
  if (!user) redirect("/login");
  return { supabase, user };
}
