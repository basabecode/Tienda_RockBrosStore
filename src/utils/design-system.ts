/**
 * Design System Constants - RockBros Store
 * Paleta de colores, espaciado y constantes de diseño
 */

// === COLORES ===
export const colors = {
  // Verde principal (RockBros)
  primary: '#10B981',
  primaryDark: '#059669',

  // Grises
  gray: {
    900: '#1F2937',
    800: '#374151',
    600: '#6B7280',
    200: '#E5E7EB',
    100: '#F3F4F6',
    50: '#F9FAFB',
  },

  // Estados
  white: '#FFFFFF',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',
} as const

// === ESPACIADO ===
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  '4xl': '40px',
  '5xl': '48px',
  '6xl': '64px',
} as const

// === TIPOGRAFÍA ===
export const typography = {
  title: {
    fontSize: '24px',
    fontWeight: '700',
    lineHeight: '1.25',
  },
  subtitle: {
    fontSize: '20px',
    fontWeight: '600',
    lineHeight: '1.3',
  },
  body: {
    fontSize: '16px',
    fontWeight: '400',
    lineHeight: '1.5',
  },
  small: {
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '1.4',
  },
  xs: {
    fontSize: '12px',
    fontWeight: '400',
    lineHeight: '1.3',
  },
} as const

// === SOMBRAS ===
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
} as const

// === TRANSICIONES ===
export const transitions = {
  fast: 'all 0.15s ease',
  normal: 'all 0.2s ease',
  slow: 'all 0.3s ease',
} as const

// === BREAKPOINTS ===
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
} as const

// === TAMAÑOS MÍNIMOS DE ACCESIBILIDAD ===
export const accessibility = {
  minTouchTarget: '44px',
  focusRingWidth: '2px',
  focusRingColor: colors.primary,
  minContrast: 4.5,
} as const

// === ANIMACIONES ===
export const animations = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  slideUp: {
    from: { transform: 'translateY(10px)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
  },
  scaleIn: {
    from: { transform: 'scale(0.95)', opacity: 0 },
    to: { transform: 'scale(1)', opacity: 1 },
  },
} as const
