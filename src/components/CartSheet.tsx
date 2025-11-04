import React, { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useNavigate } from 'react-router-dom'
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Truck,
} from 'lucide-react'
import { useCart } from '@/hooks/use-cart.tsx'
import { useCartQuery } from '@/hooks/use-cart-query'
import { useAuth } from '@/hooks/use-auth'
import { AuthDialog } from './AuthDialog'
import { toast } from '@/hooks/use-toast'

interface CartItemProps {
  item: {
    id: string
    name: string
    price: number
    quantity: number
    size?: string
    color?: string
    image?: string
  }
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
  getItemKey: (item: CartItemProps['item']) => string
}

function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  getItemKey,
}: CartItemProps) {
  // Implementación correcta para obtener la clave única del item
  // Esta función ya se recibe como prop desde CartSheet

  return (
    <div className="flex items-start space-x-4 py-4">
      <div className="flex-shrink-0">
        <img
          src={item.image || '/placeholder.svg'}
          alt={item.name}
          className="h-16 w-16 rounded-md object-cover"
        />
      </div>

      <div className="flex-1 space-y-1">
        <h4 className="text-sm font-medium line-clamp-2">{item.name}</h4>

        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          {item.size && <span>Talla: {item.size}</span>}
          {item.color && <span>Color: {item.color}</span>}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() =>
                onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))
              }
            >
              <Minus className="h-3 w-3" />
            </Button>

            <span className="w-8 text-center text-sm">{item.quantity}</span>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-700"
              onClick={() => onRemove(getItemKey(item))}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface CartSheetProps {
  children: React.ReactNode
}

export function CartSheet({ children }: CartSheetProps) {
  const [open, setOpen] = useState(false)
  const { isAuthenticated } = useAuth()
  const {
    items,
    itemCount,
    total,
    updateQuantity,
    removeItem,
    clearCart,
    getItemKey,
  } = useCart()

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      removeItem(id)
    } else {
      updateQuantity(id, quantity)
    }
  }

  const navigate = useNavigate()
  const handleCheckout = () => {
    if (!isAuthenticated) {
      // Guardar la intención de ir al checkout
      localStorage.setItem('intendedRoute', '/checkout')
      setOpen(false)
      setTimeout(() => {
        document.getElementById('auth-dialog-trigger')?.click()
      }, 300)
      return
    }
    setOpen(false)
    navigate('/checkout')
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div className="relative">
          {children}
          {itemCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {itemCount}
            </Badge>
          )}
        </div>
      </SheetTrigger>

      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5" />
            <span>Carrito de compras</span>
            {itemCount > 0 && (
              <Badge variant="secondary">
                {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 flex flex-col">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4 text-center">
              <ShoppingCart className="h-16 w-16 text-muted-foreground" />
              <div>
                <h3 className="text-lg font-medium">Tu carrito está vacío</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Agrega algunos productos para empezar a comprar
                </p>
              </div>
              <Button
                onClick={() => setOpen(false)}
                className="w-full max-w-xs"
              >
                Continuar comprando
              </Button>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 -mx-6 px-6">
                <div className="space-y-0">
                  {items.map((item, index) => (
                    <div key={getItemKey(item)}>
                      <CartItem
                        item={item}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemove={removeItem}
                        getItemKey={getItemKey}
                      />
                      {index < items.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="space-y-4 pt-4 border-t">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Envío</span>
                    <span className="text-green-600">Gratis</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {!isAuthenticated ? (
                    <AuthDialog defaultTab="login">
                      <Button
                        id="auth-dialog-trigger"
                        className="w-full"
                        size="lg"
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Iniciar sesión para comprar
                      </Button>
                    </AuthDialog>
                  ) : (
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleCheckout}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Proceder al pago
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setOpen(false)}
                  >
                    Continuar comprando
                  </Button>
                </div>

                <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                  <Truck className="h-3 w-3" />
                  <span>Envío gratis en pedidos superiores a $150.000 COP</span>
                </div>

                {items.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearCart}
                    className="w-full text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="mr-2 h-3 w-3" />
                    Vaciar carrito
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
