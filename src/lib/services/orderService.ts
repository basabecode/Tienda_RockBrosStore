import { supabase } from '../supabase'
import { orderSchema, orderFiltersSchema, type OrderFilters } from '../schemas'
import type { Order } from '../types'

// Servicio para órdenes
export class OrderService {
  // Obtener órdenes con filtros
  static async getOrders(filters: OrderFilters = {}): Promise<{
    data: Order[]
    count: number
    page: number
    pageSize: number
    totalPages: number
  }> {
    const validatedFilters = orderFiltersSchema.parse(filters)

    let query = supabase.from('orders').select('*', { count: 'exact' })

    // Aplicar filtros
    if (validatedFilters.status) {
      query = query.eq('status', validatedFilters.status)
    }

    if (validatedFilters.user_id) {
      query = query.eq('user_id', validatedFilters.user_id)
    }

    // Ordenamiento
    const ascending = validatedFilters.order === 'asc'
    query = query.order(validatedFilters.sort, { ascending })

    // Paginación
    const from = (validatedFilters.page - 1) * validatedFilters.pageSize
    const to = from + validatedFilters.pageSize - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      throw new Error(`Error fetching orders: ${error.message}`)
    }

    return {
      data: data as Order[],
      count: count || 0,
      page: validatedFilters.page,
      pageSize: validatedFilters.pageSize,
      totalPages: Math.ceil((count || 0) / validatedFilters.pageSize),
    }
  }

  // Obtener orden por ID
  static async getOrder(id: string): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw new Error(`Error fetching order: ${error.message}`)
    }

    return data as Order
  }

  // Obtener órdenes de un usuario
  static async getUserOrders(userId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Error fetching user orders: ${error.message}`)
    }

    return data as Order[]
  }
}
