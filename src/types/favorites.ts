/**
 * Tipos para el sistema de favoritos unificado
 */

export interface UnifiedFavoriteItem {
  id: string
  name: string
  price: number
  main_image?: string
  image_url?: string // Compatibilidad con formato anterior
  stock?: number
  category?: string
  brand?: string
  description?: string
  is_active?: boolean
}

export interface UnifiedFavoriteRecord {
  id: string
  user_id: string
  product_id: string
  created_at: string
  products?: UnifiedFavoriteItem | null
}

export interface UnifiedFavoritesContextType {
  // Estados
  favorites: UnifiedFavoriteRecord[]
  isLoading: boolean
  error: Error | null
  favoriteCount: number

  // Acciones
  addFavorite: (product: UnifiedFavoriteItem) => Promise<void>
  removeFavorite: (favoriteId: string) => Promise<void>
  isFavorite: (productId: string) => boolean
  toggleFavorite: (product: UnifiedFavoriteItem) => Promise<void>
  clearFavorites: () => Promise<void>

  // Utilidades
  syncLocalStorageToSupabase: () => Promise<void>
  refetch: () => void
}
