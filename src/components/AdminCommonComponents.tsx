import { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface AdminTableHeaderProps {
  title: string
  searchTerm: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  children?: ReactNode // Para filtros adicionales como select de categoría
}

export function AdminTableHeader({
  title,
  searchTerm,
  onSearchChange,
  searchPlaceholder = 'Buscar...',
  children,
}: AdminTableHeaderProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1 w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={e => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          {children}
        </div>
      </CardContent>
    </Card>
  )
}

interface AdminEmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  hasFilters?: boolean
}

export function AdminEmptyState({
  icon,
  title,
  description,
  hasFilters = false,
}: AdminEmptyStateProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">{icon}</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600">
            {hasFilters
              ? 'Intenta ajustar los filtros de búsqueda'
              : description}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

interface AdminLoadingStateProps {
  message?: string
}

export function AdminLoadingState({
  message = 'Cargando...',
}: AdminLoadingStateProps) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="text-gray-600">{message}</span>
      </div>
    </div>
  )
}
