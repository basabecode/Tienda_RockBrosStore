/**
 * Utilidades compartidas para el sistema de favoritos
 */

/**
 * Formatea un precio en pesos colombianos
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
 * Calcula el valor total de una lista de favoritos
 */
export const calculateTotalValue = (
  favorites: Array<{ products?: { price?: number } | null }>
): number => {
  return favorites.reduce((sum, favorite) => {
    return sum + (favorite.products?.price || 0)
  }, 0)
}

/**
 * Cuenta cuántos productos están disponibles (con stock > 0)
 */
export const countAvailableProducts = (
  favorites: Array<{ products?: { stock?: number } | null }>
): number => {
  return favorites.filter(favorite => (favorite.products?.stock || 0) > 0)
    .length
}

/**
 * Verifica si un producto está en stock
 */
export const isInStock = (product?: { stock?: number } | null): boolean => {
  return (product?.stock || 0) > 0
}

/**
 * Obtiene la URL de imagen correcta del producto
 */
export const getProductImageUrl = (
  product?: { main_image?: string; image_url?: string } | null
): string => {
  return product?.main_image || product?.image_url || '/placeholder.svg'
}

/**
 * Valida si un producto tiene la información mínima requerida
 */
export const isValidProduct = (
  product?: { id?: string; name?: string; price?: number } | null
): boolean => {
  return !!(product?.id && product?.name && typeof product?.price === 'number')
}

/**
 * Tipos para cart items
 */
export interface CartItem {
  id: string
  name: string
  price: number
  image_url?: string
  stock?: number
  category?: string
  brand?: string
}

/**
 * Convierte un producto de favoritos a un item del carrito
 */
export const favoriteToCartItem = (
  product?: {
    id?: string
    name?: string
    price?: number
    main_image?: string
    image_url?: string
    stock?: number
    category?: string
    brand?: string
  } | null
): CartItem | null => {
  if (!isValidProduct(product)) {
    return null
  }

  return {
    id: product!.id!,
    name: product!.name!,
    price: product!.price!,
    image_url: getProductImageUrl(product),
    stock: product?.stock,
    category: product?.category,
    brand: product?.brand,
  }
}

/**
 * Genera un mensaje de toast personalizado para favoritos
 */
export const getFavoriteToastMessage = (
  action: 'add' | 'remove' | 'clear',
  productName?: string,
  isAuthenticated?: boolean
) => {
  switch (action) {
    case 'add':
      return {
        title: 'Agregado a favoritos',
        description: isAuthenticated
          ? `${productName} se ha agregado a tus favoritos`
          : `${productName} guardado temporalmente. Inicia sesión para guardar permanentemente.`,
      }
    case 'remove':
      return {
        title: 'Eliminado de favoritos',
        description: `${productName} se ha eliminado de tus favoritos`,
      }
    case 'clear':
      return {
        title: 'Favoritos limpiados',
        description: 'Se han eliminado todos los productos de tus favoritos',
      }
    default:
      return {
        title: 'Favoritos actualizados',
        description: 'Los favoritos se han actualizado correctamente',
      }
  }
}

/**
 * Debounce function para evitar clicks múltiples
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
