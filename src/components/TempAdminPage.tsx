import React from 'react'
import { useAuth } from '@/hooks/use-auth'

/**
 * Componente temporal para reemplazar AdminPageLayout eliminado
 * Las páginas administrativas ahora usan el UnifiedDashboardLayout
 * Este es un wrapper simple para mantener compatibilidad con tema oscuro
 */
interface TempAdminPageProps {
  title: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
  actions?: React.ReactNode
  children: React.ReactNode
}

export const TempAdminPage: React.FC<TempAdminPageProps> = ({
  title,
  description,
  icon: Icon,
  actions,
  children,
}) => {
  const { isAdmin } = useAuth()

  return (
    <div className="space-y-6">
      {/* Header de página */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className={`text-3xl font-bold flex items-center ${
              isAdmin ? 'text-gray-100' : 'text-gray-900'
            }`}
          >
            {Icon && (
              <Icon
                className={`h-8 w-8 mr-3 ${
                  isAdmin ? 'text-green-400' : 'text-green-600'
                }`}
              />
            )}
            {title}
          </h1>
          {description && (
            <p
              className={`mt-2 ${isAdmin ? 'text-gray-300' : 'text-gray-600'}`}
            >
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center space-x-2">{actions}</div>
        )}
      </div>

      {/* Contenido de la página */}
      <div>{children}</div>
    </div>
  )
}

export default TempAdminPage
