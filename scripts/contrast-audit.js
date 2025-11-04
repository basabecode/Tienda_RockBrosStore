#!/usr/bin/env node

// ==========================================
// 🎨 VERIFICADOR DE CONTRASTE AUTOMÁTICO
// Valida que las correcciones de accesibilidad estén aplicadas
// ==========================================

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Colores y sus ratios de contraste sobre fondo #383838
const CONTRAST_RATIOS = {
  '#FFFFFF': 12.63, // Excelente (AAA)
  '#F3F4F6': 11.84, // text-gray-100 - Excelente
  '#E5E7EB': 10.36, // text-gray-200 - Excelente
  '#D1D5DB': 8.59, // text-gray-300 - Excelente (AAA)
  '#9CA3AF': 5.74, // text-gray-400 - Bueno (AA+)
  '#6B7280': 3.76, // text-gray-500 - ❌ FALLA AA (necesita 4.5:1)
  '#4B5563': 2.43, // text-gray-600 - ❌ FALLA AA
  '#374151': 1.67, // text-gray-700 - ❌ CRÍTICO
  '#1F2937': 1.09, // text-gray-800 - ❌ CRÍTICO
  '#111827': 1.02, // text-gray-900 - ❌ CRÍTICO
}

// Patrones problemáticos que hay que encontrar y reportar
const PROBLEMATIC_PATTERNS = [
  // Críticos - Fallan WCAG AA
  {
    pattern: /text-gray-[567890]\d{2}/g,
    severity: 'CRÍTICO',
    reason: 'Contraste insuficiente',
  },
  {
    pattern: /text-gray-(600|700|800|900)\b/g,
    severity: 'CRÍTICO',
    reason: 'Contraste insuficiente',
  },
  {
    pattern: /text-gray-(500)\b/g,
    severity: 'MODERADO',
    reason: 'Contraste límite',
  },

  // Verificar que no usen clases directas en lugar de variables semánticas
  {
    pattern: /className="[^"]*text-gray-600[^"]*"/g,
    severity: 'ALTO',
    reason: 'Usar text-secondary-dark',
  },
  {
    pattern: /className="[^"]*text-gray-500[^"]*"/g,
    severity: 'ALTO',
    reason: 'Usar text-subtle-dark',
  },
]

// Patrones correctos que deberían estar presentes
const GOOD_PATTERNS = [
  'text-secondary-dark',
  'text-subtle-dark',
  'text-muted-accessible',
  'text-white',
  'text-gray-300',
  'text-gray-400',
  'icon-secondary',
]

class ContrastAuditor {
  constructor() {
    this.results = {
      critical: [],
      high: [],
      moderate: [],
      good: [],
      summary: {
        totalFiles: 0,
        filesWithIssues: 0,
        totalIssues: 0,
        criticalIssues: 0,
      },
    }
  }

  async auditDirectory(dirPath) {
    const files = await this.getReactFiles(dirPath)

    console.log(`🔍 Auditando ${files.length} archivos React...`)

    for (const file of files) {
      await this.auditFile(file)
    }

    this.generateReport()
  }

  async getReactFiles(dirPath) {
    const files = []

    const scanDir = dir => {
      const entries = fs.readdirSync(dir)

      for (const entry of entries) {
        const fullPath = path.join(dir, entry)
        const stat = fs.statSync(fullPath)

        if (
          stat.isDirectory() &&
          !entry.startsWith('.') &&
          entry !== 'node_modules'
        ) {
          scanDir(fullPath)
        } else if (entry.match(/\.(tsx|ts|jsx|js)$/)) {
          files.push(fullPath)
        }
      }
    }

    scanDir(dirPath)
    return files
  }

  async auditFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8')
      const relativePath = path.relative(process.cwd(), filePath)

      this.results.summary.totalFiles++

      let hasIssues = false

      // Buscar patrones problemáticos
      for (const { pattern, severity, reason } of PROBLEMATIC_PATTERNS) {
        const matches = Array.from(content.matchAll(pattern))

        if (matches.length > 0) {
          hasIssues = true
          this.results.summary.totalIssues += matches.length

          if (severity === 'CRÍTICO') {
            this.results.summary.criticalIssues += matches.length
          }

          for (const match of matches) {
            const lineNumber = this.getLineNumber(content, match.index)

            const issue = {
              file: relativePath,
              line: lineNumber,
              match: match[0],
              severity,
              reason,
              context: this.getContext(content, match.index),
            }

            this.results[severity.toLowerCase()].push(issue)
          }
        }
      }

      // Buscar patrones buenos (para estadísticas positivas)
      for (const goodPattern of GOOD_PATTERNS) {
        if (content.includes(goodPattern)) {
          this.results.good.push({
            file: relativePath,
            pattern: goodPattern,
            count: (content.match(new RegExp(goodPattern, 'g')) || []).length,
          })
        }
      }

      if (hasIssues) {
        this.results.summary.filesWithIssues++
      }
    } catch (error) {
      console.error(`❌ Error auditando ${filePath}:`, error.message)
    }
  }

  getLineNumber(content, index) {
    return content.substring(0, index).split('\n').length
  }

  getContext(content, index) {
    const lines = content.split('\n')
    const lineIndex = this.getLineNumber(content, index) - 1

    const start = Math.max(0, lineIndex - 1)
    const end = Math.min(lines.length, lineIndex + 2)

    return lines.slice(start, end).join('\n')
  }

  generateReport() {
    const { summary, critical, high, moderate, good } = this.results

    console.log('\n' + '='.repeat(60))
    console.log('🎨 REPORTE DE AUDITORÍA DE CONTRASTE')
    console.log('='.repeat(60))

    // Resumen general
    console.log('\n📊 RESUMEN GENERAL:')
    console.log(`   Archivos auditados: ${summary.totalFiles}`)
    console.log(`   Archivos con problemas: ${summary.filesWithIssues}`)
    console.log(`   Total de problemas: ${summary.totalIssues}`)
    console.log(`   Problemas críticos: ${summary.criticalIssues}`)

    // Calcular puntuación de accesibilidad
    const score = this.calculateAccessibilityScore()
    const scoreColor = score >= 90 ? '🟢' : score >= 70 ? '🟡' : '🔴'
    console.log(`   Puntuación de accesibilidad: ${scoreColor} ${score}/100`)

    // Problemas críticos
    if (critical.length > 0) {
      console.log('\n🚨 PROBLEMAS CRÍTICOS (requieren corrección inmediata):')
      critical.forEach((issue, index) => {
        console.log(`\n${index + 1}. ${issue.file}:${issue.line}`)
        console.log(`   Patrón: ${issue.match}`)
        console.log(`   Problema: ${issue.reason}`)
        console.log(
          `   Contexto: ${issue.context.split('\n')[1]?.trim() || 'N/A'}`
        )
      })
    }

    // Problemas altos
    if (high.length > 0) {
      console.log('\n⚠️ PROBLEMAS ALTOS:')
      high.slice(0, 5).forEach((issue, index) => {
        console.log(
          `${index + 1}. ${issue.file}:${issue.line} - ${issue.match} (${
            issue.reason
          })`
        )
      })
      if (high.length > 5) {
        console.log(`   ... y ${high.length - 5} más`)
      }
    }

    // Problemas moderados
    if (moderate.length > 0) {
      console.log('\n📋 PROBLEMAS MODERADOS:')
      console.log(`   Total: ${moderate.length} casos encontrados`)
    }

    // Patrones buenos encontrados
    if (good.length > 0) {
      console.log('\n✅ PATRONES CORRECTOS ENCONTRADOS:')
      const goodSummary = {}
      good.forEach(item => {
        goodSummary[item.pattern] =
          (goodSummary[item.pattern] || 0) + item.count
      })

      Object.entries(goodSummary).forEach(([pattern, count]) => {
        console.log(`   ${pattern}: ${count} usos`)
      })
    }

    // Recomendaciones
    console.log('\n💡 RECOMENDACIONES:')
    if (critical.length > 0) {
      console.log('   🔥 Corregir problemas críticos inmediatamente')
      console.log('   📝 Reemplazar text-gray-600/500 con clases accesibles')
    }
    if (high.length > 0) {
      console.log('   🎯 Usar variables semánticas en lugar de clases directas')
    }
    if (summary.totalIssues === 0) {
      console.log('   🎉 ¡Excelente! No se encontraron problemas de contraste')
    }

    console.log('\n' + '='.repeat(60))

    // Generar archivo de reporte
    this.saveReport()
  }

  calculateAccessibilityScore() {
    const { totalFiles, filesWithIssues, criticalIssues, totalIssues } =
      this.results.summary

    if (totalFiles === 0) return 100

    // Fórmula de puntuación ponderada
    const fileScore = ((totalFiles - filesWithIssues) / totalFiles) * 40
    const criticalPenalty = Math.min(criticalIssues * 10, 40)
    const totalPenalty = Math.min(totalIssues * 2, 20)

    return Math.max(
      0,
      Math.round(fileScore + (60 - criticalPenalty - totalPenalty))
    )
  }

  saveReport() {
    const reportPath = path.join(process.cwd(), 'contrast-audit-report.json')
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2))
    console.log(`📄 Reporte detallado guardado en: ${reportPath}`)
  }
}

// Ejecutar auditoría
const auditor = new ContrastAuditor()
const srcPath = path.join(process.cwd(), 'src')

auditor.auditDirectory(srcPath).catch(console.error)
