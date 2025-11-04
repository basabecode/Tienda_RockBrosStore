import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Filter,
  X,
  ChevronDown,
  Package,
  DollarSign,
  Award,
  Star,
  RefreshCw,
} from 'lucide-react'
import type { ProductFilters } from '@/hooks/use-product-search'

interface FilterSidebarProps {
  filters: ProductFilters
  filterStats: {
    totalProducts: number
    filteredCount: number
    availableCategories: string[]
    availableBrands: string[]
    priceRange: { min: number; max: number }
  }
  activeFiltersCount: number
  onFilterUpdate: <K extends keyof ProductFilters>(
    key: K,
    value: ProductFilters[K]
  ) => void
  onArrayToggle: <K extends keyof ProductFilters>(key: K, value: string) => void
  onClearFilters: () => void
  isOpen: boolean
  onToggle: () => void
}

export const FilterSidebar = ({
  filters,
  filterStats,
  activeFiltersCount,
  onFilterUpdate,
  onArrayToggle,
  onClearFilters,
  isOpen,
  onToggle,
}: FilterSidebarProps) => {
  const [priceRange, setPriceRange] = useState([
    filters.minPrice,
    filters.maxPrice,
  ])

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values)
    onFilterUpdate('minPrice', values[0])
    onFilterUpdate('maxPrice', values[1])
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        variant="outline"
        className="fixed top-1/2 left-0 z-50 -rotate-90 origin-bottom-left transform -translate-x-8 border-verde-neon/30 bg-gris-oscuro/90 text-verde-neon hover:bg-verde-neon/20"
      >
        <Filter className="h-4 w-4 mr-2" />
        Filtros
        {activeFiltersCount > 0 && (
          <Badge className="ml-2 bg-verde-neon text-gris-oscuro text-xs">
            {activeFiltersCount}
          </Badge>
        )}
      </Button>
    )
  }

  return (
    <div className="w-full lg:w-80 bg-gris-oscuro border-r border-gris-medio/30 lg:h-screen lg:sticky lg:top-0 overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gris-medio/30 bg-gris-oscuro/95 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-verde-neon" />
            <h2 className="text-lg font-semibold text-white">Filtros</h2>
            {activeFiltersCount > 0 && (
              <Badge className="bg-verde-neon/20 text-verde-neon border-verde-neon/30">
                {activeFiltersCount}
              </Badge>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-gris-medio hover:text-white p-1"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between text-sm mb-4">
          <span className="text-gris-medio">Productos:</span>
          <span className="text-verde-neon font-semibold">
            {filterStats.filteredCount} de {filterStats.totalProducts}
          </span>
        </div>

        {activeFiltersCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="w-full border-gris-medio/30 text-gris-medio hover:text-white hover:bg-gris-medio/20"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Limpiar todos los filtros
          </Button>
        )}
      </div>

      {/* Filtros */}
      <div className="p-4 space-y-4">
        {/* Categorías */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-white hover:text-verde-neon hover:bg-gris-medio/10 rounded">
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span className="font-medium">Categorías</span>
              {filters.categories.length > 0 && (
                <Badge className="bg-verde-neon/20 text-verde-neon border-verde-neon/30 text-xs">
                  {filters.categories.length}
                </Badge>
              )}
            </div>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-2 ml-6">
            {filterStats.availableCategories.map(category => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={filters.categories.includes(category)}
                  onCheckedChange={() => onArrayToggle('categories', category)}
                  className="border-gris-medio data-[state=checked]:bg-verde-neon data-[state=checked]:border-verde-neon"
                />
                <Label
                  htmlFor={`category-${category}`}
                  className="text-sm text-white hover:text-verde-neon cursor-pointer flex-1"
                >
                  {category}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Marcas */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-white hover:text-verde-neon hover:bg-gris-medio/10 rounded">
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4" />
              <span className="font-medium">Marcas</span>
              {filters.brands.length > 0 && (
                <Badge className="bg-verde-neon/20 text-verde-neon border-verde-neon/30 text-xs">
                  {filters.brands.length}
                </Badge>
              )}
            </div>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-2 ml-6">
            {filterStats.availableBrands.map(brand => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand}`}
                  checked={filters.brands.includes(brand)}
                  onCheckedChange={() => onArrayToggle('brands', brand)}
                  className="border-gris-medio data-[state=checked]:bg-verde-neon data-[state=checked]:border-verde-neon"
                />
                <Label
                  htmlFor={`brand-${brand}`}
                  className="text-sm text-white hover:text-verde-neon cursor-pointer flex-1"
                >
                  {brand}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Precio */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-white hover:text-verde-neon hover:bg-gris-medio/10 rounded">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span className="font-medium">Precio</span>
              {(filters.minPrice > filterStats.priceRange.min ||
                filters.maxPrice < filterStats.priceRange.max) && (
                <Badge className="bg-verde-neon/20 text-verde-neon border-verde-neon/30 text-xs">
                  Activo
                </Badge>
              )}
            </div>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 mt-2 ml-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gris-medio">
                <span>{formatPrice(filterStats.priceRange.min)}</span>
                <span>{formatPrice(filterStats.priceRange.max)}</span>
              </div>
              <Slider
                value={priceRange}
                onValueChange={handlePriceChange}
                max={filterStats.priceRange.max}
                min={filterStats.priceRange.min}
                step={10000}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-verde-neon font-semibold">
                <span>{formatPrice(priceRange[0])}</span>
                <span>{formatPrice(priceRange[1])}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-gris-medio">Mínimo</Label>
                <Input
                  type="number"
                  value={priceRange[0]}
                  onChange={e => {
                    const value = Number(e.target.value)
                    setPriceRange([value, priceRange[1]])
                    onFilterUpdate('minPrice', value)
                  }}
                  className="bg-gris-medio/20 border-gris-medio/30 text-white text-sm"
                />
              </div>
              <div>
                <Label className="text-xs text-gris-medio">Máximo</Label>
                <Input
                  type="number"
                  value={priceRange[1]}
                  onChange={e => {
                    const value = Number(e.target.value)
                    setPriceRange([priceRange[0], value])
                    onFilterUpdate('maxPrice', value)
                  }}
                  className="bg-gris-medio/20 border-gris-medio/30 text-white text-sm"
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Características */}
        <Collapsible>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-white hover:text-verde-neon hover:bg-gris-medio/10 rounded">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4" />
              <span className="font-medium">Características</span>
            </div>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-2 ml-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="in-stock"
                checked={filters.inStock}
                onCheckedChange={checked =>
                  onFilterUpdate('inStock', checked as boolean)
                }
                className="border-gris-medio data-[state=checked]:bg-verde-neon data-[state=checked]:border-verde-neon"
              />
              <Label
                htmlFor="in-stock"
                className="text-sm text-white hover:text-verde-neon cursor-pointer"
              >
                Solo en stock
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="on-sale"
                checked={filters.onSale}
                onCheckedChange={checked =>
                  onFilterUpdate('onSale', checked as boolean)
                }
                className="border-gris-medio data-[state=checked]:bg-verde-neon data-[state=checked]:border-verde-neon"
              />
              <Label
                htmlFor="on-sale"
                className="text-sm text-white hover:text-verde-neon cursor-pointer"
              >
                En oferta
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={filters.featured}
                onCheckedChange={checked =>
                  onFilterUpdate('featured', checked as boolean)
                }
                className="border-gris-medio data-[state=checked]:bg-verde-neon data-[state=checked]:border-verde-neon"
              />
              <Label
                htmlFor="featured"
                className="text-sm text-white hover:text-verde-neon cursor-pointer"
              >
                Destacados
              </Label>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  )
}

export default FilterSidebar
