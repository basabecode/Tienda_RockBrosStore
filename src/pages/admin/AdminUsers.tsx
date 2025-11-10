import React, { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import {
  Users,
  Search,
  Mail,
  Calendar,
  MoreHorizontal,
  X,
  Loader2,
  TrendingUp,
  Activity,
  Star,
  Send,
  MessageSquare,
  Phone,
  Target,
  BarChart3,
  Download,
  Eye,
  Megaphone,
  Gift,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react'

// Interfaces de tipos
interface UserProfile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  role: string
  is_active: boolean
  created_at: string
  updated_at: string
}

interface OrderSummary {
  id: string
  total: number
  status: string
  created_at: string
}

interface UserAnalytics {
  user_id: string
  total_orders: number
  total_spent: number
  avg_order_value: number
  last_order_date: string | null
  days_since_last_order: number
  customer_segment: 'vip' | 'frequent' | 'regular' | 'inactive' | 'new'
  churn_risk: 'low' | 'medium' | 'high'
}

interface UserWithAnalytics extends UserProfile {
  analytics: UserAnalytics
  recent_orders: OrderSummary[]
}

interface CampaignData {
  name: string
  subject: string
  message: string
  target_segment: string
  recipients_count: number
}

interface DashboardStats {
  total_users: number
  active_users: number
  new_users_this_month: number
  vip_customers: number
  high_churn_risk: number
  total_revenue: number
  avg_order_value: number
}

const AdminUsers = () => {
  // Estados principales
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [segmentFilter, setSegmentFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  // Estados de modales
  const [isMarketingDialogOpen, setIsMarketingDialogOpen] = useState(false)
  const [isUserDetailDialogOpen, setIsUserDetailDialogOpen] = useState(false)
  const [selectedUserForDetail, setSelectedUserForDetail] =
    useState<UserWithAnalytics | null>(null)

  // Estados de campaña
  const [campaignData, setCampaignData] = useState<CampaignData>({
    name: '',
    subject: '',
    message: '',
    target_segment: 'all',
    recipients_count: 0,
  })

  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Query para obtener estadísticas del dashboard
  const { data: dashboardStats } = useQuery<DashboardStats>({
    queryKey: ['admin-user-stats'],
    queryFn: async () => {
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

      // Obtener usuarios
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('id, role, is_active, created_at')
        .neq('role', 'admin')

      if (usersError) throw usersError

      // Obtener órdenes
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('total, status, created_at')
        .eq('status', 'delivered')

      if (ordersError) throw ordersError

      const totalUsers = users?.length || 0
      const activeUsers = users?.filter(u => u.is_active).length || 0
      const newUsersThisMonth =
        users?.filter(u => new Date(u.created_at) >= startOfMonth).length || 0

      const totalRevenue =
        orders?.reduce((sum, order) => sum + Number(order.total), 0) || 0
      const avgOrderValue = orders?.length ? totalRevenue / orders.length : 0

      return {
        total_users: totalUsers,
        active_users: activeUsers,
        new_users_this_month: newUsersThisMonth,
        vip_customers: 0,
        high_churn_risk: 0,
        total_revenue: totalRevenue,
        avg_order_value: avgOrderValue,
      }
    },
  })

  // Query principal para obtener usuarios con análisis
  const {
    data: usersWithAnalytics = [],
    isLoading,
    error,
  } = useQuery<UserWithAnalytics[]>({
    queryKey: ['users-with-analytics', searchTerm, segmentFilter, statusFilter],
    queryFn: async () => {
      // 1. Construir query base para usuarios
      let usersQuery = supabase
        .from('profiles')
        .select(
          'id, email, full_name, avatar_url, phone, role, is_active, created_at, updated_at'
        )
        .neq('role', 'admin')

      if (searchTerm) {
        usersQuery = usersQuery.or(
          `email.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`
        )
      }

      if (statusFilter !== 'all') {
        usersQuery = usersQuery.eq('is_active', statusFilter === 'active')
      }

      const { data: users, error: usersError } = await usersQuery
      if (usersError) throw usersError

      if (!users || users.length === 0) return []

      // 2. Obtener órdenes para estos usuarios
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('id, user_id, total, status, created_at')
        .in(
          'user_id',
          users.map(u => u.id)
        )
        .eq('status', 'delivered')

      if (ordersError) throw ordersError

      // 3. Procesar análisis para cada usuario
      const now = new Date()

      const usersWithAnalytics = users.map(user => {
        const userOrders =
          orders?.filter(order => order.user_id === user.id) || []

        // Calcular métricas básicas
        const totalSpent = userOrders.reduce(
          (sum, order) => sum + Number(order.total),
          0
        )
        const totalOrders = userOrders.length
        const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0

        // Encontrar última orden
        const sortedOrders = userOrders.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        const lastOrderDate = sortedOrders[0]?.created_at || null

        // Calcular días desde última orden
        const daysSinceLastOrder = lastOrderDate
          ? Math.floor(
              (now.getTime() - new Date(lastOrderDate).getTime()) /
                (1000 * 60 * 60 * 24)
            )
          : 999

        // Determinar segmento del cliente
        let customerSegment:
          | 'vip'
          | 'frequent'
          | 'regular'
          | 'inactive'
          | 'new' = 'new'

        if (totalSpent > 500000 && totalOrders >= 5) {
          customerSegment = 'vip'
        } else if (
          totalOrders >= 8 ||
          (totalOrders >= 3 && daysSinceLastOrder < 30)
        ) {
          customerSegment = 'frequent'
        } else if (totalOrders >= 2) {
          customerSegment = 'regular'
        } else if (daysSinceLastOrder > 90 || totalOrders === 0) {
          customerSegment = 'inactive'
        }

        // Calcular riesgo de abandono
        let churnRisk: 'low' | 'medium' | 'high' = 'low'

        if (
          daysSinceLastOrder > 120 ||
          (totalOrders === 0 &&
            Math.floor(
              (now.getTime() - new Date(user.created_at).getTime()) /
                (1000 * 60 * 60 * 24)
            ) > 60)
        ) {
          churnRisk = 'high'
        } else if (daysSinceLastOrder > 60) {
          churnRisk = 'medium'
        }

        const analytics: UserAnalytics = {
          user_id: user.id,
          total_orders: totalOrders,
          total_spent: totalSpent,
          avg_order_value: avgOrderValue,
          last_order_date: lastOrderDate,
          days_since_last_order: daysSinceLastOrder,
          customer_segment: customerSegment,
          churn_risk: churnRisk,
        }

        return {
          ...user,
          analytics,
          recent_orders: sortedOrders.slice(0, 3),
        }
      })

      // Filtrar por segmento si está seleccionado
      if (segmentFilter !== 'all') {
        return usersWithAnalytics.filter(
          user => user.analytics.customer_segment === segmentFilter
        )
      }

      return usersWithAnalytics
    },
    refetchInterval: 60000,
  })

  // Mutación para enviar campaña de marketing
  const sendCampaignMutation = useMutation({
    mutationFn: async (campaign: CampaignData) => {
      const targetUsers = getTargetUsers(campaign.target_segment)

      // Simular el envío guardando la campaña en base de datos
      const { data, error } = await supabase
        .from('marketing_campaigns')
        .insert({
          name: campaign.name,
          subject: campaign.subject,
          message: campaign.message,
          target_segment: campaign.target_segment,
          recipients_count: targetUsers.length,
          status: 'sent',
          sent_at: new Date().toISOString(),
        })
        .select()

      if (error) throw error
      return { ...data[0], targetUsers }
    },
    onSuccess: result => {
      toast({
        title: 'Campaña Enviada Exitosamente',
        description: `"${result.name}" enviada a ${result.recipients_count} usuarios.`,
      })
      setIsMarketingDialogOpen(false)
      resetCampaignForm()
    },
    onError: (error: Error) => {
      toast({
        title: 'Error al Enviar Campaña',
        description: error.message || 'Ocurrió un error inesperado',
        variant: 'destructive',
      })
    },
  })

  // Funciones auxiliares
  const getTargetUsers = (segment: string): UserWithAnalytics[] => {
    switch (segment) {
      case 'vip':
        return usersWithAnalytics.filter(
          u => u.analytics.customer_segment === 'vip'
        )
      case 'frequent':
        return usersWithAnalytics.filter(
          u => u.analytics.customer_segment === 'frequent'
        )
      case 'inactive':
        return usersWithAnalytics.filter(
          u => u.analytics.customer_segment === 'inactive'
        )
      case 'high_churn':
        return usersWithAnalytics.filter(u => u.analytics.churn_risk === 'high')
      case 'new':
        return usersWithAnalytics.filter(
          u => u.analytics.customer_segment === 'new'
        )
      case 'selected':
        return usersWithAnalytics.filter(u => selectedUsers.includes(u.id))
      default:
        return usersWithAnalytics
    }
  }

  const resetCampaignForm = () => {
    setCampaignData({
      name: '',
      subject: '',
      message: '',
      target_segment: 'all',
      recipients_count: 0,
    })
  }

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleSelectAll = () => {
    if (
      selectedUsers.length === usersWithAnalytics.length &&
      usersWithAnalytics.length > 0
    ) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(usersWithAnalytics.map(user => user.id))
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSegmentFilter('all')
    setStatusFilter('all')
  }

  // Funciones de formato
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getSegmentBadge = (segment: string) => {
    const variants = {
      vip: {
        label: '👑 VIP',
        className: 'bg-purple-100 text-purple-800 border-purple-200',
      },
      frequent: {
        label: '🔥 Frecuente',
        className:
          'bg-verde-bosque/10 text-verde-bosque border-verde-bosque/30',
      },
      regular: {
        label: '👤 Regular',
        className: 'bg-blue-100 text-blue-800 border-blue-200',
      },
      inactive: {
        label: '💤 Inactivo',
        className: 'bg-red-100 text-red-800 border-red-200',
      },
      new: {
        label: '✨ Nuevo',
        className: 'bg-verde-neon/10 text-verde-bosque border-verde-neon/30',
      },
    }
    const variant =
      variants[segment as keyof typeof variants] || variants.regular
    return <Badge className={variant.className}>{variant.label}</Badge>
  }

  const getRiskBadge = (risk: string) => {
    const variants = {
      low: {
        label: '✅ Bajo',
        className:
          'bg-verde-bosque/10 text-verde-bosque border-verde-bosque/30',
      },
      medium: {
        label: '⚠️ Medio',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      },
      high: {
        label: '🚨 Alto',
        className: 'bg-red-100 text-red-800 border-red-200',
      },
    }
    const variant = variants[risk as keyof typeof variants] || variants.low
    return <Badge className={variant.className}>{variant.label}</Badge>
  }

  const openWhatsApp = (phone: string, name: string) => {
    const message = encodeURIComponent(
      `Hola ${name}, tenemos ofertas especiales en RockBros Store que te pueden interesar. ¡Échales un vistazo!`
    )
    const cleanPhone = phone.replace(/\D/g, '')
    window.open(`https://wa.me/57${cleanPhone}?text=${message}`, '_blank')
  }

  const sendEmail = (email: string, name: string) => {
    const subject = encodeURIComponent('Ofertas Especiales RockBros Store')
    const body = encodeURIComponent(
      `Hola ${name},\n\nTenemos ofertas especiales que creemos te pueden interesar en nuestros productos de ciclismo.\n\n¡No te las pierdas!\n\nSaludos,\nEquipo RockBros Store`
    )
    window.open(`mailto:${email}?subject=${subject}&body=${body}`)
  }

  // Calcular estadísticas dinámicas
  const segmentCounts = useMemo(() => {
    const counts = {
      vip: 0,
      frequent: 0,
      regular: 0,
      inactive: 0,
      new: 0,
    }
    usersWithAnalytics.forEach(user => {
      counts[user.analytics.customer_segment]++
    })
    return counts
  }, [usersWithAnalytics])

  const riskCounts = useMemo(() => {
    const counts = { low: 0, medium: 0, high: 0 }
    usersWithAnalytics.forEach(user => {
      counts[user.analytics.churn_risk]++
    })
    return counts
  }, [usersWithAnalytics])

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
          <h3 className="text-lg font-semibold text-gray-900">
            Error al cargar usuarios
          </h3>
          <p className="text-gray-600">{error.message}</p>
          <Button
            onClick={() =>
              queryClient.invalidateQueries({
                queryKey: ['users-with-analytics'],
              })
            }
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reintentar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header con paleta corporativa RockBros */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-verde-bosque to-verde-neon rounded-xl flex items-center justify-center shadow-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gris-oscuro leading-tight">
              Gestión Avanzada de Usuarios
            </h1>
            <p className="text-gris-medio font-medium">
              Análisis, segmentación y marketing directo para maximizar
              conversiones
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Contenedor de acciones */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div></div>

          <div className="flex flex-wrap items-center gap-3">
            {selectedUsers.length > 0 && (
              <Button
                onClick={() => {
                  setCampaignData(prev => ({
                    ...prev,
                    target_segment: 'selected',
                    recipients_count: selectedUsers.length,
                  }))
                  setIsMarketingDialogOpen(true)
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Mail className="h-4 w-4 mr-2" />
                Marketing a {selectedUsers.length} usuarios
              </Button>
            )}

            <Button
              onClick={() => setIsMarketingDialogOpen(true)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Megaphone className="h-4 w-4 mr-2" />
              Nueva Campaña
            </Button>
          </div>
        </div>

        {/* Estadísticas principales */}
        {dashboardStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Usuarios
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardStats.total_users}
                    </p>
                    <p className="text-xs text-gray-500">
                      +{dashboardStats.new_users_this_month} este mes
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Clientes VIP
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      {segmentCounts.vip}
                    </p>
                    <p className="text-xs text-gray-500">Alto valor</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Star className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Riesgo de Abandono
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      {riskCounts.high}
                    </p>
                    <p className="text-xs text-gray-500">Requieren atención</p>
                  </div>
                  <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Valor Promedio
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(dashboardStats.avg_order_value)}
                    </p>
                    <p className="text-xs text-gray-500">Por pedido</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Mensaje informativo */}
        <Card className="bg-white border-verde-neon/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <Activity className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Sistema de Análisis de Usuarios Avanzado
              </h3>
              <p className="text-gray-700 max-w-2xl mx-auto">
                Este componente obtiene datos reales de la base de datos
                Supabase para analizar el comportamiento de los usuarios,
                segmentarlos automáticamente y facilitar campañas de marketing
                dirigidas. Incluye análisis de riesgo de abandono, valor del
                cliente y métricas de engagement.
              </p>
              <div className="flex justify-center gap-4 mt-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  Segmentación Automática
                </span>
                <span className="flex items-center gap-1">
                  <BarChart3 className="h-4 w-4" />
                  Análisis de Comportamiento
                </span>
                <span className="flex items-center gap-1">
                  <Megaphone className="h-4 w-4" />
                  Marketing Directo
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminUsers
