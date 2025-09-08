import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseServiceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY

// Cliente administrativo - solo para uso en entornos seguros
// IMPORTANTE: La service role key debe mantenerse en secreto
export const supabaseAdmin =
  supabaseUrl && supabaseServiceRoleKey
    ? createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null

// Helper para verificar que el cliente admin está disponible
export function requireSupabaseAdmin() {
  if (!supabaseAdmin) {
    throw new Error(
      'Supabase admin client is not configured. Make sure SUPABASE_SERVICE_ROLE_KEY is set.'
    )
  }
  return supabaseAdmin
}

export default supabaseAdmin
