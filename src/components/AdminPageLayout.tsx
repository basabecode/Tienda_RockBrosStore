import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  ArrowLeft,
  Home,
  Shield,
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
} from 'lucide-react'

interface AdminPageLayoutProps {
  children: React.ReactNode
  title: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
  actions?: React.ReactNode
}

export function AdminPageLayout({
  children,
  title,
  description,
  icon: Icon = Shield,
  actions,
}: AdminPageLayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const breadcrumbItems = [
    { label: 'Tienda', path: '/', icon: Home },
    { label: 'Admin', path: '/admin', icon: LayoutDashboard },
  ]

  // Add specific breadcrumb based on current path
  if (location.pathname === '/admin/products') {
    breadcrumbItems.push({
      label: 'Productos',
      path: '/admin/products',
      icon: Package,
    })
  } else if (location.pathname === '/admin/users') {
    breadcrumbItems.push({
      label: 'Usuarios',
      path: '/admin/users',
      icon: Users,
    })
  } else if (location.pathname === '/admin/sales') {
    breadcrumbItems.push({
      label: 'Ventas',
      path: '/admin/sales',
      icon: ShoppingCart,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con navegación */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Breadcrumb y navegación */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a la Tienda
              </Button>

              <Separator orientation="vertical" className="h-6" />

              {/* Breadcrumb */}
              <nav className="flex items-center space-x-2 text-sm">
                {breadcrumbItems.map((item, index) => {
                  const ItemIcon = item.icon
                  const isLast = index === breadcrumbItems.length - 1
                  const isActive = location.pathname === item.path

                  return (
                    <React.Fragment key={item.path}>
                      <button
                        onClick={() => navigate(item.path)}
                        className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-colors ${
                          isActive
                            ? 'text-blue-700 bg-blue-50'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        <ItemIcon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </button>
                      {!isLast && <span className="text-gray-400">/</span>}
                    </React.Fragment>
                  )
                })}
              </nav>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">{actions}</div>
          </div>
        </div>
      </div>

      {/* Page content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Icon className="h-8 w-8 text-blue-700" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {title}
                  </CardTitle>
                  {description && (
                    <p className="text-gray-600 mt-1">{description}</p>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Main content */}
        {children}
      </div>
    </div>
  )
}
