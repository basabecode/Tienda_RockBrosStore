import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/hooks/use-auth'
import { getCurrentUser } from '@/lib/auth'

interface AdminProfile {
  id: string
  email: string
  full_name?: string
  role: 'user' | 'admin'
  created_at: string
  updated_at: string
}

export const useAdminAuth = () => {
  const { user } = useAuth()

  const {
    data: adminData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['admin-status', user?.id],
    queryFn: async () => {
      if (!user) {
        throw new Error('No authenticated user')
      }

      // Usar getCurrentUser que ya maneja la creación automática de perfiles
      const { user: currentUser, error } = await getCurrentUser()

      if (error || !currentUser) {
        console.error('Error fetching current user:', error)
        // Fallback: tratar como no admin si hay error
        return {
          user: null,
          profile: undefined,
          isAdmin: false,
        }
      }

      const isAdmin = currentUser.role === 'admin'

      const profileData: AdminProfile = {
        id: currentUser.id,
        email: currentUser.email || '',
        full_name: currentUser.full_name || '',
        role: currentUser.role as 'user' | 'admin',
        created_at: new Date().toISOString(), // Usar fecha actual como fallback
        updated_at: new Date().toISOString(), // Usar fecha actual como fallback
      }

      console.log('Admin auth data:', {
        userId: currentUser.id,
        role: currentUser.role,
        isAdmin,
        hasProfile: true, // getCurrentUser siempre asegura que existe
      })

      return {
        user: profileData,
        profile: profileData,
        isAdmin,
      }
    },
    enabled: !!user,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  })

  const refreshAdminStatus = () => {
    refetch()
  }

  return {
    user: adminData?.user,
    profile: adminData?.profile,
    isAdmin: adminData?.isAdmin || false,
    isLoading: isLoading && !!user, // Solo mostrar loading si hay usuario
    error,
    refreshAdminStatus,
  }
}
