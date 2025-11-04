#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

/**
 * Script para validar correcciones de contraste en UserProfile.tsx
 * Busca patrones problemáticos específicos y valida las correcciones aplicadas
 */

const userProfilePath = path.join(
  __dirname,
  '../src/pages/user/UserProfile.tsx'
)

try {
  const content = fs.readFileSync(userProfilePath, 'utf8')

  console.log('🔍 VALIDANDO UserProfile.tsx...\n')

  // Patrones problemáticos que ya NO deberían estar
  const problematicPatterns = [
    { pattern: /text-white/g, description: 'text-white sobre fondos claros' },
    { pattern: /text-gray-700/g, description: 'text-gray-700 en tema oscuro' },
    { pattern: /text-gray-900/g, description: 'text-gray-900 en tema oscuro' },
    { pattern: /text-gray-500/g, description: 'text-gray-500 en tema oscuro' },
    {
      pattern: /text-green-600/g,
      description: 'text-green-600 (color genérico)',
    },
    {
      pattern: /hover:bg-green-50/g,
      description: 'hover:bg-green-50 (tema claro)',
    },
    { pattern: /bg-white/g, description: 'bg-white en tema oscuro' },
    {
      pattern: /border-gray-200/g,
      description: 'border-gray-200 en tema oscuro',
    },
  ]

  // Patrones correctos que SÍ deberían estar
  const correctPatterns = [
    { pattern: /text-foreground/g, description: 'text-foreground (accesible)' },
    {
      pattern: /text-muted-foreground/g,
      description: 'text-muted-foreground (accesible)',
    },
    {
      pattern: /text-brand-primary/g,
      description: 'text-brand-primary (corporativo)',
    },
    { pattern: /bg-card/g, description: 'bg-card (tema adaptable)' },
    {
      pattern: /border-border/g,
      description: 'border-border (tema adaptable)',
    },
    {
      pattern: /hover:bg-brand-primary\/10/g,
      description: 'hover:bg-brand-primary/10 (corporativo)',
    },
  ]

  console.log('❌ PATRONES PROBLEMÁTICOS ENCONTRADOS:')
  let problemsFound = 0

  problematicPatterns.forEach(({ pattern, description }) => {
    const matches = content.match(pattern)
    if (matches) {
      console.log(`   🚨 ${description}: ${matches.length} ocurrencias`)
      problemsFound += matches.length
    }
  })

  if (problemsFound === 0) {
    console.log('   ✅ ¡No se encontraron patrones problemáticos!')
  }

  console.log('\n✅ PATRONES CORRECTOS ENCONTRADOS:')
  let correctPatternsFound = 0

  correctPatterns.forEach(({ pattern, description }) => {
    const matches = content.match(pattern)
    if (matches) {
      console.log(`   ✅ ${description}: ${matches.length} usos`)
      correctPatternsFound += matches.length
    }
  })

  // Análisis específico de la sección problemática
  console.log('\n🎯 ANÁLISIS ESPECÍFICO DE LABELS:')

  const labelMatches = content.match(/<Label[^>]*className="[^"]*"/g)
  if (labelMatches) {
    labelMatches.forEach((match, index) => {
      if (match.includes('text-white') || match.includes('text-gray-700')) {
        console.log(`   ❌ Label ${index + 1}: ${match}`)
      } else if (match.includes('text-foreground')) {
        console.log(`   ✅ Label ${index + 1}: ${match}`)
      }
    })
  }

  // Puntuación final
  const score =
    correctPatternsFound > 0 && problemsFound === 0
      ? 95
      : correctPatternsFound > problemsFound
      ? 75
      : problemsFound > 0
      ? 40
      : 60

  console.log('\n📊 RESUMEN:')
  console.log(`   Patrones problemáticos: ${problemsFound}`)
  console.log(`   Patrones correctos: ${correctPatternsFound}`)
  console.log(`   Puntuación de accesibilidad: ${score}/100`)

  if (score >= 90) {
    console.log('\n🎉 ¡EXCELENTE! UserProfile.tsx cumple con WCAG AA')
  } else if (score >= 70) {
    console.log('\n✅ BIEN. Quedan algunas mejoras menores por hacer')
  } else {
    console.log(
      '\n⚠️  REQUIERE ATENCIÓN. Aún hay problemas de contraste importantes'
    )
  }
} catch (error) {
  console.error('❌ Error validando UserProfile.tsx:', error.message)
}
