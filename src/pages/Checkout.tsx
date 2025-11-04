import React from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useCart } from '@/hooks/use-cart'
import { Button } from '@/components/ui/button'
import { AuthDialog } from '@/components/AuthDialog'
import { ShoppingCart, AlertCircle } from 'lucide-react'

const Checkout = () => {
  const { isAuthenticated } = useAuth()
  const { items, total } = useCart()

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-6 w-6 text-yellow-500 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">
              Registro requerido
            </h2>
          </div>
          <p className="mb-6 text-gray-600">
            Debes iniciar sesión o registrarte para continuar con el proceso de
            compra.
          </p>
          <AuthDialog defaultTab="register">
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white text-base py-2 rounded-lg">
              Registrarse o Iniciar sesión
            </Button>
          </AuthDialog>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#383838' }}>
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-2xl w-full p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
          <div className="flex items-center mb-6">
            <ShoppingCart className="h-7 w-7 text-green-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">
              Resumen de compra
            </h2>
          </div>
          <ul className="mb-6 divide-y divide-gray-100">
            {items.length === 0 ? (
              <li className="py-6 text-center text-gray-400">
                No hay productos en el carrito.
              </li>
            ) : (
              items.map(item => (
                <li
                  key={item.id}
                  className="flex justify-between items-center py-4"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">
                      {item.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      Cantidad: {item.quantity}
                    </span>
                  </div>
                  <span className="font-semibold text-green-600">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))
            )}
          </ul>
          <div className="flex justify-between items-center font-bold text-xl mb-8 px-4 py-3 rounded-lg bg-green-50 border border-green-100">
            <span className="text-green-700">Total:</span>
            <span className="text-green-700">${total.toFixed(2)}</span>
          </div>
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-3 rounded-lg shadow-md transition-all duration-150"
            disabled
          >
            Confirmar compra (demo)
          </Button>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-yellow-700 bg-yellow-50 border border-yellow-100 rounded-lg py-2">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <span>* La pasarela de pago estará disponible próximamente.</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
