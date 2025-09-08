import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { toast } from '@/hooks/use-toast'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  size?: string
  color?: string
  image?: string
  stock?: number
}

interface CartState {
  items: CartItem[]
  itemCount: number
  total: number
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }

const initialState: CartState = {
  items: [],
  itemCount: 0,
  total: 0,
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(
        item =>
          item.id === action.payload.id &&
          item.size === action.payload.size &&
          item.color === action.payload.color
      )

      let newItems: CartItem[]

      if (existingItem) {
        newItems = state.items.map(item =>
          item.id === action.payload.id &&
          item.size === action.payload.size &&
          item.color === action.payload.color
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        )
      } else {
        newItems = [...state.items, action.payload]
      }

      return calculateTotals(newItems)
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => {
        const itemKey = `${item.id}-${item.size || ''}-${item.color || ''}`
        return itemKey !== action.payload
      })
      return calculateTotals(newItems)
    }

    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item => {
        const itemKey = `${item.id}-${item.size || ''}-${item.color || ''}`
        return itemKey === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      })
      return calculateTotals(newItems)
    }

    case 'CLEAR_CART':
      return initialState

    case 'LOAD_CART':
      return calculateTotals(action.payload)

    default:
      return state
  }
}

function calculateTotals(items: CartItem[]): CartState {
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  const total = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  return {
    items,
    itemCount,
    total,
  }
}

const CartContext = createContext<{
  state: CartState
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getItemKey: (item: Pick<CartItem, 'id' | 'size' | 'color'>) => string
} | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Cargar carrito desde localStorage al inicializar
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        const items = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', payload: items })
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
    }
  }, [])

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(state.items))
    } catch (error) {
      console.error('Error saving cart to localStorage:', error)
    }
  }, [state.items])

  const getItemKey = (item: Pick<CartItem, 'id' | 'size' | 'color'>) => {
    return `${item.id}-${item.size || ''}-${item.color || ''}`
  }

  const addItem = (
    item: Omit<CartItem, 'quantity'> & { quantity?: number }
  ) => {
    const quantity = item.quantity || 1

    // Verificar stock si está disponible
    if (item.stock !== undefined && item.stock < quantity) {
      toast({
        title: 'Stock insuficiente',
        description: `Solo quedan ${item.stock} unidades disponibles`,
        variant: 'destructive',
      })
      return
    }

    const existingItem = state.items.find(
      cartItem =>
        cartItem.id === item.id &&
        cartItem.size === item.size &&
        cartItem.color === item.color
    )

    // Verificar stock total incluyendo cantidad en carrito
    if (existingItem && item.stock !== undefined) {
      const totalQuantity = existingItem.quantity + quantity
      if (totalQuantity > item.stock) {
        toast({
          title: 'Stock insuficiente',
          description: `Solo puedes agregar ${
            item.stock - existingItem.quantity
          } unidades más`,
          variant: 'destructive',
        })
        return
      }
    }

    dispatch({
      type: 'ADD_ITEM',
      payload: {
        ...item,
        quantity,
      },
    })

    toast({
      title: 'Producto agregado',
      description: `${item.name} se ha agregado al carrito`,
    })
  }

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
    toast({
      title: 'Producto eliminado',
      description: 'El producto se ha eliminado del carrito',
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }

    // Encontrar el item para verificar stock
    const item = state.items.find(cartItem => {
      const itemKey = `${cartItem.id}-${cartItem.size || ''}-${
        cartItem.color || ''
      }`
      return itemKey === id
    })

    if (item && item.stock !== undefined && quantity > item.stock) {
      toast({
        title: 'Stock insuficiente',
        description: `Solo quedan ${item.stock} unidades disponibles`,
        variant: 'destructive',
      })
      return
    }

    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { id, quantity },
    })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
    toast({
      title: 'Carrito vaciado',
      description: 'Se han eliminado todos los productos del carrito',
    })
  }

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getItemKey,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// Hook separado para evitar problemas con Fast Refresh
// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }

  return {
    items: context.state.items,
    itemCount: context.state.itemCount,
    total: context.state.total,
    addItem: context.addItem,
    removeItem: context.removeItem,
    updateQuantity: context.updateQuantity,
    clearCart: context.clearCart,
    getItemKey: context.getItemKey,
  }
}
