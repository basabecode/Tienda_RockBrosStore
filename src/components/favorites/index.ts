// Exporta todos los componentes de favoritos para fácil importación
export { FavoriteCard } from './FavoriteCard'
export { FavoritesStats } from './FavoritesStats'
export { FavoritesGrid } from './FavoritesGrid'
export { EmptyFavorites } from './EmptyFavorites'

// Re-exportar tipos comunes
export type {
  UnifiedFavoriteRecord,
  UnifiedFavoriteItem,
} from '@/types/favorites'
export type { CartItem } from '@/utils/favorites-helpers'
