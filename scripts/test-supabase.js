#!/usr/bin/env node

/**
 * 🧪 SUPABASE TEST RUNNER (Node.js)
 * =================================
 * Ejecuta tests de conexión con Supabase desde línea de comandos
 * Fecha: 15 de septiembre de 2025
 *
 * Uso:
 *   npm run test:supabase
 *   node scripts/test-supabase.js
 *   node scripts/test-supabase.js --verbose
 *   node scripts/test-supabase.js --json
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

// Cargar variables de entorno desde .env
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
// 🧪 CLASE DE TESTS
// ==========================================

class SupabaseTestRunner {
  constructor() {
    this.results = []
    this.verbose = process.argv.includes('--verbose')
    this.json = process.argv.includes('--json')
  }

  log(message, data = null) {
    if (this.json) return

    if (this.verbose || !data) {
      console.log(message)
    }

    if (data && this.verbose) {
      console.log(JSON.stringify(data, null, 2))
    }
  }

  async runTest(testName, testFn) {
    const startTime = Date.now()

    try {
      const result = await testFn()
      const duration = Date.now() - startTime

      const testResult = {
        name: testName,
        status: 'PASS',
        duration,
        data: result,
      }

      this.results.push(testResult)

      if (!this.json) {
        console.log(`✅ ${testName} - PASS (${duration}ms)`)
      }

      return testResult
    } catch (error) {
      const duration = Date.now() - startTime
      const errorMessage = error.message || 'Error desconocido'

      const testResult = {
        name: testName,
        status: 'FAIL',
        duration,
        error: errorMessage,
        data: error,
      }

      this.results.push(testResult)

      if (!this.json) {
        console.log(`❌ ${testName} - FAIL (${duration}ms): ${errorMessage}`)
      }

      return testResult
    }
  }

  // ==========================================
  // 🧪 TESTS INDIVIDUALES
  // ==========================================

  async testConnection() {
    return this.runTest('Conexión Básica', async () => {
      const { count, error } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

      if (error) throw new Error(`Error de conexión: ${error.message}`)
      return { connection: 'OK', productsCount: count ?? 0 }
    })
  }

  async testProducts() {
    return this.runTest('Lectura de Productos', async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, category, brand, stock, is_featured')
        .limit(3)

      if (error) throw new Error(`Error al leer productos: ${error.message}`)
      if (!data || data.length === 0)
        throw new Error('No se encontraron productos')

      return {
        productsFound: data.length,
        categories: [...new Set(data.map(p => p.category))],
        brands: [...new Set(data.map(p => p.brand))],
      }
    })
  }

  async testCategories() {
    return this.runTest('Lectura de Categorías', async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('name, slug')
        .eq('is_active', true)

      if (error) throw new Error(`Error al leer categorías: ${error.message}`)

      return {
        categoriesFound: data?.length || 0,
        categories: data?.map(c => c.name) || [],
      }
    })
  }

  async testSearchFunction() {
    return this.runTest('Función de Búsqueda', async () => {
      const { data, error } = await supabase.rpc('search_products', {
        search_query: 'mtb',
        limit_count: 5,
      })

      if (error)
        throw new Error(`Error en función search_products: ${error.message}`)

      return {
        searchResults: data?.length || 0,
      }
    })
  }

  async testHealthCheck() {
    return this.runTest('Verificación de Salud', async () => {
      const { data, error } = await supabase.rpc('health_check_report')

      if (error)
        throw new Error(`Error en health_check_report: ${error.message}`)
      if (!data)
        throw new Error('No se recibió respuesta de health_check_report')

      return data
    })
  }

  async testRLSPolicies() {
    return this.runTest('Políticas RLS', async () => {
      const tablesToTest = ['favorites', 'orders', 'profiles']
      const results = []

      for (const table of tablesToTest) {
        try {
          const { error } = await supabase.from(table).select('*').limit(1)

          if (error && error.code === 'PGRST116') {
            results.push({ table, status: 'PROTECTED' })
          } else if (error) {
            results.push({ table, status: 'ERROR', error: error.message })
          } else {
            results.push({ table, status: 'UNPROTECTED' })
          }
        } catch (err) {
          results.push({ table, status: 'ERROR', error: err.message })
        }
      }

      return { policyTests: results }
    })
  }

  // ==========================================
  // 🚀 EJECUCIÓN PRINCIPAL
  // ==========================================

  async runAllTests() {
    if (!this.json) {
      console.log('🚀 Ejecutando Tests de Supabase')
      console.log('================================')
      console.log(`URL: ${supabaseUrl}`)
      console.log(`Timestamp: ${new Date().toISOString()}`)
      console.log('================================\n')
    }

    const startTime = Date.now()

    // Ejecutar tests
    await this.testConnection()
    await this.testProducts()
    await this.testCategories()
    await this.testSearchFunction()
    await this.testHealthCheck()
    await this.testRLSPolicies()

    this.showSummary()

    const totalTime = Date.now() - startTime
    return {
      totalTime,
      results: this.results,
      summary: this.getSummary(),
    }
  }

  getSummary() {
    const passed = this.results.filter(r => r.status === 'PASS').length
    const failed = this.results.filter(r => r.status === 'FAIL').length
    const total = this.results.length
    const successRate = ((passed / total) * 100).toFixed(1)

    return { passed, failed, total, successRate }
  }

  showSummary() {
    if (this.json) return

    const { passed, failed, total, successRate } = this.getSummary()

    console.log('\n================================')
    console.log('📊 RESUMEN DE TESTS')
    console.log('================================')
    console.log(`✅ Tests Pasados: ${passed}`)
    console.log(`❌ Tests Fallidos: ${failed}`)
    console.log(`📈 Tasa de Éxito: ${successRate}%`)

    if (failed > 0) {
      console.log('\n❌ TESTS FALLIDOS:')
      this.results
        .filter(r => r.status === 'FAIL')
        .forEach(result => {
          console.log(`  - ${result.name}: ${result.error}`)
        })
    }

    console.log('\n================================')
  }
}

// ==========================================
// 🎬 EJECUCIÓN DEL SCRIPT
// ==========================================

async function main() {
  console.log('🚀 Iniciando tests de Supabase...')
  console.log('📋 Configuración:')
  console.log(`   URL: ${supabaseUrl ? '✅ Configurada' : '❌ Faltante'}`)
  console.log(`   Key: ${supabaseKey ? '✅ Configurada' : '❌ Faltante'}`)

  const runner = new SupabaseTestRunner()

  try {
    const result = await runner.runAllTests()

    if (runner.json) {
      console.log(JSON.stringify(result, null, 2))
    }

    // Exit code basado en resultados
    const { failed } = result.summary
    process.exit(failed > 0 ? 1 : 0)
  } catch (error) {
    console.error('❌ Error fatal ejecutando tests:', error.message)
    console.error('Stack:', error.stack)
    process.exit(1)
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
} else {
  // Si se importa como módulo, ejecutar automáticamente
  main().catch(error => {
    console.error('❌ Error en ejecución automática:', error.message)
    process.exit(1)
  })
}

export { SupabaseTestRunner }
