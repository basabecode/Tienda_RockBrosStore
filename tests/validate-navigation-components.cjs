/**
 * 🧪 Test Ligero de Componentes de Navegación
 *
 * Valida que los componentes tengan la estructura correcta
 * sin necesidad de renderizar la aplicación completa
 */

const fs = require('fs')
const path = require('path')

class ComponentNavigationValidator {
  constructor() {
    this.srcPath = path.join(__dirname, '..', 'src')
    this.results = []
  }

  log(message, color = '\x1b[0m') {
    console.log(`${color}${message}\x1b[0m`)
  }

  validateComponent(componentPath, expectedFeatures) {
    const fullPath = path.join(this.srcPath, componentPath)

    if (!fs.existsSync(fullPath)) {
      return {
        component: componentPath,
        exists: false,
        score: 0,
        features: {},
        message: 'Componente no encontrado',
      }
    }

    const content = fs.readFileSync(fullPath, 'utf8')
    const foundFeatures = {}
    let score = 0

    expectedFeatures.forEach(feature => {
      const found = feature.pattern.test(content)
      foundFeatures[feature.name] = found
      if (found) score++
    })

    return {
      component: componentPath,
      exists: true,
      score,
      maxScore: expectedFeatures.length,
      percentage: Math.round((score / expectedFeatures.length) * 100),
      features: foundFeatures,
      message: `${score}/${expectedFeatures.length} características encontradas`,
    }
  }

  async runValidation() {
    this.log('\n🧪 VALIDACIÓN LIGERA DE COMPONENTES NAVEGACIÓN\n', '\x1b[1m')

    // Definir componentes críticos y sus características esperadas
    const componentsToValidate = [
      {
        path: 'components/Header.tsx',
        name: 'Header Principal',
        features: [
          {
            name: 'Navigation Items',
            pattern: /navigationItems|navItems|menuItems/i,
          },
          {
            name: 'User Menu',
            pattern: /UserMenu|ClientUserMenu|AdminUserMenu/,
          },
          { name: 'Cart/Shopping', pattern: /cart|shopping|Cart|Shopping/ },
          { name: 'Authentication', pattern: /auth|Auth|login|Login/ },
          { name: 'Navigation Handler', pattern: /navigate|router|Navigate/ },
          { name: 'Responsive Menu', pattern: /mobile|Mobile|hamburger|Menu/ },
        ],
      },
      {
        path: 'components/ClientUserMenu.tsx',
        name: 'Menú Usuario Cliente',
        features: [
          { name: 'User Routes', pattern: /\/cuenta/ },
          { name: 'Profile Link', pattern: /perfil|profile/i },
          { name: 'Orders Link', pattern: /pedidos|orders/i },
          { name: 'Favorites Link', pattern: /favoritos|favorites/i },
          {
            name: 'Logout Function',
            pattern: /signOut|logout|cerrar.*sesión/i,
          },
          { name: 'Navigation Handler', pattern: /navigate|onClick/ },
        ],
      },
      {
        path: 'components/AdminUserMenu.tsx',
        name: 'Menú Usuario Admin',
        features: [
          { name: 'Admin Routes', pattern: /\/admin/ },
          { name: 'Dashboard Link', pattern: /dashboard|Dashboard/ },
          { name: 'Product Management', pattern: /productos|product/i },
          { name: 'User Management', pattern: /usuarios|users/i },
          { name: 'Personal Account Access', pattern: /\/cuenta/ },
          { name: 'Admin Badge', pattern: /badge|Badge|admin.*role/i },
        ],
      },
      {
        path: 'components/DashboardLayout.tsx',
        name: 'Layout Usuario',
        features: [
          { name: 'Header Component', pattern: /<Header|Header.*\/>/ },
          { name: 'Sidebar/Navigation', pattern: /nav|sidebar|navigation/i },
          { name: 'Outlet/Children', pattern: /Outlet|{children}/ },
          { name: 'Breadcrumbs', pattern: /breadcrumb|Breadcrumb/i },
          { name: 'Protected Area', pattern: /protected|auth|user/i },
        ],
      },
      {
        path: 'components/AdminDashboardLayout.tsx',
        name: 'Layout Admin',
        features: [
          { name: 'Admin Sidebar', pattern: /AdminSidebar/ },
          { name: 'Header Component', pattern: /<Header|Header.*\/>/ },
          { name: 'Outlet/Children', pattern: /Outlet|{children}/ },
          { name: 'Admin Protection', pattern: /admin|Admin/ },
          { name: 'Navigation Structure', pattern: /nav|navigation/i },
        ],
      },
      {
        path: 'pages/DashboardOverview.tsx',
        name: 'Dashboard Usuario',
        features: [
          { name: 'Navigation Links', pattern: /navigate.*\/cuenta/ },
          { name: 'Profile Navigation', pattern: /\/cuenta\/perfil/ },
          { name: 'Orders Navigation', pattern: /\/cuenta\/pedidos/ },
          { name: 'Favorites Navigation', pattern: /\/cuenta\/favoritos/ },
          { name: 'User Data Display', pattern: /user\.|profile\.|userData/ },
          { name: 'Action Buttons', pattern: /<Button.*onClick/ },
        ],
      },
      {
        path: 'pages/AdminEcommerceDashboard.tsx',
        name: 'Dashboard Admin',
        features: [
          { name: 'Admin Check', pattern: /isAdmin|admin.*role|requireAdmin/ },
          { name: 'KPI Cards', pattern: /Card|card.*title|metrics/i },
          {
            name: 'Error Boundaries',
            pattern: /error.*boundary|ErrorBoundary/i,
          },
          {
            name: 'Loading States',
            pattern: /loading|Loading|pending|skeleton/i,
          },
          { name: 'Navigation Links', pattern: /navigate.*\/admin/ },
          { name: 'Data Queries', pattern: /query|Query|useQuery|fetch/ },
        ],
      },
    ]

    // Validar cada componente
    for (const componentDef of componentsToValidate) {
      this.log(`📋 Validando: ${componentDef.name}`, '\x1b[34m')

      const result = this.validateComponent(
        componentDef.path,
        componentDef.features
      )
      this.results.push(result)

      if (!result.exists) {
        this.log(`   ❌ ${result.message}`, '\x1b[31m')
      } else {
        const color =
          result.percentage >= 80
            ? '\x1b[32m'
            : result.percentage >= 60
            ? '\x1b[33m'
            : '\x1b[31m'
        this.log(
          `   ${
            result.percentage >= 80
              ? '✅'
              : result.percentage >= 60
              ? '⚠️ '
              : '❌'
          } ${result.percentage}% - ${result.message}`,
          color
        )

        // Mostrar características faltantes
        const missing = Object.entries(result.features)
          .filter(([_, found]) => !found)
          .map(([name, _]) => name)

        if (missing.length > 0 && missing.length <= 3) {
          this.log(`      Falta: ${missing.join(', ')}`, '\x1b[33m')
        }
      }

      this.log('')
    }

    // Generar reporte final
    this.generateComponentReport()
  }

  generateComponentReport() {
    const validComponents = this.results.filter(r => r.exists)
    const totalScore = validComponents.reduce((sum, r) => sum + r.score, 0)
    const maxScore = validComponents.reduce((sum, r) => sum + r.maxScore, 0)
    const overallPercentage =
      maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0

    this.log('='.repeat(60), '\x1b[35m')
    this.log('📊 REPORTE DE COMPONENTES NAVEGACIÓN', '\x1b[1m')
    this.log('='.repeat(60), '\x1b[35m')

    this.log(
      `\n🎯 Score General: ${overallPercentage}% (${totalScore}/${maxScore})`
    )
    this.log(
      `📦 Componentes encontrados: ${validComponents.length}/${this.results.length}`
    )

    // Top componentes
    const sortedResults = validComponents
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 3)

    this.log('\n🏆 Mejores Componentes:', '\x1b[32m')
    sortedResults.forEach((result, index) => {
      this.log(`${index + 1}. ${result.component}: ${result.percentage}%`)
    })

    // Componentes que necesitan atención
    const needAttention = validComponents.filter(r => r.percentage < 70)
    if (needAttention.length > 0) {
      this.log('\n⚠️  Requieren Atención:', '\x1b[33m')
      needAttention.forEach(result => {
        this.log(`- ${result.component}: ${result.percentage}%`)
      })
    }

    // Estado general
    if (overallPercentage >= 85) {
      this.log('\n🎉 EXCELENTE! Componentes muy bien estructurados', '\x1b[32m')
    } else if (overallPercentage >= 70) {
      this.log('\n⚡ BUENO! Estructura sólida con mejoras menores', '\x1b[33m')
    } else {
      this.log(
        '\n🚨 ATENCIÓN! Necesita reestructuración significativa',
        '\x1b[31m'
      )
    }

    // Guardar resultados
    try {
      fs.writeFileSync(
        path.join(__dirname, 'component-navigation-results.json'),
        JSON.stringify(
          {
            timestamp: new Date().toISOString(),
            overallScore: overallPercentage,
            components: this.results,
          },
          null,
          2
        )
      )
      this.log(
        '\n📄 Reporte guardado: tests/component-navigation-results.json',
        '\x1b[34m'
      )
    } catch (error) {
      this.log('\n⚠️  No se pudo guardar el reporte JSON', '\x1b[33m')
    }

    return overallPercentage >= 70
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  const validator = new ComponentNavigationValidator()
  validator
    .runValidation()
    .then(success => {
      process.exit(success ? 0 : 1)
    })
    .catch(error => {
      console.error('Error:', error)
      process.exit(1)
    })
}

module.exports = ComponentNavigationValidator
