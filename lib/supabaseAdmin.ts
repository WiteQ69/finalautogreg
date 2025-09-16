import { createClient } from '@supabase/supabase-js';

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // USTAW w .env (tylko serwer)
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}