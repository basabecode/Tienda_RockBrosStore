import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Play,
  BookOpen,
  Users,
  Clock,
  Star,
  ArrowRight,
  Video,
  FileText,
  Zap,
} from 'lucide-react'

interface EducationalContent {
  id: string
  type: 'video' | 'article' | 'guide'
  title: string
  description: string
  duration: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  views: number
  rating: number
  thumbnail: string
  category: string
}

const educationalContent: EducationalContent[] = [
  {
    id: '1',
    type: 'video',
    title: 'Mantenimiento básico de tu bicicleta',
    description:
      'Guía paso a paso para limpieza, ajuste de frenos y lubricación de cadena',
    duration: '20 min',
    difficulty: 'Beginner',
    views: 15420,
    rating: 4.8,
    thumbnail:
      'https://images.unsplash.com/photo-1520975913100-4a2f1dbd7d44?w=400&h=300&fit=crop',
    category: 'Mantenimiento',
  },
  {
    id: '2',
    type: 'article',
    title: 'Cómo elegir el casco adecuado',
    description:
      'Consejos para seleccionar talla, certificaciones y tipos de casco según uso',
    duration: '8 min lectura',
    difficulty: 'Beginner',
    views: 8930,
    rating: 4.6,
    thumbnail:
      'https://images.unsplash.com/photo-1518655048521-f130df041f66?w=400&h=300&fit=crop',
    category: 'Seguridad',
  },
  {
    id: '3',
    type: 'guide',
    title: 'Ajuste de cambios y configuración de transmisión',
    description:
      'Técnicas para optimizar el rendimiento de cambios en bicicletas de ruta y montaña',
    duration: '30 min',
    difficulty: 'Intermediate',
    views: 12750,
    rating: 4.9,
    thumbnail:
      'https://images.unsplash.com/photo-1508163227542-24a9f4a1cc3f?w=400&h=300&fit=crop',
    category: 'Componentes',
  },
]

const Education = () => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />
      case 'article':
        return <FileText className="h-4 w-4" />
      case 'guide':
        return <BookOpen className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-500'
      case 'Intermediate':
        return 'bg-yellow-500'
      case 'Advanced':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <section
      id="education"
      className="py-20 bg-gradient-to-b from-muted/30 to-background"
      aria-labelledby="education-title"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 text-sm font-medium">
            Aprende y mejora
          </Badge>
          <h2
            id="education-title"
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
          >
            Recursos para
            <span className="block gradient-primary bg-clip-text text-transparent">
              ciclistas
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Guías, tutoriales y consejos prácticos para mantener y mejorar tu
            experiencia en bicicleta.
          </p>
        </div>

        {/* Featured Video Section */}
        <Card className="mb-16 gradient-card border-0 shadow-large overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Video Thumbnail */}
            <div className="relative bg-gray-900 min-h-[300px] flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/80"></div>
              <Button
                variant="secondary"
                size="lg"
                className="relative z-10 w-20 h-20 rounded-full shadow-large hover:scale-110 transition-transform"
                aria-label="Play featured video"
              >
                <Play className="h-8 w-8 ml-1" />
              </Button>
              <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                Live
              </Badge>
            </div>

            {/* Video Info */}
            <CardContent className="p-8 flex flex-col justify-center">
              <Badge className="w-fit mb-4 bg-primary/10 text-primary border-primary/20">
                <Zap className="mr-1 h-3 w-3" />
                Featured Tutorial
              </Badge>
              <h3 className="text-2xl font-bold mb-4">
                Sesión en vivo: mantenimiento esencial
              </h3>
              <p className="text-muted-foreground mb-6">
                Únete a nuestra sesión con expertos en ciclismo para aprender
                mantenimiento, ajustes y seguridad.
              </p>
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">1 hour</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">2.4k watching</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm">4.9</span>
                </div>
              </div>
              <Button variant="default" size="lg" className="w-fit">
                Unirse a la sesión
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </div>
        </Card>

        {/* Educational Content Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {educationalContent.map(content => (
            <Card
              key={content.id}
              className="group cursor-pointer gradient-card border-0 shadow-soft hover:shadow-large transition-all duration-500 hover:scale-105"
              role="article"
              aria-labelledby={`content-${content.id}-title`}
            >
              <CardHeader className="p-0 relative overflow-hidden">
                {/* Content Type Badge */}
                <Badge className="absolute top-4 left-4 z-10 bg-black/70 text-white border-0">
                  {getTypeIcon(content.type)}
                  <span className="ml-1 capitalize">{content.type}</span>
                </Badge>

                {/* Difficulty Badge */}
                <div
                  className={`absolute top-4 right-4 z-10 w-3 h-3 rounded-full ${getDifficultyColor(
                    content.difficulty
                  )}`}
                  title={content.difficulty}
                ></div>

                {/* Thumbnail */}
                <img
                  src={content.thumbnail}
                  alt={content.description}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Play button overlay for videos */}
                {content.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="w-12 h-12 rounded-full shadow-large"
                    >
                      <Play className="h-6 w-6 ml-1" />
                    </Button>
                  </div>
                )}
              </CardHeader>

              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline" className="text-xs">
                    {content.category}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-muted-foreground">
                      {content.rating}
                    </span>
                  </div>
                </div>

                <CardTitle
                  id={`content-${content.id}-title`}
                  className="text-lg mb-2 group-hover:text-primary transition-colors"
                >
                  {content.title}
                </CardTitle>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {content.description}
                </p>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-3 w-3" />
                    <span>{content.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-3 w-3" />
                    <span>{content.views.toLocaleString()} views</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            className="shadow-medium hover:shadow-large mr-4"
          >
            Ver todo el contenido
          </Button>
          <Button
            variant="default"
            size="lg"
            className="shadow-medium hover:shadow-large"
          >
            Suscribirse al boletín
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}

export default Education
