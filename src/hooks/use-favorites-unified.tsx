/**
 * @deprecated Este archivo ha sido refactorizado para seguir mejores prácticas.
 * Los componentes, hooks y tipos se han separado en archivos individuales.
 *
 * Nueva estructura:
 * - Provider: @/components/providers/UnifiedFavoritesProvider
 * - Hook: @/hooks/useUnifiedFavorites (importar directamente desde allí)
 * - Tipos: @/types/favorites
 * - Contexto: @/contexts/favorites-context
 *
 * Nota: Para usar el hook, importa directamente:
 * import { useUnifiedFavorites } from '@/hooks/useUnifiedFavorites'
 */

// Re-exportar solo componentes y tipos para compatibilidad con Fast Refresh
export { UnifiedFavoritesProvider } from '@/components/providers/UnifiedFavoritesProvider'

export type {
  UnifiedFavoriteItem,
  UnifiedFavoriteRecord,
  UnifiedFavoritesContextType,
} from '@/types/favorites'
