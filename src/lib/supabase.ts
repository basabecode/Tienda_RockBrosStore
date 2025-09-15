import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Si no hay variables de entorno, usar valores de desarrollo
const defaultUrl = 'https://placeholder.supabase.co'
const defaultKey = 'placeholder-key'

// Cliente público SIN tipos estrictos (para evitar problemas de sincronización)
export const supabase = createClient(
  supabaseUrl || defaultUrl,
  supabaseAnonKey || defaultKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
)

// Export para compatibilidad con código existente
export function getSupabaseClient() {
  return supabase
}

export default supabase
