import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Brand {
  id: string;
  name: string;
  logo: string;
  description: string;
  products: number;
  isPartner: boolean;
}

const brands: Brand[] = [
  {
    id: 'apple',
    name: 'Apple',
    logo: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=200&h=200&fit=crop',
    description: 'Electrónica de consumo y accesorios',
    products: 45,
    isPartner: true,
  },
  {
    id: 'samsung',
    name: 'Samsung',
    logo: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=200&h=200&fit=crop',
    description: 'Innovation in mobile and displays',
    products: 38,
    isPartner: true,
  },
  {
    id: 'sony',
    name: 'Sony',
    logo: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=200&h=200&fit=crop',
    description: 'Audio and gaming excellence',
    products: 52,
    isPartner: true,
  },
  {
    id: 'dell',
    name: 'Dell',
    logo: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=200&h=200&fit=crop',
    description: 'Professional computing solutions',
    products: 29,
    isPartner: false,
  },
  {
    id: 'hp',
    name: 'HP',
    logo: 'https://images.unsplash.com/photo-1541328263107-82e25c9ebe03?w=200&h=200&fit=crop',
    description: 'Reliable business technology',
    products: 34,
    isPartner: false,
  },
  {
    id: 'asus',
    name: 'ASUS',
    logo: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=200&h=200&fit=crop',
    description: 'Gaming and motherboards',
    products: 41,
    isPartner: true,
  },
];

const Brands = () => {
  return (
    <section
      id="brands"
      className="py-20 bg-background"
      aria-labelledby="brands-title"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 text-sm font-medium">
            Marcas asociadas
          </Badge>
          <h2
            id="brands-title"
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
          >
            Marcas
            <span className="block gradient-primary bg-clip-text text-transparent">
              de confianza
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trabajamos con marcas reconocidas del mundo del ciclismo para
            ofrecer productos fiables y garantía.
          </p>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          {brands.map(brand => (
            <Card
              key={brand.id}
              className="group cursor-pointer gradient-card border-0 shadow-soft hover:shadow-large transition-all duration-500 hover:scale-105 relative"
              role="button"
              tabIndex={0}
              aria-label={`View ${brand.name} products - ${brand.products} items available`}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  console.log(`Navigate to ${brand.name} products`);
                }
              }}
            >
              {/* Partner Badge */}
              {brand.isPartner && (
                <Badge className="absolute -top-2 -right-2 z-10 bg-primary text-primary-foreground text-xs">
                  Socio
                </Badge>
              )}

              <CardContent className="p-6 text-center">
                {/* Brand Logo */}
                <div className="w-16 h-16 mx-auto mb-4 rounded-lg overflow-hidden bg-white shadow-soft group-hover:shadow-medium transition-shadow">
                  <img
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                {/* Brand Name */}
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {brand.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {brand.description}
                </p>

                {/* Product Count */}
                <Badge variant="outline" className="text-xs">
                  {brand.products} productos
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">50+</div>
            <p className="text-sm text-muted-foreground">Marcas asociadas</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">1000+</div>
            <p className="text-sm text-muted-foreground">Productos</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">24/7</div>
            <p className="text-sm text-muted-foreground">Soporte</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">99%</div>
            <p className="text-sm text-muted-foreground">Satisfacción</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Brands;
