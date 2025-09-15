#!/usr/bin/env node

/**
 * 🔧 VERIFICACIÓN RÁPIDA DE SUPABASE
 * =================================
 * Verifica estado crítico de Supabase sin ejecutar tests completos
 * Fecha: 15 de septiembre de 2025
 *
 * Uso:
 *   node scripts/verify-supabase.js
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// ==========================================
// 📋 CONFIGURACIÓN
// ==========================================

// Cargar variables de entorno
function loadEnv() {
  try {
    const envPath = join(__dirname, '..', '.env')
    const envContent = readFileSync(envPath, 'utf8')
    const envVars = {}

    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=')
      if (key && key.startsWith('VITE_')) {
        const value = valueParts.join('=').trim()
        if (value) {
          envVars[key] = value.replace(/['"]/g, '')
        }
      }
    })

    return envVars
  } catch (error) {
    console.warn(
      '⚠️ No se pudo cargar .env, usando variables de entorno del sistema'
    )
    return {}
  }
}

const env = loadEnv()
const supabaseUrl = env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey =
  env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno no encontradas')
  console.error(
    '   Asegúrate de tener VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY configuradas'
  )
  process.exit(1)
}

// Crear cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

// ==========================================
// 🔍 VERIFICACIONES CRÍTICAS
// ==========================================

async function verifyConnection() {
  try {
    console.log('🔍 Verificando conexión básica...')
    const { data, error } = await supabase
      .from('products')
      .select('count')
      .limit(1)
    if (error) throw error
    console.log('✅ Conexión básica: OK')
    return true
  } catch (error) {
    console.log('❌ Conexión básica: FAIL')
    console.log(`   Error: ${error.message}`)
    return false
  }
}

async function verifyTables() {
  const tables = ['products', 'categories', 'brands']
  let allOk = true

  for (const table of tables) {
    try {
      console.log(`🔍 Verificando tabla ${table}...`)
      const { data, error } = await supabase.from(table).select('*').limit(1)
      if (error) throw error
      console.log(
        `✅ Tabla ${table}: OK (${
          data ? data.length : 0
        } registros encontrados)`
      )
    } catch (error) {
      console.log(`❌ Tabla ${table}: FAIL`)
      console.log(`   Error: ${error.message}`)
      allOk = false
    }
  }

  return allOk
}

async function verifyFunctions() {
  try {
    console.log('🔍 Verificando función search_products...')
    const { data, error } = await supabase.rpc('search_products', {
      search_query: '',
      limit_count: 1,
      offset_count: 0,
    })
    if (error) throw error
    console.log('✅ Función search_products: OK')
    return true
  } catch (error) {
    console.log('❌ Función search_products: FAIL')
    console.log(`   Error: ${error.message}`)
    return false
  }
}

async function verifyPolicies() {
  try {
    console.log('🔍 Verificando políticas RLS...')

    // Intentar acceder sin autenticación (debe funcionar para datos públicos)
    const { data, error } = await supabase.from('products').select('*').limit(1)
    if (error) throw error

    console.log('✅ Políticas RLS: OK (acceso público funciona)')
    return true
  } catch (error) {
    console.log('❌ Políticas RLS: FAIL')
    console.log(`   Error: ${error.message}`)
    return false
  }
}

// ==========================================
// 🎬 EJECUCIÓN
// ==========================================

async function main() {
  console.log('🚀 VERIFICACIÓN RÁPIDA DE SUPABASE')
  console.log('================================')
  console.log(`URL: ${supabaseUrl}`)
  console.log(`Timestamp: ${new Date().toISOString()}`)
  console.log('================================\n')

  const results = []

  // Ejecutar verificaciones
  results.push(await verifyConnection())
  results.push(await verifyTableStructure())
  results.push(await verifyFunctionStructure())
  results.push(await verifyUserManagement()) // Nueva verificación de usuarios
  results.push(await verifyTables())
  results.push(await verifyFunctions())
  results.push(await verifyPolicies())

  // Resumen
  console.log('\n================================')
  console.log('📊 RESUMEN DE VERIFICACIÓN')
  console.log('================================')

  const passed = results.filter(r => r).length
  const total = results.length // Ahora es 5 verificaciones

  console.log(`✅ Verificaciones pasadas: ${passed}`)
  console.log(`❌ Verificaciones fallidas: ${total - passed}`)
  console.log(`📈 Tasa de éxito: ${successRate}%`)

  if (passed === total) {
    console.log('\n🎉 ¡Todas las verificaciones pasaron! Supabase está listo.')
    process.exit(0)
  } else {
    console.log(
      '\n⚠️ Algunas verificaciones fallaron. Revisa los errores arriba.'
    )
    console.log('💡 Ejecuta: npm run test:supabase para diagnóstico completo')
    process.exit(1)
  }
}

// Ejecutar
main().catch(error => {
  console.error('❌ Error fatal en verificación:', error.message)
  process.exit(1)
})
