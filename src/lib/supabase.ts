import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)'
  )
}

// Cliente optimizado para performance
export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'Cache-Control': 'max-age=300', // Cache 5 minutos
      },
    },
    // Optimizaciones de rendimiento
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
) as SupabaseClient

export function getSupabaseClient() {
  return supabase
}

export default supabase
