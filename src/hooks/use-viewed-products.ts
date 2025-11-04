import { useState, useEffect } from 'react'

interface ViewedProduct {
  id: string
  name: string
  viewedAt: number
  image?: string
  price: number
}

const MAX_VIEWED_PRODUCTS = 10
const STORAGE_KEY = 'viewed_products'

export function useViewedProducts() {
  const [viewedProducts, setViewedProducts] = useState<ViewedProduct[]>([])

  // Cargar productos vistos desde localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        // Filtrar productos más antiguos de 30 días
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
        const filtered = parsed.filter(
          (p: ViewedProduct) => p.viewedAt > thirtyDaysAgo
        )
        setViewedProducts(filtered)
      }
    } catch (error) {
      console.error('Error loading viewed products:', error)
    }
  }, [])

  // Guardar en localStorage cuando cambie
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(viewedProducts))
    } catch (error) {
      console.error('Error saving viewed products:', error)
    }
  }, [viewedProducts])

  const addViewedProduct = (product: {
    id: string
    name: string
    image?: string
    price: number
  }) => {
    setViewedProducts(prev => {
      // Remover si ya existe
      const filtered = prev.filter(p => p.id !== product.id)

      // Agregar al inicio
      const newProduct: ViewedProduct = {
        ...product,
        viewedAt: Date.now(),
      }

      const updated = [newProduct, ...filtered]

      // Mantener solo los últimos MAX_VIEWED_PRODUCTS
      return updated.slice(0, MAX_VIEWED_PRODUCTS)
    })
  }

  const clearViewedProducts = () => {
    setViewedProducts([])
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    viewedProducts,
    addViewedProduct,
    clearViewedProducts,
  }
}
