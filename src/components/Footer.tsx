import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Productos', href: '/products' },
    { name: 'Categorías', href: '/#categories' },
    { name: 'Mi cuenta', href: '/profile' },
  ]

  const legalLinks = [
    { name: 'Privacidad', href: '#' },
    { name: 'Términos', href: '#' },
    { name: 'Cookies', href: '#' },
  ]

  const socialLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      href: '#',
      color: 'hover:text-blue-600',
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
      color: 'hover:text-blue-700',
    },
  ]

  return (
    <footer
      className="bg-gris-oscuro border-t border-verde-neon/20"
      role="contentinfo"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-verde-neon to-verde-bosque rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-xl">RB</span>
              </div>
              <span className="text-2xl font-bold text-white">
                RockbrosShop
              </span>
            </div>

            <p className="text-gris-medio mb-6 leading-relaxed">
              Tu tienda de confianza en Colombia para accesorios y repuestos de
              ciclismo. Productos de calidad para ciclistas urbanos y de
              montaña.
            </p>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-verde-neon flex-shrink-0" />
                <span className="text-sm text-white">Bogotá, Colombia</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-verde-neon flex-shrink-0" />
                <a
                  href="tel:+573000000000"
                  className="text-sm text-white hover:text-verde-neon transition-colors"
                >
                  +57 300 000 0000
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-verde-neon flex-shrink-0" />
                <a
                  href="mailto:soporte@rockbrosshop.com"
                  className="text-sm text-white hover:text-verde-neon transition-colors"
                >
                  soporte@rockbrosshop.com
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Enlaces rápidos</h3>
            <nav role="navigation" aria-label="Quick links">
              <ul className="space-y-3">
                {quickLinks.map(link => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-white hover:text-verde-neon transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Síguenos</h3>
            <p className="text-sm text-gris-medio mb-4">
              Conecta con nosotros para novedades y consejos de ciclismo.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map(social => {
                const IconComponent = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="text-white hover:text-verde-neon transition-colors"
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

      <Separator className="bg-verde-neon/20" />

      <div id="contact" className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 text-xs md:text-sm">
          <div className="text-gris-medio">
            © {currentYear} RockbrosShop. Todos los derechos reservados.
          </div>

          <nav role="navigation" aria-label="Legal information">
            <ul className="flex items-center space-x-4 md:space-x-6">
              {legalLinks.map(link => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gris-medio hover:text-verde-neon transition-colors"
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
