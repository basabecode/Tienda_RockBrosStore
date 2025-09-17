// Hook personalizado para consulta de productos con React Query
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Product } from '@/lib/types'

interface ProductFilters {
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  search?: string
}

export const useProductsQuery = (filters: ProductFilters = {}) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      let query = supabase.from('products').select('*').eq('is_active', true)

      // Aplicar filtros
      if (filters.category) {
        query = query.eq('category', filters.category)
      }

      if (filters.brand) {
        query = query.eq('brand', filters.brand)
      }

      if (filters.minPrice) {
        query = query.gte('price', filters.minPrice)
      }

      if (filters.maxPrice) {
        query = query.lte('price', filters.maxPrice)
      }

      if (filters.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
        )
      }

      const { data, error } = await query.order('created_at', {
        ascending: false,
      })

      if (error) {
        console.error('Error fetching products:', error)
        throw error
      }

      return data as Product[]
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (nuevo nombre en React Query v5)
  })
}
