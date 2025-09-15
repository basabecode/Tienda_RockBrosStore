import { useState, useEffect, useMemo } from 'react'
import { Search, X, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

interface Product {
  id: number
  name: string
  price: number
  category: string
  brand: string
  rating: number
  image: string
}

interface SearchFilters {
  category: string
  brand: string
  priceRange: [number, number]
  minRating: number
  inStock: boolean
}

interface SearchBarProps {
  products: Product[]
  onResultsChange: (results: Product[]) => void
}

export const SearchBar = ({ products, onResultsChange }: SearchBarProps) => {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({
    category: '',
    brand: '',
    priceRange: [0, 1000000],
    minRating: 0,
    inStock: false,
  })
  const [sortBy, setSortBy] = useState('name')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Obtener categorías y marcas únicas
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(p => p.category))]
    return uniqueCategories
  }, [products])

  const brands = useMemo(() => {
    const uniqueBrands = [...new Set(products.map(p => p.brand))]
    return uniqueBrands
  }, [products])

  // Filtrar y ordenar productos
  const filteredProducts = useMemo(() => {
    const results = products.filter(product => {
      // Búsqueda por texto
      const matchesQuery =
        query === '' ||
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        product.brand.toLowerCase().includes(query.toLowerCase())

      // Filtros
      const matchesCategory =
        !filters.category || product.category === filters.category
      const matchesBrand = !filters.brand || product.brand === filters.brand
      const matchesPrice =
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1]
      const matchesRating = product.rating >= filters.minRating

      return (
        matchesQuery &&
        matchesCategory &&
        matchesBrand &&
        matchesPrice &&
        matchesRating
      )
    })

    // Ordenar resultados
    results.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'rating':
          return b.rating - a.rating
        case 'name':
        default:
          return a.name.localeCompare(b.name)
      }
    })

    return results
  }, [products, query, filters, sortBy])

  // Notificar cambios en los resultados
  useEffect(() => {
    onResultsChange(filteredProducts)
  }, [filteredProducts, onResultsChange])

  const clearSearch = () => {
    setQuery('')
    setFilters({
      category: '',
      brand: '',
      priceRange: [0, 1000000],
      minRating: 0,
      inStock: false,
    })
    setSortBy('name')
  }

  const hasActiveFilters =
    filters.category ||
    filters.brand ||
    filters.minRating > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 1000000

  return (
    <div className="w-full space-y-4">
      {/* Barra de búsqueda principal */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Buscar productos, categorías, marcas..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuery('')}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Filtros */}
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="relative">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
              {hasActiveFilters && (
                <Badge
                  variant="destructive"
                  className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  !
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filtros de búsqueda</SheetTitle>
              <SheetDescription>
                Refina tu búsqueda con estos filtros
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-6 mt-6">
              {/* Categoría */}
              <div>
                <Label className="text-sm font-medium">Categoría</Label>
                <Select
                  value={filters.category}
                  onValueChange={value =>
                    setFilters({ ...filters, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las categorías" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas las categorías</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Marca */}
              <div>
                <Label className="text-sm font-medium">Marca</Label>
                <Select
                  value={filters.brand}
                  onValueChange={value =>
                    setFilters({ ...filters, brand: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las marcas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas las marcas</SelectItem>
                    {brands.map(brand => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Rango de precio */}
              <div>
                <Label className="text-sm font-medium">
                  Precio: ${filters.priceRange[0].toLocaleString()} - $
                  {filters.priceRange[1].toLocaleString()}
                </Label>
                <Slider
                  value={filters.priceRange}
                  onValueChange={value =>
                    setFilters({
                      ...filters,
                      priceRange: value as [number, number],
                    })
                  }
                  max={1000000}
                  min={0}
                  step={10000}
                  className="mt-2"
                />
              </div>

              {/* Rating mínimo */}
              <div>
                <Label className="text-sm font-medium">Rating mínimo</Label>
                <Select
                  value={filters.minRating.toString()}
                  onValueChange={value =>
                    setFilters({ ...filters, minRating: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Todos</SelectItem>
                    <SelectItem value="3">3+ estrellas</SelectItem>
                    <SelectItem value="4">4+ estrellas</SelectItem>
                    <SelectItem value="4.5">4.5+ estrellas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Botones */}
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={clearSearch}
                  variant="outline"
                  className="flex-1"
                >
                  Limpiar filtros
                </Button>
                <Button
                  onClick={() => setIsFilterOpen(false)}
                  className="flex-1"
                >
                  Aplicar
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Ordenar */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Nombre A-Z</SelectItem>
            <SelectItem value="price-low">Precio: Menor a Mayor</SelectItem>
            <SelectItem value="price-high">Precio: Mayor a Menor</SelectItem>
            <SelectItem value="rating">Mejor Rating</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Resultados y filtros activos */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {filteredProducts.length} producto
            {filteredProducts.length !== 1 ? 's' : ''} encontrado
            {filteredProducts.length !== 1 ? 's' : ''}
          </span>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearSearch}>
              <X className="h-4 w-4 mr-1" />
              Limpiar filtros
            </Button>
          )}
        </div>

        {/* Filtros activos */}
        <div className="flex gap-1">
          {filters.category && (
            <Badge variant="secondary">
              {filters.category}
              <X
                className="h-3 w-3 ml-1 cursor-pointer"
                onClick={() => setFilters({ ...filters, category: '' })}
              />
            </Badge>
          )}
          {filters.brand && (
            <Badge variant="secondary">
              {filters.brand}
              <X
                className="h-3 w-3 ml-1 cursor-pointer"
                onClick={() => setFilters({ ...filters, brand: '' })}
              />
            </Badge>
          )}
          {filters.minRating > 0 && (
            <Badge variant="secondary">
              {filters.minRating}+ estrellas
              <X
                className="h-3 w-3 ml-1 cursor-pointer"
                onClick={() => setFilters({ ...filters, minRating: 0 })}
              />
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}
