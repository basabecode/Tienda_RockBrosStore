import { useContext } from 'react'
import { UnifiedFavoritesContext } from '@/contexts/favorites-context'

/**
 * Hook para usar el contexto de favoritos unificados
 *
 * @throws {Error} Si se usa fuera del UnifiedFavoritesProvider
 * @returns {UnifiedFavoritesContextType} El contexto de favoritos
 */
export const useUnifiedFavorites = () => {
  const context = useContext(UnifiedFavoritesContext)
  if (!context) {
    throw new Error(
      'useUnifiedFavorites must be used within a UnifiedFavoritesProvider'
    )
  }
  return context
}

// Re-exportar tipos para conveniencia
export type {
  UnifiedFavoriteItem,
  UnifiedFavoriteRecord,
  UnifiedFavoritesContextType,
} from '@/types/favorites'
