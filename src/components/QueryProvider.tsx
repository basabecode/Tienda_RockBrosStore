import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

// Configuración del cliente de React Query
function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minuto por defecto
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
      },
      mutations: {
        retry: false,
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
