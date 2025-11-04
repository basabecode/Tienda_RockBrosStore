import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

interface RecentOrder {
  id: string
  total: number
  status: string
  created_at: string
  profiles: { email: string } | null
}

interface LowStockProduct {
  id: string
  name: string
  stock: number
  price: number
}

interface AdminStats {
  totalUsers: number
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  recentOrders: RecentOrder[]
  lowStockProducts: LowStockProduct[]
}

export const useAdminData = () => {
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async (): Promise<AdminStats> => {
      // Consultas optimizadas en paralelo
      const [
        usersResult,
        productsResult,
        ordersResult,
        recentOrdersResult,
        lowStockResult,
      ] = await Promise.all([
        // Total usuarios - solo contar
        supabase.from('profiles').select('id', { count: 'exact', head: true }),

        // Total productos - solo contar
        supabase.from('products').select('id', { count: 'exact', head: true }),

        // Total órdenes y revenue
        supabase.from('orders').select('total', { count: 'exact' }),

        // Órdenes recientes (últimas 5)
        supabase
          .from('orders')
          .select(
            `
              id,
              total,
              status,
              created_at,
              profiles(email)
            `
          )
          .order('created_at', { ascending: false })
          .limit(5),

        // Productos con bajo stock
        supabase
          .from('products')
          .select('id, name, stock, price')
          .lt('stock', 10)
          .limit(5),
      ])

      if (usersResult.error) throw usersResult.error
      if (productsResult.error) throw productsResult.error
      if (ordersResult.error) throw ordersResult.error
      if (recentOrdersResult.error) throw recentOrdersResult.error
      if (lowStockResult.error) throw lowStockResult.error

      // Calcular revenue total
      const totalRevenue =
        ordersResult.data?.reduce(
          (sum, order) => sum + (order.total || 0),
          0
        ) || 0

      return {
        totalUsers: usersResult.count || 0,
        totalProducts: productsResult.count || 0,
        totalOrders: ordersResult.count || 0,
        totalRevenue,
        recentOrders: (recentOrdersResult.data ||
          []) as unknown as RecentOrder[],
        lowStockProducts: (lowStockResult.data ||
          []) as unknown as LowStockProduct[],
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos en cache
    refetchOnWindowFocus: false,
    retry: 2,
  })

  return {
    stats,
    isLoading: statsLoading,
    error: statsError,
  }
}

export const useRealtimeAdminStats = () => {
  // Hook para stats en tiempo real (opcional)
  const { data: realtimeStats } = useQuery({
    queryKey: ['admin-realtime-stats'],
    queryFn: async () => {
      // Solo datos críticos en tiempo real
      const { data, error } = await supabase
        .from('orders')
        .select('id, status, created_at')
        .gte(
          'created_at',
          new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        ) // Últimas 24h
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
    refetchInterval: 30000, // Cada 30 segundos
    staleTime: 30000,
  })

  return { realtimeStats }
}
