import React, { useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase'
import { toast } from '@/hooks/use-toast'
import { UnifiedFavoritesContext } from '@/contexts/favorites-context'
import type {
  UnifiedFavoriteItem,
  UnifiedFavoriteRecord,
  UnifiedFavoritesContextType,
} from '@/types/favorites'

interface UnifiedFavoritesProviderProps {
  children: React.ReactNode
}

/**
 * Provider para el contexto de favoritos unificados
 * Maneja favoritos tanto para usuarios autenticados (Supabase) como invitados (localStorage)
 */
export const UnifiedFavoritesProvider: React.FC<
  UnifiedFavoritesProviderProps
> = ({ children }) => {
  const { user, isAuthenticated } = useAuth()
  const queryClient = useQueryClient()

  // Query Key dinámico
  const getFavoritesQueryKey = () => ['unified-favorites', user?.id || 'guest']

  // Query para obtener favoritos
  const {
    data: favorites = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: getFavoritesQueryKey(),
    queryFn: async () => {
      try {
        if (isAuthenticated && user?.id) {
          // Usuario autenticado: obtener de Supabase
          const { data, error: supabaseError } = await supabase
            .from('favorites')
            .select(
              `
              id,
              user_id,
              product_id,
              created_at,
              products (
                id,
                name,
                price,
                main_image,
                stock,
                category,
                brand,
                description,
                is_active
              )
            `
            )
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

          if (supabaseError) {
            throw new Error(
              `Error al cargar favoritos de Supabase: ${supabaseError.message}`
            )
          }

          return (data || []) as unknown as UnifiedFavoriteRecord[]
        } else {
          // Usuario invitado: obtener de localStorage
          const storageKey = 'favorites_guest'
          const savedFavorites = localStorage.getItem(storageKey)

          if (!savedFavorites) return []

          try {
            const localFavorites = JSON.parse(
              savedFavorites
            ) as UnifiedFavoriteItem[]

            // Convertir formato localStorage a formato Supabase para compatibilidad
            return localFavorites.map((item, index) => ({
              id: `local_${item.id}_${index}`,
              user_id: 'guest',
              product_id: item.id,
              created_at: new Date().toISOString(),
              products: item,
            })) as UnifiedFavoriteRecord[]
          } catch (parseError) {
            console.error('Error parsing localStorage favorites:', parseError)
            return []
          }
        }
      } catch (error) {
        console.error('Error in unified favorites query:', error)
        throw error
      }
    },
    enabled: true,
    retry: 2,
    staleTime: 3 * 60 * 1000,
    refetchOnWindowFocus: true,
  })

  // Mutación para agregar favorito
  const addFavoriteMutation = useMutation({
    mutationFn: async (product: UnifiedFavoriteItem) => {
      if (isAuthenticated && user?.id) {
        // Agregar a Supabase
        const { data, error } = await supabase
          .from('favorites')
          .insert([
            {
              user_id: user.id,
              product_id: product.id,
            },
          ])
          .select()

        if (error) {
          throw new Error(`Error al agregar favorito: ${error.message}`)
        }

        return data
      } else {
        // Agregar a localStorage
        const storageKey = 'favorites_guest'
        const existingFavorites = JSON.parse(
          localStorage.getItem(storageKey) || '[]'
        )

        // Evitar duplicados
        const exists = existingFavorites.find(
          (item: UnifiedFavoriteItem) => item.id === product.id
        )
        if (exists) {
          throw new Error('El producto ya está en favoritos')
        }

        const updatedFavorites = [...existingFavorites, product]
        localStorage.setItem(storageKey, JSON.stringify(updatedFavorites))

        return updatedFavorites
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getFavoritesQueryKey() })
      toast({
        title: 'Agregado a favoritos',
        description: isAuthenticated
          ? 'El producto se ha guardado en tus favoritos'
          : 'Producto guardado temporalmente. Inicia sesión para guardar permanentemente',
      })
    },
    onError: (error: Error) => {
      if (error.message !== 'El producto ya está en favoritos') {
        toast({
          title: 'Error',
          description:
            error.message || 'No se pudo agregar el producto a favoritos',
          variant: 'destructive',
        })
      }
    },
  })

  // Mutación para eliminar favorito
  const removeFavoriteMutation = useMutation({
    mutationFn: async (favoriteId: string) => {
      if (isAuthenticated && user?.id) {
        // Eliminar de Supabase
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('id', favoriteId)
          .eq('user_id', user.id)

        if (error) {
          throw new Error(`Error al eliminar favorito: ${error.message}`)
        }
      } else {
        // Eliminar de localStorage
        const storageKey = 'favorites_guest'
        const existingFavorites = JSON.parse(
          localStorage.getItem(storageKey) || '[]'
        )

        // Extraer product_id del favoriteId local
        const productId = favoriteId.replace(/^local_/, '').replace(/_\d+$/, '')
        const updatedFavorites = existingFavorites.filter(
          (item: UnifiedFavoriteItem) => item.id !== productId
        )

        localStorage.setItem(storageKey, JSON.stringify(updatedFavorites))
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getFavoritesQueryKey() })
      toast({
        title: 'Eliminado de favoritos',
        description: 'El producto se ha eliminado de tus favoritos',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description:
          error.message || 'No se pudo eliminar el producto de favoritos',
        variant: 'destructive',
      })
    },
  })

  // Función para sincronizar localStorage a Supabase cuando el usuario se autentica
  const syncLocalStorageToSupabase = useCallback(async () => {
    if (!isAuthenticated || !user?.id) return

    try {
      const storageKey = 'favorites_guest'
      const localFavorites = JSON.parse(
        localStorage.getItem(storageKey) || '[]'
      ) as UnifiedFavoriteItem[]

      if (localFavorites.length === 0) return

      // Obtener favoritos existentes en Supabase
      const { data: existingFavorites } = await supabase
        .from('favorites')
        .select('product_id')
        .eq('user_id', user.id)

      const existingProductIds =
        existingFavorites?.map(fav => fav.product_id) || []

      // Filtrar favoritos que no existen en Supabase
      const newFavorites = localFavorites.filter(
        item => !existingProductIds.includes(item.id)
      )

      if (newFavorites.length > 0) {
        const favoritesToInsert = newFavorites.map(item => ({
          user_id: user.id,
          product_id: item.id,
        }))

        const { error } = await supabase
          .from('favorites')
          .insert(favoritesToInsert)

        if (error) {
          console.error('Error syncing favorites to Supabase:', error)
        } else {
          // Limpiar localStorage después de sincronizar
          localStorage.removeItem(storageKey)

          toast({
            title: 'Favoritos sincronizados',
            description: `${newFavorites.length} productos sincronizados con tu cuenta`,
          })
        }
      }

      // Refetch para actualizar la UI
      refetch()
    } catch (error) {
      console.error('Error in syncLocalStorageToSupabase:', error)
    }
  }, [isAuthenticated, user?.id, refetch])

  // Auto-sincronizar cuando el usuario se autentica
  React.useEffect(() => {
    if (isAuthenticated && user?.id) {
      syncLocalStorageToSupabase()
    }
  }, [isAuthenticated, user?.id, syncLocalStorageToSupabase])

  // Funciones de utilidad
  const addFavorite = async (product: UnifiedFavoriteItem): Promise<void> => {
    await addFavoriteMutation.mutateAsync(product)
  }

  const removeFavorite = async (favoriteId: string): Promise<void> => {
    await removeFavoriteMutation.mutateAsync(favoriteId)
  }

  const isFavorite = (productId: string) => {
    return favorites.some(favorite => favorite.product_id === productId)
  }

  const toggleFavorite = async (product: UnifiedFavoriteItem) => {
    const existingFavorite = favorites.find(
      fav => fav.product_id === product.id
    )

    if (existingFavorite) {
      await removeFavorite(existingFavorite.id)
    } else {
      await addFavorite(product)
    }
  }

  const clearFavorites = async () => {
    try {
      if (isAuthenticated && user?.id) {
        // Eliminar todos de Supabase
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)

        if (error) {
          throw new Error(`Error al limpiar favoritos: ${error.message}`)
        }
      } else {
        // Limpiar localStorage
        localStorage.removeItem('favorites_guest')
      }

      queryClient.invalidateQueries({ queryKey: getFavoritesQueryKey() })

      toast({
        title: 'Favoritos limpiados',
        description: 'Se han eliminado todos los productos de tus favoritos',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron limpiar los favoritos',
        variant: 'destructive',
      })
    }
  }

  const contextValue: UnifiedFavoritesContextType = {
    favorites,
    isLoading:
      isLoading ||
      addFavoriteMutation.isPending ||
      removeFavoriteMutation.isPending,
    error: error as Error | null,
    favoriteCount: favorites.length,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    clearFavorites,
    syncLocalStorageToSupabase,
    refetch,
  }

  return (
    <UnifiedFavoritesContext.Provider value={contextValue}>
      {children}
    </UnifiedFavoritesContext.Provider>
  )
}
