// Which sign-in providers are switched on in Supabase. Buttons appear by themselves once a provider
// is turned on there, and disappear if it's turned off. Cached for 5 minutes.
export type Providers = { google: boolean; apple: boolean };

export async function enabledProviders(): Promise<Providers> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/settings`, {
      headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! },
      next: { revalidate: 300 },
    });
    const d = (await res.json()) as { external?: Record<string, boolean> };
    return { google: Boolean(d.external?.google), apple: Boolean(d.external?.apple) };
  } catch {
    return { google: false, apple: false };
  }
}
