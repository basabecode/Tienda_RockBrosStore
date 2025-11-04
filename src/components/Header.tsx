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
import { useSearch } from '@/hooks/use-search-context'
import { AuthDialog } from './AuthDialog'
import { ClientUserMenu } from './ClientUserMenu'
import { AdminUserMenu } from './AdminUserMenu'
import { CartSheet } from './CartSheet'
import { FavoritesSheet } from './FavoritesSheet'
import { toast } from '@/hooks/use-toast'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [indicatorPosition, setIndicatorPosition] = useState(0)
  const { isAuthenticated, isAdmin } = useAuth()
  const { searchTerm, setSearchTerm } = useSearch()
  const [localSearch, setLocalSearch] = useState('')
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
      { name: 'Inicio', path: '/' },
      { name: 'Productos', path: '/#shop' },
      { name: 'Categorías', path: '/#categories' },
      { name: 'Marcas', path: '/#brands' },
    ],
    []
  )

  // Función helper para mapear nombres de navegación a secciones de scroll
  const getScrollSectionName = (navItemName: string): string => {
    const mapping = {
      inicio: 'inicio',
      productos: 'productos',
      categorías: 'categoria',
      marcas: 'marca',
    }
    return mapping[navItemName.toLowerCase()] || 'inicio'
  }

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

  const handleHomeNavigation = () => {
    if (location.pathname === '/') {
      // Si ya estamos en la página principal, hacer scroll al top (elemento home)
      const homeElement = document.getElementById('home')
      if (homeElement) {
        homeElement.scrollIntoView({ behavior: 'smooth' })
      } else {
        // Fallback: scroll al top de la página
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } else {
      // Si estamos en otra página, navegar a la página principal
      navigate('/')
    }
    setIsMenuOpen(false)
  }

  const handleNavigation = (path: string) => {
    // Caso especial para "Inicio"
    if (path === '/') {
      handleHomeNavigation()
      return
    }

    if (path.startsWith('/#')) {
      // Si es un hash, verificar si estamos en la página principal
      if (location.pathname === '/') {
        const sectionId = path.replace('/#', '')
        scrollToSection(sectionId)
      } else {
        navigate(path)
      }
    } else {
      navigate(path)
    }
    setIsMenuOpen(false)
  }

  // Función para calcular la posición del indicador
  const calculateIndicatorPosition = useCallback(() => {
    // Mapeo correcto de secciones a índices de navegación
    // Debe coincidir con los valores que retorna useScrollSpy
    const sectionToIndex = {
      inicio: 0, // useScrollSpy retorna 'inicio'
      productos: 1, // useScrollSpy retorna 'productos'
      categoria: 2, // useScrollSpy retorna 'categoria'
      marca: 3, // useScrollSpy retorna 'marca'
    } as Record<string, number>

    const activeIndex =
      location.pathname === '/' ? sectionToIndex[activeSection] ?? 0 : 0

    if (navButtonsRef.current[activeIndex]) {
      const button = navButtonsRef.current[activeIndex]
      if (button) {
        const rect = button.getBoundingClientRect()
        const nav = button.parentElement
        const navRect = nav?.getBoundingClientRect()

        if (navRect) {
          const relativeLeft = rect.left - navRect.left
          const buttonCenter = relativeLeft + rect.width / 2
          const indicatorCenter = buttonCenter - 60 // Ajuste del indicador
          setIndicatorPosition(indicatorCenter)
        }
      }
    } else {
      // Posición por defecto en "Inicio"
      setIndicatorPosition(30)
    }
  }, [activeSection, location.pathname])

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
    if (localSearch.trim()) {
      setSearchTerm(localSearch.trim())

      // Scroll a la sección de productos
      const productsSection = document.getElementById('shop')
      if (productsSection) {
        productsSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }

      toast({
        title: 'Búsqueda realizada',
        description: `Buscando: ${localSearch}`,
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
          {/* Logo - Proporcional al navbar - Clickeable */}
          <div
            className="flex items-center space-x-3 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity duration-300"
            onClick={handleHomeNavigation}
            aria-label="Ir al inicio"
          >
            <div
              className={`transition-all duration-300 rounded-full flex items-center justify-center ${
                isScrolled ? 'w-12 h-12' : 'w-14 h-14'
              } white-primary`}
            >
              <img
                src="/favicon.ico"
                alt="RockBros Logo"
                className={`transition-all duration-300 ${
                  isScrolled ? 'w-7 h-7' : 'w-10 h-10'
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
                    onClick={() => handleNavigation(item.path)}
                    className={`relative text-sm xl:text-base font-medium transition-all duration-300 py-3 px-2 ${
                      !isScrolled
                        ? 'text-white hover:text-verde-neon'
                        : 'text-white hover:text-verde-neon'
                    } ${
                      activeSection === getScrollSectionName(item.name)
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
                    width: '60px',
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
                    value={localSearch}
                    onChange={e => setLocalSearch(e.target.value)}
                    className={`w-52 xl:w-64 pl-10 pr-4 py-2.5 rounded-full border transition-all duration-300 focus:ring-2 ${
                      !isScrolled
                        ? 'bg-white/90 border-verde-neon/30 text-gray-900 placeholder-gray-500 backdrop-blur-sm focus:bg-white focus:ring-verde-neon/20'
                        : 'bg-white/90 border-verde-neon/30 text-gray-900 placeholder-gray-500 focus:ring-verde-neon/30 shadow-sm backdrop-blur-sm focus:bg-white'
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
            <div className="relative group">
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
                  <Heart className="h-6 w-6" />
                </Button>
              </FavoritesSheet>
              {/* Tooltip */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gris-oscuro text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none z-50">
                Favoritos
              </div>
            </div>

            <div className="relative group">
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
                  <ShoppingCart className="h-6 w-6" />
                </Button>
              </CartSheet>
              {/* Tooltip */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gris-oscuro text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none z-50">
                Comprar
              </div>
            </div>

            {isAuthenticated ? (
              <div className="ml-2">
                {/* Usar menú específico según el rol */}
                {isAdmin ? <AdminUserMenu /> : <ClientUserMenu />}
              </div>
            ) : (
              <div className="relative group">
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
                {/* Tooltip */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gris-oscuro text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none z-50">
                  Iniciar sesión
                </div>
              </div>
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
                    value={localSearch}
                    onChange={e => setLocalSearch(e.target.value)}
                    className={`w-36 sm:w-44 pl-9 pr-4 py-2 text-sm rounded-full border transition-all duration-300 focus:ring-2 ${
                      !isScrolled
                        ? 'bg-white/90 border-verde-neon/30 text-gray-900 placeholder-gray-500 backdrop-blur-sm focus:bg-white focus:ring-verde-neon/20'
                        : 'bg-white/90 border-verde-neon/30 text-gray-900 placeholder-gray-500 focus:ring-verde-neon/30 shadow-sm backdrop-blur-sm focus:bg-white'
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
              <div className="relative group">
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
                  <Heart className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
                {/* Tooltip */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gris-oscuro text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none z-50">
                  Favoritos
                </div>
              </div>
            </FavoritesSheet>

            <CartSheet>
              <div className="relative group">
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
                  <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
                {/* Tooltip */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gris-oscuro text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none z-50">
                  Comprar
                </div>
              </div>
            </CartSheet>

            {isAuthenticated ? (
              isAdmin ? (
                <AdminUserMenu />
              ) : (
                <ClientUserMenu />
              )
            ) : (
              <div className="relative group">
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
                {/* Tooltip */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gris-oscuro text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none z-50">
                  Iniciar sesión
                </div>
              </div>
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
                  onClick={() => handleNavigation(item.path)}
                  className={`text-left font-medium transition-colors duration-300 py-2 px-3 rounded-md ${
                    location.pathname === item.path ||
                    (location.pathname === '/' && item.path === '/')
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
                onClick={() => handleNavigation('/#shop')}
                className="w-full button-primary-glow"
              >
                Ir a Tienda
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header
