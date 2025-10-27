import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  ShoppingCart,
  Menu,
  X,
  Search,
  User,
  Heart,
  Shield,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useNavigate, useLocation } from 'react-router-dom'
import { useScrollSpy } from '@/hooks/use-scroll-spy'
import { AuthDialog } from './AuthDialog'
import { ClientUserMenu } from './ClientUserMenu'
import { AdminUserMenu } from './AdminUserMenu'
import { CartSheet } from './CartSheet'
import { FavoritesSheet } from './FavoritesSheet'
import { toast } from '@/hooks/use-toast'
import DevTools from './DevTools'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [indicatorPosition, setIndicatorPosition] = useState(0)
  const { isAuthenticated, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const navButtonsRef = useRef<(HTMLButtonElement | null)[]>([])

  // Usar el hook personalizado de scroll spy
  const { activeSection, isScrolled } = useScrollSpy({
    sections: ['home', 'shop', 'categories', 'brands'],
    offset: 50,
    throttle: 16,
  })

  const navigationItems = useMemo(
    () => [
      { name: 'Inicio', path: '/', sectionId: 'home' },
      { name: 'Productos', path: '/', sectionId: 'shop' },
      { name: 'Categoria', path: '/', sectionId: 'categories' },
      { name: 'Marca', path: '/', sectionId: 'brands' },
    ],
    []
  )

  const scrollToSection = (sectionId: string) => {
    // Si estamos en la página principal, hacer scroll a la sección
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      // Si estamos en otra página, navegar a la principal con hash
      navigate(`/#${sectionId}`)
    }
    setIsMenuOpen(false)
  }

  const handleNavigation = (path: string, sectionId?: string) => {
    if (sectionId && location.pathname === '/') {
      scrollToSection(sectionId)
    } else {
      navigate(path)
    }
    setIsMenuOpen(false)
  }

  // Función para calcular la posición del indicador
  const calculateIndicatorPosition = useCallback(() => {
    const activeIndex = navigationItems.findIndex(
      item => item.name.toLowerCase() === activeSection
    )

    if (activeIndex !== -1 && navButtonsRef.current[activeIndex]) {
      const button = navButtonsRef.current[activeIndex]
      if (button) {
        const rect = button.getBoundingClientRect()
        const nav = button.parentElement
        const navRect = nav?.getBoundingClientRect()

        if (navRect) {
          const relativeLeft = rect.left - navRect.left
          const buttonCenter = relativeLeft + rect.width / 2
          const indicatorCenter = buttonCenter - 56 // 60px width / 2
          setIndicatorPosition(indicatorCenter)
        }
      }
    } else {
      // Si no se encuentra una sección activa, posicionar en "Inicio" (índice 0)
      setIndicatorPosition(30) // Posición centrada del primer botón
    }
  }, [activeSection, navigationItems])

  // Calcular la posición del indicador basado en el botón activo
  useEffect(() => {
    calculateIndicatorPosition()
  }, [calculateIndicatorPosition, isScrolled])

  // Inicialización después del montaje
  useEffect(() => {
    const initTimer = setTimeout(() => {
      calculateIndicatorPosition()
    }, 200)

    return () => clearTimeout(initTimer)
  }, [calculateIndicatorPosition])

  // Recalcular posición en resize
  useEffect(() => {
    const handleResize = () => {
      setTimeout(calculateIndicatorPosition, 150) // Pequeño delay para que el layout se ajuste
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [calculateIndicatorPosition])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // TODO: Implementar búsqueda
      toast({
        title: 'Búsqueda',
        description: `Buscando: ${searchQuery}`,
      })
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'header-blur shadow-xl' : 'bg-transparent'
      }`}
      role="banner"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between min-h-[60px]">
          {/* Logo - Proporcional al navbar */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <div
              className={`transition-all duration-300 rounded-full flex items-center justify-center ${
                isScrolled ? 'w-10 h-10' : 'w-12 h-12'
              } white-primary`}
            >
              <img
                src="/favicon.ico"
                alt="RockBros Logo"
                className={`transition-all duration-300 ${
                  isScrolled ? 'w-6 h-6' : 'w-8 h-8'
                }`}
              />
            </div>
            <span
              className={`relative font-bold transition-all duration-300 ${
                !isScrolled
                  ? 'text-white text-2xl lg:text-3xl'
                  : 'text-white text-xl lg:text-2xl'
              }`}
            >
              <span
                className="relative font-bold"
                style={{
                  textShadow: !isScrolled
                    ? '0 0 12px rgba(0, 0, 0, 0.3), 0 0 1px #000000'
                    : '0 0 8px rgba(0, 0, 0, 0.2)',
                }}
              >
                RockbrosShop
              </span>
            </span>
          </div>

          {/* Desktop Navigation - Centrado y organizado */}
          <div className="hidden lg:flex items-center justify-center flex-1 mx-8">
            <div className="flex items-center space-x-8 xl:space-x-12">
              {/* Navegación principal con indicador deslizante */}
              <nav
                className="relative flex items-center space-x-6 xl:space-x-8"
                role="navigation"
                aria-label="Main navigation"
              >
                {navigationItems.map((item, index) => (
                  <button
                    key={item.name}
                    ref={el => (navButtonsRef.current[index] = el)}
                    onClick={() => handleNavigation(item.path, item.sectionId)}
                    className={`relative text-sm xl:text-base font-medium transition-all duration-300 py-3 px-2 ${
                      !isScrolled
                        ? 'text-white hover:text-verde-neon'
                        : 'text-white hover:text-verde-neon'
                    } ${
                      activeSection === item.name.toLowerCase()
                        ? !isScrolled
                          ? 'text-verde-neon font-semibold'
                          : 'text-verde-neon font-semibold'
                        : ''
                    }`}
                    aria-label={`Navigate to ${item.name}`}
                  >
                    {item.name}
                  </button>
                ))}

                {/* Barra deslizante inferior - Posicionamiento preciso con refs */}
                <div
                  className="absolute bottom-0 h-1 nav-indicator rounded-full"
                  style={{
                    width: '50px',
                    left: `${indicatorPosition}px`,
                    opacity: activeSection ? 1 : 0,
                    transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />
              </nav>

              {/* Separador visual */}
              <div
                className={`w-px h-6 transition-colors duration-300 ${
                  !isScrolled ? 'bg-verde-neon/30' : 'bg-gris-medio/30'
                }`}
              />

              {/* Buscador integrado - Centrado */}
              <form onSubmit={handleSearch} className="flex items-center">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className={`w-52 xl:w-64 pl-10 pr-4 py-2.5 rounded-full border transition-all duration-300 focus:ring-2 ${
                      !isScrolled
                        ? 'bg-gris-medio/20 border-verde-neon/30 text-white placeholder-white/70 backdrop-blur-sm focus:bg-gris-medio/30 focus:ring-verde-neon/20'
                        : 'bg-gris-medio/20 border-verde-neon/30 text-white placeholder-white/70 focus:ring-verde-neon/30 shadow-sm backdrop-blur-sm'
                    }`}
                  />
                  <Search
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-300 ${
                      !isScrolled ? 'text-verde-neon/70' : 'text-verde-neon/70'
                    }`}
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Desktop Actions - Alineadas y centradas */}
          <div className="hidden lg:flex items-center space-x-1 flex-shrink-0">
            <FavoritesSheet>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Favorites"
                className={`transition-all duration-300 rounded-full ${
                  !isScrolled
                    ? 'text-white hover:text-verde-neon hover:bg-verde-neon/10'
                    : 'text-white hover:text-verde-neon hover:bg-verde-neon/10'
                }`}
              >
                <Heart className="h-5 w-5" />
              </Button>
            </FavoritesSheet>

            <CartSheet>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Shopping cart"
                className={`transition-all duration-300 rounded-full ${
                  !isScrolled
                    ? 'text-white hover:text-verde-neon hover:bg-verde-neon/10'
                    : 'text-white hover:text-verde-neon hover:bg-verde-neon/10'
                }`}
              >
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </CartSheet>

            {isAuthenticated ? (
              <div className="ml-2">
                {/* Usar menú específico según el rol */}
                {isAdmin ? <AdminUserMenu /> : <ClientUserMenu />}
              </div>
            ) : (
              <AuthDialog>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="User account"
                  className={`transition-all duration-300 rounded-full ${
                    !isScrolled
                      ? 'text-white hover:text-verde-neon hover:bg-verde-neon/10'
                      : 'text-white hover:text-verde-neon hover:bg-verde-neon/10'
                  }`}
                >
                  <User className="h-5 w-5" />
                </Button>
              </AuthDialog>
            )}
          </div>

          {/* Tablet/Mobile Actions - Centradas y organizadas */}
          <div className="flex lg:hidden items-center space-x-1 flex-shrink-0">
            {/* Buscador móvil - Solo en tablets, mejor centrado */}
            <div className="hidden md:flex lg:hidden mr-2">
              <form onSubmit={handleSearch} className="flex items-center">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Buscar..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className={`w-36 sm:w-44 pl-9 pr-4 py-2 text-sm rounded-full border transition-all duration-300 focus:ring-2 ${
                      !isScrolled
                        ? 'bg-gris-medio/20 border-verde-neon/30 text-white placeholder-white/70 backdrop-blur-sm focus:bg-gris-medio/30 focus:ring-verde-neon/20'
                        : 'bg-gris-medio/20 border-verde-neon/30 text-white placeholder-white/70 focus:ring-verde-neon/30 shadow-sm backdrop-blur-sm'
                    }`}
                  />
                  <Search
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 transition-colors duration-300 ${
                      !isScrolled ? 'text-verde-neon/70' : 'text-verde-neon/70'
                    }`}
                  />
                </div>
              </form>
            </div>

            <FavoritesSheet>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Favorites"
                className={`transition-all duration-300 rounded-full ${
                  !isScrolled
                    ? 'text-white hover:text-verde-neon hover:bg-verde-neon/10'
                    : 'text-white hover:text-verde-neon hover:bg-verde-neon/10'
                }`}
              >
                <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </FavoritesSheet>

            <CartSheet>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Shopping cart"
                className={`transition-all duration-300 rounded-full ${
                  !isScrolled
                    ? 'text-white hover:text-verde-neon hover:bg-verde-neon/10'
                    : 'text-white hover:text-verde-neon hover:bg-verde-neon/10'
                }`}
              >
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </CartSheet>

            {isAuthenticated ? (
              isAdmin ? (
                <AdminUserMenu />
              ) : (
                <ClientUserMenu />
              )
            ) : (
              <AuthDialog>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="User account"
                  className={`transition-all duration-300 rounded-full ${
                    !isScrolled
                      ? 'text-white hover:text-verde-neon hover:bg-verde-neon/10'
                      : 'text-white hover:text-verde-neon hover:bg-verde-neon/10'
                  }`}
                >
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </AuthDialog>
            )}

            <Button
              variant="ghost"
              size="icon"
              className={`lg:hidden ml-2 transition-all duration-300 rounded-full ${
                !isScrolled
                  ? 'text-white hover:text-verde-neon hover:bg-verde-neon/10'
                  : 'text-white hover:text-verde-neon hover:bg-verde-neon/10'
              }`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav
            className="lg:hidden mt-4 pb-4 border-t border-verde-neon/20 pt-4"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col space-y-3">
              {/* Navegación principal en móvil */}
              {navigationItems.map(item => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.path, item.sectionId)}
                  className={`text-left font-medium transition-colors duration-300 py-2 px-3 rounded-md ${
                    location.pathname === item.path && item.sectionId === 'home'
                      ? 'text-verde-neon bg-verde-neon/10'
                      : 'text-white hover:text-verde-neon hover:bg-verde-neon/10'
                  }`}
                  aria-label={`Navigate to ${item.name}`}
                >
                  {item.name}
                </button>
              ))}

              <div className="border-t border-verde-neon/20 my-2"></div>
              <Button
                variant="default"
                onClick={() => handleNavigation('/', 'shop')}
                className="w-full button-primary-glow"
              >
                Ir a Tienda
              </Button>
            </div>
          </nav>
        )}

        {/* Dev Tools - Solo visible en desarrollo */}
        {isAuthenticated && (
          <div className="hidden lg:block absolute top-2 right-2">
            <DevTools />
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
