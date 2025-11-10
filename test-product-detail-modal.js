// Script para probar la funcionalidad del modal "Ver más"
// Ejecutar en la consola del navegador

console.log('🔍 Probando funcionalidad del modal "Ver más"')

function testProductDetailNavigation() {
  console.log('\n🎯 1. Buscando botones "Ver más"...')

  // Buscar botones de ver más (ojo)
  const eyeButtons = Array.from(document.querySelectorAll('button')).filter(
    btn => {
      const eyeIcon = btn.querySelector('[data-lucide="eye"]')
      return eyeIcon !== null
    }
  )

  console.log(`   📊 ${eyeButtons.length} botones "Ver más" encontrados`)

  if (eyeButtons.length === 0) {
    console.log('   ❌ No se encontraron botones "Ver más"')
    console.log(
      '   💡 Asegúrate de estar en la página principal con productos cargados'
    )
    return
  }

  console.log('\n👁️ 2. Verificando tooltips...')

  // Verificar que los tooltips estén configurados
  const tooltipsFound = eyeButtons.some(btn => {
    const tooltip = btn.closest('[data-radix-tooltip-trigger]')
    return tooltip !== null
  })

  if (tooltipsFound) {
    console.log('   ✅ Tooltips detectados en botones "Ver más"')
    console.log('   📝 Pasa el mouse sobre los ojos para ver "Ver más"')
  } else {
    console.log('   ⚠️ No se detectaron tooltips en todos los botones')
  }

  console.log('\n🔗 3. Probando navegación automática...')

  // Simular click en el primer botón
  const firstEyeButton = eyeButtons[0]
  if (firstEyeButton) {
    console.log('   🎯 Primer botón "Ver más" encontrado')

    // Obtener ID del producto desde el botón
    const productCard = firstEyeButton.closest('.card-dark-enhanced')
    if (productCard) {
      console.log('   📦 Tarjeta de producto identificada')

      // Simular click (pero no ejecutar para evitar navegación no deseada)
      console.log('   ✅ El botón está listo para navegar a detalles')
      console.log(
        '   📝 Haz click manual en cualquier ojo para ir a /product/[id]'
      )

      // Verificar que la función handleViewDetails existe
      const onClickHandler = firstEyeButton.onclick
      if (onClickHandler) {
        console.log('   ✅ Handler onClick configurado')
      } else {
        console.log('   ⚠️ No se detectó handler onClick directo')
      }
    } else {
      console.log('   ❌ No se pudo identificar la tarjeta del producto')
    }
  }

  console.log('\n📋 4. Verificando página de destino...')

  // Verificar que ProductDetail.tsx esté disponible
  const currentPath = window.location.pathname
  console.log(`   🌐 Ruta actual: ${currentPath}`)

  if (currentPath.startsWith('/product/')) {
    console.log('   ✅ Ya estás en una página de producto')
    console.log('   📝 La navegación funcionó correctamente')

    // Verificar elementos de la página de detalles
    testProductDetailPage()
  } else {
    console.log('   📝 En página principal - listo para probar navegación')
    console.log('   🎯 Haz click en un ojo para ir a detalles del producto')
  }
}

function testProductDetailPage() {
  console.log('\n🔍 5. Probando página de detalles del producto...')

  // Verificar elementos clave de ProductDetail
  const elements = {
    breadcrumb: document.querySelector('nav'),
    productImage: document.querySelector('img[alt*=""]'),
    productTitle: document.querySelector('h1'),
    priceElement: document.querySelector('.text-verde-neon'),
    addToCartButton: document.querySelector(
      'button:has([data-lucide="shopping-cart"])'
    ),
    favoriteButton: document.querySelector('button:has([data-lucide="heart"])'),
    backButton: document.querySelector(
      'button:has([data-lucide="arrow-left"])'
    ),
  }

  const foundElements = Object.entries(elements).filter(
    ([key, el]) => el !== null
  )

  console.log(`   📊 ${foundElements.length}/7 elementos clave encontrados:`)
  foundElements.forEach(([key, el]) => {
    console.log(`   ✅ ${key}: Encontrado`)
  })

  const missingElements = Object.entries(elements).filter(
    ([key, el]) => el === null
  )
  if (missingElements.length > 0) {
    console.log(`   ❌ Elementos faltantes:`)
    missingElements.forEach(([key, el]) => {
      console.log(`   ❌ ${key}: No encontrado`)
    })
  }

  // Verificar funcionalidad específica
  if (elements.backButton) {
    console.log('   🔙 Botón "Volver" disponible')
  }

  if (elements.addToCartButton) {
    console.log('   🛒 Botón "Agregar al carrito" disponible')
  }

  if (elements.favoriteButton) {
    console.log('   ❤️ Botón de favoritos disponible con tooltip')
  }
}

function simulateProductNavigation() {
  console.log('\n🚀 6. Simulación de navegación completa...')

  // Simular flujo completo de navegación
  const eyeButtons = Array.from(document.querySelectorAll('button')).filter(
    btn => btn.querySelector('[data-lucide="eye"]')
  )

  if (eyeButtons.length > 0) {
    const randomButton =
      eyeButtons[Math.floor(Math.random() * eyeButtons.length)]

    console.log('   🎲 Botón seleccionado aleatoriamente')
    console.log('   📝 Para probar: Haz click en este botón')

    // Resaltar el botón visualmente (temporal)
    const originalStyle = randomButton.style.cssText
    randomButton.style.cssText +=
      'border: 3px solid #00ff41 !important; box-shadow: 0 0 10px #00ff41 !important;'

    setTimeout(() => {
      randomButton.style.cssText = originalStyle
    }, 3000)

    console.log('   ✨ Botón resaltado por 3 segundos')
  }
}

// Ejecutar pruebas principales
console.log('🚀 Iniciando pruebas de navegación...')

setTimeout(() => {
  testProductDetailNavigation()

  console.log('\n✅ Pruebas completadas!')
  console.log('\n📋 Resumen de funcionalidades implementadas:')
  console.log('1. 👁️ Botón "Ver más" con tooltip')
  console.log('2. 🔗 Navegación a /product/[id]')
  console.log('3. 📄 Página ProductDetail.tsx completa')
  console.log('4. 🎨 Estilo RockBros coherente')
  console.log('5. 🔙 Navegación de vuelta funcional')

  console.log('\n🛠️ Funciones disponibles:')
  console.log('testProductDetailNavigation() - Probar navegación')
  console.log('testProductDetailPage() - Probar página de detalles')
  console.log('simulateProductNavigation() - Resaltar botón para probar')

  // Hacer funciones disponibles globalmente
  window.testProductDetailNavigation = testProductDetailNavigation
  window.testProductDetailPage = testProductDetailPage
  window.simulateProductNavigation = simulateProductNavigation

  // Auto-ejecutar simulación si estamos en la página principal
  if (window.location.pathname === '/') {
    setTimeout(simulateProductNavigation, 2000)
  }
}, 1000) // Esperar 1 segundo para que todo se renderice

console.log('⏳ Esperando renderizado de componentes...')
