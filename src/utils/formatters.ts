/**
 * Utilidades de formateo para la aplicación
 */

/**
 * Formatea un precio en pesos colombianos (COP)
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

/**
 * Formatea una fecha en formato legible en español
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Formatea una fecha y hora en formato legible en español
 */
export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Formatea un número como porcentaje
 */
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100)
}

/**
 * Formatea un número con separadores de miles
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('es-CO').format(value)
}

/**
 * Trunca un texto a una longitud específica y añade puntos suspensivos
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * Capitaliza la primera letra de cada palabra
 */
export const capitalizeWords = (text: string): string => {
  return text.replace(/\b\w/g, l => l.toUpperCase())
}

/**
 * Calcula el tiempo relativo desde una fecha (ej: "hace 2 horas")
 */
export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInMinutes < 1) return 'hace un momento'
  if (diffInMinutes < 60)
    return `hace ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`
  if (diffInHours < 24)
    return `hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`
  if (diffInDays < 7)
    return `hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`

  return formatDate(dateString)
}
