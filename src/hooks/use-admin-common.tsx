import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

// Hook genérico para paginación y filtros
export function usePagination(initialPageSize = 10) {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(initialPageSize)

  const resetPagination = () => {
    setCurrentPage(1)
    setSearchTerm('')
  }

  return {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    pageSize,
    resetPagination,
  }
}

// Hook para gestión de diálogos de formularios
export function useFormDialog<T>() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<T | null>(null)

  const openDialog = (item?: T) => {
    setEditingItem(item || null)
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingItem(null)
  }

  return {
    isDialogOpen,
    setIsDialogOpen,
    editingItem,
    setEditingItem,
    openDialog,
    closeDialog,
  }
}

// Hook genérico para mutaciones CRUD
export function useCrudMutations(tableName: string, queryKey: string[]) {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const createMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const { data: result, error } = await supabase
        .from(tableName)
        .insert(data)
        .select()
        .single()

      if (error) throw error
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
      toast({
        title: 'Éxito',
        description: 'Registro creado correctamente',
      })
    },
    onError: error => {
      toast({
        title: 'Error',
        description: `Error al crear: ${error.message}`,
        variant: 'destructive',
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: Record<string, unknown>
    }) => {
      const { data: result, error } = await supabase
        .from(tableName)
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
      toast({
        title: 'Éxito',
        description: 'Registro actualizado correctamente',
      })
    },
    onError: error => {
      toast({
        title: 'Error',
        description: `Error al actualizar: ${error.message}`,
        variant: 'destructive',
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(tableName).delete().eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
      toast({
        title: 'Éxito',
        description: 'Registro eliminado correctamente',
      })
    },
    onError: error => {
      toast({
        title: 'Error',
        description: `Error al eliminar: ${error.message}`,
        variant: 'destructive',
      })
    },
  })

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  }
}

// Hook para buscar datos con filtros
export function useFilteredData<T>(
  tableName: string,
  queryKey: string[],
  searchTerm: string,
  filters: Record<string, unknown> = {}
) {
  return useQuery({
    queryKey: [...queryKey, searchTerm, filters],
    queryFn: async () => {
      let query = supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false })

      // Aplicar filtro de búsqueda por nombre si existe
      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`)
      }

      // Aplicar filtros adicionales
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== 'all') {
          query = query.eq(key, value)
        }
      })

      const { data, error } = await query
      if (error) throw error
      return data as T[]
    },
  })
}
