import { createContext } from 'react'
import { UnifiedFavoritesContextType } from '@/types/favorites'

/**
 * Contexto para el estado global de favoritos unificados
 */
export const UnifiedFavoritesContext =
  createContext<UnifiedFavoritesContextType | null>(null)
