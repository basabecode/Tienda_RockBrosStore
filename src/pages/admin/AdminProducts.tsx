import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import {
  ROCKBROS_CATEGORIES,
  getCategoryNames,
  getCategoryByName,
  isValidCategory,
} from '@/lib/constants/categories'
import {
  Package,
  Plus,
  Search,
  Edit,
  Eye,
  Trash2,
  Filter,
  Grid,
  List,
  Upload,
  Loader2,
  DollarSign,
  Star,
  Package2,
  TrendingUp,
  AlertTriangle,
  MoreHorizontal,
  ArrowUpDown,
  X,
  CheckCircle,
  XCircle,
  ShoppingCart,
} from 'lucide-react'

interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  compare_price: number | null
  main_image: string | null
  images: string[] | null
  category: string
  brand: string
  stock: number
  min_stock: number
  weight: number | null
  dimensions: string | null
  material: string | null
  color: string | null
  size: string | null
  tags: string[] | null
  is_featured: boolean
  is_active: boolean
  sort_order: number
  rating: number
  review_count: number
  sold_count: number
  created_at: string
  updated_at: string
}

interface FilterState {
  category: string
  brand: string
  status: string
  stock: string
  featured: string
}

const AdminProducts = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [sortBy, setSortBy] = useState('updated_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    brand: 'all',
    status: 'all',
    stock: 'all',
    featured: 'all',
  })
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    brand: '',
    stock: '',
    main_image: '',
    is_active: true,
    is_featured: false,
  })

  // Image upload state
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
  const [isUploadingImages, setIsUploadingImages] = useState(false)

  // Fetch products with filters and search
  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['admin-products', searchTerm, filters, sortBy, sortOrder],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*')
        .order(sortBy, { ascending: sortOrder === 'asc' })

      if (searchTerm) {
        query = query.or(
          `name.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%,tags.ilike.%${searchTerm}%`
        )
      }

      if (filters.category !== 'all') {
        query = query.eq('category', filters.category)
      }

      if (filters.brand !== 'all') {
        query = query.eq('brand', filters.brand)
      }

      if (filters.status !== 'all') {
        query = query.eq('is_active', filters.status === 'active')
      }

      if (filters.featured !== 'all') {
        query = query.eq('is_featured', filters.featured === 'featured')
      }

      if (filters.stock === 'low') {
        query = query.lte('stock', 10)
      } else if (filters.stock === 'out') {
        query = query.eq('stock', 0)
      }

      const { data, error } = await query
      if (error) throw error
      return data as Product[]
    },
  })

  // Get unique brands for filter
  const { data: brands = [] } = useQuery({
    queryKey: ['product-brands'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('brand')
        .neq('brand', null)
      if (error) throw error
      const uniqueBrands = [...new Set(data.map(item => item.brand))]
      return uniqueBrands.sort()
    },
  })

  // Save product mutation
  const saveMutation = useMutation({
    mutationFn: async (productData: Partial<Product>) => {
      if (editingProduct) {
        const { data, error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id)
          .select()
        if (error) throw error
        return data
      } else {
        const { data, error } = await supabase
          .from('products')
          .insert([productData])
          .select()
        if (error) throw error
        return data
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      toast({
        title: editingProduct ? 'Producto actualizado' : 'Producto creado',
        description: `El producto ha sido ${
          editingProduct ? 'actualizado' : 'creado'
        } exitosamente.`,
      })
      resetForm()
      setIsDialogOpen(false)
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description:
          error.message || 'Ha ocurrido un error al guardar el producto.',
        variant: 'destructive',
      })
    },
  })

  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      toast({
        title: 'Producto eliminado',
        description: 'El producto ha sido eliminado exitosamente.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description:
          error.message || 'Ha ocurrido un error al eliminar el producto.',
        variant: 'destructive',
      })
    },
  })

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      brand: '',
      stock: '',
      main_image: '',
      is_active: true,
      is_featured: false,
    })
    setEditingProduct(null)
    setSelectedImages([])
    setImagePreviewUrls([])
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category,
      brand: product.brand,
      stock: product.stock.toString(),
      main_image: product.main_image || '',
      is_active: product.is_active,
      is_featured: product.is_featured,
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.name ||
      !formData.price ||
      !formData.category ||
      !formData.brand
    ) {
      toast({
        title: 'Error de validación',
        description: 'Por favor, completa todos los campos requeridos.',
        variant: 'destructive',
      })
      return
    }

    const productData: Partial<Product> & { created_at?: string } = {
      name: formData.name.trim(),
      description: formData.description.trim() || null,
      price: parseFloat(formData.price),
      category: formData.category,
      brand: formData.brand,
      stock: parseInt(formData.stock) || 0,
      main_image: formData.main_image || null,
      is_active: formData.is_active,
      is_featured: formData.is_featured,
      slug: formData.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, ''),
      updated_at: new Date().toISOString(),
    }

    if (!editingProduct) {
      productData.created_at = new Date().toISOString()
    }

    saveMutation.mutate(productData)
  }

  const clearFilters = () => {
    setFilters({
      category: 'all',
      brand: 'all',
      status: 'all',
      stock: 'all',
      featured: 'all',
    })
    setSearchTerm('')
  }

  const getStatusBadge = (product: Product) => {
    if (!product.is_active) {
      return (
        <Badge
          variant="secondary"
          className="bg-red-100 text-red-800 hover:bg-red-100"
        >
          <XCircle className="w-3 h-3 mr-1" />
          Inactivo
        </Badge>
      )
    }
    if (product.stock === 0) {
      return (
        <Badge variant="destructive" className="bg-red-500 hover:bg-red-600">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Sin Stock
        </Badge>
      )
    }
    if (product.stock <= 10) {
      return (
        <Badge
          variant="secondary"
          className="bg-amber-100 text-amber-800 hover:bg-amber-100"
        >
          <AlertTriangle className="w-3 h-3 mr-1" />
          Stock Bajo
        </Badge>
      )
    }
    return (
      <Badge
        variant="secondary"
        className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
      >
        <CheckCircle className="w-3 h-3 mr-1" />
        Activo
      </Badge>
    )
  }

  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="group bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header con imagen y acciones */}
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16 rounded-xl border-2 border-gray-100 group-hover:border-emerald-200 transition-colors">
              <AvatarImage
                src={product.main_image || ''}
                alt={product.name}
                className="object-cover"
              />
              <AvatarFallback className="rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-700">
                <Package2 className="w-8 h-8" />
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-gray-900 truncate group-hover:text-emerald-700 transition-colors text-lg">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 font-medium mt-1">
                    {product.brand}
                  </p>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-white border-gray-200"
                  >
                    <DropdownMenuLabel className="text-gray-900">
                      Acciones
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleEdit(product)}
                      className="cursor-pointer hover:bg-emerald-50 focus:bg-emerald-50"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer hover:bg-emerald-50 focus:bg-emerald-50">
                      <Eye className="w-4 h-4 mr-2" />
                      Ver detalles
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => deleteMutation.mutate(product.id)}
                      className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 focus:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Badges de estado y destacado */}
          <div className="flex items-center gap-2 flex-wrap">
            {getStatusBadge(product)}
            {product.is_featured && (
              <Badge
                variant="secondary"
                className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200"
              >
                <Star className="w-3 h-3 mr-1" />
                Destacado
              </Badge>
            )}
          </div>

          {/* Métricas del producto */}
          <div className="grid grid-cols-3 gap-4 pt-2 border-t border-gray-100">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-medium text-gray-600">
                  Precio
                </span>
              </div>
              <p className="font-bold text-emerald-600 text-lg">
                {formatCurrency(product.price)}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Package className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-gray-600">Stock</span>
              </div>
              <p className="font-bold text-gray-900">{product.stock}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <ShoppingCart className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-medium text-gray-600">
                  Vendidos
                </span>
              </div>
              <p className="font-bold text-gray-900">
                {product.sold_count || 0}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const ProductListItem = ({ product }: { product: Product }) => (
    <div className="group border-b border-gray-100 hover:bg-emerald-50/30 transition-colors">
      <div className="flex items-center gap-4 p-4">
        <Avatar className="w-12 h-12 rounded-xl border-2 border-gray-100 group-hover:border-emerald-200 transition-colors">
          <AvatarImage
            src={product.main_image || ''}
            alt={product.name}
            className="object-cover"
          />
          <AvatarFallback className="rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-700">
            <Package2 className="w-6 h-6" />
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 truncate group-hover:text-emerald-700 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 font-medium">{product.brand}</p>
        </div>

        <div className="text-center w-32 flex-shrink-0">
          <p className="text-xs text-gray-500 font-medium mb-1">Categoría</p>
          <Badge
            variant="outline"
            className="border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-50 text-xs"
          >
            {getCategoryByName(product.category)?.name || product.category}
          </Badge>
        </div>

        <div className="text-center w-24 flex-shrink-0">
          <p className="text-xs text-gray-500 font-medium mb-1">Precio</p>
          <p className="font-bold text-emerald-600">
            {formatCurrency(product.price)}
          </p>
        </div>

        <div className="text-center w-20 flex-shrink-0">
          <p className="text-xs text-gray-500 font-medium mb-1">Stock</p>
          <p className="font-bold text-gray-900">{product.stock}</p>
        </div>

        <div className="text-center w-24 flex-shrink-0">
          <p className="text-xs text-gray-500 font-medium mb-1">Estado</p>
          {getStatusBadge(product)}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-gray-50 w-10 flex-shrink-0"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white border-gray-200">
            <DropdownMenuLabel className="text-gray-900">
              Acciones
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleEdit(product)}
              className="cursor-pointer hover:bg-emerald-50 focus:bg-emerald-50"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-emerald-50 focus:bg-emerald-50">
              <Eye className="w-4 h-4 mr-2" />
              Ver detalles
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => deleteMutation.mutate(product.id)}
              className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 focus:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error al cargar productos
          </h3>
          <p className="text-gray-600">
            Ha ocurrido un error al cargar la lista de productos.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header con paleta corporativa RockBros */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-verde-bosque to-verde-neon rounded-xl flex items-center justify-center shadow-lg">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gris-oscuro leading-tight">
              Gestión de Productos
            </h1>
            <p className="text-gris-medio font-medium">
              Administra tu catálogo completo de productos RockBros
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Contenedor de acciones */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div></div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={resetForm}
                className="bg-gradient-to-br from-verde-bosque to-verde-neon hover:from-verde-bosque/90 hover:to-verde-neon/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nuevo Producto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-gris-oscuro flex items-center space-x-2">
                  <Package className="h-5 w-5 text-verde-bosque" />
                  <span>
                    {editingProduct
                      ? 'Editar Producto'
                      : 'Crear Nuevo Producto'}
                  </span>
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Nombre del Producto *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={e =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Ingresa el nombre del producto"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="price" className="text-sm font-medium">
                      Precio *
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={e =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      placeholder="0"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="stock" className="text-sm font-medium">
                      Stock
                    </Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={e =>
                        setFormData({ ...formData, stock: e.target.value })
                      }
                      placeholder="0"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category" className="text-sm font-medium">
                      Categoría *
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={value =>
                        setFormData({ ...formData, category: value })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {ROCKBROS_CATEGORIES.map(category => (
                          <SelectItem key={category.slug} value={category.slug}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="brand" className="text-sm font-medium">
                      Marca *
                    </Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={e =>
                        setFormData({ ...formData, brand: e.target.value })
                      }
                      placeholder="Ingresa la marca"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="main_image" className="text-sm font-medium">
                      URL Imagen Principal
                    </Label>
                    <Input
                      id="main_image"
                      value={formData.main_image}
                      onChange={e =>
                        setFormData({ ...formData, main_image: e.target.value })
                      }
                      placeholder="https://ejemplo.com/imagen.jpg"
                      className="mt-1"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label
                      htmlFor="description"
                      className="text-sm font-medium"
                    >
                      Descripción
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Describe el producto..."
                      className="mt-1 min-h-[100px]"
                    />
                  </div>

                  <div className="flex items-center space-x-6 md:col-span-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="is_active"
                        checked={formData.is_active}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            is_active: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <Label
                        htmlFor="is_active"
                        className="text-sm font-medium"
                      >
                        Producto activo
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="is_featured"
                        checked={formData.is_featured}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            is_featured: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <Label
                        htmlFor="is_featured"
                        className="text-sm font-medium"
                      >
                        Producto destacado
                      </Label>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={saveMutation.isPending}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    {saveMutation.isPending && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    {editingProduct ? 'Actualizar' : 'Crear'} Producto
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filtros y Búsqueda */}
        <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Barra de búsqueda */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar productos, marcas o etiquetas..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10 h-11 border-gray-200 focus:border-emerald-300 focus:ring-emerald-200 bg-white"
                  />
                </div>
              </div>

              {/* Controles de filtro */}
              <div className="flex flex-wrap gap-3">
                <Select
                  value={filters.category}
                  onValueChange={value =>
                    setFilters({ ...filters, category: value })
                  }
                >
                  <SelectTrigger className="w-40 bg-white border-gray-300 text-gray-900 hover:border-gray-400 hover:bg-gray-50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-colors">
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300 shadow-lg">
                    <SelectItem
                      value="all"
                      className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
                    >
                      categorías
                    </SelectItem>
                    {ROCKBROS_CATEGORIES.map(category => (
                      <SelectItem
                        key={category.slug}
                        value={category.slug}
                        className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.brand}
                  onValueChange={value =>
                    setFilters({ ...filters, brand: value })
                  }
                >
                  <SelectTrigger className="w-36 bg-white border-gray-300 text-gray-900 hover:border-gray-400 hover:bg-gray-50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-colors">
                    <SelectValue placeholder="Marca" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300 shadow-lg">
                    <SelectItem
                      value="all"
                      className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
                    >
                      Marcas
                    </SelectItem>
                    {brands.map(brand => (
                      <SelectItem
                        key={brand}
                        value={brand}
                        className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
                      >
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.status}
                  onValueChange={value =>
                    setFilters({ ...filters, status: value })
                  }
                >
                  <SelectTrigger className="w-32 bg-white border-gray-300 text-gray-900 hover:border-gray-400 hover:bg-gray-50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-colors">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300 shadow-lg">
                    <SelectItem
                      value="all"
                      className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
                    >
                      Estado
                    </SelectItem>
                    <SelectItem
                      value="active"
                      className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
                    >
                      Activos
                    </SelectItem>
                    <SelectItem
                      value="inactive"
                      className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
                    >
                      Inactivos
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.stock}
                  onValueChange={value =>
                    setFilters({ ...filters, stock: value })
                  }
                >
                  <SelectTrigger className="w-32 bg-white border-gray-300 text-gray-900 hover:border-gray-400 hover:bg-gray-50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-colors">
                    <SelectValue placeholder="Stock" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300 shadow-lg">
                    <SelectItem
                      value="all"
                      className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
                    >
                      Stock
                    </SelectItem>
                    <SelectItem
                      value="low"
                      className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
                    >
                      Stock bajo
                    </SelectItem>
                    <SelectItem
                      value="out"
                      className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
                    >
                      Sin stock
                    </SelectItem>
                  </SelectContent>
                </Select>

                {(searchTerm ||
                  Object.values(filters).some(f => f !== 'all')) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="px-3 bg-white border-gray-300 text-gray-700 hover:border-red-400 hover:bg-red-50 hover:text-red-700 transition-colors font-medium"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Limpiar
                  </Button>
                )}
              </div>

              {/* Modo de vista y ordenamiento */}
              <div className="flex items-center gap-2 border-l border-gray-300 pl-4">
                <div className="flex rounded-lg border border-gray-300 bg-gray-500">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={
                      viewMode === 'grid'
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'hover:bg-gray-50'
                    }
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={
                      viewMode === 'list'
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'hover:bg-gray-50'
                    }
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>

                <Select
                  value={`${sortBy}-${sortOrder}`}
                  onValueChange={value => {
                    const [field, order] = value.split('-')
                    setSortBy(field)
                    setSortOrder(order as 'asc' | 'desc')
                  }}
                >
                  <SelectTrigger className="w-44 bg-white border-gray-300 text-gray-900 hover:border-gray-400 hover:bg-gray-50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-colors">
                    <ArrowUpDown className="w-4 h-4 mr-2 text-gray-600" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300 shadow-lg">
                    <SelectItem
                      value="updated_at-desc"
                      className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
                    >
                      Más reciente
                    </SelectItem>
                    <SelectItem
                      value="updated_at-asc"
                      className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
                    >
                      Más antiguo
                    </SelectItem>
                    <SelectItem
                      value="name-asc"
                      className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
                    >
                      Nombre A-Z
                    </SelectItem>
                    <SelectItem
                      value="name-desc"
                      className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
                    >
                      Nombre Z-A
                    </SelectItem>
                    <SelectItem
                      value="price-asc"
                      className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
                    >
                      Precio menor
                    </SelectItem>
                    <SelectItem
                      value="price-desc"
                      className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
                    >
                      Precio mayor
                    </SelectItem>
                    <SelectItem
                      value="stock-asc"
                      className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
                    >
                      Stock menor
                    </SelectItem>
                    <SelectItem
                      value="stock-desc"
                      className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
                    >
                      Stock mayor
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumen de resultados */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium text-gray-900">
                    {isLoading
                      ? 'Cargando productos...'
                      : `${products.length} producto${
                          products.length !== 1 ? 's' : ''
                        } ${
                          products.length !== 1 ? 'encontrados' : 'encontrado'
                        }`}
                  </span>
                </div>
                {!isLoading && products.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                  >
                    {viewMode === 'grid'
                      ? 'Visual tipo rejilla'
                      : 'Visual tipo lista'}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products List/Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-4" />
              <p className="text-gray-600">Cargando productos...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="py-16">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  No se encontraron productos
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  No hay productos que coincidan con los filtros seleccionados.
                  Intenta ajustar los criterios de búsqueda.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    className="border-gray-300 hover:border-emerald-400 hover:bg-emerald-50"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Limpiar filtros
                  </Button>
                  <Button
                    onClick={resetForm}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar producto
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-0">
              <div className="border-b border-gray-200 p-4 bg-emerald-50/30">
                <div className="flex items-center gap-4 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  <div className="w-12"></div>
                  <div className="flex-1">Producto</div>
                  <div className="text-center w-32">Categoría</div>
                  <div className="text-center w-24">Precio</div>
                  <div className="text-center w-20">Stock</div>
                  <div className="text-center w-24">Estado</div>
                  <div className="w-10"></div>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {products.map(product => (
                  <ProductListItem key={product.id} product={product} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default AdminProducts
