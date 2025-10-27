import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, X, Sparkles } from 'lucide-react'

const ImprovementNotification = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Mostrar la notificación después de 2 segundos
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  const improvements = [
    'Tema oscuro corporativo implementado',
    'Navegación mejorada con scroll spy',
    'Efectos visuales y animaciones optimizadas',
    'Paleta de colores RockBros aplicada',
    'Rendimiento de scroll optimizado',
  ]

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <Card className="card-dark-enhanced border-verde-neon/30 max-w-sm">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-verde-neon" />
              <h4 className="text-white font-semibold">
                Mejoras Implementadas
              </h4>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="h-8 w-8 p-0 text-gris-medio hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ul className="space-y-2 mb-3">
            {improvements.map((improvement, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-verde-neon mt-0.5 flex-shrink-0" />
                <span className="text-white">{improvement}</span>
              </li>
            ))}
          </ul>

          <Button
            onClick={() => setIsVisible(false)}
            className="button-primary-glow w-full text-sm"
          >
            Entendido
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default ImprovementNotification
