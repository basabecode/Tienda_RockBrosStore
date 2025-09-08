import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Menu, X, Search, User, Heart } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useNavigate, useLocation } from 'react-router-dom'
import { AuthDialog } from './AuthDialog'
import { UserMenu } from './UserMenu'
import { CartSheet } from './CartSheet'
import { FavoritesSheet } from './FavoritesSheet'
import { toast } from '@/hooks/use-toast'
import DevTools from './DevTools'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { isAuthenticated } = useAuth()
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

  const navigationItems = [
    { name: 'Inicio', id: 'home' },
    { name: 'Tienda', id: 'shop' },
    { name: 'Categorías', id: 'categories' },
    { name: 'Guía', id: 'education' },
    { name: 'Marcas', id: 'brands' },
    { name: 'Contacto', id: 'contact' },
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
            <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">RB</span>
            </div>
            <span className="text-2xl font-bold text-foreground">
              RockbrosShop
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center space-x-8"
            role="navigation"
            aria-label="Main navigation"
          >
            {navigationItems.map(item => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-foreground hover:text-primary transition-colors duration-300 font-medium"
                aria-label={`Navigate to ${item.name} section`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
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
              <UserMenu />
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

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
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

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav
            className="md:hidden mt-4 pb-4 border-t border-border pt-4"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col space-y-3">
              {navigationItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-left text-foreground hover:text-primary transition-colors duration-300 py-2"
                  aria-label={`Navigate to ${item.name} section`}
                >
                  {item.name}
                </button>
              ))}
              <div className="flex items-center space-x-2 pt-2">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Search products"
                  onClick={() => {
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
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Shopping cart"
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </Button>
                </CartSheet>

                {isAuthenticated ? (
                  <UserMenu />
                ) : (
                  <AuthDialog>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="User account"
                    >
                      <User className="h-5 w-5" />
                    </Button>
                  </AuthDialog>
                )}
              </div>
              <Button
                variant="default"
                onClick={() => scrollToSection('shop')}
                className="w-full"
              >
                Comprar
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
