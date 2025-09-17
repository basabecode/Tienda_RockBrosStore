import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/use-auth'

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

      // Obtener el perfil del usuario para verificar el rol
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, role, created_at, updated_at')
        .eq('id', user.id)
        .maybeSingle()

      if (error) {
        console.error('Error fetching user profile:', error)
        // Fallback: tratar como no admin si hay error
        return {
          user,
          profile: undefined,
          isAdmin: false,
        }
      }

      // Derivar rol: del perfil si existe, de metadatos si no
      type Meta = { role?: 'user' | 'admin' }
      const roleFromMeta =
        (user as unknown as { user_metadata?: Meta; app_metadata?: Meta })
          .user_metadata?.role ||
        (user as unknown as { user_metadata?: Meta; app_metadata?: Meta })
          .app_metadata?.role
      const derivedRole =
        (profile?.role as AdminProfile['role']) || roleFromMeta || 'user'

      return {
        user,
        profile: (profile as AdminProfile) || undefined,
        isAdmin: derivedRole === 'admin',
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
