import { Button } from '@/components/ui/button'
import { ArrowRight, Star, Shield, Truck } from 'lucide-react'
import heroBanner from '@/assets/hero-banner.jpg'

const HeroBanner = () => {
  const scrollToShop = () => {
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
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroBanner}
          alt="Equipamiento de ciclismo - imagen promocional"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium">
              Confiado por ciclistas en toda Colombia
            </span>
          </div>

          {/* Main Heading */}
          <h1
            id="hero-title"
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in"
          >
            Equipamiento
            <span className="block gradient-hero bg-clip-text text-transparent">
              para ciclismo
            </span>
            <span className="block text-3xl md:text-4xl lg:text-5xl font-normal mt-2">
              Calidad y confianza en Colombia
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-90 animate-slide-up">
            Encuentra cascos, ropa, componentes y accesorios seleccionados para
            ciclistas urbanos y de montaña. Envíos a toda Colombia.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12 animate-bounce-soft">
            <Button
              variant="hero"
              size="lg"
              onClick={scrollToShop}
              className="text-lg px-8 py-4 min-w-[200px]"
              aria-label="Explorar colección de productos"
            >
              Comprar ahora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-4 bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm min-w-[200px]"
              aria-label="Ver video demostrativo"
            >
              Ver demostración
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <Shield className="h-6 w-6 text-green-400" />
              <span className="font-medium">Garantía limitada</span>
            </div>
            <div className="flex items-center justify-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <Truck className="h-6 w-6 text-blue-400" />
              <span className="font-medium">Envíos nacionales</span>
            </div>
            <div className="flex items-center justify-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <Star className="h-6 w-6 text-yellow-400" />
              <span className="font-medium">Soporte especializado</span>
            </div>
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
