#!/usr/bin/env node

import { exec } from 'child_process'
import { promisify } from 'util'
const execAsync = promisify(exec)

// Configuración
const PORTS_TO_TRY = ['8080', '8081', '3000', '5173']
let BASE_URL = null
const TEST_TIMEOUT = 10000 // 10 segundos

// Rutas a verificar
const routes = {
  public: ['/', '/login', '/admin/login'],
  protected: [
    '/cuenta',
    '/cuenta/perfil',
    '/cuenta/pedidos',
    '/cuenta/favoritos',
    '/cuenta/direcciones',
    '/cuenta/seguridad',
  ],
  admin: ['/admin', '/admin/productos', '/admin/usuarios', '/admin/ventas'],
}

async function checkRoute(url) {
  try {
    console.log(`🔍 Verificando: ${url}`)

    // Usar curl para hacer la petición
    const { stdout, stderr } = await execAsync(
      `curl -s -o /dev/null -w "%{http_code}" "${url}"`,
      {
        timeout: TEST_TIMEOUT,
      }
    )

    const statusCode = stdout.trim()

    if (statusCode === '200') {
      console.log(`✅ ${url} - Respuesta: ${statusCode}`)
      return { url, status: statusCode, success: true }
    } else if (statusCode === '404') {
      console.log(`❌ ${url} - Error 404: Página no encontrada`)
      return { url, status: statusCode, success: false, error: '404 Not Found' }
    } else if (statusCode === '302' || statusCode === '301') {
      console.log(`🔄 ${url} - Redirección: ${statusCode}`)
      return { url, status: statusCode, success: true, redirect: true }
    } else {
      console.log(`⚠️ ${url} - Respuesta inesperada: ${statusCode}`)
      return {
        url,
        status: statusCode,
        success: false,
        error: `Unexpected status: ${statusCode}`,
      }
    }
  } catch (error) {
    console.log(`❌ ${url} - Error de conexión: ${error.message}`)
    return { url, success: false, error: error.message }
  }
}

async function findServerPort() {
  console.log('🔍 Buscando servidor de desarrollo...')

  for (const port of PORTS_TO_TRY) {
    try {
      const testUrl = `http://localhost:${port}`
      console.log(`   Probando puerto ${port}...`)
      await execAsync(`curl -s "${testUrl}" > /dev/null`, { timeout: 3000 })
      console.log(`✅ Servidor encontrado en puerto ${port}`)
      return testUrl
    } catch (error) {
      // Continúa con el siguiente puerto
    }
  }

  throw new Error(
    'No se encontró servidor de desarrollo en ningún puerto común'
  )
}

async function runTests() {
  console.log('🚀 Iniciando verificación de rutas - RockBros Store')
  console.log('='.repeat(60))

  // Buscar y establecer el servidor
  try {
    BASE_URL = await findServerPort()
  } catch (error) {
    console.log('❌ ' + error.message)
    console.log(
      '   Asegúrate de que el servidor esté ejecutándose con: npm run dev'
    )
    process.exit(1)
  }

  const results = {
    public: [],
    protected: [],
    admin: [],
    summary: { total: 0, success: 0, failed: 0, redirects: 0 },
  }

  // Verificar rutas públicas
  console.log('\n📂 Verificando rutas públicas...')
  for (const route of routes.public) {
    const result = await checkRoute(`${BASE_URL}${route}`)
    results.public.push(result)
    results.summary.total++
    if (result.success) {
      results.summary.success++
      if (result.redirect) results.summary.redirects++
    } else {
      results.summary.failed++
    }
    await new Promise(resolve => setTimeout(resolve, 100)) // Pequeña pausa
  }

  // Verificar rutas protegidas (esperamos redirecciones al login)
  console.log(
    '\n🔐 Verificando rutas protegidas (deberían redirigir al login)...'
  )
  for (const route of routes.protected) {
    const result = await checkRoute(`${BASE_URL}${route}`)
    results.protected.push(result)
    results.summary.total++
    if (result.success) {
      results.summary.success++
      if (result.redirect) results.summary.redirects++
    } else {
      results.summary.failed++
    }
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  // Verificar rutas de admin
  console.log('\n👑 Verificando rutas de admin...')
  for (const route of routes.admin) {
    const result = await checkRoute(`${BASE_URL}${route}`)
    results.admin.push(result)
    results.summary.total++
    if (result.success) {
      results.summary.success++
      if (result.redirect) results.summary.redirects++
    } else {
      results.summary.failed++
    }
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  // Resumen
  console.log('\n' + '='.repeat(60))
  console.log('📊 RESUMEN DE RESULTADOS')
  console.log('='.repeat(60))
  console.log(`Total de rutas verificadas: ${results.summary.total}`)
  console.log(`✅ Exitosas: ${results.summary.success}`)
  console.log(`❌ Fallidas: ${results.summary.failed}`)
  console.log(`🔄 Redirecciones: ${results.summary.redirects}`)

  if (results.summary.failed > 0) {
    console.log('\n❌ RUTAS CON PROBLEMAS:')
    ;[...results.public, ...results.protected, ...results.admin]
      .filter(r => !r.success)
      .forEach(r => {
        console.log(`   ${r.url} - ${r.error || 'Error desconocido'}`)
      })
  }

  // Consejos específicos para el problema reportado
  console.log('\n💡 DIAGNÓSTICO ESPECÍFICO:')
  const cuentaResult = results.protected.find(r => r.url.endsWith('/cuenta'))
  if (cuentaResult) {
    if (cuentaResult.success && cuentaResult.redirect) {
      console.log(
        '✅ /cuenta funciona correctamente (redirige al login como se espera)'
      )
    } else if (!cuentaResult.success) {
      console.log(
        '❌ /cuenta tiene problemas - revisa la configuración de rutas'
      )
    }
  }

  console.log('\n📝 NOTAS IMPORTANTES:')
  console.log(
    '• Las rutas protegidas DEBEN redirigir al login cuando no hay sesión'
  )
  console.log(
    '• Para probar las rutas protegidas completamente, inicia sesión primero'
  )
  console.log('• El servidor debe estar ejecutándose en puerto 8081 (no 8080)')
  console.log(`• URL correcta: ${BASE_URL}/cuenta (no localhost:8080)`)

  return results.summary.failed === 0
}

// Ejecutar
runTests()
  .then(success => {
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('Error ejecutando las pruebas:', error)
    process.exit(1)
  })
