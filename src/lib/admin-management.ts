// Funciones para gestión de administradores desde el frontend
import { supabase } from '@/lib/supabase'

export interface AdminUser {
  id: string
  email: string
  full_name: string | null
  created_at: string
  phone: string | null
  avatar_url: string | null
}

export interface AdminOperationResult {
  success: boolean
  message: string
  user_id?: string
  email?: string
  full_name?: string
  action?: string
}

/**
 * Promover un usuario existente a administrador
 * @param email Email del usuario a promover
 * @param fullName Nombre completo (opcional)
 * @returns Resultado de la operación
 */
export async function promoteToAdmin(
  email: string,
  fullName?: string
): Promise<AdminOperationResult> {
  try {
    const { data, error } = await supabase.rpc(
      'create_admin_user' as never,
      {
        user_email: email,
        user_full_name: fullName || null,
      } as never
    )

    if (error) {
      return {
        success: false,
        message: `Error al promover usuario: ${error.message}`,
      }
    }

    return data as AdminOperationResult
  } catch (error) {
    return {
      success: false,
      message: `Error inesperado: ${
        error instanceof Error ? error.message : 'Error desconocido'
      }`,
    }
  }
}

/**
 * Obtener lista de todos los administradores
 * @returns Lista de administradores
 */
export async function getAdminUsers(): Promise<{
  success: boolean
  data?: AdminUser[]
  error?: string
}> {
  try {
    const { data, error } = await supabase.rpc('get_admin_users' as never)

    if (error) {
      return {
        success: false,
        error: `Error al obtener administradores: ${error.message}`,
      }
    }

    return {
      success: true,
      data: data as AdminUser[],
    }
  } catch (error) {
    return {
      success: false,
      error: `Error inesperado: ${
        error instanceof Error ? error.message : 'Error desconocido'
      }`,
    }
  }
}

/**
 * Remover privilegios de administrador de un usuario
 * @param email Email del administrador a degradar
 * @returns Resultado de la operación
 */
export async function removeAdminRole(
  email: string
): Promise<AdminOperationResult> {
  try {
    const { data, error } = await supabase.rpc(
      'remove_admin_role' as never,
      {
        user_email: email,
      } as never
    )

    if (error) {
      return {
        success: false,
        message: `Error al remover privilegios: ${error.message}`,
      }
    }

    return data as AdminOperationResult
  } catch (error) {
    return {
      success: false,
      message: `Error inesperado: ${
        error instanceof Error ? error.message : 'Error desconocido'
      }`,
    }
  }
}

/**
 * Verificar si el usuario actual es administrador
 * @returns True si es admin, false en caso contrario
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  try {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) return false

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.user.id)
      .single()

    // Verificación explícita del tipo y null
    if (!profile || typeof profile !== 'object') return false

    return (profile as { role: string }).role === 'admin'
  } catch (error) {
    console.error('Error verificando rol de admin:', error)
    return false
  }
}

/**
 * Obtener estadísticas de administradores
 * @returns Estadísticas de admins
 */
export async function getAdminStats(): Promise<{
  success: boolean
  data?: {
    total_admins: number
    new_admins_last_30_days: number
    first_admin_created: string | null
    last_admin_created: string | null
  }
  error?: string
}> {
  try {
    const { data, error } = await supabase
      .from('admin_stats')
      .select('*')
      .single()

    if (error) {
      return {
        success: false,
        error: `Error al obtener estadísticas: ${error.message}`,
      }
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    return {
      success: false,
      error: `Error inesperado: ${
        error instanceof Error ? error.message : 'Error desconocido'
      }`,
    }
  }
}

/**
 * Obtener historial de cambios de roles (auditoría)
 * @returns Historial de cambios
 */
export async function getRoleChangeAudit(): Promise<{
  success: boolean
  data?: Array<{
    id: string
    user_id: string
    old_role: string
    new_role: string
    changed_by: string
    changed_at: string
    reason: string
  }>
  error?: string
}> {
  try {
    const { data, error } = await supabase
      .from('role_change_audit')
      .select(
        `
        *,
        user:profiles!user_id(email, full_name),
        changer:profiles!changed_by(email, full_name)
      `
      )
      .order('changed_at', { ascending: false })
      .limit(50)

    if (error) {
      return {
        success: false,
        error: `Error al obtener auditoría: ${error.message}`,
      }
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    return {
      success: false,
      error: `Error inesperado: ${
        error instanceof Error ? error.message : 'Error desconocido'
      }`,
    }
  }
}

// Hook personalizado para React
export function useAdminManagement() {
  return {
    promoteToAdmin,
    getAdminUsers,
    removeAdminRole,
    isCurrentUserAdmin,
    getAdminStats,
    getRoleChangeAudit,
  }
}
