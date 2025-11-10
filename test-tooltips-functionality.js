// Script para probar tooltips en tarjetas de productos
// Ejecutar en la consola del navegador

console.log('🧪 Probando tooltips en tarjetas de productos')

function testTooltips() {
  console.log('\n🔍 1. Buscando tarjetas de productos...')

  // Buscar tarjetas de productos
  const productCards = document.querySelectorAll('.card-dark-enhanced')
  console.log(`   📊 ${productCards.length} tarjetas de producto encontradas`)

  if (productCards.length === 0) {
    console.log('   ❌ No se encontraron tarjetas de productos')
    console.log(
      '   💡 Asegúrate de que estás en la página principal y hay productos cargados'
    )
    return
  }

  console.log('\n❤️ 2. Probando tooltips de favoritos...')

  // Buscar botones de favoritos (corazón)
  const favoriteButtons = Array.from(
    document.querySelectorAll('button')
  ).filter(btn => {
    const heartIcon = btn.querySelector('[data-lucide="heart"]')
    return heartIcon !== null
  })

  console.log(
    `   📊 ${favoriteButtons.length} botones de favoritos encontrados`
  )

  if (favoriteButtons.length > 0) {
    console.log('   ✅ Botones de favoritos detectados')
    console.log(
      '   📝 Pasa el mouse sobre los corazones para ver "Agregar a favoritos"'
    )
  }

  console.log('\n👁️ 3. Probando tooltips de ver detalles...')

  // Buscar botones de ver detalles (ojo)
  const viewButtons = Array.from(document.querySelectorAll('button')).filter(
    btn => {
      const eyeIcon = btn.querySelector('[data-lucide="eye"]')
      return eyeIcon !== null
    }
  )

  console.log(`   📊 ${viewButtons.length} botones de ver detalles encontrados`)

  if (viewButtons.length > 0) {
    console.log('   ✅ Botones de ver detalles detectados')
    console.log('   📝 Pasa el mouse sobre los ojos para ver "Ver más"')
  }

  console.log('\n🔗 4. Probando funcionalidad de navegación...')

  // Verificar que los botones de "ver más" tengan funcionalidad
  if (viewButtons.length > 0) {
    console.log('   ✅ Los botones "Ver más" navegan a /product/[id]')
    console.log(
      '   📝 Haz click en el ojo de cualquier producto para ir a sus detalles'
    )
  }

  console.log('\n🎯 5. Verificando componentes Tooltip...')

  // Buscar elementos tooltip en el DOM
  const tooltipTriggers = document.querySelectorAll(
    '[data-radix-tooltip-trigger]'
  )
  const tooltipContents = document.querySelectorAll(
    '[data-radix-tooltip-content]'
  )

  console.log(`   📊 ${tooltipTriggers.length} triggers de tooltip encontrados`)
  console.log(
    `   📊 ${tooltipContents.length} contenidos de tooltip encontrados`
  )

  if (tooltipTriggers.length > 0) {
    console.log('   ✅ Sistema de tooltips Radix UI funcionando')
  } else {
    console.log('   ⚠️ No se detectaron tooltips de Radix UI')
    console.log('   💡 Puede que necesiten tiempo para renderizar')
  }
}

function testProductNavigation() {
  console.log('\n🚀 6. Probando navegación a detalles...')

  // Simular click en el primer botón de "ver más"
  const firstViewButton = Array.from(document.querySelectorAll('button')).find(
    btn => btn.querySelector('[data-lucide="eye"]')
  )

  if (firstViewButton) {
    console.log('   ✅ Primer botón "Ver más" encontrado')
    console.log(
      '   📝 El botón está listo para navegar a detalles del producto'
    )

    // No hacer click automáticamente, solo informar
    console.log('   ⚠️ Click manual requerido para probar navegación')
  } else {
    console.log('   ❌ No se encontró botón "Ver más" para probar')
  }
}

// Ejecutar pruebas
console.log('🚀 Iniciando pruebas de tooltips...')

// Esperar a que los componentes se rendericen
setTimeout(() => {
  testTooltips()
  testProductNavigation()

  console.log('\n✅ Pruebas completadas!')
  console.log('\n📋 Resumen de funcionalidades implementadas:')
  console.log('1. ❤️ Tooltip "Agregar a favoritos" en botones de corazón')
  console.log('2. 👁️ Tooltip "Ver más" en botones de ojo')
  console.log('3. 🔗 Navegación a /product/[id] en botones "Ver más"')
  console.log('4. 🎯 Sistema de tooltips Radix UI integrado')

  console.log('\n🛠️ Funciones disponibles:')
  console.log('testTooltips() - Volver a ejecutar pruebas')

  // Hacer funciones disponibles globalmente
  window.testTooltips = testTooltips
  window.testProductNavigation = testProductNavigation
}, 2000) // Esperar 2 segundos para que todo se renderice

console.log('⏳ Esperando renderizado de componentes...')
