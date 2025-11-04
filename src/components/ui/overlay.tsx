import React from 'react'
import { cn } from '@/lib/utils'

/**
 * Componente Overlay para mejorar la accesibilidad y experiencia visual
 * de dropdowns, modales y otros elementos flotantes
 *
 * Funcionalidades:
 * - Backdrop semi-transparente
 * - Bloquea interacción con elementos de fondo
 * - Cierre por click fuera del elemento
 * - Animaciones suaves de entrada/salida
 */
interface OverlayProps {
  isVisible: boolean
  onClose?: () => void
  className?: string
  children?: React.ReactNode
  blur?: boolean
  opacity?: 'light' | 'medium' | 'dark'
}

export const Overlay: React.FC<OverlayProps> = ({
  isVisible,
  onClose,
  className,
  children,
  blur = false,
  opacity = 'medium',
}) => {
  if (!isVisible) return null

  const opacityClasses = {
    light: 'bg-black/20',
    medium: 'bg-black/40',
    dark: 'bg-black/60',
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 transition-all duration-300',
        opacityClasses[opacity],
        blur && 'backdrop-blur-sm',
        className
      )}
      onClick={onClose}
      role="button"
      tabIndex={0}
      aria-label="Cerrar overlay"
      onKeyDown={e => {
        if (e.key === 'Escape' && onClose) {
          onClose()
        }
      }}
    >
      {children}
    </div>
  )
}

/**
 * Hook para gestionar overlays con estado y animaciones
 */
export const useOverlay = (initialState = false) => {
  const [isVisible, setIsVisible] = React.useState(initialState)

  const show = React.useCallback(() => {
    setIsVisible(true)
  }, [])

  const hide = React.useCallback(() => {
    setIsVisible(false)
  }, [])

  const toggle = React.useCallback(() => {
    setIsVisible(prev => !prev)
  }, [])

  return {
    isVisible,
    show,
    hide,
    toggle,
    setIsVisible,
  }
}

export default Overlay
