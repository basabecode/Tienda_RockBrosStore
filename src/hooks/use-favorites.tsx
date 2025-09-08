import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { toast } from '@/hooks/use-toast'

export interface FavoriteItem {
  id: string
  name: string
  price: number
  image?: string
  stock?: number
  category?: string
  brand?: string
}

interface FavoritesState {
  items: FavoriteItem[]
  favoriteCount: number
}

type FavoritesAction =
  | { type: 'ADD_FAVORITE'; payload: FavoriteItem }
  | { type: 'REMOVE_FAVORITE'; payload: string }
  | { type: 'CLEAR_FAVORITES' }
  | { type: 'LOAD_FAVORITES'; payload: FavoriteItem[] }

const initialState: FavoritesState = {
  items: [],
  favoriteCount: 0,
}

function favoritesReducer(
  state: FavoritesState,
  action: FavoritesAction
): FavoritesState {
  switch (action.type) {
    case 'ADD_FAVORITE': {
      const existingItem = state.items.find(
        item => item.id === action.payload.id
      )
      if (existingItem) {
        return state // Ya existe, no agregar duplicado
      }

      const newItems = [...state.items, action.payload]
      return {
        items: newItems,
        favoriteCount: newItems.length,
      }
    }

    case 'REMOVE_FAVORITE': {
      const newItems = state.items.filter(item => item.id !== action.payload)
      return {
        items: newItems,
        favoriteCount: newItems.length,
      }
    }

    case 'CLEAR_FAVORITES':
      return initialState

    case 'LOAD_FAVORITES':
      return {
        items: action.payload,
        favoriteCount: action.payload.length,
      }

    default:
      return state
  }
}

const FavoritesContext = createContext<{
  state: FavoritesState
  addFavorite: (item: FavoriteItem) => void
  removeFavorite: (id: string) => void
  clearFavorites: () => void
  isFavorite: (id: string) => boolean
  toggleFavorite: (item: FavoriteItem) => void
} | null>(null)

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(favoritesReducer, initialState)
  const { user, isAuthenticated } = useAuth()

  // Cargar favoritos desde localStorage al inicializar
  useEffect(() => {
    if (isAuthenticated && user) {
      try {
        const savedFavorites = localStorage.getItem(`favorites_${user.id}`)
        if (savedFavorites) {
          const items = JSON.parse(savedFavorites)
          dispatch({ type: 'LOAD_FAVORITES', payload: items })
        }
      } catch (error) {
        console.error('Error loading favorites from localStorage:', error)
      }
    } else {
      // Limpiar favoritos si no está autenticado
      dispatch({ type: 'CLEAR_FAVORITES' })
    }
  }, [isAuthenticated, user])

  // Guardar favoritos en localStorage cuando cambien
  useEffect(() => {
    if (isAuthenticated && user) {
      try {
        localStorage.setItem(
          `favorites_${user.id}`,
          JSON.stringify(state.items)
        )
      } catch (error) {
        console.error('Error saving favorites to localStorage:', error)
      }
    }
  }, [state.items, isAuthenticated, user])

  const addFavorite = (item: FavoriteItem) => {
    if (!isAuthenticated) {
      toast({
        title: 'Inicia sesión',
        description: 'Necesitas iniciar sesión para agregar favoritos',
        variant: 'destructive',
      })
      return
    }

    dispatch({ type: 'ADD_FAVORITE', payload: item })
    toast({
      title: 'Agregado a favoritos',
      description: `${item.name} se ha agregado a tus favoritos`,
    })
  }

  const removeFavorite = (id: string) => {
    dispatch({ type: 'REMOVE_FAVORITE', payload: id })
    toast({
      title: 'Eliminado de favoritos',
      description: 'El producto se ha eliminado de tus favoritos',
    })
  }

  const clearFavorites = () => {
    dispatch({ type: 'CLEAR_FAVORITES' })
    toast({
      title: 'Favoritos limpiados',
      description: 'Se han eliminado todos los productos de tus favoritos',
    })
  }

  const isFavorite = (id: string) => {
    return state.items.some(item => item.id === id)
  }

  const toggleFavorite = (item: FavoriteItem) => {
    if (isFavorite(item.id)) {
      removeFavorite(item.id)
    } else {
      addFavorite(item)
    }
  }

  return (
    <FavoritesContext.Provider
      value={{
        state,
        addFavorite,
        removeFavorite,
        clearFavorites,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

// Hook para usar favoritos
// eslint-disable-next-line react-refresh/only-export-components
export const useFavorites = () => {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }

  return {
    favorites: context.state.items,
    favoriteCount: context.state.favoriteCount,
    addFavorite: context.addFavorite,
    removeFavorite: context.removeFavorite,
    clearFavorites: context.clearFavorites,
    isFavorite: context.isFavorite,
    toggleFavorite: context.toggleFavorite,
  }
}
