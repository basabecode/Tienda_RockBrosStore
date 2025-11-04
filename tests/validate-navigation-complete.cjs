/**
 * 🧪 Test Completo de Navegación - 3 Escenarios
 *
 * Valida navegación en:
 * 1. Usuario sin autenticar
 * 2. Usuario normal autenticado
 * 3. Usuario administrador
 */

const fs = require('fs')
const path = require('path')

// Colores para output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
}

class NavigationTestSuite {
  constructor() {
    this.srcPath = path.join(__dirname, '..', 'src')
    this.results = {
      timestamp: new Date().toISOString(),
      scenarios: {
        unauthenticated: { total: 0, passed: 0, failed: 0, tests: [] },
        user: { total: 0, passed: 0, failed: 0, tests: [] },
        admin: { total: 0, passed: 0, failed: 0, tests: [] },
      },
      summary: { total: 0, passed: 0, failed: 0, successRate: 0 },
    }
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`)
  }

  success(message) {
    this.log(`✅ ${message}`, 'green')
  }

  error(message) {
    this.log(`❌ ${message}`, 'red')
  }

  warning(message) {
    this.log(`⚠️  ${message}`, 'yellow')
  }

  info(message) {
    this.log(`ℹ️  ${message}`, 'blue')
  }

  async runAllTests() {
    this.log('\n🚀 INICIANDO SUITE COMPLETA DE NAVEGACIÓN', 'bold')
    this.log(`📅 ${new Date().toLocaleString('es-ES')}\n`, 'cyan')

    // Escenario 1: Usuario sin autenticar
    await this.testUnauthenticatedNavigation()

    // Escenario 2: Usuario normal
    await this.testUserNavigation()

    // Escenario 3: Administrador
    await this.testAdminNavigation()

    // Generar reporte final
    this.generateFinalReport()
  }

  async testUnauthenticatedNavigation() {
    this.log('🔓 ESCENARIO 1: USUARIO SIN AUTENTICAR', 'bold')
    this.log('-'.repeat(50), 'blue')

    const scenario = 'unauthenticated'

    // Test 1.1: Acceso a rutas públicas
    await this.runTest(scenario, 'Rutas Públicas Disponibles', () => {
      const appContent = fs.readFileSync(
        path.join(this.srcPath, 'App.tsx'),
        'utf8'
      )

      const publicRoutes = [
        { path: '/', component: 'Index', description: 'Página principal' },
        {
          path: '/product/:id',
          component: 'ProductDetail',
          description: 'Detalle de producto',
        },
        { path: '/login', component: 'Login', description: 'Página de login' },
        {
          path: '/admin/login',
          component: 'AdminLogin',
          description: 'Login admin',
        },
      ]

      let availableRoutes = 0
      publicRoutes.forEach(route => {
        if (appContent.includes(route.component)) {
          this.log(
            `     ✓ ${route.path} → ${route.component} (${route.description})`
          )
          availableRoutes++
        } else {
          this.log(
            `     ✗ ${route.path} → ${route.component} NO ENCONTRADO`,
            'red'
          )
        }
      })

      if (availableRoutes === publicRoutes.length) {
        return {
          success: true,
          message: `${availableRoutes}/${publicRoutes.length} rutas públicas disponibles`,
        }
      } else {
        return {
          success: false,
          message: `Solo ${availableRoutes}/${publicRoutes.length} rutas disponibles`,
        }
      }
    })

    // Test 1.2: Header público funcional
    await this.runTest(scenario, 'Header Navegación Pública', () => {
      const headerContent = fs.readFileSync(
        path.join(this.srcPath, 'components', 'Header.tsx'),
        'utf8'
      )

      const publicNavItems = ['Inicio', 'Productos', 'Categorías', 'Marcas']

      let foundItems = 0
      publicNavItems.forEach(item => {
        if (headerContent.includes(item)) {
          foundItems++
          this.log(`     ✓ Navegación "${item}" presente`)
        } else {
          this.log(`     ✗ Navegación "${item}" NO encontrada`, 'red')
        }
      })

      // Verificar botón de login
      const hasLoginButton =
        headerContent.includes('Login') || headerContent.includes('Iniciar')
      if (hasLoginButton) {
        foundItems++
        this.log(`     ✓ Botón de login presente`)
      }

      return {
        success: foundItems >= 4,
        message: `${foundItems}/5 elementos de navegación pública encontrados`,
      }
    })

    // Test 1.3: Protección de rutas privadas
    await this.runTest(scenario, 'Protección de Rutas Privadas', () => {
      const appContent = fs.readFileSync(
        path.join(this.srcPath, 'App.tsx'),
        'utf8'
      )

      const protectedRoutes = ['/cuenta', '/admin']

      let protectedCount = 0
      protectedRoutes.forEach(route => {
        if (
          appContent.includes('ProtectedRoute') &&
          appContent.includes(route)
        ) {
          this.log(`     ✓ Ruta ${route} está protegida`)
          protectedCount++
        } else {
          this.log(`     ✗ Ruta ${route} podría no estar protegida`, 'yellow')
        }
      })

      return {
        success: protectedCount >= 2,
        message: `${protectedCount}/2 rutas críticas protegidas`,
      }
    })

    // Test 1.4: Redirecciones de compatibilidad
    await this.runTest(scenario, 'Redirecciones de Compatibilidad', () => {
      const appContent = fs.readFileSync(
        path.join(this.srcPath, 'App.tsx'),
        'utf8'
      )

      const hasNavigateImport = appContent.includes('Navigate')
      const hasDashboardRedirect = appContent.includes('/dashboard')

      if (hasNavigateImport && hasDashboardRedirect) {
        this.log(`     ✓ Redirecciones de /dashboard configuradas`)
        return { success: true, message: 'Redirecciones legacy funcionando' }
      } else {
        return {
          success: false,
          message: 'Faltan redirecciones de compatibilidad',
        }
      }
    })

    this.log('')
  }

  async testUserNavigation() {
    this.log('👤 ESCENARIO 2: USUARIO NORMAL AUTENTICADO', 'bold')
    this.log('-'.repeat(50), 'blue')

    const scenario = 'user'

    // Test 2.1: Rutas de usuario disponibles
    await this.runTest(scenario, 'Rutas de Usuario (/cuenta/*)', () => {
      const appContent = fs.readFileSync(
        path.join(this.srcPath, 'App.tsx'),
        'utf8'
      )

      const userRoutes = [
        {
          path: '/cuenta',
          component: 'DashboardOverview',
          description: 'Panel principal',
        },
        {
          path: 'perfil',
          component: 'Profile',
          description: 'Perfil de usuario',
        },
        {
          path: 'pedidos',
          component: 'Orders',
          description: 'Historial de pedidos',
        },
        {
          path: 'favoritos',
          component: 'Favorites',
          description: 'Lista de favoritos',
        },
        {
          path: 'direcciones',
          component: 'Addresses',
          description: 'Direcciones de envío',
        },
        {
          path: 'seguridad',
          component: 'ChangePassword',
          description: 'Cambio de contraseña',
        },
      ]

      let availableRoutes = 0
      userRoutes.forEach(route => {
        if (appContent.includes(route.component)) {
          this.log(
            `     ✓ ${route.path} → ${route.component} (${route.description})`
          )
          availableRoutes++
        } else {
          this.log(
            `     ✗ ${route.path} → ${route.component} NO ENCONTRADO`,
            'red'
          )
        }
      })

      return {
        success: availableRoutes >= 5,
        message: `${availableRoutes}/${userRoutes.length} rutas de usuario disponibles`,
      }
    })

    // Test 2.2: Menú de usuario funcional
    await this.runTest(scenario, 'ClientUserMenu Completo', () => {
      const menuPath = path.join(
        this.srcPath,
        'components',
        'ClientUserMenu.tsx'
      )

      if (!fs.existsSync(menuPath)) {
        return { success: false, message: 'ClientUserMenu.tsx no encontrado' }
      }

      const menuContent = fs.readFileSync(menuPath, 'utf8')

      const userMenuItems = [
        { label: 'Mi Panel', path: '/cuenta' },
        { label: 'Mi Perfil', path: '/cuenta/perfil' },
        { label: 'Mis Pedidos', path: '/cuenta/pedidos' },
        { label: 'Lista de Deseos', path: '/cuenta/favoritos' },
        { label: 'Direcciones', path: '/cuenta/direcciones' },
        { label: 'Seguridad', path: '/cuenta/seguridad' },
      ]

      let foundItems = 0
      userMenuItems.forEach(item => {
        if (menuContent.includes(item.path)) {
          this.log(`     ✓ "${item.label}" → ${item.path}`)
          foundItems++
        } else {
          this.log(`     ✗ "${item.label}" → ${item.path} NO encontrado`, 'red')
        }
      })

      return {
        success: foundItems >= 5,
        message: `${foundItems}/${userMenuItems.length} items de menú funcionando`,
      }
    })

    // Test 2.3: Dashboard de usuario funcional
    await this.runTest(scenario, 'DashboardOverview Navegación', () => {
      const dashboardPath = path.join(
        this.srcPath,
        'pages',
        'DashboardOverview.tsx'
      )

      if (!fs.existsSync(dashboardPath)) {
        return {
          success: false,
          message: 'DashboardOverview.tsx no encontrado',
        }
      }

      const dashboardContent = fs.readFileSync(dashboardPath, 'utf8')

      const navigationLinks = [
        '/cuenta/perfil',
        '/cuenta/pedidos',
        '/cuenta/direcciones',
        '/cuenta/favoritos',
      ]

      let workingLinks = 0
      navigationLinks.forEach(link => {
        // Buscar tanto navigate(link) como onClick que incluya el link
        if (dashboardContent.includes(link)) {
          this.log(`     ✓ Navegación a ${link} configurada`)
          workingLinks++
        } else {
          this.log(`     ✗ Navegación a ${link} NO encontrada`, 'red')
        }
      })

      return {
        success: workingLinks >= 3,
        message: `${workingLinks}/${navigationLinks.length} enlaces de navegación funcionando`,
      }
    })

    // Test 2.4: Layout de usuario
    await this.runTest(scenario, 'DashboardLayout para Usuario', () => {
      const layoutPath = path.join(
        this.srcPath,
        'components',
        'DashboardLayout.tsx'
      )

      if (!fs.existsSync(layoutPath)) {
        return { success: false, message: 'DashboardLayout.tsx no encontrado' }
      }

      const layoutContent = fs.readFileSync(layoutPath, 'utf8')

      const requiredFeatures = [
        { feature: 'Header', pattern: /Header|header/ },
        { feature: 'Sidebar/Navigation', pattern: /nav|sidebar|menu/i },
        { feature: 'Outlet', pattern: /Outlet|children/ },
        { feature: 'Breadcrumbs', pattern: /breadcrumb|Breadcrumb/i },
      ]

      let foundFeatures = 0
      requiredFeatures.forEach(item => {
        if (item.pattern.test(layoutContent)) {
          this.log(`     ✓ ${item.feature} presente en layout`)
          foundFeatures++
        } else {
          this.log(`     ✗ ${item.feature} NO encontrado en layout`, 'yellow')
        }
      })

      return {
        success: foundFeatures >= 3,
        message: `${foundFeatures}/${requiredFeatures.length} características de layout presentes`,
      }
    })

    this.log('')
  }

  async testAdminNavigation() {
    this.log('🛡️  ESCENARIO 3: ADMINISTRADOR AUTENTICADO', 'bold')
    this.log('-'.repeat(50), 'blue')

    const scenario = 'admin'

    // Test 3.1: Rutas administrativas
    await this.runTest(scenario, 'Rutas Admin (/admin/*)', () => {
      const appContent = fs.readFileSync(
        path.join(this.srcPath, 'App.tsx'),
        'utf8'
      )

      const adminRoutes = [
        {
          path: '/admin',
          component: 'AdminEcommerceDashboard',
          description: 'Dashboard admin',
        },
        {
          path: 'productos',
          component: 'ProductManagement',
          description: 'Gestión productos',
        },
        {
          path: 'usuarios',
          component: 'UserManagement',
          description: 'Gestión usuarios',
        },
        {
          path: 'ventas',
          component: 'SalesManagement',
          description: 'Gestión ventas',
        },
      ]

      let availableRoutes = 0
      adminRoutes.forEach(route => {
        if (appContent.includes(route.component)) {
          this.log(
            `     ✓ ${route.path} → ${route.component} (${route.description})`
          )
          availableRoutes++
        } else {
          this.log(
            `     ✗ ${route.path} → ${route.component} NO ENCONTRADO`,
            'red'
          )
        }
      })

      return {
        success: availableRoutes >= 3,
        message: `${availableRoutes}/${adminRoutes.length} rutas admin disponibles`,
      }
    })

    // Test 3.2: Protección admin
    await this.runTest(scenario, 'Protección Admin (requireAdmin)', () => {
      const appContent = fs.readFileSync(
        path.join(this.srcPath, 'App.tsx'),
        'utf8'
      )

      const hasAdminProtection =
        appContent.includes('requireAdmin={true}') ||
        appContent.includes('requireAdmin: true')

      if (hasAdminProtection) {
        this.log(`     ✓ Rutas admin protegidas con requireAdmin`)
        return { success: true, message: 'Protección admin configurada' }
      } else {
        return {
          success: false,
          message: 'Falta protección requireAdmin en rutas admin',
        }
      }
    })

    // Test 3.3: Menú administrativo
    await this.runTest(scenario, 'AdminUserMenu Completo', () => {
      const menuPath = path.join(
        this.srcPath,
        'components',
        'AdminUserMenu.tsx'
      )

      if (!fs.existsSync(menuPath)) {
        return { success: false, message: 'AdminUserMenu.tsx no encontrado' }
      }

      const menuContent = fs.readFileSync(menuPath, 'utf8')

      const adminMenuItems = [
        { label: 'Dashboard Admin', path: '/admin' },
        { label: 'Gestión de Productos', path: '/admin/productos' },
        { label: 'Gestión de Usuarios', path: '/admin/usuarios' },
        { label: 'Revisión de Compras', path: '/admin/ventas' },
      ]

      let foundItems = 0
      adminMenuItems.forEach(item => {
        if (menuContent.includes(item.path)) {
          this.log(`     ✓ "${item.label}" → ${item.path}`)
          foundItems++
        } else {
          this.log(`     ✗ "${item.label}" → ${item.path} NO encontrado`, 'red')
        }
      })

      // Test acceso a cuenta personal desde admin
      const hasPersonalAccount = menuContent.includes('/cuenta')
      if (hasPersonalAccount) {
        this.log(`     ✓ Acceso a cuenta personal desde admin`)
        foundItems++
      }

      return {
        success: foundItems >= 4,
        message: `${foundItems}/${
          adminMenuItems.length + 1
        } items de menú admin funcionando`,
      }
    })

    // Test 3.4: Layout administrativo
    await this.runTest(scenario, 'AdminDashboardLayout', () => {
      const layoutPath = path.join(
        this.srcPath,
        'components',
        'AdminDashboardLayout.tsx'
      )

      if (!fs.existsSync(layoutPath)) {
        return {
          success: false,
          message: 'AdminDashboardLayout.tsx no encontrado',
        }
      }

      const layoutContent = fs.readFileSync(layoutPath, 'utf8')

      const adminFeatures = [
        { feature: 'AdminSidebar', pattern: /AdminSidebar/ },
        { feature: 'Header Admin', pattern: /Header|header/ },
        { feature: 'Outlet', pattern: /Outlet|children/ },
        { feature: 'Admin Protection', pattern: /admin|Admin/ },
      ]

      let foundFeatures = 0
      adminFeatures.forEach(item => {
        if (item.pattern.test(layoutContent)) {
          this.log(`     ✓ ${item.feature} presente`)
          foundFeatures++
        } else {
          this.log(`     ✗ ${item.feature} NO encontrado`, 'yellow')
        }
      })

      return {
        success: foundFeatures >= 3,
        message: `${foundFeatures}/${adminFeatures.length} características admin presentes`,
      }
    })

    // Test 3.5: Dashboard administrativo funcional
    await this.runTest(scenario, 'AdminEcommerceDashboard Funcional', () => {
      const dashboardPath = path.join(
        this.srcPath,
        'pages',
        'AdminEcommerceDashboard.tsx'
      )

      if (!fs.existsSync(dashboardPath)) {
        return {
          success: false,
          message: 'AdminEcommerceDashboard.tsx no encontrado',
        }
      }

      const dashboardContent = fs.readFileSync(dashboardPath, 'utf8')

      const adminDashboardFeatures = [
        { feature: 'KPIs/Métricas', pattern: /card|Card|metric|stats/i },
        { feature: 'Error Handling', pattern: /error|Error|try|catch/ },
        { feature: 'Loading States', pattern: /loading|Loading|pending/ },
        { feature: 'Admin Check', pattern: /admin|Admin|isAdmin/ },
      ]

      let foundFeatures = 0
      adminDashboardFeatures.forEach(item => {
        if (item.pattern.test(dashboardContent)) {
          this.log(`     ✓ ${item.feature} implementado`)
          foundFeatures++
        } else {
          this.log(`     ✗ ${item.feature} NO encontrado`, 'yellow')
        }
      })

      return {
        success: foundFeatures >= 3,
        message: `${foundFeatures}/${adminDashboardFeatures.length} características admin dashboard`,
      }
    })

    this.log('')
  }

  async runTest(scenario, testName, testFunction) {
    this.results.scenarios[scenario].total++
    this.results.summary.total++

    try {
      const result = await testFunction()

      if (result.success) {
        this.success(`${testName}: ${result.message}`)
        this.results.scenarios[scenario].passed++
        this.results.summary.passed++
        this.results.scenarios[scenario].tests.push({
          name: testName,
          status: 'PASS',
          message: result.message,
        })
      } else {
        this.error(`${testName}: ${result.message}`)
        this.results.scenarios[scenario].failed++
        this.results.summary.failed++
        this.results.scenarios[scenario].tests.push({
          name: testName,
          status: 'FAIL',
          message: result.message,
        })
      }
    } catch (error) {
      this.error(`${testName}: ERROR - ${error.message}`)
      this.results.scenarios[scenario].failed++
      this.results.summary.failed++
      this.results.scenarios[scenario].tests.push({
        name: testName,
        status: 'ERROR',
        error: error.message,
      })
    }
  }

  generateFinalReport() {
    this.results.summary.successRate =
      (this.results.summary.passed / this.results.summary.total) * 100

    this.log('\n' + '='.repeat(70), 'magenta')
    this.log('📊 REPORTE FINAL DE NAVEGACIÓN COMPLETA', 'bold')
    this.log('='.repeat(70), 'magenta')

    // Resumen por escenario
    Object.entries(this.results.scenarios).forEach(([scenario, data]) => {
      const scenarioName = {
        unauthenticated: '🔓 Usuario sin autenticar',
        user: '👤 Usuario normal',
        admin: '🛡️  Administrador',
      }[scenario]

      const successRate = data.total > 0 ? (data.passed / data.total) * 100 : 0
      const color =
        successRate >= 80 ? 'green' : successRate >= 60 ? 'yellow' : 'red'

      this.log(`\n${scenarioName}:`, 'bold')
      this.log(`  ✅ Exitosos: ${data.passed}/${data.total}`, color)
      this.log(`  📊 Tasa éxito: ${successRate.toFixed(1)}%`, color)
    })

    // Score general
    this.log(
      `\n🎯 SCORE GENERAL: ${this.results.summary.successRate.toFixed(1)}% (${
        this.results.summary.passed
      }/${this.results.summary.total})`,
      'bold'
    )

    if (this.results.summary.successRate >= 90) {
      this.log('🏆 EXCELENTE! Navegación completamente funcional', 'green')
    } else if (this.results.summary.successRate >= 80) {
      this.log('✅ MUY BUENO! Navegación mayormente funcional', 'green')
    } else if (this.results.summary.successRate >= 70) {
      this.log('⚡ BUENO! Algunas mejoras necesarias', 'yellow')
    } else {
      this.log('🚨 CRÍTICO! Problemas significativos de navegación', 'red')
    }

    // Guardar resultados
    try {
      fs.writeFileSync(
        path.join(__dirname, 'navigation-test-results.json'),
        JSON.stringify(this.results, null, 2)
      )
      this.log(
        '\n📄 Reporte detallado: tests/navigation-test-results.json',
        'blue'
      )
    } catch (error) {
      this.warning('No se pudo guardar el reporte JSON')
    }

    // Recomendaciones
    this.generateRecommendations()

    return this.results.summary.successRate >= 80
  }

  generateRecommendations() {
    this.log('\n💡 RECOMENDACIONES ESPECÍFICAS:', 'bold')

    const unauthRate =
      (this.results.scenarios.unauthenticated.passed /
        this.results.scenarios.unauthenticated.total) *
      100
    const userRate =
      (this.results.scenarios.user.passed / this.results.scenarios.user.total) *
      100
    const adminRate =
      (this.results.scenarios.admin.passed /
        this.results.scenarios.admin.total) *
      100

    if (unauthRate < 80) {
      this.warning('- Mejorar navegación pública y protección de rutas')
    }

    if (userRate < 80) {
      this.warning('- Revisar rutas y navegación de usuarios normales')
    }

    if (adminRate < 80) {
      this.warning('- Fortalecer funcionalidad administrativa')
    }

    this.log('\n📚 PRÓXIMOS PASOS:', 'bold')
    this.log('1. Ejecutar tests E2E con Playwright para validación real')
    this.log('2. Implementar tests de integración con autenticación')
    this.log('3. Agregar monitoreo de navegación en producción')
    this.log('4. Crear tests automatizados en CI/CD pipeline')
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  const testSuite = new NavigationTestSuite()
  testSuite
    .runAllTests()
    .then(success => {
      process.exit(success ? 0 : 1)
    })
    .catch(error => {
      console.error('Error crítico:', error)
      process.exit(1)
    })
}

module.exports = NavigationTestSuite
