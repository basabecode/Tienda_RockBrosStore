// Script de prueba para verificar integración de categorías
// Ejecutar en la consola del navegador

console.log(
  '🧪 Probando integración de categorías AdminProducts <-> ProductGrid'
)

// Función para probar el selector de categorías en AdminProducts
function testAdminCategorySelector() {
  console.log('\n📋 1. Probando selector de categorías en Admin...')

  // Navegar a admin si no estamos allí
  if (!window.location.href.includes('/admin')) {
    console.log('   Redirigiendo a admin...')
    window.location.href = '/admin/products'
    return
  }

  // Buscar el botón de "Crear Producto"
  const createButton = Array.from(document.querySelectorAll('button')).find(
    btn =>
      btn.textContent?.includes('Crear Producto') ||
      btn.textContent?.includes('Agregar')
  )

  if (createButton) {
    console.log('   ✅ Botón de crear producto encontrado')
    // createButton.click() // No hacer click automáticamente
    console.log(
      '   📝 Hacer click manualmente en "Crear Producto" para probar el selector'
    )
  } else {
    console.log('   ❌ Botón de crear producto no encontrado')
  }

  // Verificar que las categorías RockBros estén disponibles
  const categorySelectors = document.querySelectorAll(
    '[data-radix-select-trigger]'
  )
  console.log(`   📊 ${categorySelectors.length} selectores encontrados`)
}

// Función para probar filtros en ProductGrid
function testProductGridFilters() {
  console.log('\n🔍 2. Probando filtros en ProductGrid...')

  // Navegar a la tienda si no estamos allí
  if (window.location.href.includes('/admin')) {
    console.log('   Redirigiendo a la tienda...')
    window.location.href = '/'
    return
  }

  // Buscar el botón de "Mostrar Filtros"
  const filterButton = Array.from(document.querySelectorAll('button')).find(
    btn =>
      btn.textContent?.includes('Mostrar Filtros') ||
      btn.textContent?.includes('Filtros')
  )

  if (filterButton) {
    console.log('   ✅ Botón de filtros encontrado')
    console.log(
      '   📝 Hacer click manualmente en "Mostrar Filtros" para probar'
    )
  } else {
    console.log('   ❌ Botón de filtros no encontrado')
  }

  // Verificar sección de productos
  const productsSection =
    document.getElementById('shop') || document.getElementById('products-grid')
  if (productsSection) {
    console.log('   ✅ Sección de productos encontrada')
  } else {
    console.log('   ❌ Sección de productos no encontrada')
  }
}

// Función para verificar categorías disponibles
function testCategoryIntegration() {
  console.log('\n🎯 3. Verificando categorías RockBros...')

  // Categorías esperadas según categories.ts
  const expectedCategories = [
    'Seguridad',
    'Bolsos',
    'Accesorios',
    'Herramientas',
  ]

  console.log('   📝 Categorías oficiales esperadas:')
  expectedCategories.forEach((cat, index) => {
    const emoji = ['🛡️', '🎒', '⚙️', '🔧'][index]
    console.log(`   ${emoji} ${cat}`)
  })

  // Verificar si hay elementos de categoría en el DOM
  const categoryElements = document.querySelectorAll(
    '[class*="categoria"], [data-category]'
  )
  console.log(
    `   📊 ${categoryElements.length} elementos de categoría encontrados en DOM`
  )
}

// Ejecutar pruebas
console.log('🚀 Iniciando pruebas de integración...')

// Determinar dónde estamos y qué probar
if (window.location.href.includes('/admin')) {
  testAdminCategorySelector()
} else {
  testProductGridFilters()
}

testCategoryIntegration()

console.log('\n✅ Pruebas completadas. Resultados arriba.')
console.log('\n📋 Próximos pasos manuales:')
console.log('1. Probar crear/editar producto en Admin con nuevas categorías')
console.log(
  '2. Verificar que los filtros de ProductGrid usen las categorías correctas'
)
console.log('3. Confirmar que el filtrado funcione entre Admin y ProductGrid')

// Función helper para navegar
window.testCategories = {
  goToAdmin: () => (window.location.href = '/admin/products'),
  goToShop: () => (window.location.href = '/'),
  testAdmin: testAdminCategorySelector,
  testShop: testProductGridFilters,
  testIntegration: testCategoryIntegration,
}

console.log('\n🛠️ Funciones disponibles:')
console.log('testCategories.goToAdmin() - Ir a admin')
console.log('testCategories.goToShop() - Ir a tienda')
console.log('testCategories.testAdmin() - Probar admin')
console.log('testCategories.testShop() - Probar tienda')
console.log('testCategories.testIntegration() - Verificar categorías')
