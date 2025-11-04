/**
 * Breadcrumbs Component - Sistema de navegación contextual
 */
import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { colors, spacing, typography, transitions } from '@/utils/design-system'

export interface BreadcrumbItem {
  label: string
  href?: string
  isActive?: boolean
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  if (!items || items.length === 0) {
    return null
  }

  return (
    <nav
      className={`flex items-center space-x-2 text-sm ${className}`}
      aria-label="Breadcrumb"
      style={{
        color: colors.gray[600],
        fontSize: typography.small.fontSize,
      }}
    >
      <ol className="flex items-center space-x-2 list-none">
        {items.map((item, index) => (
          <li key={`breadcrumb-${index}`} className="flex items-center">
            {index > 0 && (
              <ChevronRight
                className="mx-2 h-4 w-4"
                style={{ color: colors.gray[400] }}
                aria-hidden="true"
              />
            )}

            {index === 0 && (
              <Home
                className="mr-2 h-4 w-4"
                style={{ color: colors.gray[500] }}
                aria-hidden="true"
              />
            )}

            {item.href && !item.isActive ? (
              <Link
                to={item.href}
                className="hover:underline focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                style={{
                  color: colors.gray[600],
                  transition: transitions.fast,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = colors.primary
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = colors.gray[600]
                }}
              >
                {item.label}
              </Link>
            ) : (
              <span
                className="font-medium"
                style={{
                  color: colors.gray[900],
                  fontWeight: '600',
                }}
                aria-current={item.isActive ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default Breadcrumbs
