// Re-export del servicio de productos para compatibilidad
export { ProductService } from './services/productService'

// Hook personalizado para productos usando React Query
import { useQuery } from '@tanstack/react-query'
import { ProductService } from './services'
import type { ProductFilters } from './schemas'

// Hook para obtener productos
export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => ProductService.getProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

// Hook para obtener un producto específico
export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => ProductService.getProduct(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutos
  })
}

// Hook para productos destacados
export function useFeaturedProducts(limit = 8) {
  return useQuery({
    queryKey: ['featured-products', limit],
    queryFn: () => ProductService.getFeaturedProducts(limit),
    staleTime: 15 * 60 * 1000, // 15 minutos
  })
}

// Hook para categorías
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => ProductService.getCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutos
  })
}

// Hook para marcas
export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: () => ProductService.getBrands(),
    staleTime: 30 * 60 * 1000, // 30 minutos
  })
}
