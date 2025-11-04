/**
 * Skeleton Component - Loading placeholders
 */
import React from 'react'
import { colors } from '@/utils/design-system'

interface SkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
  rounded?: boolean
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width,
  height,
  rounded = false,
}) => {
  const style: React.CSSProperties = {
    backgroundColor: colors.gray[200],
    borderRadius: rounded ? '50%' : '6px',
    width,
    height,
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  }

  return (
    <div
      className={`animate-pulse ${className}`}
      style={style}
      role="status"
      aria-label="Cargando..."
    />
  )
}
