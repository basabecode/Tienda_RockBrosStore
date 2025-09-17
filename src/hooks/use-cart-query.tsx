import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/use-auth'

export interface CartItem {
  id: string
  cart_id: string
  product_id: string
  quantity: number
  unit_price: number
  created_at: string
  product: {
    id: string
    name: string
    price: number
    main_image: string | null
  }
}

// Servicio de Carrito
export class CartService {
  // Tipos locales para normalizar filas
  private static mapRow(row: unknown): CartItem {
    type Row = {
      id: string
      cart_id: string
      product_id: string
      quantity: number
      unit_price: number | string
      created_at: string
      product?: {
        id: string
        name: string
        price: number | string
        main_image?: string | null
      }
    }
    const r = row as Row
    const price =
      typeof r.product?.price === 'string'
        ? Number(r.product.price)
        : r.product?.price ?? 0
    const unitPrice =
      typeof r.unit_price === 'string'
        ? Number(r.unit_price)
        : r.unit_price ?? 0
    return {
      id: r.id,
      cart_id: r.cart_id,
      product_id: r.product_id,
      quantity: r.quantity,
      unit_price: unitPrice,
      created_at: r.created_at,
      product: {
        id: r.product?.id ?? r.product_id,
        name: r.product?.name ?? '',
        price,
        main_image: r.product?.main_image ?? null,
      },
    }
  }
  static async getOrCreateCart(userId: string) {
    const { data: existing, error: fetchError } = await supabase
      .from('carts')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (fetchError) throw fetchError
    if (existing) return existing

    const { data: created, error: insertError } = await supabase
      .from('carts')
      .insert({ user_id: userId })
      .select()
      .single()

    if (insertError) throw insertError
    return created
  }

  static async getCartItems(userId: string): Promise<CartItem[]> {
    if (!userId) return []

    const cart = await this.getOrCreateCart(userId)
    if (!cart) return []

    const { data, error } = await supabase
      .from('cart_items')
      .select(
        `
        id, cart_id, product_id, quantity, unit_price, created_at,
        product:products(id, name, price, main_image)
      `
      )
      .eq('cart_id', cart.id)

    if (error) {
      console.error('Error fetching cart items:', error)
      throw error
    }

    // Normalizar tipos numéricos
    return (data?.map(this.mapRow) || []) as CartItem[]
  }

  static async addToCart(
    userId: string,
    productId: string,
    quantity: number = 1
  ) {
    if (!userId || !productId) return

    const cart = await this.getOrCreateCart(userId)

    // Verificar si el item ya existe
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('cart_id', cart.id)
      .eq('product_id', productId)
      .maybeSingle()

    if (existingItem) {
      // Actualizar cantidad si ya existe
      return this.updateQuantity(
        userId,
        productId,
        ((existingItem as unknown as { quantity: number }).quantity ?? 0) +
          quantity
      )
    }

    // Obtener precio actual del producto para unit_price
    const { data: product, error: prodError } = await supabase
      .from('products')
      .select('id, price')
      .eq('id', productId)
      .single()
    if (prodError) throw prodError

    const unitPrice = Number(
      (product as unknown as { price: number | string }).price ?? 0
    )

    // Crear nuevo item
    const { data, error } = await supabase
      .from('cart_items')
      .insert({
        cart_id: cart.id,
        product_id: productId,
        quantity,
        unit_price: unitPrice,
      })
      .select(
        `
        id, cart_id, product_id, quantity, unit_price, created_at,
        product:products(id, name, price, main_image)
      `
      )
      .single()

    if (error) throw error
    return data as unknown as CartItem
  }

  static async updateQuantity(
    userId: string,
    productId: string,
    quantity: number
  ) {
    if (quantity < 1) {
      return this.removeItem(userId, productId)
    }

    const cart = await this.getOrCreateCart(userId)

    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('cart_id', cart.id)
      .eq('product_id', productId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async removeItem(userId: string, productId: string) {
    const cart = await this.getOrCreateCart(userId)
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('cart_id', cart.id)
      .eq('product_id', productId)

    if (error) throw error
  }

  static async clearCart(userId: string) {
    const cart = await this.getOrCreateCart(userId)
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('cart_id', cart.id)

    if (error) throw error
  }
}

// Hook mejorado para el carrito
export const useCartQuery = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Obtener items del carrito
  const {
    data: cartItems = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['cart', user?.id],
    queryFn: () => CartService.getCartItems(user?.id || ''),
    enabled: !!user?.id,
    staleTime: 0, // Siempre refetch para mantener sincronizado
    gcTime: 5 * 60 * 1000, // 5 minutos en cache
  })

  // Agregar al carrito
  const addToCartMutation = useMutation({
    mutationFn: ({
      productId,
      quantity = 1,
    }: {
      productId: string
      quantity?: number
    }) => CartService.addToCart(user?.id || '', productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] })
    },
    onError: error => {
      console.error('Error adding to cart:', error)
    },
  })

  // Limpiar carrito completo
  const clearCartMutation = useMutation({
    mutationFn: () => CartService.clearCart(user?.id || ''),
    onSuccess: () => {
      // Limpiar cache del carrito inmediatamente
      queryClient.setQueryData(['cart', user?.id], [])
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] })
    },
    onError: error => {
      console.error('Error clearing cart:', error)
    },
  })

  // Eliminar item específico
  const removeItemMutation = useMutation({
    mutationFn: (productId: string) =>
      CartService.removeItem(user?.id || '', productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] })
    },
    onError: error => {
      console.error('Error removing item:', error)
    },
  })

  // Actualizar cantidad
  const updateQuantityMutation = useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: string
      quantity: number
    }) => CartService.updateQuantity(user?.id || '', productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] })
    },
    onError: error => {
      console.error('Error updating quantity:', error)
    },
  })

  // Limpiar cache al hacer logout
  const clearCartCache = () => {
    queryClient.removeQueries({ queryKey: ['cart'] })
  }

  // Calcular totales
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + Number(item.unit_price) * item.quantity,
    0
  )

  return {
    cartItems,
    isLoading,
    error,
    itemCount,
    totalPrice,
    addToCart: addToCartMutation.mutate,
    clearCart: clearCartMutation.mutate,
    removeItem: removeItemMutation.mutate,
    updateQuantity: updateQuantityMutation.mutate,
    clearCartCache,
    isAddingToCart: addToCartMutation.isPending,
    isClearing: clearCartMutation.isPending,
    isUpdating: updateQuantityMutation.isPending,
    isRemoving: removeItemMutation.isPending,
  }
}
