/**
 * 🧪 Tests de Validación de Error Handling
 * 
 * Valida que las páginas críticas implementen correctamente:
 * - Estados de carga (loading)
 * - Estados de error con retry
 * - Fallbacks de UI
 * - Recovery patterns
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

class ErrorHandlingValidator {
  constructor() {
    this.pagesPath = path.join(__dirname, '..', 'src', 'pages');
    this.testResults = [];
    this.criticalPages = [
      'DashboardOverview.tsx',
      'Orders.tsx', 
      'Favorites.tsx',
      'ChangePassword.tsx',
      'AdminEcommerceDashboard.tsx'
    ];
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

  async validateErrorHandling() {
    this.log('\n🧪 INICIANDO VALIDACIÓN DE ERROR HANDLING\n', 'bold');

    for (const pageFile of this.criticalPages) {
      const filePath = path.join(this.pagesPath, pageFile);
      
      if (!fs.existsSync(filePath)) {
        this.error(`Archivo no encontrado: ${pageFile}`);
        continue;
      }

      this.info(`Validando: ${pageFile}`);
      const content = fs.readFileSync(filePath, 'utf8');
      
      const result = {
        file: pageFile,
        hasErrorStates: this.validateErrorStates(content),
        hasLoadingStates: this.validateLoadingStates(content), 
        hasRetryLogic: this.validateRetryLogic(content),
        hasErrorBoundaries: this.validateErrorBoundaries(content),
        hasTryCatch: this.validateTryCatch(content),
        hasToastNotifications: this.validateToastNotifications(content),
        score: 0
      };

      // Calcular score
      const checks = ['hasErrorStates', 'hasLoadingStates', 'hasRetryLogic', 'hasErrorBoundaries', 'hasTryCatch', 'hasToastNotifications'];
      result.score = checks.filter(check => result[check]).length;

      this.testResults.push(result);
      this.displayPageResults(result);
    }

    this.displaySummary();
  }

  validateErrorStates(content) {
    const errorPatterns = [
      /error.*state/i,
      /isError/i,
      /error.*message/i,
      /catch.*error/i,
      /\.error\s*[?&]/,
      /errorState/i
    ];
    
    return errorPatterns.some(pattern => pattern.test(content));
  }

  validateLoadingStates(content) {
    const loadingPatterns = [
      /loading.*state/i,
      /isLoading/i,
      /isPending/i,
      /loading.*true/i,
      /skeleton/i,
      /spinner/i
    ];
    
    return loadingPatterns.some(pattern => pattern.test(content));
  }

  validateRetryLogic(content) {
    const retryPatterns = [
      /retry/i,
      /refetch/i,
      /reload/i,
      /reintentar/i,
      /refresh/i,
      /queryClient\.invalidateQueries/
    ];
    
    return retryPatterns.some(pattern => pattern.test(content));
  }

  validateErrorBoundaries(content) {
    const boundaryPatterns = [
      /ErrorBoundary/i,
      /componentDidCatch/i,
      /getDerivedStateFromError/i,
      /error.*boundary/i
    ];
    
    return boundaryPatterns.some(pattern => pattern.test(content));
  }

  validateTryCatch(content) {
    const tryCatchPatterns = [
      /try\s*{[\s\S]*?catch\s*\(/,
      /\.catch\(/,
      /Promise.*catch/,
      /async.*await.*catch/
    ];
    
    return tryCatchPatterns.some(pattern => pattern.test(content));
  }

  validateToastNotifications(content) {
    const toastPatterns = [
      /toast\./i,
      /notification/i,
      /alert\(/,
      /showError/i,
      /showSuccess/i
    ];
    
    return toastPatterns.some(pattern => pattern.test(content));
  }

  displayPageResults(result) {
    const { file, score } = result;
    const percentage = Math.round((score / 6) * 100);
    
    if (percentage >= 80) {
      this.success(`${file}: ${percentage}% (${score}/6)`);
    } else if (percentage >= 60) {
      this.warning(`${file}: ${percentage}% (${score}/6)`);
    } else {
      this.error(`${file}: ${percentage}% (${score}/6)`);
    }

    // Mostrar detalles de qué falta
    const missing = [];
    if (!result.hasErrorStates) missing.push('Estados de Error');
    if (!result.hasLoadingStates) missing.push('Estados de Carga');
    if (!result.hasRetryLogic) missing.push('Lógica de Retry');
    if (!result.hasErrorBoundaries) missing.push('Error Boundaries');
    if (!result.hasTryCatch) missing.push('Try/Catch');
    if (!result.hasToastNotifications) missing.push('Notificaciones');

    if (missing.length > 0) {
      this.log(`   Faltante: ${missing.join(', ')}`, 'yellow');
    }
    console.log('');
  }

  displaySummary() {
    this.log('📊 RESUMEN DE VALIDACIÓN\n', 'bold');
    
    const totalScore = this.testResults.reduce((acc, result) => acc + result.score, 0);
    const maxScore = this.testResults.length * 6;
    const overallPercentage = Math.round((totalScore / maxScore) * 100);
    
    this.log(`Score Total: ${totalScore}/${maxScore} (${overallPercentage}%)`, 'bold');
    
    if (overallPercentage >= 80) {
      this.success('🎉 Excelente! El error handling está bien implementado');
    } else if (overallPercentage >= 60) {
      this.warning('⚡ Bueno, pero se puede mejorar');
    } else {
      this.error('🚨 Necesita mejoras significativas en error handling');
    }

    // Estadísticas detalladas
    const stats = {
      withErrorStates: this.testResults.filter(r => r.hasErrorStates).length,
      withLoadingStates: this.testResults.filter(r => r.hasLoadingStates).length,
      withRetryLogic: this.testResults.filter(r => r.hasRetryLogic).length,
      withErrorBoundaries: this.testResults.filter(r => r.hasErrorBoundaries).length,
      withTryCatch: this.testResults.filter(r => r.hasTryCatch).length,
      withToastNotifications: this.testResults.filter(r => r.hasToastNotifications).length
    };

    this.log('\n📈 Estadísticas por Característica:', 'blue');
    this.log(`Estados de Error: ${stats.withErrorStates}/${this.testResults.length}`);
    this.log(`Estados de Carga: ${stats.withLoadingStates}/${this.testResults.length}`);
    this.log(`Lógica de Retry: ${stats.withRetryLogic}/${this.testResults.length}`);
    this.log(`Error Boundaries: ${stats.withErrorBoundaries}/${this.testResults.length}`);
    this.log(`Try/Catch: ${stats.withTryCatch}/${this.testResults.length}`);
    this.log(`Notificaciones: ${stats.withToastNotifications}/${this.testResults.length}`);

    // Recomendaciones
    this.log('\n💡 RECOMENDACIONES:', 'bold');
    if (stats.withErrorStates < this.testResults.length) {
      this.warning('- Implementar estados de error consistentes en todas las páginas');
    }
    if (stats.withLoadingStates < this.testResults.length) {
      this.warning('- Añadir estados de carga (loading/skeleton) donde falten');
    }
    if (stats.withRetryLogic < this.testResults.length) {
      this.warning('- Implementar lógica de retry para recuperación de errores');
    }
    if (stats.withErrorBoundaries < this.testResults.length) {
      this.warning('- Considerar añadir Error Boundaries para captura de errores');
    }
    if (stats.withTryCatch < this.testResults.length) {
      this.warning('- Implementar try/catch en operaciones async');
    }
    if (stats.withToastNotifications < this.testResults.length) {
      this.warning('- Añadir notificaciones de usuario para feedback de errores');
    }
  }
}

// Ejecutar validación
if (require.main === module) {
  const validator = new ErrorHandlingValidator();
  validator.validateErrorHandling().catch(console.error);
}

module.exports = ErrorHandlingValidator;