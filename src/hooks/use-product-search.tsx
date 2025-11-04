import { useState, useMemo, useCallback } from 'react'
import type { Product } from '@/lib/types'

// Interfaz simplificada de filtros
export interface ProductFilters {
  search: string
  categories: string[]
  brands: string[]
  minPrice: number
  maxPrice: number
  inStock: boolean
  onSale: boolean
  featured: boolean
}

// Estado inicial de filtros
const initialFilters: ProductFilters = {
  search: '',
  categories: [],
  brands: [],
  minPrice: 0,
  maxPrice: 10000000,
  inStock: false,
  onSale: false,
  featured: false,
}

// Categorías oficiales de RockBros
export const ROCKBROS_CATEGORIES = [
  'Accesorio',
  'Seguridad',
  'Bolsos',
  'Herramientas',
]

// Marca única
export const ROCKBROS_BRAND = 'RockBros'

export const useProductSearch = (products: Product[] = []) => {
  const [filters, setFilters] = useState<ProductFilters>(initialFilters)

  // Función para actualizar filtros individuales
  const updateFilter = useCallback(
    <K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) => {
      setFilters(prev => ({
        ...prev,
        [key]: value,
      }))
    },
    []
  )

  // Toggle para arrays (categorías, marcas)
  const toggleArrayFilter = useCallback(
    <K extends keyof ProductFilters>(key: K, value: string) => {
      setFilters(prev => {
        const currentArray = prev[key] as string[]
        const newArray = currentArray.includes(value)
          ? currentArray.filter(item => item !== value)
          : [...currentArray, value]

        return {
          ...prev,
          [key]: newArray,
        }
      })
    },
    []
  )

  // Limpiar todos los filtros
  const clearFilters = useCallback(() => {
    setFilters(initialFilters)
  }, [])

  // Búsqueda con regex
  const searchProducts = useCallback(
    (searchTerm: string, productList: Product[]) => {
      if (!searchTerm.trim()) return productList

      const regex = new RegExp(
        searchTerm.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        'gi'
      )

      return productList.filter(product => {
        const searchFields = [
          product.name,
          product.description || '',
          product.category,
          product.brand || '',
          ...(product.tags || []),
        ].join(' ')

        return regex.test(searchFields)
      })
    },
    []
  )

  // Productos filtrados
  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Búsqueda por texto
    if (filters.search) {
      result = searchProducts(filters.search, result)
    }

    // Filtrar por categorías
    if (filters.categories.length > 0) {
      result = result.filter(product =>
        filters.categories.includes(product.category)
      )
    }

    // Filtrar por marcas
    if (filters.brands.length > 0) {
      result = result.filter(
        product => product.brand && filters.brands.includes(product.brand)
      )
    }

    // Filtrar por rango de precio
    result = result.filter(
      product =>
        product.price >= filters.minPrice && product.price <= filters.maxPrice
    )

    // Filtrar por stock
    if (filters.inStock) {
      result = result.filter(product => product.stock > 0)
    }

    // Filtrar por ofertas
    if (filters.onSale) {
      result = result.filter(
        product =>
          product.compare_price && product.compare_price > product.price
      )
    }

    // Filtrar destacados
    if (filters.featured) {
      result = result.filter(product => product.is_featured)
    }

    return result
  }, [products, filters, searchProducts])

  // Estadísticas para filtros
  const filterStats = useMemo(() => {
    // Usar las categorías oficiales de RockBros
    const availableCategories = ROCKBROS_CATEGORIES

    // Solo mostrar RockBros como marca disponible
    const availableBrands = [ROCKBROS_BRAND]

    const priceRange = products.reduce(
      (acc, product) => ({
        min: Math.min(acc.min, product.price),
        max: Math.max(acc.max, product.price),
      }),
      { min: Infinity, max: 0 }
    )

    return {
      totalProducts: products.length,
      filteredCount: filteredProducts.length,
      availableCategories,
      availableBrands,
      priceRange: products.length > 0 ? priceRange : { min: 0, max: 1000000 },
    }
  }, [products, filteredProducts])

  // Contador de filtros activos
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.search) count++
    if (filters.categories.length > 0) count++
    if (filters.brands.length > 0) count++
    if (filters.inStock) count++
    if (filters.onSale) count++
    if (filters.featured) count++
    if (filters.minPrice > 0 || filters.maxPrice < 10000000) count++
    return count
  }, [filters])

  return {
    filters,
    filteredProducts,
    filterStats,
    activeFiltersCount,
    updateFilter,
    toggleArrayFilter,
    clearFilters,
    searchProducts,
  }
}
