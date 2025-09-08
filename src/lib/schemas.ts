import { z } from 'zod'

// Esquemas para productos
export const productSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(255, 'El nombre es demasiado largo'),
  description: z.string().optional(),
  price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
  stock: z
    .number()
    .int()
    .min(0, 'El stock debe ser mayor o igual a 0')
    .default(0),
  category: z.string().optional(),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  images: z.array(z.string().url('URL de imagen inválida')).optional(),
  is_featured: z.boolean().default(false),
  status: z.enum(['active', 'archived']).default('active'),
  brand: z.string().optional(),
  specifications: z.record(z.any()).optional(),
})

export const productUpdateSchema = productSchema.partial()

// Esquemas para órdenes
export const orderItemSchema = z.object({
  product_id: z.string().uuid('ID de producto inválido'),
  quantity: z.number().int().min(1, 'La cantidad debe ser al menos 1'),
  price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
  size: z.string().optional(),
  color: z.string().optional(),
})

export const addressSchema = z.object({
  full_name: z.string().min(1, 'El nombre completo es requerido'),
  phone: z.string().min(1, 'El teléfono es requerido'),
  address_line1: z.string().min(1, 'La dirección es requerida'),
  address_line2: z.string().optional(),
  city: z.string().min(1, 'La ciudad es requerida'),
  region: z.string().min(1, 'El departamento es requerido'),
  postal_code: z.string().min(1, 'El código postal es requerido'),
  country: z.string().default('Colombia'),
  is_default_shipping: z.boolean().default(false),
  is_default_billing: z.boolean().default(false),
})

export const orderSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'Debe incluir al menos un item'),
  shipping_address: addressSchema.optional(),
  billing_address: addressSchema.optional(),
})

// Esquemas para perfiles
export const profileSchema = z.object({
  full_name: z.string().optional(),
  phone: z.string().optional(),
  avatar_url: z.string().url('URL de avatar inválida').optional(),
})

export const profileUpdateSchema = profileSchema.partial()

// Esquemas para autenticación
export const signUpSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  full_name: z.string().min(1, 'El nombre completo es requerido'),
})

export const signInSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

// Esquemas para filtros y consultas
export const productFiltersSchema = z.object({
  category: z.string().optional(),
  brand: z.string().optional(),
  min_price: z.number().min(0).optional(),
  max_price: z.number().min(0).optional(),
  is_featured: z.boolean().optional(),
  status: z.enum(['active', 'archived']).optional(),
  search: z.string().optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(12),
  sort: z.enum(['name', 'price', 'created_at']).default('created_at'),
  order: z.enum(['asc', 'desc']).default('desc'),
})

export const orderFiltersSchema = z.object({
  status: z
    .enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])
    .optional(),
  user_id: z.string().uuid().optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(10),
  sort: z.enum(['created_at', 'total']).default('created_at'),
  order: z.enum(['asc', 'desc']).default('desc'),
})

// Esquemas para subida de archivos
export const uploadFileSchema = z.object({
  file: z.instanceof(File),
  path: z.string().optional(),
})

// Types inferidos de los esquemas
export type ProductInput = z.infer<typeof productSchema>
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>
export type OrderInput = z.infer<typeof orderSchema>
export type OrderItemInput = z.infer<typeof orderItemSchema>
export type AddressInput = z.infer<typeof addressSchema>
export type ProfileInput = z.infer<typeof profileSchema>
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>
export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type ProductFilters = z.infer<typeof productFiltersSchema>
export type OrderFilters = z.infer<typeof orderFiltersSchema>
export type UploadFileInput = z.infer<typeof uploadFileSchema>
