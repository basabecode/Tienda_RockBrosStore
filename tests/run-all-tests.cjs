/**
 * 🧪 Test Suite Principal - Ejecutor de Todas las Validaciones
 *
 * Este script ejecuta todos los tests de validación y genera un reporte completo
 */

const ErrorHandlingValidator = require('./validate-error-handling.cjs')
const RoutesValidator = require('./validate-routes-navigation.cjs')
const NavigationTestSuite = require('./validate-navigation-complete.cjs')
const ComponentNavigationValidator = require('./validate-navigation-components.cjs')

// Colores para output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m',
  magenta: '\x1b[35m',
}

class TestSuite {
  constructor() {
    this.results = {
      errorHandling: null,
      routes: null,
      startTime: new Date(),
      endTime: null,
    }
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`)
  }

  async runAllTests() {
    this.log('🚀 INICIANDO SUITE COMPLETA DE TESTS', 'bold')
    this.log(`📅 ${this.results.startTime.toLocaleString('es-ES')}\n`, 'blue')

    try {
      // Test 1: Error Handling
      this.log('='.repeat(60), 'magenta')
      this.log('📋 TEST 1: ERROR HANDLING VALIDATION', 'bold')
      this.log('='.repeat(60), 'magenta')

      const errorValidator = new ErrorHandlingValidator()
      await errorValidator.validateErrorHandling()
      this.results.errorHandling = errorValidator.testResults

      // Test 2: Routes & Navigation
      this.log('\n' + '='.repeat(60), 'magenta')
      this.log('📋 TEST 2: ROUTES & NAVIGATION VALIDATION', 'bold')
      this.log('='.repeat(60), 'magenta')

      const routesValidator = new RoutesValidator()
      await routesValidator.validateRoutes()
      this.results.routes = routesValidator.testResults

      // Test 3: Navigation Complete (3 Scenarios)
      this.log('\n' + '='.repeat(60), 'magenta')
      this.log('📋 TEST 3: NAVEGACIÓN COMPLETA (3 ESCENARIOS)', 'bold')
      this.log('='.repeat(60), 'magenta')

      const navigationSuite = new NavigationTestSuite()
      await navigationSuite.runAllTests()
      this.results.navigation = navigationSuite.results

      // Test 4: Component Navigation
      this.log('\n' + '='.repeat(60), 'magenta')
      this.log('📋 TEST 4: COMPONENTES DE NAVEGACIÓN', 'bold')
      this.log('='.repeat(60), 'magenta')

      const componentValidator = new ComponentNavigationValidator()
      await componentValidator.runValidation()
      this.results.components = componentValidator.results

      // Generar reporte final
      this.generateFinalReport()
    } catch (error) {
      this.log(`❌ Error ejecutando tests: ${error.message}`, 'red')
    }
  }

  generateFinalReport() {
    this.results.endTime = new Date()
    const duration = (
      (this.results.endTime - this.results.startTime) /
      1000
    ).toFixed(2)

    this.log('\n' + '='.repeat(80), 'magenta')
    this.log('📊 REPORTE FINAL COMPLETO', 'bold')
    this.log('='.repeat(80), 'magenta')

    this.log(`⏱️  Duración total: ${duration} segundos`, 'blue')
    this.log(
      `📅 Completado: ${this.results.endTime.toLocaleString('es-ES')}`,
      'blue'
    )

    // Resumen Error Handling
    if (this.results.errorHandling) {
      const ehTotal = this.results.errorHandling.reduce(
        (acc, r) => acc + r.score,
        0
      )
      const ehMax = this.results.errorHandling.length * 6
      const ehPercentage = Math.round((ehTotal / ehMax) * 100)

      this.log(
        `\n📋 Error Handling: ${ehPercentage}% (${ehTotal}/${ehMax})`,
        ehPercentage >= 80 ? 'green' : ehPercentage >= 60 ? 'yellow' : 'red'
      )
    }

    // Resumen Routes
    if (this.results.routes) {
      const routesTotal = this.results.routes.reduce(
        (acc, r) => acc + r.score,
        0
      )
      const routesMax = this.results.routes.reduce((acc, r) => {
        const checks = Object.keys(r).filter(
          key => key !== 'component' && key !== 'score'
        )
        return acc + checks.length
      }, 0)
      const routesPercentage = Math.round((routesTotal / routesMax) * 100)

      this.log(
        `📋 Routes & Navigation: ${routesPercentage}% (${routesTotal}/${routesMax})`,
        routesPercentage >= 80
          ? 'green'
          : routesPercentage >= 60
          ? 'yellow'
          : 'red'
      )
    }

    // Score general
    this.calculateOverallScore()

    // Generar reporte JSON
    this.generateJSONReport()

    // Acciones recomendadas
    this.generateActionPlan()
  }

  calculateOverallScore() {
    let totalScore = 0
    let maxScore = 0

    if (this.results.errorHandling) {
      totalScore += this.results.errorHandling.reduce(
        (acc, r) => acc + r.score,
        0
      )
      maxScore += this.results.errorHandling.length * 6
    }

    if (this.results.routes) {
      totalScore += this.results.routes.reduce((acc, r) => acc + r.score, 0)
      maxScore += this.results.routes.reduce((acc, r) => {
        const checks = Object.keys(r).filter(
          key => key !== 'component' && key !== 'score'
        )
        return acc + checks.length
      }, 0)
    }

    const overallPercentage = Math.round((totalScore / maxScore) * 100)

    this.log(
      `\n🎯 SCORE GENERAL: ${overallPercentage}% (${totalScore}/${maxScore})`,
      'bold'
    )

    if (overallPercentage >= 90) {
      this.log('🏆 EXCELENTE! La aplicación está en muy buen estado', 'green')
    } else if (overallPercentage >= 80) {
      this.log('✅ MUY BUENO! Pequeñas mejoras posibles', 'green')
    } else if (overallPercentage >= 70) {
      this.log('⚡ BUENO! Algunas mejoras recomendadas', 'yellow')
    } else if (overallPercentage >= 60) {
      this.log('⚠️  ACEPTABLE! Necesita mejoras', 'yellow')
    } else {
      this.log('🚨 CRÍTICO! Requiere atención inmediata', 'red')
    }

    return overallPercentage
  }

  generateJSONReport() {
    const report = {
      timestamp: this.results.endTime.toISOString(),
      duration: (this.results.endTime - this.results.startTime) / 1000,
      results: {
        errorHandling: this.results.errorHandling,
        routes: this.results.routes,
      },
      summary: {
        overallScore: this.calculateOverallScore(),
        totalTests:
          (this.results.errorHandling?.length || 0) +
          (this.results.routes?.length || 0),
        passedTests: this.countPassedTests(),
        failedTests: this.countFailedTests(),
      },
    }

    const fs = require('fs')
    const path = require('path')
    const reportPath = path.join(__dirname, 'test-results.json')

    try {
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
      this.log(`📄 Reporte JSON guardado en: ${reportPath}`, 'blue')
    } catch (error) {
      this.log(`❌ Error guardando reporte JSON: ${error.message}`, 'red')
    }
  }

  countPassedTests() {
    let passed = 0

    if (this.results.errorHandling) {
      passed += this.results.errorHandling.filter(r => r.score >= 5).length
    }

    if (this.results.routes) {
      passed += this.results.routes.filter(r => {
        const maxChecks = Object.keys(r).filter(
          key => key !== 'component' && key !== 'score'
        ).length
        return r.score / maxChecks >= 0.8
      }).length
    }

    return passed
  }

  countFailedTests() {
    let failed = 0

    if (this.results.errorHandling) {
      failed += this.results.errorHandling.filter(r => r.score < 3).length
    }

    if (this.results.routes) {
      failed += this.results.routes.filter(r => {
        const maxChecks = Object.keys(r).filter(
          key => key !== 'component' && key !== 'score'
        ).length
        return r.score / maxChecks < 0.5
      }).length
    }

    return failed
  }

  generateActionPlan() {
    this.log('\n🎯 PLAN DE ACCIÓN RECOMENDADO', 'bold')
    this.log('-'.repeat(50), 'blue')

    const overallScore = this.calculateOverallScore()

    if (overallScore >= 80) {
      this.log('✨ Mantener el buen trabajo y considerar:', 'green')
      this.log('  - Optimizaciones de performance')
      this.log('  - Tests de integración adicionales')
      this.log('  - Documentación de mejores prácticas')
    } else if (overallScore >= 60) {
      this.log('🔧 Acciones prioritarias:', 'yellow')
      this.log('  1. Completar implementación de error boundaries')
      this.log('  2. Añadir estados de carga faltantes')
      this.log('  3. Mejorar lógica de retry en fallos')
      this.log('  4. Validar protección de rutas admin')
    } else {
      this.log('🚨 ACCIÓN INMEDIATA REQUERIDA:', 'red')
      this.log('  1. Implementar error handling básico en todas las páginas')
      this.log('  2. Configurar correctamente las rutas protegidas')
      this.log('  3. Añadir estados de carga y error')
      this.log('  4. Revisar la navegación y layouts')
      this.log('  5. Implementar try/catch en operaciones async')
    }

    this.log('\n📚 PRÓXIMOS PASOS SUGERIDOS:', 'bold')
    this.log('  - Ejecutar tests regularmente durante el desarrollo')
    this.log('  - Establecer un score mínimo del 80% para production')
    this.log('  - Automatizar estos tests en CI/CD')
    this.log('  - Crear tests de integración E2E')
    this.log('  - Monitorear errores en production con Sentry/similar')
  }
}

// Ejecutar suite completa
if (require.main === module) {
  const testSuite = new TestSuite()
  testSuite.runAllTests().catch(console.error)
}

module.exports = TestSuite
