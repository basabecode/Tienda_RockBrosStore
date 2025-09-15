#!/usr/bin/env node

/**
 * 🔍 INSPECTOR DE FUNCIONES SUPABASE
 * =================================
 * Inspecciona las funciones existentes en Supabase para diagnosticar problemas
 * Fecha: 15 de septiembre de 2025
 *
 * Uso:
 *   node scripts/inspect-functions.js
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
// 🔍 INSPECCIÓN DE FUNCIONES
// ==========================================

async function inspectFunctions() {
  try {
    console.log('🔍 Inspeccionando funciones en Supabase...')

    // Consulta para obtener información de funciones
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT
          n.nspname as schema_name,
          p.proname as function_name,
          pg_get_function_identity_arguments(p.oid) as arguments,
          obj_description(p.oid, 'pg_proc') as description
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
        AND p.proname LIKE '%search%'
        ORDER BY p.proname, p.oid;
      `,
    })

    if (error) {
      console.log(
        '⚠️ No se pudo consultar funciones directamente, intentando método alternativo...'
      )

      // Método alternativo: intentar llamar a las funciones conocidas
      await inspectKnownFunctions()
      return
    }

    console.log('\n📋 FUNCIONES ENCONTRADAS:')
    console.log('==========================')

    if (data && data.length > 0) {
      data.forEach((func, index) => {
        console.log(`${index + 1}. ${func.function_name}`)
        console.log(`   Parámetros: ${func.arguments || 'Sin parámetros'}`)
        console.log(`   Descripción: ${func.description || 'Sin descripción'}`)
        console.log('')
      })
    } else {
      console.log('   No se encontraron funciones de búsqueda')
    }
  } catch (error) {
    console.log('⚠️ Error en inspección directa, usando método alternativo...')
    await inspectKnownFunctions()
  }
}

async function inspectKnownFunctions() {
  console.log('\n🔍 Probando funciones conocidas:')
  console.log('================================')

  const functionsToTest = [
    { name: 'search_products', params: {} },
    {
      name: 'search_products',
      params: { search_query: '', limit_count: 1, offset_count: 0 },
    },
    { name: 'get_featured_products', params: {} },
    { name: 'health_check_report', params: {} },
  ]

  for (const func of functionsToTest) {
    try {
      console.log(`\n📝 Probando ${func.name}...`)

      if (Object.keys(func.params).length === 0) {
        // Función sin parámetros
        const { data, error } = await supabase.rpc(func.name)
        if (error) {
          console.log(`   ❌ Error: ${error.message}`)
        } else {
          console.log(
            `   ✅ OK - Retornó ${Array.isArray(data) ? data.length : 'datos'}`
          )
        }
      } else {
        // Función con parámetros
        const { data, error } = await supabase.rpc(func.name, func.params)
        if (error) {
          console.log(`   ❌ Error: ${error.message}`)
        } else {
          console.log(
            `   ✅ OK - Retornó ${Array.isArray(data) ? data.length : 'datos'}`
          )
        }
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`)
    }
  }
}

async function showRecommendations() {
  console.log('\n💡 RECOMENDACIONES:')
  console.log('===================')

  console.log('1. Si hay múltiples versiones de search_products:')
  console.log('   - Ejecuta supabase/URGENT-FIXES.sql para limpiar')
  console.log('   - Esto eliminará todas las versiones conflictivas')

  console.log('\n2. Para verificar después de las correcciones:')
  console.log('   - npm run verify:supabase')
  console.log('   - npm run test:supabase:verbose')

  console.log('\n3. Si persisten errores:')
  console.log('   - Revisa el SQL Editor de Supabase')
  console.log('   - Busca funciones duplicadas manualmente')
}

// ==========================================
// 🎬 EJECUCIÓN
// ==========================================

async function main() {
  console.log('🔍 INSPECTOR DE FUNCIONES SUPABASE')
  console.log('==================================')
  console.log(`URL: ${supabaseUrl}`)
  console.log(`Timestamp: ${new Date().toISOString()}`)
  console.log('==================================\n')

  await inspectFunctions()
  await showRecommendations()

  console.log('\n✅ Inspección completada')
}

// Ejecutar
main().catch(error => {
  console.error('❌ Error fatal en inspección:', error.message)
  process.exit(1)
})
