import * as React from 'react'
import type { User } from './use-auth'

// Stub useProfile: devolver perfil vacío hasta integrar la API real.
export function useProfile() {
  const [profile, setProfile] = React.useState<Partial<User> | null>(null)
  const [loading, setLoading] = React.useState(false)

  // Implementación real debe obtener datos desde `/api/profile` o supabase

  return {
    profile,
    loading,
    setProfile,
  }
}
