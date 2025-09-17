import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
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
import { AuthDialog } from './AuthDialog'
import { ClientUserMenu } from './ClientUserMenu'
import { AdminUserMenu } from './AdminUserMenu'
import { CartSheet } from './CartSheet'
import { FavoritesSheet } from './FavoritesSheet'
import { toast } from '@/hooks/use-toast'
import DevTools from './DevTools'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { isAuthenticated, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

  const navigationItems = [
    { name: 'Inicio', path: '/', sectionId: 'home' },
    { name: 'Productos', path: '/', sectionId: 'shop' },
    { name: 'Categorías', path: '/', sectionId: 'categories' },
    { name: 'Guía', path: '/', sectionId: 'education' },
    { name: 'Marcas', path: '/', sectionId: 'brands' },
    { name: 'Contacto', path: '/', sectionId: 'contact' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-md shadow-medium'
          : 'bg-transparent'
      }`}
      role="banner"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-12 h-12 white-primary rounded-full flex items-center justify-center">
              <img src="/favicon.ico" alt="" />
            </div>
            <span className="relative text-4xl font-bold text-black">
              <span
                className="relative font-bold"
                style={{
                  textShadow: '0 0 12px rgba(255,255,255,1), 0 0 1px #fff',
                  color: 'black',
                }}
              >
                RockbrosShop
              </span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav
            className="hidden lg:flex items-center space-x-6"
            role="navigation"
            aria-label="Main navigation"
          >
            {/* Navegación principal siempre visible */}
            <div className="flex items-center space-x-6">
              {navigationItems.map(item => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.path, item.sectionId)}
                  className={`text-sm font-medium transition-colors duration-300 hover:text-primary ${
                    location.pathname === item.path && item.sectionId === 'home'
                      ? 'text-primary border-b-2 border-primary pb-1'
                      : 'text-foreground'
                  }`}
                  aria-label={`Navigate to ${item.name}`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Search products"
              onClick={() => {
                // TODO: Implementar búsqueda
                toast({
                  title: 'Función en desarrollo',
                  description: 'La búsqueda estará disponible pronto',
                })
              }}
            >
              <Search className="h-5 w-5" />
            </Button>

            <FavoritesSheet>
              <Button variant="ghost" size="icon" aria-label="Favorites">
                <Heart className="h-5 w-5" />
              </Button>
            </FavoritesSheet>

            <CartSheet>
              <Button variant="ghost" size="icon" aria-label="Shopping cart">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </CartSheet>

            {isAuthenticated ? (
              <>
                {/* Usar menú específico según el rol */}
                {isAdmin ? <AdminUserMenu /> : <ClientUserMenu />}
              </>
            ) : (
              <AuthDialog>
                <Button variant="ghost" size="icon" aria-label="User account">
                  <User className="h-5 w-5" />
                </Button>
              </AuthDialog>
            )}

            <Button variant="default" onClick={() => scrollToSection('shop')}>
              Comprar
            </Button>
          </div>

          {/* Tablet/Mobile Actions */}
          <div className="flex lg:hidden items-center space-x-2 sm:space-x-3">
            <FavoritesSheet>
              <Button variant="ghost" size="icon" aria-label="Favorites">
                <Heart className="h-5 w-5" />
              </Button>
            </FavoritesSheet>

            <CartSheet>
              <Button variant="ghost" size="icon" aria-label="Shopping cart">
                <ShoppingCart className="h-5 w-5" />
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
                <Button variant="ghost" size="icon" aria-label="User account">
                  <User className="h-5 w-5" />
                </Button>
              </AuthDialog>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav
            className="lg:hidden mt-4 pb-4 border-t border-border pt-4"
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
                      ? 'text-primary bg-primary/10'
                      : 'text-foreground hover:text-primary hover:bg-muted'
                  }`}
                  aria-label={`Navigate to ${item.name}`}
                >
                  {item.name}
                </button>
              ))}

              <div className="border-t border-border my-2"></div>
              <Button
                variant="default"
                onClick={() => handleNavigation('/', 'shop')}
                className="w-full"
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
