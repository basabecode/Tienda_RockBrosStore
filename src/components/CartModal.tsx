import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useCartQuery } from '@/hooks/use-cart-query'
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useState } from 'react'

interface CartModalProps {
  isOpen: boolean
  onClose: () => void
}

export const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const {
    cartItems,
    clearCart,
    removeItem,
    updateQuantity,
    isLoading,
    isClearing,
    totalPrice,
    itemCount,
  } = useCartQuery()

  const [processingItem, setProcessingItem] = useState<string | null>(null)

  const handleClearCart = async () => {
    try {
      await clearCart()
    } catch (error) {
      console.error('Error clearing cart:', error)
    }
  }

  const handleRemoveItem = async (productId: string) => {
    setProcessingItem(productId)
    try {
      await removeItem(productId)
    } catch (error) {
      console.error('Error removing item:', error)
    } finally {
      setProcessingItem(null)
    }
  }

  const handleUpdateQuantity = async (
    productId: string,
    newQuantity: number
  ) => {
    if (newQuantity < 1) {
      handleRemoveItem(productId)
      return
    }

    setProcessingItem(productId)
    try {
      await updateQuantity({ productId, quantity: newQuantity })
    } catch (error) {
      console.error('Error updating quantity:', error)
    } finally {
      setProcessingItem(null)
    }
  }

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3">Cargando carrito...</span>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-blue-600" />
              <span>🛒 Carrito de Compras ({itemCount} items)</span>
            </div>
            {cartItems.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearCart}
                disabled={isClearing}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isClearing ? 'Limpiando...' : 'Limpiar Todo'}
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-300 text-8xl mb-6">🛒</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Tu carrito está vacío
              </h3>
              <p className="text-gray-500 mb-6">
                Explora nuestros productos y agrega algunos al carrito
              </p>
              <Button
                onClick={onClose}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Continuar Comprando
              </Button>
            </div>
          ) : (
            <div className="space-y-4 p-1">
              {cartItems.map(item => (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Imagen del producto */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.product.main_image || '/placeholder.svg'}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-md border"
                      onError={e => {
                        const target = e.target as HTMLImageElement
                        target.src = '/placeholder.svg'
                      }}
                    />
                  </div>

                  {/* Información del producto */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-gray-900 truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-xl font-bold text-blue-600">
                      ${(item.product.price ?? 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Subtotal: $
                      {(
                        (Number(item.unit_price ?? item.product.price) || 0) *
                        item.quantity
                      ).toLocaleString()}
                    </p>
                  </div>

                  {/* Controles de cantidad */}
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleUpdateQuantity(
                            item.product_id,
                            item.quantity - 1
                          )
                        }
                        disabled={processingItem === item.product_id}
                        className="h-8 w-8 p-0 hover:bg-gray-200"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>

                      <span className="w-10 text-center font-semibold">
                        {item.quantity}
                      </span>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleUpdateQuantity(
                            item.product_id,
                            item.quantity + 1
                          )
                        }
                        disabled={processingItem === item.product_id}
                        className="h-8 w-8 p-0 hover:bg-gray-200"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Botón eliminar */}
                  <div className="flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.product_id)}
                      disabled={processingItem === item.product_id}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                    >
                      {processingItem === item.product_id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer con total y botón de pago */}
        {cartItems.length > 0 && (
          <div className="flex-shrink-0 border-t bg-gray-50 p-6 rounded-b-lg">
            <div className="flex justify-between items-center">
              <div className="text-left">
                <p className="text-sm text-gray-600">
                  Total de items: {itemCount}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  Total: ${totalPrice.toLocaleString()}
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose} className="px-6">
                  Seguir Comprando
                </Button>
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 px-8"
                  onClick={() => {
                    // TODO: Implementar checkout
                    alert('Funcionalidad de pago en desarrollo')
                  }}
                >
                  💳 Proceder al Pago
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
