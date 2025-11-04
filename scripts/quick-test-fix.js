#!/usr/bin/env node

import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

// Configuración
const BASE_URL = 'http://localhost:8081'
const TEST_TIMEOUT = 5000

const routes = [
  '/',
  '/login',
  '/cuenta',
  '/cuenta/perfil',
  '/cuenta/pedidos',
  '/cuenta/favoritos',
  '/cuenta/direcciones',
  '/cuenta/seguridad',
  '/admin/login',
  '/admin',
]

async function testRoute(route) {
  try {
    const command = `powershell -Command "try { $response = Invoke-WebRequest -Uri '${BASE_URL}${route}' -Method HEAD -UseBasicParsing -TimeoutSec 5; Write-Output $response.StatusCode } catch { Write-Output 'ERROR' }"`

    const { stdout } = await execAsync(command, { timeout: TEST_TIMEOUT })
    const statusCode = stdout.trim()

    if (statusCode === '200') {
      console.log(`✅ ${route} - OK (${statusCode})`)
      return true
    } else if (statusCode === '302' || statusCode === '301') {
      console.log(`🔄 ${route} - Redirect (${statusCode})`)
      return true
    } else {
      console.log(`❌ ${route} - Error (${statusCode})`)
      return false
    }
  } catch (error) {
    console.log(`❌ ${route} - Connection error`)
    return false
  }
}

async function runQuickTest() {
  console.log('🚀 Quick Route Test - Post SearchProvider Fix')
  console.log('='.repeat(50))

  let passed = 0
  let total = routes.length

  for (const route of routes) {
    const success = await testRoute(route)
    if (success) passed++
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  console.log('='.repeat(50))
  console.log(`📊 Results: ${passed}/${total} routes working`)

  if (passed === total) {
    console.log('🎉 All routes are working correctly!')
    console.log('✅ SearchProvider fix was successful')
  } else {
    console.log('⚠️ Some routes still have issues')
  }

  console.log('\n💡 Next steps:')
  console.log('1. Open http://localhost:8081 in your browser')
  console.log('2. Check browser console for any remaining errors')
  console.log('3. Test login functionality')
  console.log('4. Navigate through the /cuenta menu')

  return passed === total
}

runQuickTest()
  .then(success => process.exit(success ? 0 : 1))
  .catch(error => {
    console.error('Test failed:', error.message)
    process.exit(1)
  })
