import { supabase } from '../supabase'
import {
  productSchema,
  productUpdateSchema,
  productFiltersSchema,
  type ProductFilters,
} from '../schemas'
import type { Product } from '../types'

// Servicio para productos
export class ProductService {
  // Obtener productos con filtros
  static async getProducts(filters: ProductFilters = {}) {
    const validatedFilters = productFiltersSchema.parse(filters)

    let query = supabase.from('products').select('*')

    // Aplicar filtros
    if (validatedFilters.status) {
      query = query.eq('status', validatedFilters.status)
    } else {
      query = query.eq('status', 'active') // Por defecto solo productos activos
    }

    if (validatedFilters.category) {
      query = query.eq('category', validatedFilters.category)
    }

    if (validatedFilters.brand) {
      query = query.eq('brand', validatedFilters.brand)
    }

    if (validatedFilters.is_featured !== undefined) {
      query = query.eq('is_featured', validatedFilters.is_featured)
    }

    if (validatedFilters.min_price !== undefined) {
      query = query.gte('price', validatedFilters.min_price)
    }

    if (validatedFilters.max_price !== undefined) {
      query = query.lte('price', validatedFilters.max_price)
    }

    if (validatedFilters.search) {
      query = query.or(
        `name.ilike.%${validatedFilters.search}%,description.ilike.%${validatedFilters.search}%`
      )
    }

    // Ordenamiento
    const ascending = validatedFilters.order === 'asc'
    query = query.order(validatedFilters.sort, { ascending })

    // Paginación
    const from = (validatedFilters.page - 1) * validatedFilters.pageSize
    const to = from + validatedFilters.pageSize - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      throw new Error(`Error fetching products: ${error.message}`)
    }

    return {
      data: data as Product[],
      count: count || 0,
      page: validatedFilters.page,
      pageSize: validatedFilters.pageSize,
      totalPages: Math.ceil((count || 0) / validatedFilters.pageSize),
    }
  }

  // Obtener producto por ID
  static async getProduct(id: string): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw new Error(`Error fetching product: ${error.message}`)
    }

    return data as Product
  }

  // Obtener productos destacados
  static async getFeaturedProducts(limit = 8): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'active')
      .eq('is_featured', true)
      .limit(limit)

    if (error) {
      throw new Error(`Error fetching featured products: ${error.message}`)
    }

    return data as Product[]
  }

  // Obtener categorías disponibles
  static async getCategories(): Promise<string[]> {
    const { data, error } = await supabase
      .from('products')
      .select('category')
      .eq('status', 'active')
      .not('category', 'is', null)

    if (error) {
      throw new Error(`Error fetching categories: ${error.message}`)
    }

    const categories = [
      ...new Set(
        (data as { category: string | null }[])
          .map(item => item.category)
          .filter(Boolean)
      ),
    ]
    return categories as string[]
  }

  // Obtener marcas disponibles
  static async getBrands(): Promise<string[]> {
    const { data, error } = await supabase
      .from('products')
      .select('brand')
      .eq('status', 'active')
      .not('brand', 'is', null)

    if (error) {
      throw new Error(`Error fetching brands: ${error.message}`)
    }

    const brands = [
      ...new Set(
        (data as { brand: string | null }[])
          .map(item => item.brand)
          .filter(Boolean)
      ),
    ]
    return brands as string[]
  }
}
