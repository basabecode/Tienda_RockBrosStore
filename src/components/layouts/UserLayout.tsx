import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/hooks/use-auth'
import {
  User,
  Package,
  Heart,
  Home,
  Search,
  ShoppingCart,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  ArrowLeft,
  Settings,
  LogOut,
} from 'lucide-react'

const UserLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, signOut } = useAuth()

  const menuItems = [
    {
      icon: User,
      label: 'Mi Perfil',
      path: '/usuario/perfil',
      description: 'Información personal y configuración',
    },
    {
      icon: Package,
      label: 'Mis Pedidos',
      path: '/usuario/pedidos',
      description: 'Historial y estado de compras',
    },
    {
      icon: Heart,
      label: 'Favoritos',
      path: '/usuario/favoritos',
      description: 'Productos guardados',
    },
  ]

  const navigationItems = [
    { name: 'Inicio', path: '/', icon: Home },
    { name: 'Productos', path: '/products', icon: Search },
    { name: 'Categorías', path: '/#categories', icon: ShoppingCart },
  ]

  const socialLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      href: '#',
      color: 'hover:text-brand-primary',
    },
    {
      name: 'Instagram',
      icon: Instagram,
      href: '#',
      color: 'hover:text-pink-600',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: '#',
      color: 'hover:text-brand-primary',
    },
  ]

  const handleNavigation = (path: string) => {
    if (path.startsWith('/#')) {
      navigate('/')
      setTimeout(() => {
        const element = document.getElementById(path.replace('/#', ''))
        element?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      navigate(path)
    }
  }

  const currentYear = new Date().getFullYear()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-rockbros-green-neon/5">
      {/* Header principal similar a la página principal */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo y navegación principal */}
            <div className="flex items-center space-x-8">
              <div
                onClick={() => navigate('/')}
                className="flex items-center space-x-3 cursor-pointer hover:opacity-90 transition-all duration-200 group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-rockbros-green-forest to-rockbros-green-neon rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-rockbros-green-forest/30 transition-shadow">
                  <span className="text-white font-bold text-sm">RB</span>
                </div>
                <span className="text-xl font-bold text-rockbros-gray-dark">
                  RockBrosShop
                </span>
              </div>

              {/* Navegación principal - solo en desktop */}
              <nav className="hidden md:flex items-center space-x-6">
                {navigationItems.map(item => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNavigation(item.path)}
                      className="flex items-center space-x-2 text-rockbros-gray-medium hover:text-rockbros-green-forest transition-colors duration-200 text-sm font-semibold group"
                    >
                      <Icon className="h-4 w-4 group-hover:text-rockbros-green-neon transition-colors" />
                      <span>{item.name}</span>
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Usuario y acciones */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-rockbros-gray-dark">
                <User className="h-4 w-4 text-rockbros-green-forest" />
                <span className="font-medium">{user?.email}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
                className="text-rockbros-green-forest border-rockbros-green-forest hover:bg-rockbros-green-forest hover:text-white transition-colors duration-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Tienda
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar de usuario - solo visible en desktop */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-rockbros-gray-medium/20 p-6 sticky top-24">
              {/* Información del usuario - sin foto de perfil */}
              <div className="text-center pb-6 border-b border-rockbros-gray-medium/20 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-rockbros-green-forest to-rockbros-green-neon rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-white font-bold text-2xl">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <h2 className="font-bold text-rockbros-gray-dark text-lg">
                  Mi Cuenta
                </h2>
                <p className="text-sm text-rockbros-gray-medium mt-2 font-medium">
                  {user?.email}
                </p>
                <div className="mt-3 px-3 py-1 bg-rockbros-green-neon/10 border border-rockbros-green-neon/30 rounded-full text-xs font-semibold text-rockbros-green-forest">
                  Cliente Activo
                </div>
              </div>

              {/* Menú de navegación */}
              <nav className="space-y-3">
                {menuItems.map(item => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.path
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={`group flex items-start p-4 rounded-xl transition-all duration-300 border ${
                        isActive
                          ? 'bg-gradient-to-r from-rockbros-green-forest to-rockbros-green-neon text-white shadow-lg border-rockbros-green-forest'
                          : 'text-rockbros-gray-dark hover:bg-rockbros-green-neon/5 hover:text-rockbros-green-forest hover:border-rockbros-green-neon/30 border-transparent'
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 mt-0.5 mr-3 flex-shrink-0 transition-colors ${
                          isActive
                            ? 'text-white'
                            : 'text-rockbros-gray-medium group-hover:text-rockbros-green-forest'
                        }`}
                      />
                      <div>
                        <div className="text-sm font-semibold">
                          {item.label}
                        </div>
                        <div
                          className={`text-xs mt-1 ${
                            isActive
                              ? 'text-white/90'
                              : 'text-rockbros-gray-medium'
                          }`}
                        >
                          {item.description}
                        </div>
                      </div>
                    </NavLink>
                  )
                })}
              </nav>

              <Separator className="my-6" />

              {/* Acciones adicionales */}
              <div className="space-y-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={signOut}
                  className="w-full justify-start text-rockbros-gray-medium hover:text-red-600 hover:bg-red-50/80 font-medium transition-colors duration-200"
                >
                  Cerrar Sesión
                </Button>
              </div>
            </div>
          </aside>

          {/* Contenido principal */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg border border-rockbros-gray-medium/20 p-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      {/* Footer con paleta corporativa RockBros */}
      <footer className="bg-rockbros-gray-dark text-white mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Logo y descripción */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-rockbros-green-forest to-rockbros-green-neon rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">RB</span>
                </div>
                <span className="text-2xl font-bold">RockBrosShop</span>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Tu tienda de confianza en Colombia para accesorios y repuestos
                de ciclismo de alta calidad.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-rockbros-green-neon flex-shrink-0" />
                  <span className="text-sm font-medium">Bogotá, Colombia</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-rockbros-green-neon flex-shrink-0" />
                  <span className="text-sm font-medium">+57 300 000 0000</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-rockbros-green-neon flex-shrink-0" />
                  <span className="text-sm font-medium">
                    soporte@rockbrosshop.com
                  </span>
                </div>
              </div>
            </div>

            {/* Enlaces rápidos */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-rockbros-green-neon">
                Enlaces rápidos
              </h3>
              <div className="space-y-3">
                {navigationItems.map(item => (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className="block text-sm text-gray-300 hover:text-rockbros-green-neon transition-colors duration-200 font-medium"
                  >
                    {item.name}
                  </button>
                ))}
                <button
                  onClick={() => navigate('/usuario/perfil')}
                  className="block text-sm text-gray-300 hover:text-rockbros-green-neon transition-colors duration-200 font-medium"
                >
                  Mi Cuenta
                </button>
              </div>
            </div>

            {/* Redes sociales */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-rockbros-green-neon">
                Síguenos
              </h3>
              <div className="flex space-x-4">
                {socialLinks.map(social => {
                  const Icon = social.icon
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      className="p-3 rounded-xl bg-rockbros-gray-dark/50 text-gray-300 hover:bg-rockbros-green-forest hover:text-white transition-all duration-300 shadow-lg hover:shadow-rockbros-green-forest/25"
                      aria-label={social.name}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>

          <Separator className="my-8 bg-rockbros-gray-medium/30" />

          <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-400">
            <p className="font-medium">
              &copy; {currentYear} RockBrosShop. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a
                href="#"
                className="hover:text-rockbros-green-neon transition-colors duration-200 font-medium"
              >
                Privacidad
              </a>
              <a
                href="#"
                className="hover:text-rockbros-green-neon transition-colors duration-200 font-medium"
              >
                Términos
              </a>
              <a
                href="#"
                className="hover:text-rockbros-green-neon transition-colors duration-200 font-medium"
              >
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default UserLayout
