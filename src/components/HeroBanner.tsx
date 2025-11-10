import { Button } from '@/components/ui/button'
import { ArrowRight, Star, UserPlus } from 'lucide-react'
import { AuthDialog } from './AuthDialog'

const HeroBanner = () => {
  const scrollToProducts = () => {
    const element = document.getElementById('shop')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      role="banner"
      aria-labelledby="hero-title"
    >
      {/* Background Image - Responsive */}
      <div className="absolute inset-0">
        {/* Imagen horizontal para desktop y tablet (oculta en móviles) */}
        <img
          src="/hero_ppal/66b1e90cef032.jpeg"
          alt="Equipamiento de ciclismo - imagen promocional"
          className="hidden sm:block w-full h-full object-cover"
          loading="eager"
        />

        <img
          src="/hero_ppal/shop-01.jpg"
          alt="Equipamiento de ciclismo - imagen promocional móvil"
          className="block sm:hidden w-full h-full object-cover object-top brightness-150 contrast-90"
          loading="eager"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
            <span className="text-sm font-medium">
              Producto para ciclistas en Colombia
            </span>
          </div>

          {/* Main Heading */}
          <h1
            id="hero-title"
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in"
          >
            Equipamiento
            <span className="block gradient-hero bg-clip-text text-transparent">
              para ciclistas
            </span>
            <span className="block text-3xl md:text-4xl lg:text-5xl font-normal mt-2">
              Calidad y confianza en Colombia
              <br />
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-90 animate-slide-up">
            Encuentra cascos, bolsos, componentes y accesorios seleccionados
            para ciclistas urbanos y de montaña. Envíos a toda Colombia.
          </p>

          {/* CTA Buttons - Solo dos botones */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12 animate-bounce-soft">
            <Button
              size="lg"
              onClick={scrollToProducts}
              className="button-primary-glow text-lg px-8 py-4 min-w-[200px]"
              aria-label="Ver más productos de ciclismo"
            >
              Ver más
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <AuthDialog>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4 bg-gris-medio/20 border-verde-neon/30 text-white hover:bg-verde-neon/20 backdrop-blur-sm min-w-[200px] transition-all duration-300"
                aria-label="Suscribirse o iniciar sesión"
              >
                <UserPlus className="mr-2 h-5 w-5" />
                Suscríbete
              </Button>
            </AuthDialog>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse-slow"></div>
        </div>
      </div>
    </section>
  )
}

export default HeroBanner
