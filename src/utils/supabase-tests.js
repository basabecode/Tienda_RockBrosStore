// Browser tests for Supabase connectivity used by supabase-test.html
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2'

function log(...args) {
  console.log(...args)
}

export async function runSupabaseTests() {
  const params = new URLSearchParams(window.location.search)
  const url = params.get('url') || window.VITE_SUPABASE_URL || ''
  const key = params.get('key') || window.VITE_SUPABASE_ANON_KEY || ''

  if (!url || !key) {
    throw new Error('Faltan parámetros url y key. Usa ?url=...&key=...')
  }

  log(`🔧 Configuración: URL=${url}`)

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  // Test 1: conexión básica
  try {
    log('🔍 Test conexión básica...')
    const { count, error } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
    if (error) throw error
    log(`✅ Conexión OK. Productos: ${count ?? 0}`)
  } catch (e) {
    log(`❌ Conexión FAIL: ${e.message}`)
  }

  // Test 2: tablas públicas
  for (const table of ['categories', 'brands']) {
    try {
      log(`🔍 Leyendo ${table}...`)
      const { data, error } = await supabase.from(table).select('*').limit(3)
      if (error) throw error
      log(`✅ ${table} OK. Registros: ${data?.length ?? 0}`)
    } catch (e) {
      log(`❌ ${table} FAIL: ${e.message}`)
    }
  }

  // Test 3: función opcional
  try {
    log('🔍 RPC search_products...')
    const { data, error } = await supabase.rpc('search_products', {
      search_query: '',
      limit_count: 1,
      offset_count: 0,
    })
    if (error) throw error
    log(`✅ search_products OK. Resultados: ${data?.length ?? 0}`)
  } catch (e) {
    log(`⚠️ search_products no disponible: ${e.message}`)
  }
}
