/**
 * Exportaciones principales del sistema de favoritos unificados
 */

// Provider
export { UnifiedFavoritesProvider } from '@/components/providers/UnifiedFavoritesProvider'

// Hook
export { useUnifiedFavorites } from '@/hooks/useUnifiedFavorites'

// Tipos
export type {
  UnifiedFavoriteItem,
  UnifiedFavoriteRecord,
  UnifiedFavoritesContextType,
} from '@/types/favorites'

// Contexto (para casos avanzados)
export { UnifiedFavoritesContext } from '@/contexts/favorites-context'
