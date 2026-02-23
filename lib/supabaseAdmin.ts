// lib/supabaseAdmin.ts
import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _admin: SupabaseClient | null = null;

/**
 * Tworzy i zwraca singleton klienta ADMIN (service_role).
 * Używaj tylko po stronie serwera (route handlers, server actions).
 */
export function createAdminClient(): SupabaseClient {
  if (_admin) return _admin;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error('Brak NEXT_PUBLIC_SUPABASE_URL w env');
  }
  if (!serviceRoleKey) {
    throw new Error('Brak SUPABASE_SERVICE_ROLE_KEY w env (service_role)');
  }

  _admin = createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
    global: {
      // po stronie serwera możemy chcieć „omijać” RLS — service_role to zapewnia
      headers: { 'X-Client-Info': 'autopaczynski-admin' },
    },
  });

  return _admin;
}

/** Krótki alias, gdy wolisz nazwę `supabaseAdmin()` */
export const supabaseAdmin = () => createAdminClient();
