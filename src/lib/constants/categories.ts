/**
 * 📋 CONSTANTES DE CATEGORÍAS - UNIFICADAS
 *
 * Archivo centralizado para todas las categorías del proyecto RockBros Store.
 * Define las categorías principales de forma consistente en toda la aplicación.
 *
 * @autor RockBros Development Team
 * @fecha Noviembre 2025
 * @version 1.0.0
 */

// ====================================
// 🎯 DEFINICIÓN DE TIPOS
// ====================================

export interface Category {
  id: string
  name: string
  slug: string
  image: string
  count: number
  description: string
  color: string
  is_active: boolean
}

// ====================================
// 📊 CATEGORÍAS PRINCIPALES (4 oficiales)
// ====================================

/**
 * Categorías principales del sistema RockBros Store
 * Estas son las 4 categorías oficiales después de la simplificación de Nov 2025
 */
export const ROCKBROS_CATEGORIES: Category[] = [
  {
    id: 'seguridad',
    name: 'Seguridad',
    slug: 'seguridad',
    image: '/img/categories/casco.jpg',
    count: 120,
    description: 'Cascos y equipamiento de protección',
    color: 'from-emerald-600/80 to-emerald-500/60', // Verde bosque degradado
    is_active: true,
  },
  {
    id: 'bolsos',
    name: 'Bolsos',
    slug: 'bolsos',
    image: '/img/categories/bolsos.jpg',
    count: 76,
    description: 'Mochilas y bolsos para ciclismo',
    color: 'from-teal-500/80 to-cyan-400/60', // Verde neón degradado
    is_active: true,
  },
  {
    id: 'accesorios',
    name: 'Accesorios',
    slug: 'accesorios',
    image: '/img/categories/gafas3.jpg',
    count: 87,
    description: 'Soportes, bombas, candados y más',
    color: 'from-slate-600/80 to-slate-500/60', // Gris neutro degradado
    is_active: true,
  },
  {
    id: 'herramientas',
    name: 'Herramientas',
    slug: 'herramientas',
    image: '/img/categories/pedales.jpg',
    count: 53,
    description: 'Mantenimiento y ajuste profesional',
    color: 'from-zinc-700/80 to-zinc-600/60', // Gris oscuro degradado
    is_active: true,
  },
]

// ====================================
// 🔄 MAPEO PARA COMPATIBILIDAD
// ====================================

/**
 * Mapeo de nombres de categorías para diferentes contextos
 * Útil para mantener compatibilidad entre diferentes partes del sistema
 */
export const CATEGORY_MAPPINGS = {
  // Nombres exactos (usar estos en forms y filtros)
  EXACT_NAMES: ['seguridad', 'bolsos', 'accesorios', 'herramientas'] as const,

  // Nombres con capitalización (para mostrar en UI)
  DISPLAY_NAMES: ['Seguridad', 'Bolsos', 'Accesorios', 'Herramientas'] as const,

  // IDs únicos
  IDS: ['seguridad', 'bolsos', 'accesorios', 'herramientas'] as const,

  // Slugs para URLs
  SLUGS: ['seguridad', 'bolsos', 'accesorios', 'herramientas'] as const,
}

// ====================================
// 🎨 CONFIGURACIÓN VISUAL
// ====================================

/**
 * Colores específicos para cada categoría
 */
export const CATEGORY_COLORS = {
  seguridad: 'from-emerald-600/80 to-emerald-500/60',
  bolsos: 'from-teal-500/80 to-cyan-400/60',
  accesorios: 'from-slate-600/80 to-slate-500/60',
  herramientas: 'from-zinc-700/80 to-zinc-600/60',
} as const

/**
 * Imágenes por categoría
 */
export const CATEGORY_IMAGES = {
  seguridad: '/img/categories/casco.jpg',
  bolsos: '/img/categories/bolsos.jpg',
  accesorios: '/img/categories/gafas3.jpg',
  herramientas: '/img/categories/pedales.jpg',
} as const

// ====================================
// 🛠️ FUNCIONES UTILITARIAS
// ====================================

/**
 * Obtiene una categoría por su ID
 */
export function getCategoryById(id: string): Category | undefined {
  return ROCKBROS_CATEGORIES.find(cat => cat.id === id)
}

/**
 * Obtiene una categoría por su nombre
 */
export function getCategoryByName(name: string): Category | undefined {
  return ROCKBROS_CATEGORIES.find(
    cat => cat.name.toLowerCase() === name.toLowerCase()
  )
}

/**
 * Obtiene todas las categorías activas
 */
export function getActiveCategories(): Category[] {
  return ROCKBROS_CATEGORIES.filter(cat => cat.is_active)
}

/**
 * Obtiene solo los nombres de las categorías
 */
export function getCategoryNames(): string[] {
  return ROCKBROS_CATEGORIES.map(cat => cat.name)
}

/**
 * Obtiene solo los IDs de las categorías
 */
export function getCategoryIds(): string[] {
  return ROCKBROS_CATEGORIES.map(cat => cat.id)
}

/**
 * Valida si un nombre de categoría es válido
 */
export function isValidCategory(categoryName: string): boolean {
  return (
    (CATEGORY_MAPPINGS.EXACT_NAMES as readonly string[]).includes(
      categoryName
    ) ||
    (CATEGORY_MAPPINGS.DISPLAY_NAMES as readonly string[]).includes(
      categoryName
    )
  )
}

/**
 * Normaliza el nombre de una categoría
 */
export function normalizeCategoryName(name: string): string {
  const category = getCategoryByName(name)
  return category ? category.name : name
}

// ====================================
// 📊 ESTADÍSTICAS
// ====================================

/**
 * Contador total de productos por categoría
 */
export const CATEGORY_STATS = {
  total_categories: ROCKBROS_CATEGORIES.length,
  total_products: ROCKBROS_CATEGORIES.reduce((sum, cat) => sum + cat.count, 0),
  active_categories: getActiveCategories().length,
} as const

// ====================================
// 🚫 CATEGORÍAS DEPRECADAS
// ====================================

/**
 * Categorías que fueron removidas en la actualización Nov 2025
 * Mantener para referencia histórica y migración de datos
 */
export const DEPRECATED_CATEGORIES = [
  'bicicletas',
  'componentes',
  'ropa',
  'neumaticos',
] as const

/**
 * Mapeo de categorías deprecadas a las nuevas
 */
export const MIGRATION_MAP = {
  bicicletas: 'accesorios', // Los accesorios de bicicletas van a accesorios
  componentes: 'accesorios', // Componentes van a accesorios
  ropa: 'seguridad', // Ropa de ciclismo va a seguridad
  neumaticos: 'accesorios', // Neumáticos van a accesorios
} as const

// ====================================
// 🔧 TIPOS DERIVADOS
// ====================================

export type CategoryId = (typeof CATEGORY_MAPPINGS.IDS)[number]
export type CategoryName = (typeof CATEGORY_MAPPINGS.DISPLAY_NAMES)[number]
export type CategorySlug = (typeof CATEGORY_MAPPINGS.SLUGS)[number]
export type DeprecatedCategory = (typeof DEPRECATED_CATEGORIES)[number]

// ====================================
// 📤 EXPORTS
// ====================================

// Export default de las categorías principales
export default ROCKBROS_CATEGORIES

// Named exports para uso específico
export {
  ROCKBROS_CATEGORIES as categories,
  CATEGORY_MAPPINGS as mappings,
  CATEGORY_COLORS as colors,
  CATEGORY_IMAGES as images,
}
