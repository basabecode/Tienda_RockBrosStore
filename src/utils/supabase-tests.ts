/**
 * 🧪 SUPABASE CONNECTION TEST SUITE
 * ==================================
 * Test completo para validar la conexión con Supabase
 * Fecha: 15 de septiembre de 2025
 *
 * Ejecutar en:
 * - Navegador: Copiar y pegar en consola
 * - Node.js: Ejecutar con ts-node o similar
 */

import { supabase } from '../lib/supabase'

// ==========================================
// 🏗️ CONFIGURACIÓN DE TESTS
// ==========================================

interface TestResult {
  name: string
  status: 'PASS' | 'FAIL' | 'SKIP'
  message: string
  duration?: number
  data?: unknown
}

class SupabaseTestSuite {
  private results: TestResult[] = []
  private startTime: number = 0

  private log(message: string, data?: unknown) {
    console.log(`🔍 ${message}`, data ? data : '')
  }

  private async runTest(
    testName: string,
    testFn: () => Promise<unknown>
  ): Promise<void> {
    const startTime = Date.now()
    this.log(`Ejecutando: ${testName}`)

    try {
      const result = await testFn()
      const duration = Date.now() - startTime

      this.results.push({
        name: testName,
        status: 'PASS',
        message: 'Test completado exitosamente',
        duration,
        data: result,
      })

      console.log(`✅ ${testName} - PASS (${duration}ms)`)
    } catch (error) {
      const duration = Date.now() - startTime
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido'

      this.results.push({
        name: testName,
        status: 'FAIL',
        message: errorMessage,
        duration,
        data: error,
      })

      console.log(`❌ ${testName} - FAIL (${duration}ms): ${errorMessage}`)
    }
  }

  // ==========================================
  // 🧪 TESTS INDIVIDUALES
  // ==========================================

  async testBasicConnection() {
    await this.runTest('Conexión Básica', async () => {
      const { data, error } = await supabase
        .from('products')
        .select('count')
        .single()

      if (error) throw new Error(`Error de conexión: ${error.message}`)
      if (data === null)
        throw new Error('No se pudo obtener el conteo de productos')

      return { connection: 'OK', productsCount: data }
    })
  }

  async testReadProducts() {
    await this.runTest('Lectura de Productos', async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, category, brand, stock, is_featured')
        .limit(5)

      if (error) throw new Error(`Error al leer productos: ${error.message}`)
      if (!data || data.length === 0)
        throw new Error('No se encontraron productos')

      return {
        productsFound: data.length,
        sampleProduct: data[0],
        categories: [...new Set(data.map(p => p.category))],
        brands: [...new Set(data.map(p => p.brand))],
      }
    })
  }

  async testReadCategories() {
    await this.runTest('Lectura de Categorías', async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug, is_active')
        .eq('is_active', true)

      if (error) throw new Error(`Error al leer categorías: ${error.message}`)

      return {
        categoriesFound: data?.length || 0,
        categories: data?.map(c => ({ name: c.name, slug: c.slug })) || [],
      }
    })
  }

  async testReadBrands() {
    await this.runTest('Lectura de Marcas', async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('id, name, slug, is_active')
        .eq('is_active', true)

      if (error) throw new Error(`Error al leer marcas: ${error.message}`)

      return {
        brandsFound: data?.length || 0,
        brands: data?.map(b => ({ name: b.name, slug: b.slug })) || [],
      }
    })
  }

  async testSearchFunction() {
    await this.runTest('Función de Búsqueda', async () => {
      const { data, error } = await supabase.rpc('search_products', {
        search_query: 'mtb',
        limit_count: 3,
      })

      if (error)
        throw new Error(`Error en función search_products: ${error.message}`)

      return {
        searchResults: data?.length || 0,
        results: data,
      }
    })
  }

  async testFeaturedProducts() {
    await this.runTest('Productos Destacados', async () => {
      const { data, error } = await supabase.rpc('get_featured_products', {
        limit_count: 4,
      })

      if (error)
        throw new Error(
          `Error en función get_featured_products: ${error.message}`
        )

      return {
        featuredProducts: data?.length || 0,
        products: data,
      }
    })
  }

  async testSiteSettings() {
    await this.runTest('Configuración del Sitio', async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value, description')

      if (error)
        throw new Error(`Error al leer configuración: ${error.message}`)

      return {
        settingsFound: data?.length || 0,
        settings:
          data?.reduce((acc, setting) => {
            acc[setting.key] = setting.value
            return acc
          }, {} as Record<string, string>) || {},
      }
    })
  }

  async testHealthCheck() {
    await this.runTest('Verificación de Salud', async () => {
      const { data, error } = await supabase.rpc('health_check_report')

      if (error)
        throw new Error(`Error en health_check_report: ${error.message}`)
      if (!data)
        throw new Error('No se recibió respuesta de health_check_report')

      return data
    })
  }

  async testRLSPolicies() {
    await this.runTest('Políticas RLS', async () => {
      // Intentar acceder a tablas que requieren autenticación
      const tablesToTest = ['favorites', 'orders', 'profiles']

      const results = []

      for (const table of tablesToTest) {
        try {
          const { data, error } = await supabase
            .from(table)
            .select('*')
            .limit(1)

          if (error && error.code === 'PGRST116') {
            // Error esperado: no tiene permisos sin autenticación
            results.push({
              table,
              status: 'PROTECTED',
              message: 'Acceso correctamente restringido',
            })
          } else if (error) {
            results.push({ table, status: 'ERROR', message: error.message })
          } else {
            results.push({
              table,
              status: 'UNPROTECTED',
              message: 'Acceso público (revisar políticas)',
            })
          }
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : 'Error desconocido'
          results.push({ table, status: 'ERROR', message: errorMessage })
        }
      }

      return { policyTests: results }
    })
  }

  async testPerformance() {
    await this.runTest('Performance Básica', async () => {
      const startTime = Date.now()

      // Ejecutar múltiples queries en paralelo
      const promises = [
        supabase.from('products').select('count').single(),
        supabase.from('categories').select('count').single(),
        supabase.from('brands').select('count').single(),
        supabase.rpc('search_products', { limit_count: 10 }),
      ]

      const results = await Promise.all(promises)
      const totalTime = Date.now() - startTime

      const hasErrors = results.some(result => result.error)

      if (hasErrors) {
        throw new Error('Errores en queries de performance')
      }

      return {
        totalTime,
        avgTime: totalTime / promises.length,
        queriesExecuted: promises.length,
        allSuccessful: !hasErrors,
      }
    })
  }

  // ==========================================
  // 🚀 EJECUCIÓN DE SUITE COMPLETA
  // ==========================================

  async runAllTests() {
    console.log('🚀 Iniciando Suite de Tests de Supabase')
    console.log('=====================================')
    console.log(`URL: ${import.meta.env.VITE_SUPABASE_URL}`)
    console.log(`Timestamp: ${new Date().toISOString()}`)
    console.log('=====================================\n')

    this.startTime = Date.now()

    // Ejecutar todos los tests
    await this.testBasicConnection()
    await this.testReadProducts()
    await this.testReadCategories()
    await this.testReadBrands()
    await this.testSearchFunction()
    await this.testFeaturedProducts()
    await this.testSiteSettings()
    await this.testHealthCheck()
    await this.testRLSPolicies()
    await this.testPerformance()

    this.showSummary()
  }

  private showSummary() {
    const totalTime = Date.now() - this.startTime
    const passed = this.results.filter(r => r.status === 'PASS').length
    const failed = this.results.filter(r => r.status === 'FAIL').length
    const skipped = this.results.filter(r => r.status === 'SKIP').length

    console.log('\n=====================================')
    console.log('📊 RESUMEN DE TESTS')
    console.log('=====================================')
    console.log(`✅ Tests Pasados: ${passed}`)
    console.log(`❌ Tests Fallidos: ${failed}`)
    console.log(`⏭️  Tests Omitidos: ${skipped}`)
    console.log(`⏱️  Tiempo Total: ${totalTime}ms`)
    console.log(
      `📈 Tasa de Éxito: ${((passed / this.results.length) * 100).toFixed(1)}%`
    )

    if (failed > 0) {
      console.log('\n❌ TESTS FALLIDOS:')
      this.results
        .filter(r => r.status === 'FAIL')
        .forEach(result => {
          console.log(`  - ${result.name}: ${result.message}`)
        })
    }

    console.log('\n🎯 RECOMENDACIONES:')
    if (failed === 0) {
      console.log(
        '  ✅ ¡Todos los tests pasaron! La conexión con Supabase está funcionando perfectamente.'
      )
    } else if (failed <= 2) {
      console.log(
        '  ⚠️ Algunos tests fallaron. Revisa la configuración y vuelve a intentar.'
      )
    } else {
      console.log(
        '  ❌ Múltiples tests fallaron. Revisa la configuración de Supabase y las variables de entorno.'
      )
    }

    console.log('\n=====================================')
  }
}

// ==========================================
// 🎬 EJECUCIÓN AUTOMÁTICA
// ==========================================

// Función para ejecutar desde navegador
export async function runSupabaseTests() {
  const testSuite = new SupabaseTestSuite()
  await testSuite.runAllTests()
}

// Auto-ejecutar si estamos en un entorno de navegador
if (typeof window !== 'undefined') {
  console.log('🎯 Ejecutando tests de Supabase automáticamente...')
  console.log(
    'Abre la consola del navegador para ver los resultados detallados.\n'
  )

  // Ejecutar tests después de un pequeño delay para asegurar que todo esté cargado
  setTimeout(() => {
    runSupabaseTests()
  }, 1000)
}

// Export para uso en Node.js o tests manuales
export { SupabaseTestSuite }

// ==========================================
// 💡 INSTRUCCIONES DE USO
// ==========================================
/*
PARA EJECUTAR EN NAVEGADOR:
1. Abre la aplicación en el navegador
2. Abre la consola del desarrollador (F12)
3. Copia y pega este archivo completo
4. Los tests se ejecutarán automáticamente

PARA EJECUTAR EN NODE.JS:
1. Instalar dependencias: npm install @supabase/supabase-js
2. Crear archivo test.js con:
   import { runSupabaseTests } from './supabase-tests.js'
   runSupabaseTests()
3. Ejecutar: node test.js

PARA EJECUTAR MANUALMENTE:
1. Importar la clase: import { SupabaseTestSuite } from './supabase-tests'
2. Crear instancia: const tests = new SupabaseTestSuite()
3. Ejecutar: await tests.runAllTests()
*/
