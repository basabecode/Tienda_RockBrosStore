import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

interface ScrollSpyOptions {
  sections: string[]
  offset?: number
  throttle?: number
}

export const useScrollSpy = ({
  sections,
  offset = 50,
  throttle = 16,
}: ScrollSpyOptions) => {
  const [activeSection, setActiveSection] = useState<string>('inicio')
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (ticking) return
      ticking = true

      requestAnimationFrame(() => {
        const scrollPosition = window.scrollY
        setIsScrolled(scrollPosition > offset)

        // Solo detectar secciones en la página principal
        if (location.pathname === '/') {
          const viewportHeight = window.innerHeight
          const documentHeight = document.documentElement.scrollHeight

          // Mapeo consistente de secciones
          const sectionNames = {
            home: 'inicio',
            shop: 'productos',
            categories: 'categoria',
            brands: 'marca',
          } as Record<string, string>

          // Lógica simplificada y más robusta
          let activeSection = 'inicio' // Default

          // Si estamos al inicio de la página (primeros 200px)
          if (scrollPosition < 200) {
            activeSection = 'inicio'
          }
          // Si estamos cerca del final, mostrar la última sección
          else if (scrollPosition + viewportHeight >= documentHeight - 300) {
            activeSection = 'marca'
          }
          // Buscar la primera sección que esté visible en la parte superior del viewport
          else {
            const threshold = viewportHeight * 0.3 // 30% del viewport desde arriba

            for (const sectionId of sections) {
              const element = document.getElementById(sectionId)
              if (element) {
                const rect = element.getBoundingClientRect()

                // Si la sección está cruzando el threshold desde arriba
                if (rect.top <= threshold && rect.bottom > threshold) {
                  activeSection = sectionNames[sectionId] || 'inicio'
                  break
                }
              }
            }
          }

          setActiveSection(activeSection)
        } else {
          // Si no estamos en la página principal, resetear
          setActiveSection('inicio')
        }

        ticking = false
      })
    }

    // Ejecutar inmediatamente y después de un pequeño delay para asegurar que el DOM esté listo
    handleScroll()

    const initTimeout = setTimeout(() => {
      handleScroll()
    }, 100)

    // Agregar listener con opciones optimizadas
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })

    return () => {
      clearTimeout(initTimeout)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [sections, offset, location.pathname])

  return { activeSection, isScrolled }
}
