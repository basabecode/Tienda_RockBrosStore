import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface SimpleProduct {
  id: string
  name: string
  description: string
  price: number
  category: string
  brand: string
  stock: number
  is_active: boolean
  main_image: string | null
}

const TestProducts = () => {
  const [products, setProducts] = useState<SimpleProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      console.log('🔍 Iniciando fetch de productos...')

      try {
        // Test 1: Verificar conexión básica
        console.log('📡 Testing conexión a Supabase...')
        const { data: connectionTest, error: connectionError } = await supabase
          .from('products')
          .select('count', { count: 'exact', head: true })

        console.log('🔗 Conexión result:', { connectionTest, connectionError })

        // Test 2: Obtener productos
        console.log('📦 Obteniendo productos...')
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .limit(5)

        console.log('📋 Productos result:', { data, error })

        if (error) {
          throw error
        }

        setProducts(data || [])
      } catch (err) {
        console.error('❌ Error en fetch:', err)
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test de Productos</h1>

      {loading && <p>Cargando...</p>}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="mb-4">
        <strong>Productos encontrados:</strong> {products.length}
      </div>

      {products.length > 0 && (
        <div className="space-y-4">
          {products.map(product => (
            <div key={product.id} className="border p-4 rounded">
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-gray-600">{product.description}</p>
              <p className="text-green-600 font-bold">${product.price}</p>
              <p className="text-sm text-gray-500">
                Categoría: {product.category}
              </p>
              <p className="text-sm text-gray-500">Marca: {product.brand}</p>
              <p className="text-sm text-gray-500">Stock: {product.stock}</p>
              <p className="text-sm text-gray-500">
                Activo: {product.is_active ? 'Sí' : 'No'}
              </p>
              {product.main_image && (
                <img
                  src={product.main_image}
                  alt={product.name}
                  className="w-24 h-24 object-cover mt-2"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {products.length === 0 && !loading && !error && (
        <p className="text-gray-500">No se encontraron productos.</p>
      )}
    </div>
  )
}

export default TestProducts
