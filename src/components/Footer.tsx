import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Shield,
  Truck,
  RotateCcw,
  CreditCard,
} from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerSections = {
    userNavigation: [
      { name: 'Mi cuenta', href: '#' },
      { name: 'Historial de pedidos', href: '#' },
      { name: 'Favoritos', href: '#' },
      { name: 'Rastrear pedido', href: '#' },
      { name: 'Devoluciones', href: '#' },
      { name: 'Centro de ayuda', href: '#' },
    ],
    categories: [
      { name: 'Cascos', href: '#' },
      { name: 'Ropa', href: '#' },
      { name: 'Componentes', href: '#' },
      { name: 'Iluminación', href: '#' },
      { name: 'Accesorios', href: '#' },
      { name: 'Bicicletas', href: '#' },
    ],
    company: [
      { name: 'Sobre nosotros', href: '#' },
      { name: 'Trabaja con nosotros', href: '#' },
      { name: 'Prensa', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Sostenibilidad', href: '#' },
      { name: 'Inversores', href: '#' },
    ],
    legal: [
      { name: 'Política de privacidad', href: '#' },
      { name: 'Términos de servicio', href: '#' },
      { name: 'Política de cookies', href: '#' },
      { name: 'Accesibilidad', href: '#' },
    ],
  }

  const socialLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      href: '#',
      color: 'hover:text-blue-600',
    },
    { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:text-blue-400' },
    {
      name: 'Instagram',
      icon: Instagram,
      href: '#',
      color: 'hover:text-pink-600',
    },
    { name: 'YouTube', icon: Youtube, href: '#', color: 'hover:text-red-600' },
  ]

  const features = [
    {
      icon: Shield,
      title: '2-Year Warranty',
      description: 'Comprehensive protection',
    },
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'On orders over $100',
    },
    {
      icon: RotateCcw,
      title: '30-Day Returns',
      description: 'Hassle-free returns',
    },
    {
      icon: CreditCard,
      title: 'Secure Payments',
      description: 'Multiple payment options',
    },
  ]

  return (
    <footer className="bg-muted/50 border-t" role="contentinfo">
      {/* Features Bar */}
      <div className="border-b border-border/50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map(feature => {
              const IconComponent = feature.icon
              return (
                <div
                  key={feature.title}
                  className="flex items-center space-x-3"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{feature.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">RB</span>
              </div>
              <span className="text-2xl font-bold text-foreground">
                RockbrosShop
              </span>
            </div>

            <p className="text-muted-foreground mb-6 leading-relaxed">
              Tu tienda de confianza en Colombia para accesorios y repuestos de
              ciclismo. Productos seleccionados para ciclistas urbanos y de
              montaña.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  Bogotá, Colombia
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  +57 300 000 0000
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  soporte@rockbrosshop.com
                </span>
              </div>
            </div>
          </div>

          {/* User Navigation */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Mi cuenta</h3>
            <nav role="navigation" aria-label="User account navigation">
              <ul className="space-y-3">
                {footerSections.userNavigation.map(link => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Categorías</h3>
            <nav role="navigation" aria-label="Product categories">
              <ul className="space-y-3">
                {footerSections.categories.map(link => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Compañía</h3>
            <nav role="navigation" aria-label="Company information">
              <ul className="space-y-3">
                {footerSections.company.map(link => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">
              Mantente informado
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Suscríbete para recibir novedades, ofertas y consejos para
              ciclistas.
            </p>

            <form className="space-y-3" onSubmit={e => e.preventDefault()}>
              <div className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Ingresa tu correo"
                  className="text-sm"
                  aria-label="Dirección de correo para suscripción"
                  required
                />
                <Button
                  type="submit"
                  size="icon"
                  className="shadow-medium hover:shadow-large"
                  aria-label="Suscribirse al boletín"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Al suscribirte aceptas nuestra política de privacidad.
              </p>
            </form>

            {/* Social Links */}
            <div className="mt-6">
              <h4 className="font-medium text-foreground mb-3">Síguenos</h4>
              <div className="flex space-x-3">
                {socialLinks.map(social => {
                  const IconComponent = social.icon
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      className={`text-muted-foreground ${social.color} transition-colors`}
                      aria-label={`Síguenos en ${social.name}`}
                    >
                      <IconComponent className="h-5 w-5" />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Bottom Bar */}
      <div id="contact" className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © {currentYear} RockbrosShop. Todos los derechos reservados.
          </div>

          <nav role="navigation" aria-label="Legal information">
            <ul className="flex items-center space-x-6">
              {footerSections.legal.map(link => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export default Footer
