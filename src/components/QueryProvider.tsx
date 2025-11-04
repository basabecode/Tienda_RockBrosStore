import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

// Configuración optimizada del cliente de React Query
function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutos para productos (datos que no cambian frecuentemente)
        gcTime: 10 * 60 * 1000, // 10 minutos en cache (antes cacheTime)
        refetchOnWindowFocus: false, // No recargar al cambiar de ventana
        refetchOnMount: 'always', // Recargar al montar si está stale
        refetchOnReconnect: 'always', // Recargar al reconectar
        retry: (failureCount, error) => {
          // No reintentar en errores 4xx
          const errorWithStatus = error as { status?: number }
          if (
            errorWithStatus.status &&
            errorWithStatus.status >= 400 &&
            errorWithStatus.status < 500
          ) {
            return false
          }
          return failureCount < 3
        },
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      mutations: {
        retry: false,
        gcTime: 5 * 60 * 1000, // 5 minutos para mutations
      },
    },
  })
}

interface QueryProviderProps {
  children: React.ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(() => createQueryClient())

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
