/**
 * 🧪 Tests de Validación de Rutas y Navegación
 * 
 * Valida que:
 * - Las rutas estén correctamente configuradas
 * - La protección de rutas funcione
 * - Los layouts sean consistentes
 * - La navegación sea fluida
 */

const fs = require('fs');
const path = require('path');

// Colores para output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m'
};

class RoutesValidator {
  constructor() {
    this.srcPath = path.join(__dirname, '..', 'src');
    this.testResults = [];
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  success(message) {
    this.log(`✅ ${message}`, 'green');
  }

  error(message) {
    this.log(`❌ ${message}`, 'red');
  }

  warning(message) {
    this.log(`⚠️  ${message}`, 'yellow');
  }

  info(message) {
    this.log(`ℹ️  ${message}`, 'blue');
  }

  async validateRoutes() {
    this.log('\n🧪 INICIANDO VALIDACIÓN DE RUTAS Y NAVEGACIÓN\n', 'bold');

    // Validar App.tsx (configuración principal de rutas)
    await this.validateAppRoutes();
    
    // Validar componentes de protección
    await this.validateProtectedRoutes();
    
    // Validar layouts
    await this.validateLayouts();
    
    // Validar páginas críticas
    await this.validateCriticalPages();
    
    // Validar navegación
    await this.validateNavigation();
    
    this.displaySummary();
  }

  async validateAppRoutes() {
    this.info('Validando configuración de rutas en App.tsx...');
    
    const appPath = path.join(this.srcPath, 'App.tsx');
    if (!fs.existsSync(appPath)) {
      this.error('App.tsx no encontrado');
      return;
    }

    const content = fs.readFileSync(appPath, 'utf8');
    
    const routeChecks = {
      hasReactRouter: /react-router-dom/.test(content),
      hasRoutes: /<Routes>/.test(content),
      hasUserRoutes: /cuenta|perfil|pedidos|favoritos/i.test(content),
      hasAdminRoutes: /admin/i.test(content),
      hasProtectedRoutes: /ProtectedRoute|AdminRoute/.test(content),
      hasPublicRoutes: /login|register|\//g.test(content)
    };

    this.testResults.push({
      component: 'App.tsx - Configuración de Rutas',
      ...routeChecks,
      score: Object.values(routeChecks).filter(Boolean).length
    });

    this.displayComponentResults('App.tsx', routeChecks, 6);
  }

  async validateProtectedRoutes() {
    this.info('Validando componentes de protección de rutas...');
    
    const protectedRoutePath = path.join(this.srcPath, 'components', 'ProtectedRoute.tsx');
    const adminRoutePath = path.join(this.srcPath, 'components', 'AdminRoute.tsx');
    
    // Validar ProtectedRoute
    if (fs.existsSync(protectedRoutePath)) {
      const content = fs.readFileSync(protectedRoutePath, 'utf8');
      const checks = {
        hasAuthCheck: /auth|user|session/.test(content),
        hasRedirect: /redirect|navigate/.test(content),
        hasLoading: /loading|pending/.test(content),
        hasErrorHandling: /error|catch|try/.test(content)
      };
      
      this.testResults.push({
        component: 'ProtectedRoute.tsx',
        ...checks,
        score: Object.values(checks).filter(Boolean).length
      });
      
      this.displayComponentResults('ProtectedRoute', checks, 4);
    } else {
      this.warning('ProtectedRoute.tsx no encontrado');
    }

    // Validar AdminRoute
    if (fs.existsSync(adminRoutePath)) {
      const content = fs.readFileSync(adminRoutePath, 'utf8');
      const checks = {
        hasAdminCheck: /is_admin|admin.*role/.test(content),
        hasAccessDenied: /access.*denied|acceso.*denegado/i.test(content),
        hasRedirect: /redirect|navigate/.test(content),
        hasErrorHandling: /error|catch|try/.test(content)
      };
      
      this.testResults.push({
        component: 'AdminRoute.tsx',
        ...checks,
        score: Object.values(checks).filter(Boolean).length
      });
      
      this.displayComponentResults('AdminRoute', checks, 4);
    } else {
      this.warning('AdminRoute.tsx no encontrado');
    }
  }

  async validateLayouts() {
    this.info('Validando layouts y estructura...');
    
    const layoutFiles = [
      'components/DashboardLayout.tsx',
      'components/AdminPageLayout.tsx',
      'components/Header.tsx',
      'components/Footer.tsx'
    ];

    for (const layoutFile of layoutFiles) {
      const layoutPath = path.join(this.srcPath, layoutFile);
      
      if (fs.existsSync(layoutPath)) {
        const content = fs.readFileSync(layoutPath, 'utf8');
        const checks = {
          hasNavigation: /nav|menu|link/.test(content),
          hasResponsive: /mobile|md:|lg:|responsive/.test(content),
          hasErrorBoundary: /error.*boundary/i.test(content),
          hasAccessibility: /aria|role=|alt=/.test(content)
        };
        
        this.testResults.push({
          component: layoutFile,
          ...checks,
          score: Object.values(checks).filter(Boolean).length
        });
        
        this.displayComponentResults(layoutFile, checks, 4);
      } else {
        this.warning(`${layoutFile} no encontrado`);
      }
    }
  }

  async validateCriticalPages() {
    this.info('Validando páginas críticas...');
    
    const criticalPages = [
      'pages/Login.tsx',
      'pages/DashboardOverview.tsx',
      'pages/Orders.tsx',
      'pages/Favorites.tsx',
      'pages/ChangePassword.tsx',
      'pages/AdminDashboard.tsx',
      'pages/AdminEcommerceDashboard.tsx'
    ];

    for (const page of criticalPages) {
      const pagePath = path.join(this.srcPath, page);
      
      if (fs.existsSync(pagePath)) {
        const content = fs.readFileSync(pagePath, 'utf8');
        const checks = {
          hasProperImports: /react|useState|useEffect/.test(content),
          hasErrorHandling: /error|catch|try/.test(content),
          hasLoadingStates: /loading|pending|skeleton/.test(content),
          hasNavigation: /navigate|Link|useRouter/.test(content),
          hasAccessibility: /aria|role=|alt=/.test(content)
        };
        
        this.testResults.push({
          component: page,
          ...checks,
          score: Object.values(checks).filter(Boolean).length
        });
        
        this.displayComponentResults(page.replace('pages/', ''), checks, 5);
      } else {
        this.warning(`${page} no encontrado`);
      }
    }
  }

  async validateNavigation() {
    this.info('Validando componentes de navegación...');
    
    const navComponents = [
      'components/Header.tsx',
      'components/AdminSidebar.tsx',
      'components/UserMenu.tsx',
      'components/AdminUserMenu.tsx',
      'components/ClientUserMenu.tsx'
    ];

    for (const navComponent of navComponents) {
      const navPath = path.join(this.srcPath, navComponent);
      
      if (fs.existsSync(navPath)) {
        const content = fs.readFileSync(navPath, 'utf8');
        const checks = {
          hasReactRouterLinks: /Link.*to=|NavLink/.test(content),
          hasActiveStates: /active|current|selected/.test(content),
          hasLogout: /logout|signOut|cerrar.*sesion/i.test(content),
          hasConditionalNav: /user.*admin|role|permission/.test(content),
          hasResponsive: /mobile|hidden|md:|lg:/.test(content)
        };
        
        this.testResults.push({
          component: navComponent,
          ...checks,
          score: Object.values(checks).filter(Boolean).length
        });
        
        this.displayComponentResults(navComponent.replace('components/', ''), checks, 5);
      }
    }
  }

  displayComponentResults(componentName, checks, maxScore) {
    const score = Object.values(checks).filter(Boolean).length;
    const percentage = Math.round((score / maxScore) * 100);
    
    if (percentage >= 80) {
      this.success(`${componentName}: ${percentage}% (${score}/${maxScore})`);
    } else if (percentage >= 60) {
      this.warning(`${componentName}: ${percentage}% (${score}/${maxScore})`);
    } else {
      this.error(`${componentName}: ${percentage}% (${score}/${maxScore})`);
    }

    // Mostrar detalles de checks fallidos
    const failed = Object.entries(checks)
      .filter(([_, passed]) => !passed)
      .map(([check, _]) => check);
    
    if (failed.length > 0) {
      this.log(`   Falló: ${failed.join(', ')}`, 'yellow');
    }
    console.log('');
  }

  displaySummary() {
    this.log('📊 RESUMEN DE VALIDACIÓN DE RUTAS\n', 'bold');
    
    const totalScore = this.testResults.reduce((acc, result) => acc + result.score, 0);
    const maxScore = this.testResults.reduce((acc, result) => {
      const checks = Object.keys(result).filter(key => 
        key !== 'component' && key !== 'score'
      );
      return acc + checks.length;
    }, 0);
    
    const overallPercentage = Math.round((totalScore / maxScore) * 100);
    
    this.log(`Score Total: ${totalScore}/${maxScore} (${overallPercentage}%)`, 'bold');
    
    if (overallPercentage >= 80) {
      this.success('🎉 Excelente! Las rutas y navegación están bien configuradas');
    } else if (overallPercentage >= 60) {
      this.warning('⚡ Bueno, pero se puede mejorar la configuración');
    } else {
      this.error('🚨 Necesita mejoras significativas en rutas y navegación');
    }

    // Componentes con mejor puntuación
    const topComponents = this.testResults
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    
    this.log('\n🏆 Mejores Componentes:', 'green');
    topComponents.forEach((result, index) => {
      const maxPossible = Object.keys(result).filter(key => 
        key !== 'component' && key !== 'score'
      ).length;
      const percentage = Math.round((result.score / maxPossible) * 100);
      this.log(`${index + 1}. ${result.component}: ${percentage}%`);
    });

    // Componentes que necesitan atención
    const needsAttention = this.testResults
      .filter(result => {
        const maxPossible = Object.keys(result).filter(key => 
          key !== 'component' && key !== 'score'
        ).length;
        return (result.score / maxPossible) < 0.6;
      });
    
    if (needsAttention.length > 0) {
      this.log('\n⚠️ Requieren Atención:', 'yellow');
      needsAttention.forEach(result => {
        const maxPossible = Object.keys(result).filter(key => 
          key !== 'component' && key !== 'score'
        ).length;
        const percentage = Math.round((result.score / maxPossible) * 100);
        this.log(`- ${result.component}: ${percentage}%`);
      });
    }

    this.log('\n💡 RECOMENDACIONES GENERALES:', 'bold');
    this.log('- Asegurar que todas las rutas tengan protección adecuada');
    this.log('- Implementar estados de carga en cambios de ruta');
    this.log('- Añadir breadcrumbs para mejor navegación');
    this.log('- Verificar accesibilidad en todos los componentes');
    this.log('- Implementar lazy loading para mejor performance');
  }
}

// Ejecutar validación
if (require.main === module) {
  const validator = new RoutesValidator();
  validator.validateRoutes().catch(console.error);
}

module.exports = RoutesValidator;