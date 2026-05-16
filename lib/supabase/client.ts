"use client";

import { createBrowserClient } from "@supabase/ssr";

let client: ReturnType<typeof createBrowserClient> | null = null;

// Returns null when Supabase env vars are not configured (e.g. local dev without
// .env.local) so the rest of the app renders without crashing.
export function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;

  if (!client) {
    client = createBrowserClient(url, key);
  }
  return client;
}
