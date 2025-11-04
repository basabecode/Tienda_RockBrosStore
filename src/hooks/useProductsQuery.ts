// Hook personalizado para consulta de productos con React Query optimizado
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Product } from '@/lib/types'

interface ProductFilters {
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  search?: string
  page?: number
  pageSize?: number
}

interface ProductQueryResult {
  data: Product[]
  totalCount: number
  totalPages: number
  currentPage: number
}

export const useProductsQuery = (filters: ProductFilters = {}) => {
  const { page = 1, pageSize = 12, ...otherFilters } = filters

  return useQuery({
    queryKey: ['products', { ...otherFilters, page, pageSize }],
    queryFn: async (): Promise<ProductQueryResult> => {
      // Consulta para contar el total
      let countQuery = supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)

      // Consulta principal con paginación
      let query = supabase.from('products').select('*').eq('is_active', true)

      // Aplicar filtros a la consulta de conteo
      if (otherFilters.category) {
        countQuery = countQuery.eq('category', otherFilters.category)
      }
      if (otherFilters.brand) {
        countQuery = countQuery.eq('brand', otherFilters.brand)
      }
      if (otherFilters.minPrice) {
        countQuery = countQuery.gte('price', otherFilters.minPrice)
      }
      if (otherFilters.maxPrice) {
        countQuery = countQuery.lte('price', otherFilters.maxPrice)
      }
      if (otherFilters.search) {
        countQuery = countQuery.or(
          `name.ilike.%${otherFilters.search}%,description.ilike.%${otherFilters.search}%`
        )
      }

      // Aplicar filtros a la consulta principal
      if (otherFilters.category) {
        query = query.eq('category', otherFilters.category)
      }
      if (otherFilters.brand) {
        query = query.eq('brand', otherFilters.brand)
      }
      if (otherFilters.minPrice) {
        query = query.gte('price', otherFilters.minPrice)
      }
      if (otherFilters.maxPrice) {
        query = query.lte('price', otherFilters.maxPrice)
      }
      if (otherFilters.search) {
        query = query.or(
          `name.ilike.%${otherFilters.search}%,description.ilike.%${otherFilters.search}%`
        )
      }

      // Aplicar paginación y ordenamiento
      const startIndex = (page - 1) * pageSize
      query = query
        .order('created_at', { ascending: false })
        .range(startIndex, startIndex + pageSize - 1)

      // Ejecutar ambas consultas
      const [{ data, error }, { count, error: countError }] = await Promise.all(
        [query, countQuery]
      )

      if (error) {
        console.error('Error fetching products:', error)
        throw error
      }

      if (countError) {
        console.error('Error counting products:', countError)
        throw countError
      }

      const totalPages = Math.ceil((count || 0) / pageSize)

      return {
        data: (data as Product[]) || [],
        totalCount: count || 0,
        totalPages,
        currentPage: page,
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos para datos de productos
    gcTime: 10 * 60 * 1000, // 10 minutos en cache
    refetchOnWindowFocus: false,
    // Mantener datos anteriores mientras carga la nueva página
    placeholderData: previousData => previousData,
  })
}

// Hook legado para mantener compatibilidad
export const useAllProductsQuery = (
  filters: Omit<ProductFilters, 'page' | 'pageSize'> = {}
) => {
  return useQuery({
    queryKey: ['all-products', filters],
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
        console.error('Error fetching all products:', error)
        throw error
      }

      return data as Product[]
    },
    staleTime: 10 * 60 * 1000, // 10 minutos para la consulta de todos los productos
    gcTime: 15 * 60 * 1000, // 15 minutos en cache
    refetchOnWindowFocus: false,
  })
}
