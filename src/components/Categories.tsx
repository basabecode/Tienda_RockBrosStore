import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Laptop, 
  Smartphone, 
  Headphones, 
  Camera, 
  Watch, 
  Home,
  Gamepad2,
  Monitor,
  ArrowRight
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  count: number;
  description: string;
  color: string;
}

const categories: Category[] = [
  {
    id: 'laptops',
    name: 'Laptops',
    icon: Laptop,
    count: 234,
    description: 'High-performance computing',
    color: 'bg-blue-500'
  },
  {
    id: 'smartphones',
    name: 'Smartphones',
    icon: Smartphone,
    count: 189,
    description: 'Latest mobile technology',
    color: 'bg-green-500'
  },
  {
    id: 'audio',
    name: 'Audio',
    icon: Headphones,
    count: 156,
    description: 'Premium sound experience',
    color: 'bg-purple-500'
  },
  {
    id: 'cameras',
    name: 'Cameras',
    icon: Camera,
    count: 98,
    description: 'Professional photography',
    color: 'bg-red-500'
  },
  {
    id: 'wearables',
    name: 'Wearables',
    icon: Watch,
    count: 87,
    description: 'Smart fitness tracking',
    color: 'bg-pink-500'
  },
  {
    id: 'smart-home',
    name: 'Smart Home',
    icon: Home,
    count: 142,
    description: 'Connected living solutions',
    color: 'bg-yellow-500'
  },
  {
    id: 'gaming',
    name: 'Gaming',
    icon: Gamepad2,
    count: 176,
    description: 'Ultimate gaming gear',
    color: 'bg-indigo-500'
  },
  {
    id: 'monitors',
    name: 'Monitors',
    icon: Monitor,
    count: 123,
    description: 'Crystal clear displays',
    color: 'bg-teal-500'
  }
];

const Categories = () => {
  return (
    <section 
      id="categories" 
      className="py-20 bg-background"
      aria-labelledby="categories-title"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 text-sm font-medium">
            Shop by Category
          </Badge>
          <h2 
            id="categories-title" 
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
          >
            Find Your Perfect
            <span className="block gradient-primary bg-clip-text text-transparent">
              Tech Category
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our comprehensive collection of cutting-edge electronics across all major categories
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {categories.map((category) => {
            const IconComponent = category.icon;
            
            return (
              <Card 
                key={category.id}
                className="group cursor-pointer gradient-card border-0 shadow-soft hover:shadow-large transition-all duration-500 hover:scale-105"
                role="button"
                tabIndex={0}
                aria-label={`Browse ${category.name} category with ${category.count} products`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    // Handle category navigation
                    console.log(`Navigate to ${category.name} category`);
                  }
                }}
              >
                <CardContent className="p-6 text-center">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  
                  {/* Category Name */}
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-3">
                    {category.description}
                  </p>
                  
                  {/* Product Count */}
                  <Badge variant="outline" className="text-xs">
                    {category.count} products
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Featured Category Banner */}
        <Card className="gradient-primary text-white border-0 shadow-large overflow-hidden relative">
          <CardContent className="p-8 md:p-12 relative z-10">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <Badge className="mb-4 bg-white/20 text-white border-white/30">
                  Limited Time Offer
                </Badge>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Gaming Week Special
                </h3>
                <p className="text-lg mb-6 opacity-90">
                  Up to 40% off on all gaming accessories, monitors, and peripherals. 
                  Upgrade your setup with premium gear from top brands.
                </p>
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="shadow-medium hover:shadow-large"
                >
                  Shop Gaming Deals
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/20">
                      <Gamepad2 className="h-8 w-8 mb-2" />
                      <p className="text-sm font-medium">Controllers</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/20">
                      <Monitor className="h-8 w-8 mb-2" />
                      <p className="text-sm font-medium">Monitors</p>
                    </div>
                  </div>
                  <div className="space-y-4 mt-8">
                    <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/20">
                      <Headphones className="h-8 w-8 mb-2" />
                      <p className="text-sm font-medium">Headsets</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/20">
                      <Laptop className="h-8 w-8 mb-2" />
                      <p className="text-sm font-medium">Gaming Laptops</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Categories;