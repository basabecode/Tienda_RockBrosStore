/**
 * Utilidades para limpieza completa de sesión
 * Session Termination - Limpiar estado temporal sin afectar datos persistentes
 */

/**
 * Claves de localStorage que deben limpiarse al cerrar sesión
 */
const LOCAL_STORAGE_KEYS = [
  'cart', // Carrito de compras temporal
  'favorites', // Favoritos de usuario invitado
  'favorites_guest', // Favoritos específicos de invitado
  'viewedProducts', // Productos vistos recientemente
  'intendedRoute', // Ruta planeada después de login
  'lastVisitedCategory', // Última categoría visitada
  'searchHistory', // Historial de búsquedas
  'userPreferences', // Preferencias temporales de UI
  'cartFilters', // Filtros aplicados en productos
  'sortPreferences', // Preferencias de ordenamiento
  'recentSearches', // Búsquedas recientes
]

/**
 * Claves de sessionStorage que deben limpiarse
 */
const SESSION_STORAGE_KEYS = [
  'tempUserData', // Datos temporales de usuario
  'formDrafts', // Borradores de formularios
  'navigationState', // Estado de navegación
  'tempCart', // Carrito temporal
  'checkoutProgress', // Progreso del checkout
  'productFilters', // Filtros de productos activos
]

/**
 * Limpia completamente el localStorage de datos relacionados con la sesión
 */
export const clearLocalStorageSession = (): void => {
  try {
    console.log('🧹 Limpiando localStorage de la sesión...')

    LOCAL_STORAGE_KEYS.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key)
        console.log(`✅ Eliminado localStorage: ${key}`)
      }
    })

    // Limpiar cualquier clave que empiece con patrones conocidos
    const allKeys = Object.keys(localStorage)
    const patternsToClean = ['user_', 'temp_', 'draft_', 'cache_', 'session_']

    allKeys.forEach(key => {
      if (patternsToClean.some(pattern => key.startsWith(pattern))) {
        localStorage.removeItem(key)
        console.log(`✅ Eliminado localStorage por patrón: ${key}`)
      }
    })
  } catch (error) {
    console.error('❌ Error limpiando localStorage:', error)
  }
}

/**
 * Limpia completamente el sessionStorage
 */
export const clearSessionStorageSession = (): void => {
  try {
    console.log('🧹 Limpiando sessionStorage de la sesión...')

    SESSION_STORAGE_KEYS.forEach(key => {
      if (sessionStorage.getItem(key)) {
        sessionStorage.removeItem(key)
        console.log(`✅ Eliminado sessionStorage: ${key}`)
      }
    })

    // Alternativamente, limpiar todo el sessionStorage ya que es temporal por naturaleza
    sessionStorage.clear()
    console.log('✅ SessionStorage completamente limpio')
  } catch (error) {
    console.error('❌ Error limpiando sessionStorage:', error)
  }
}

/**
 * Resetea el estado de React Query / TanStack Query
 * Esta función se llama desde el hook de auth donde se tiene acceso al queryClient
 */
export const clearQueryCache = (queryClient?: {
  clear: () => void
  removeQueries: () => void
}): void => {
  try {
    console.log('🧹 Limpiando cache de queries...')

    if (queryClient) {
      // Limpiar todas las queries
      queryClient.clear()
      queryClient.removeQueries()
      console.log('✅ Cache de React Query limpiado')
    } else {
      console.log('ℹ️ QueryClient no disponible, saltando limpieza de cache')
    }
  } catch (error) {
    console.error('❌ Error limpiando query cache:', error)
  }
}

/**
 * Limpia cookies relacionadas con la sesión (si las hay)
 */
export const clearSessionCookies = (): void => {
  try {
    console.log('🧹 Limpiando cookies de sesión...')

    const cookiesToClear = [
      'sb-access-token',
      'sb-refresh-token',
      'user-session',
      'auth-token',
      'remember-me',
    ]

    cookiesToClear.forEach(cookieName => {
      // Limpiar cookie en diferentes paths y dominios
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`
    })

    console.log('✅ Cookies de sesión limpiadas')
  } catch (error) {
    console.error('❌ Error limpiando cookies:', error)
  }
}

/**
 * Función principal para Session Termination completa
 */
export const performSessionTermination = (queryClient?: {
  clear: () => void
  removeQueries: () => void
}): void => {
  console.log('🚀 Iniciando Session Termination completa...')

  // 1. Limpiar localStorage
  clearLocalStorageSession()

  // 2. Limpiar sessionStorage
  clearSessionStorageSession()

  // 3. Limpiar cookies de sesión
  clearSessionCookies()

  // 4. Limpiar cache de queries
  clearQueryCache(queryClient)

  console.log('✅ Session Termination completada exitosamente')
}

/**
 * Función para verificar que la limpieza fue efectiva
 */
export const verifySessionCleanup = (): boolean => {
  try {
    const remainingKeys = LOCAL_STORAGE_KEYS.filter(
      key => localStorage.getItem(key) !== null
    )
    const remainingSessionKeys = SESSION_STORAGE_KEYS.filter(
      key => sessionStorage.getItem(key) !== null
    )

    if (remainingKeys.length > 0) {
      console.warn('⚠️ Claves de localStorage aún presentes:', remainingKeys)
      return false
    }

    if (remainingSessionKeys.length > 0) {
      console.warn(
        '⚠️ Claves de sessionStorage aún presentes:',
        remainingSessionKeys
      )
      return false
    }

    console.log('✅ Verificación de limpieza exitosa')
    return true
  } catch (error) {
    console.error('❌ Error verificando limpieza:', error)
    return false
  }
}
