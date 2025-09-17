import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { AdminPageLayout } from '@/components/AdminPageLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Package,
  DollarSign,
  Eye,
  EyeOff,
  Upload,
  Grid3X3,
  LayoutGrid,
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

const ProductManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [viewMode, setViewMode] = useState<'square' | 'rectangle'>('square')
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
  })

  // Image upload state
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
  const [isUploadingImages, setIsUploadingImages] = useState(false)

  // Fetch products
  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products', searchTerm, selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`)
      }

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory)
      }

      const { data, error } = await query
      if (error) throw error
      return data as Product[]
    },
  })

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('category')
        .not('category', 'is', null)

      if (error) throw error

      const uniqueCategories = [...new Set(data.map(item => item.category))]
      return uniqueCategories
    },
  })

  // Create/Update product mutation
  const productMutation = useMutation({
    mutationFn: async (
      productData: Omit<Product, 'id' | 'rating' | 'created_at'>
    ) => {
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
    })
    setEditingProduct(null)
    setSelectedImages([])
    setImagePreviewUrls([])
  }

  // Handle image file selection
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])

    if (files.length > 2) {
      toast({
        title: 'Error',
        description: 'Solo puedes subir máximo 2 imágenes por producto',
        variant: 'destructive',
      })
      return
    }

    setSelectedImages(files)

    // Create preview URLs
    const previewUrls = files.map(file => URL.createObjectURL(file))
    setImagePreviewUrls(previewUrls)
  }

  // Remove selected image
  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index)
    const newPreviewUrls = imagePreviewUrls.filter((_, i) => i !== index)

    setSelectedImages(newImages)
    setImagePreviewUrls(newPreviewUrls)
  }

  // Upload images to Supabase Storage
  const uploadImages = async (images: File[]): Promise<string[]> => {
    setIsUploadingImages(true)

    try {
      const { uploadMultipleImages } = await import('@/lib/imageUpload')
      const results = await uploadMultipleImages(images, 'products')

      // Verificar si hay errores en la subida
      const errors = results.filter(result => result.error)
      if (errors.length > 0) {
        throw new Error(
          `Error subiendo imágenes: ${errors.map(e => e.error).join(', ')}`
        )
      }

      // Retornar URLs exitosas
      return results.map(result => result.url)
    } catch (error) {
      console.error('Error uploading images:', error)
      throw error
    } finally {
      setIsUploadingImages(false)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      brand: product.brand,
      stock: product.stock.toString(),
      main_image: product.main_image,
      is_active: product.is_active,
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      let mainImage = formData.main_image

      // If there are selected images, upload them first
      if (selectedImages.length > 0) {
        const uploadedUrls = await uploadImages(selectedImages)
        mainImage = uploadedUrls[0] // Use the first uploaded image as the main image
      }

      const now = new Date().toISOString()
      const productData: Omit<Product, 'id' | 'created_at' | 'rating'> = {
        name: formData.name,
        slug: formData.name
          .toLowerCase()
          .replace(/ /g, '-')
          .replace(/[^\w-]+/g, ''),
        description: formData.description || '',
        price: parseFloat(formData.price),
        compare_price: null,
        main_image: mainImage,
        images: selectedImages.length > 0 ? [mainImage] : null,
        category: formData.category,
        brand: formData.brand,
        stock: parseInt(formData.stock),
        min_stock: 0,
        weight: null,
        dimensions: null,
        material: null,
        color: null,
        size: null,
        tags: null,
        is_featured: false,
        is_active: formData.is_active,
        sort_order: 0,
        review_count: 0,
        sold_count: 0,
        updated_at: now,
      }

      productMutation.mutate(productData)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al subir las imágenes. Inténtalo de nuevo.',
        variant: 'destructive',
      })
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <AdminPageLayout
      title="Gestión de Productos"
      description="Administra el catálogo completo de productos de RockBros"
      icon={Package}
      actions={
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Producto
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del producto *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={e =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Ej: Bicicleta de montaña Pro"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">Marca *</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={e =>
                      setFormData({ ...formData, brand: e.target.value })
                    }
                    placeholder="Ej: RockBros"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={e =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe las características del producto..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Precio ($ COP) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={e =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="99.99"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoría *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={value =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bicicletas">Bicicletas</SelectItem>
                      <SelectItem value="componentes">Componentes</SelectItem>
                      <SelectItem value="accesorios">Accesorios</SelectItem>
                      <SelectItem value="ropa">Ropa</SelectItem>
                      <SelectItem value="herramientas">Herramientas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Stock *</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={e =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    placeholder="10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Imágenes del producto (máximo 2)</Label>

                {/* Image Upload Input */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="image-upload"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Haz clic para subir imágenes o arrastra y suelta
                    </span>
                    <span className="text-xs text-gray-500">
                      PNG, JPG, GIF hasta 10MB cada una
                    </span>
                  </label>
                </div>

                {/* Image Previews */}
                {imagePreviewUrls.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 h-6 w-6 p-0"
                        >
                          ×
                        </Button>
                        <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                          Imagen {index + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Fallback URL Input */}
                <div className="space-y-2">
                  <Label htmlFor="main_image">
                    O ingresa URL de imagen (opcional)
                  </Label>
                  <Input
                    id="main_image"
                    value={formData.main_image}
                    onChange={e =>
                      setFormData({ ...formData, main_image: e.target.value })
                    }
                    placeholder="https://ejemplo.com/imagen.jpg"
                    disabled={selectedImages.length > 0}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={e =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                  className="rounded"
                />
                <Label htmlFor="is_active">Producto activo</Label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={productMutation.isPending || isUploadingImages}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                >
                  {isUploadingImages
                    ? 'Subiendo imágenes...'
                    : productMutation.isPending
                    ? 'Guardando...'
                    : editingProduct
                    ? 'Actualizar'
                    : 'Crear'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="space-y-6">
        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories?.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* View Mode Toggle */}
              <div className="flex border rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === 'square' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('square')}
                  className="rounded-none border-0"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'rectangle' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('rectangle')}
                  className="rounded-none border-0"
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div
          className={
            viewMode === 'square'
              ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3'
              : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
          }
        >
          {products?.map(product => (
            <Card
              key={product.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardContent className={viewMode === 'square' ? 'p-2' : 'p-4'}>
                {viewMode === 'square' ? (
                  // Vista Cuadrada (Compacta)
                  <>
                    <div className="aspect-square bg-gray-100 rounded-lg mb-2 overflow-hidden">
                      {product.main_image ? (
                        <img
                          src={product.main_image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-semibold text-xs text-gray-900 line-clamp-2 leading-tight">
                          {product.name}
                        </h3>
                        <Badge
                          variant={product.is_active ? 'default' : 'secondary'}
                          className="text-xs px-1 py-0 ml-1 flex-shrink-0"
                        >
                          {product.is_active ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-center mb-1">
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-3 h-3 text-green-600" />
                          <span className="font-bold text-sm text-green-600">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Stock: {product.stock}</span>
                        <span className="capitalize text-xs truncate ml-1">
                          {product.category}
                        </span>
                      </div>

                      <div className="flex flex-col space-y-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(product)}
                          className="w-full h-6 text-xs"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (
                              confirm(
                                '¿Estás seguro de que quieres eliminar este producto?'
                              )
                            ) {
                              deleteMutation.mutate(product.id)
                            }
                          }}
                          className="w-full h-6 text-xs text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  // Vista Rectangular (Detallada)
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {product.main_image ? (
                        <img
                          src={product.main_image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                          {product.name}
                        </h3>
                        <Badge
                          variant={product.is_active ? 'default' : 'secondary'}
                        >
                          {product.is_active ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="font-bold text-lg text-green-600">
                            {formatPrice(product.price)}
                          </span>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Stock: {product.stock}</span>
                          <span className="capitalize">{product.category}</span>
                          <span className="text-gray-500">
                            Marca: {product.brand}
                          </span>
                        </div>
                      </div>

                      <div className="flex space-x-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(product)}
                          className="flex-1"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (
                              confirm(
                                '¿Estás seguro de que quieres eliminar este producto?'
                              )
                            ) {
                              deleteMutation.mutate(product.id)
                            }
                          }}
                          className="flex-1 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {products?.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-gray-600">
                  {searchTerm || selectedCategory !== 'all'
                    ? 'Intenta ajustar los filtros de búsqueda'
                    : 'Comienza creando tu primer producto'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminPageLayout>
  )
}

export default ProductManagement
