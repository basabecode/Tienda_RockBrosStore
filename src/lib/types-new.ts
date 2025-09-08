// Database types for Supabase integration

// Specific types for better type safety
export interface ProductSpecifications {
  weight?: number
  dimensions?: {
    width: number
    height: number
    depth: number
  }
  material?: string
  color_options?: string[]
  size_guide?: Record<string, string>
  warranty?: string
  features?: string[]
  [key: string]: unknown
}

// Main Database interface - EXPORTED for Supabase client
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          email: string
          full_name: string | null
          phone: string | null
          is_admin: boolean
          avatar_url: string | null
        }
        Insert: {
          id: string
          created_at?: string
          email: string
          full_name?: string | null
          phone?: string | null
          is_admin?: boolean
          avatar_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          is_admin?: boolean
          avatar_url?: string | null
        }
      }
      products: {
        Row: {
          id: string
          created_at: string
          title: string | null // Columna original para compatibilidad
          name: string
          slug: string | null
          description: string | null
          price: number
          currency: string
          stock: number
          category: string | null
          sizes: string[] | null
          colors: string[] | null
          images: string[] | null
          is_featured: boolean
          status: 'active' | 'archived'
          brand: string | null
          specifications: ProductSpecifications | null
        }
        Insert: {
          id?: string
          created_at?: string
          title?: string | null
          name: string
          slug?: string | null
          description?: string | null
          price: number
          currency?: string
          stock?: number
          category?: string | null
          sizes?: string[] | null
          colors?: string[] | null
          images?: string[] | null
          is_featured?: boolean
          status?: 'active' | 'archived'
          brand?: string | null
          specifications?: ProductSpecifications | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string | null
          name?: string
          slug?: string | null
          description?: string | null
          price?: number
          currency?: string
          stock?: number
          category?: string | null
          sizes?: string[] | null
          colors?: string[] | null
          images?: string[] | null
          is_featured?: boolean
          status?: 'active' | 'archived'
          brand?: string | null
          specifications?: ProductSpecifications | null
        }
      }
      addresses: {
        Row: {
          id: string
          created_at: string
          user_id: string
          name: string
          street: string
          city: string
          state: string
          postal_code: string
          country: string
          is_default: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          name: string
          street: string
          city: string
          state: string
          postal_code: string
          country?: string
          is_default?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          name?: string
          street?: string
          city?: string
          state?: string
          postal_code?: string
          country?: string
          is_default?: boolean
        }
      }
      orders: {
        Row: {
          id: string
          created_at: string
          user_id: string
          status:
            | 'pending'
            | 'confirmed'
            | 'shipped'
            | 'delivered'
            | 'cancelled'
          total: number
          currency: string
          shipping_address_id: string | null
          notes: string | null
          tracking_number: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          status?:
            | 'pending'
            | 'confirmed'
            | 'shipped'
            | 'delivered'
            | 'cancelled'
          total: number
          currency?: string
          shipping_address_id?: string | null
          notes?: string | null
          tracking_number?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          status?:
            | 'pending'
            | 'confirmed'
            | 'shipped'
            | 'delivered'
            | 'cancelled'
          total?: number
          currency?: string
          shipping_address_id?: string | null
          notes?: string | null
          tracking_number?: string | null
        }
      }
      order_items: {
        Row: {
          id: string
          created_at: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
          total_price: number
          size: string | null
          color: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
          total_price: number
          size?: string | null
          color?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          order_id?: string
          product_id?: string
          quantity?: number
          unit_price?: number
          total_price?: number
          size?: string | null
          color?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Type exports for easier usage
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type Product = Database['public']['Tables']['products']['Row']
export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type ProductUpdate = Database['public']['Tables']['products']['Update']

export type Address = Database['public']['Tables']['addresses']['Row']
export type AddressInsert = Database['public']['Tables']['addresses']['Insert']
export type AddressUpdate = Database['public']['Tables']['addresses']['Update']

export type Order = Database['public']['Tables']['orders']['Row']
export type OrderInsert = Database['public']['Tables']['orders']['Insert']
export type OrderUpdate = Database['public']['Tables']['orders']['Update']

export type OrderItem = Database['public']['Tables']['order_items']['Row']
export type OrderItemInsert =
  Database['public']['Tables']['order_items']['Insert']
export type OrderItemUpdate =
  Database['public']['Tables']['order_items']['Update']

// Additional useful types
export type ProductStatus = 'active' | 'archived'
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

// Form validation types
export interface ProductForm {
  name: string
  description?: string
  price: number
  stock: number
  category?: string
  brand?: string
  is_featured: boolean
  status: ProductStatus
  images?: string[]
  sizes?: string[]
  colors?: string[]
}

export interface AddressForm {
  name: string
  street: string
  city: string
  state: string
  postal_code: string
  country: string
  is_default: boolean
}

// API Response types
export interface ApiResponse<T = unknown> {
  data: T | null
  error: unknown | null
}

// Auth types
export interface AuthUser {
  id: string
  email: string
  full_name?: string
  is_admin: boolean
  avatar_url?: string
}

// Cart types
export interface CartItem {
  id: string
  product: Product
  quantity: number
  size?: string
  color?: string
  unit_price: number
  total_price: number
}

export interface Cart {
  items: CartItem[]
  total: number
  itemCount: number
}
