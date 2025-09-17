import * as React from 'react'
import { supabase } from '../lib/supabase'
import {
  getCurrentUser,
  signIn as authSignIn,
  signOut as authSignOut,
  signUp as authSignUp,
  signInWithGoogle as authSignInWithGoogle,
  clearUserCache,
  refreshCurrentUser,
} from '../lib/auth'
import type { User } from '../lib/auth'

export type { User }

export function useAuth() {
  const [user, setUser] = React.useState<User | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [initialized, setInitialized] = React.useState(false)

  React.useEffect(() => {
    let isMounted = true
    let retryCount = 0
    const maxRetries = 2 // Reducir reintentos

    // Función para obtener usuario con reintentos
    const getAndSetUser = async () => {
      try {
        const { user, error } = await getCurrentUser()

        if (!isMounted) return

        if (error) {
          console.error('Error obteniendo usuario:', error)
          if (retryCount < maxRetries) {
            retryCount++
            setTimeout(getAndSetUser, 500 * retryCount) // Reducir tiempo de backoff
            return
          }
        }

        setUser(user)
        setLoading(false)
        setInitialized(true)
      } catch (error) {
        console.error('Error inesperado obteniendo usuario:', error)
        if (isMounted) {
          setUser(null)
          setLoading(false)
          setInitialized(true)
        }
      }
    }

    // Obtener usuario inicial
    getAndSetUser()

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.id)

      if (!isMounted) return

      try {
        // Limpiar cache en cada cambio de estado
        clearUserCache()

        if (event === 'SIGNED_IN' && session?.user) {
          console.log('Usuario se logueó, obteniendo perfil...')
          // Reducir delay para mejorar UX
          setTimeout(async () => {
            if (!isMounted) return
            const { user } = await getCurrentUser()
            setUser(user)
            setLoading(false)
          }, 100)
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          console.log('Token renovado')
          // Solo actualizar si no tenemos usuario o si cambió
          if (!user || user.id !== session.user.id) {
            const { user: newUser } = await getCurrentUser()
            setUser(newUser)
          }
          setLoading(false)
        } else if (event === 'SIGNED_OUT') {
          console.log('Usuario cerró sesión')
          setUser(null)
          setLoading(false)
        } else if (event === 'INITIAL_SESSION') {
          console.log('Sesión inicial detectada')
          if (session?.user && !initialized) {
            const { user } = await getCurrentUser()
            setUser(user)
          }
          setLoading(false)
        }

        // Asegurar que siempre se marca como inicializado
        if (!initialized) {
          setInitialized(true)
        }
      } catch (error) {
        console.error('Error en auth state change:', error)
        if (isMounted) {
          setLoading(false)
          setInitialized(true)
        }
      }
    })

    // Cleanup function
    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Solo ejecutar una vez

  const signIn = React.useCallback(async (email: string, password: string) => {
    console.log('Iniciando signIn...')
    setLoading(true)

    try {
      const { data, error } = await authSignIn(email, password)

      if (error) {
        console.error('Error en signIn:', error)
        setLoading(false)
        return { data, error }
      }

      console.log('SignIn exitoso, usuario:', data.user?.email)
      // El onAuthStateChange se encargará del resto
      return { data, error }
    } catch (error) {
      console.error('Excepción en signIn:', error)
      setLoading(false)
      return { data: null, error: error as Error }
    }
  }, [])

  const signUp = React.useCallback(
    async (
      email: string,
      password: string,
      metadata: { full_name: string }
    ) => {
      setLoading(true)
      try {
        const { data, error } = await authSignUp(email, password, metadata)
        setLoading(false)
        return { data, error }
      } catch (error) {
        console.error('Error en signUp:', error)
        setLoading(false)
        return { data: null, error: error as Error }
      }
    },
    []
  )

  const signInWithGoogle = React.useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await authSignInWithGoogle()
      if (error) {
        console.error('Error en Google signIn:', error)
        setLoading(false)
      }
      // Si no hay error, Google manejará la redirección
      return { data, error }
    } catch (error) {
      console.error('Excepción en Google signIn:', error)
      setLoading(false)
      return { data: null, error: error as Error }
    }
  }, [])

  const signOut = React.useCallback(async () => {
    setLoading(true)
    try {
      // Limpiar cache antes del logout
      clearUserCache()

      const { error } = await authSignOut()
      if (!error) {
        setUser(null)
        // Limpiar todo el localStorage relacionado
        localStorage.removeItem('cart')
        localStorage.removeItem('favorites')
      }
      setLoading(false)
      return { error }
    } catch (error) {
      console.error('Error en signOut:', error)
      setLoading(false)
      return { error: error as Error }
    }
  }, [])

  // Función para refrescar usuario manualmente
  const refreshUser = React.useCallback(async () => {
    setLoading(true)
    try {
      console.log('🔄 Refrescando datos de usuario...')
      const { user, error } = await refreshCurrentUser()

      if (error) {
        console.error('❌ Error refrescando usuario:', error)
      } else {
        console.log(
          '✅ Usuario refrescado:',
          user?.email,
          'isAdmin:',
          user?.is_admin
        )
        setUser(user)
      }
    } catch (error) {
      console.error('💥 Excepción refrescando usuario:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    user,
    loading,
    initialized,
    isAuthenticated: !!user,
    isAdmin: user?.is_admin || false,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    refreshUser,
    setUser, // Mantener para compatibilidad
  }
}
