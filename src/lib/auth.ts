import { supabase } from './supabase'
import type { AuthUser, Profile } from './types'

// Tipo extendido para usuario con perfil
export interface User extends AuthUser {
  role: 'admin' | 'moderator' | 'user'
  profile?: Profile
}

type ProfileFromDB = {
  id: string
  created_at: string
  email: string
  full_name: string | null
  phone: string | null
  role: 'user' | 'moderator' | 'admin'
  avatar_url: string | null
}

// Tipo para el usuario de Supabase Auth
type SupabaseUser = {
  id: string
  email?: string
  user_metadata?: Record<string, unknown>
  app_metadata?: Record<string, unknown>
  raw_user_meta_data?: Record<string, unknown>
}

// Cache para evitar múltiples queries
let userCache: { user: User | null; timestamp: number } | null = null
const CACHE_DURATION = 30000 // 30 segundos

// Helper para obtener el usuario actual (OPTIMIZADO)
export async function getCurrentUser(): Promise<{
  user: User | null
  error: Error | null
}> {
  try {
    // Verificar cache
    const now = Date.now()
    if (userCache && now - userCache.timestamp < CACHE_DURATION) {
      console.log('📦 Usando usuario desde cache')
      return { user: userCache.user, error: null }
    }

    console.log('🔍 Obteniendo usuario desde Supabase...')
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      console.error('❌ Error obteniendo usuario de auth:', error)
      return { user: null, error }
    }

    if (!user) {
      console.log('👤 No hay usuario autenticado')
      // Limpiar cache
      userCache = { user: null, timestamp: now }
      return { user: null, error: null }
    }

    console.log('👤 Usuario de auth obtenido:', user.email)

    // Intentar obtener el perfil del usuario EN UNA SOLA QUERY
    let extendedUser: User

    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle() // Usar maybeSingle() en lugar de single()

      if (profileError) {
        console.warn('Error consultando profiles:', profileError)
        // Usar solo datos de auth si falla profiles
        extendedUser = createUserFromAuth(user)
      } else if (profile) {
        // Crear usuario con datos de profile
        extendedUser = createUserFromProfile(user, profile as ProfileFromDB)
      } else {
        // Profile no existe, intentar crearlo
        console.warn('Profile no encontrado para usuario:', user.id)
        try {
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name || null,
              role: 'user',
              is_active: true,
            })
            .select()
            .single()

          if (createError) {
            console.warn('Error creando profile:', createError)
            extendedUser = createUserFromAuth(user)
          } else {
            console.log('✅ Profile creado automáticamente para:', user.id)
            extendedUser = createUserFromProfile(
              user,
              newProfile as ProfileFromDB
            )
          }
        } catch (createError) {
          console.warn('Excepción creando profile:', createError)
          extendedUser = createUserFromAuth(user)
        }
      }
    } catch (profileError) {
      console.warn('Excepción al consultar profiles:', profileError)
      extendedUser = createUserFromAuth(user)
    }

    // Actualizar cache
    userCache = { user: extendedUser, timestamp: now }

    return { user: extendedUser, error: null }
  } catch (error) {
    console.error('Error en getCurrentUser:', error)
    return { user: null, error: error as Error }
  }
}

// Helper para crear usuario desde auth.users únicamente
function createUserFromAuth(user: SupabaseUser): User {
  const roleFromMeta = ((): User['role'] => {
    const v =
      (user.user_metadata?.role as string) ||
      (user.app_metadata?.role as string) ||
      (user.raw_user_meta_data?.role as string)
    return v === 'admin' || v === 'moderator' ? v : 'user'
  })()

  // Función helper para obtener string desde metadata
  const getStringFromMeta = (value: unknown): string | null => {
    return typeof value === 'string' ? value : null
  }

  // Crear AuthUser compatible con nuestros tipos
  const authUser: AuthUser = {
    id: user.id,
    email: user.email || '',
    full_name:
      getStringFromMeta(user.user_metadata?.full_name) ||
      user.email?.split('@')[0] ||
      null,
    is_admin: roleFromMeta === 'admin',
    avatar_url: getStringFromMeta(user.user_metadata?.avatar_url) || null,
  }

  return {
    ...authUser,
    role: roleFromMeta,
    profile: undefined,
  }
}

// Helper para crear usuario desde profile
function createUserFromProfile(
  user: SupabaseUser,
  profile: ProfileFromDB
): User {
  // Función helper para obtener string desde metadata
  const getStringFromMeta = (value: unknown): string | null => {
    return typeof value === 'string' ? value : null
  }

  // Crear AuthUser compatible con nuestros tipos
  const authUser: AuthUser = {
    id: user.id,
    email: user.email || profile.email || '',
    full_name:
      profile.full_name ||
      getStringFromMeta(user.user_metadata?.full_name) ||
      null,
    is_admin: profile.role === 'admin',
    avatar_url:
      profile.avatar_url ||
      getStringFromMeta(user.user_metadata?.avatar_url) ||
      null,
  }

  const normalizedProfile = {
    id: profile.id,
    created_at: 'unknown',
    email: profile.email ?? '',
    full_name: profile.full_name ?? null,
    phone: profile.phone ?? null,
    // Compatibilidad con tipos antiguos: is_admin derivado del role
    is_admin: profile.role === 'admin',
    avatar_url: profile.avatar_url ?? null,
  } as unknown as Profile

  return {
    ...authUser,
    role: profile.role,
    profile: normalizedProfile,
  }
}

// Función para limpiar cache (útil después de updates)
export function clearUserCache() {
  userCache = null
  console.log('🗑️ Cache de usuario limpiado')
}

// Función para refrescar el usuario actual forzando recarga desde DB
export async function refreshCurrentUser(): Promise<{
  user: User | null
  error: Error | null
}> {
  console.log('🔄 Refrescando usuario desde la base de datos...')
  clearUserCache()
  return await getCurrentUser()
}

// Helper para verificar si el usuario actual es admin (OPTIMIZADO)
export async function isCurrentUserAdmin(): Promise<boolean> {
  const { user } = await getCurrentUser()
  return user?.role === 'admin' || false
}

// Helper para verificar autenticación requerida
export async function requireUser(): Promise<
  { user: User; error: null } | { user: null; error: Error }
> {
  const { user, error } = await getCurrentUser()

  if (error) {
    return { user: null, error }
  }

  if (!user) {
    return { user: null, error: new Error('Authentication required') }
  }

  return { user, error: null }
}

// Helper para verificar permisos de admin
export async function requireAdmin(): Promise<
  { user: User; error: null } | { user: null; error: Error }
> {
  const { user, error } = await requireUser()

  if (error) {
    return { user: null, error }
  }

  if (user!.role !== 'admin') {
    return { user: null, error: new Error('Admin access required') }
  }

  return { user: user!, error: null }
}

// Helper para verificar si una request es de admin (usando header temporal)
export function isAdminRequest(headers: Headers): boolean {
  const adminSecret = import.meta.env.VITE_ADMIN_SECRET
  const requestSecret = headers.get('x-admin-secret')

  return adminSecret && requestSecret === adminSecret
}

// Funciones de autenticación
export async function signUp(
  email: string,
  password: string,
  metadata: { full_name: string }
) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    })

    // Limpiar cache después del registro
    if (data.user) {
      clearUserCache()
    }

    return { data, error }
  } catch (error) {
    console.error('Error en signUp:', error)
    return { data: null, error: error as Error }
  }
}

export async function signIn(email: string, password: string) {
  try {
    console.log('🔄 Iniciando signIn para:', email)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('❌ Error en signIn:', error)
      return { data, error }
    }

    if (data.user) {
      console.log('✅ Usuario autenticado:', data.user.email)
      // Limpiar cache después del login para forzar nueva consulta
      clearUserCache()
    }

    return { data, error }
  } catch (error) {
    console.error('💥 Excepción en signIn:', error)
    return { data: null, error: error as Error }
  }
}

export async function signInWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/profile`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    return { data, error }
  } catch (error) {
    console.error('Error en signInWithGoogle:', error)
    return { data: null, error: error as Error }
  }
}

export async function signOut() {
  try {
    // Limpiar cache antes del logout
    clearUserCache()

    const { error } = await supabase.auth.signOut()
    return { error }
  } catch (error) {
    console.error('Error en signOut:', error)
    return { error: error as Error }
  }
}

export async function resetPassword(email: string) {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    return { data, error }
  } catch (error) {
    console.error('Error en resetPassword:', error)
    return { data: null, error: error as Error }
  }
}

export async function updatePassword(password: string) {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password,
    })

    // Limpiar cache después de actualizar
    if (data.user) {
      clearUserCache()
    }

    return { data, error }
  } catch (error) {
    console.error('Error en updatePassword:', error)
    return { data: null, error: error as Error }
  }
}

// Función para actualizar perfil (nueva)
export async function updateProfile(updates: Partial<Profile>) {
  try {
    const { user, error: userError } = await requireUser()
    if (userError || !user) {
      return { data: null, error: userError || new Error('User not found') }
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates as Record<string, unknown>)
      .eq('id', user.id)
      .select()
      .single()

    // Limpiar cache después de actualizar
    if (data) {
      clearUserCache()
    }

    return { data, error }
  } catch (error) {
    console.error('Error en updateProfile:', error)
    return { data: null, error: error as Error }
  }
}

// Función para crear profile faltante
export async function createMissingProfile(
  userId: string,
  userData?: { email?: string; full_name?: string }
) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: userData?.email || null,
        full_name: userData?.full_name || null,
        role: 'user',
        is_active: true,
      })
      .select()
      .single()

    return { data, error }
  } catch (error) {
    console.error('Error creando profile faltante:', error)
    return { data: null, error: error as Error }
  }
}
