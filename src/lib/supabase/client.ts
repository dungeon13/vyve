import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

let _client: SupabaseClient<Database> | null = null;

export function getSupabase(): SupabaseClient<Database> {
  if (_client) return _client;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }

  _client = createClient<Database>(supabaseUrl, supabaseAnonKey);
  return _client;
}
