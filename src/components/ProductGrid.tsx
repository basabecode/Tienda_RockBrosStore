import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import { useState } from 'react';

import product1 from '@/assets/product-1.jpg';
import product2 from '@/assets/product-2.jpg';
import product3 from '@/assets/product-3.jpg';
import product4 from '@/assets/product-4.jpg';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  isNew?: boolean;
  isOnSale?: boolean;
  description: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "Premium Tech Bundle",
    price: 1299,
    originalPrice: 1499,
    image: product1,
    rating: 4.8,
    reviews: 124,
    category: "Bundles",
    isOnSale: true,
    description: "Complete tech setup with wireless headphones, smartwatch, laptop, and smartphone"
  },
  {
    id: 2,
    name: "Gaming Pro Setup",
    price: 899,
    image: product2,
    rating: 4.9,
    reviews: 89,
    category: "Gaming",
    isNew: true,
    description: "Professional gaming setup with RGB keyboard, precision mouse, and high-refresh monitor"
  },
  {
    id: 3,
    name: "Smart Home Starter Kit",
    price: 449,
    originalPrice: 549,
    image: product3,
    rating: 4.7,
    reviews: 156,
    category: "Smart Home",
    isOnSale: true,
    description: "Complete smart home solution with voice assistant, security cameras, and smart bulbs"
  },
  {
    id: 4,
    name: "Pro Photography Kit",
    price: 2299,
    image: product4,
    rating: 4.9,
    reviews: 67,
    category: "Cameras",
    isNew: true,
    description: "Professional camera equipment with DSLR, multiple lenses, tripod, and accessories"
  }
];

const ProductGrid = () => {
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section 
      id="shop" 
      className="py-20 bg-gradient-to-b from-background to-muted/30"
      aria-labelledby="products-title"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 text-sm font-medium">
            Featured Products
          </Badge>
          <h2 
            id="products-title" 
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
          >
            Discover Our
            <span className="block gradient-primary bg-clip-text text-transparent">
              Best Sellers
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Handpicked premium electronics that deliver exceptional performance and value
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Card 
              key={product.id}
              className={`group gradient-card border-0 shadow-soft hover:shadow-large transition-all duration-500 cursor-pointer ${
                hoveredProduct === product.id ? 'scale-105' : ''
              }`}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
              role="article"
              aria-labelledby={`product-${product.id}-title`}
            >
              <CardHeader className="p-0 relative overflow-hidden rounded-t-lg">
                {/* Product Badges */}
                <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
                  {product.isNew && (
                    <Badge className="bg-accent text-accent-foreground">
                      New
                    </Badge>
                  )}
                  {product.isOnSale && (
                    <Badge className="bg-destructive text-destructive-foreground">
                      Sale
                    </Badge>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button 
                    variant="secondary" 
                    size="icon"
                    className="bg-white/90 hover:bg-white shadow-medium"
                    aria-label={`Add ${product.name} to wishlist`}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="icon"
                    className="bg-white/90 hover:bg-white shadow-medium"
                    aria-label={`Quick view ${product.name}`}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>

                {/* Product Image */}
                <img 
                  src={product.image} 
                  alt={product.description}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              </CardHeader>

              <CardContent className="p-6">
                {/* Category */}
                <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                
                {/* Product Name */}
                <CardTitle 
                  id={`product-${product.id}-title`}
                  className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors"
                >
                  {product.name}
                </CardTitle>

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center space-x-1">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-2xl font-bold text-primary">
                    ${product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0">
                <Button 
                  variant="default" 
                  className="w-full shadow-medium hover:shadow-large"
                  aria-label={`Add ${product.name} to cart for $${product.price}`}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg"
            className="shadow-medium hover:shadow-large"
          >
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;