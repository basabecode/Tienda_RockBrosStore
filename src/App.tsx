import { QueryProvider } from './components/QueryProvider'
import { CartProvider } from './hooks/use-cart.tsx'
import { FavoritesProvider } from './hooks/use-favorites.tsx'
import { UnifiedFavoritesProvider } from '@/components/providers/UnifiedFavoritesProvider'
import { SearchProvider } from './contexts/SearchContext'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Suspense, lazy } from 'react'
import { Loader2 } from 'lucide-react'

// Páginas públicas - carga inmediata
import Index from './pages/Index'
import ProductDetail from './pages/ProductDetail'
import Login from './pages/Login'
import AdminLogin from './pages/AdminLogin'
import NotFound from './pages/NotFound'

// Layouts - carga inmediata
import UserLayout from './components/layouts/UserLayout'
import AdminLayout from './components/layouts/AdminLayout'

// Componentes de protección
import { ProtectedRoute } from './components/auth/ProtectedRoute'

// Páginas protegidas - Usuario (lazy loading)
const UserDashboard = lazy(() => import('./pages/user/UserDashboard'))
const UserProfile = lazy(() => import('./pages/user/UserProfile'))
const UserOrders = lazy(() => import('./pages/user/UserOrders'))
const UserFavorites = lazy(() => import('./pages/user/UserFavorites'))
const Checkout = lazy(() => import('./pages/Checkout'))

// Páginas protegidas - Admin (lazy loading)
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'))
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'))
const AdminSales = lazy(() => import('./pages/admin/AdminSales'))
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'))

// Componente de loading personalizado
const PageSuspense = ({ children }: { children: React.ReactNode }) => (
  <Suspense
    fallback={
      <div className="min-h-screen bg-gris-oscuro flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-verde-neon mx-auto" />
          <p className="text-blanco mt-4">Cargando página...</p>
        </div>
      </div>
    }
  >
    {children}
  </Suspense>
)

const App = () => {
  return (
    <QueryProvider>
      <SearchProvider>
        <CartProvider>
          <FavoritesProvider>
            <UnifiedFavoritesProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin/login" element={<AdminLogin />} />

                  {/* ========== ÁREA DE USUARIO ========== */}
                  <Route
                    path="/usuario/*"
                    element={
                      <ProtectedRoute requiredRole="user">
                        <UserLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route
                      index
                      element={
                        <PageSuspense>
                          <UserDashboard />
                        </PageSuspense>
                      }
                    />
                    <Route
                      path="perfil"
                      element={
                        <PageSuspense>
                          <UserProfile />
                        </PageSuspense>
                      }
                    />
                    <Route
                      path="pedidos"
                      element={
                        <PageSuspense>
                          <UserOrders />
                        </PageSuspense>
                      }
                    />
                    <Route
                      path="favoritos"
                      element={
                        <PageSuspense>
                          <UserFavorites />
                        </PageSuspense>
                      }
                    />
                  </Route>

                  {/* Checkout independiente */}
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute requiredRole="user">
                        <PageSuspense>
                          <Checkout />
                        </PageSuspense>
                      </ProtectedRoute>
                    }
                  />

                  {/* ========== ÁREA ADMINISTRATIVA ========== */}
                  <Route
                    path="/admin/*"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route
                      index
                      element={
                        <PageSuspense>
                          <AdminDashboard />
                        </PageSuspense>
                      }
                    />
                    <Route
                      path="productos"
                      element={
                        <PageSuspense>
                          <AdminProducts />
                        </PageSuspense>
                      }
                    />
                    <Route
                      path="usuarios"
                      element={
                        <PageSuspense>
                          <AdminUsers />
                        </PageSuspense>
                      }
                    />
                    <Route
                      path="ventas"
                      element={
                        <PageSuspense>
                          <AdminSales />
                        </PageSuspense>
                      }
                    />
                    <Route
                      path="configuracion"
                      element={
                        <PageSuspense>
                          <AdminSettings />
                        </PageSuspense>
                      }
                    />
                  </Route>

                  {/* ========== REDIRECCIONES Y COMPATIBILIDAD ========== */}
                  {/* Redirecciones de URLs antiguas */}
                  <Route
                    path="/dashboard"
                    element={<Navigate to="/usuario" replace />}
                  />
                  <Route
                    path="/dashboard/*"
                    element={<Navigate to="/usuario" replace />}
                  />
                  <Route
                    path="/perfil"
                    element={<Navigate to="/usuario/perfil" replace />}
                  />
                  <Route
                    path="/pedidos"
                    element={<Navigate to="/usuario/pedidos" replace />}
                  />
                  <Route
                    path="/favoritos"
                    element={<Navigate to="/usuario/favoritos" replace />}
                  />
                  <Route
                    path="/cuenta"
                    element={<Navigate to="/usuario" replace />}
                  />
                  <Route
                    path="/cuenta/*"
                    element={<Navigate to="/usuario" replace />}
                  />

                  {/* Redirecciones admin */}
                  <Route
                    path="/admin/products"
                    element={<Navigate to="/admin/productos" replace />}
                  />
                  <Route
                    path="/admin/users"
                    element={<Navigate to="/admin/usuarios" replace />}
                  />
                  <Route
                    path="/admin/sales"
                    element={<Navigate to="/admin/ventas" replace />}
                  />

                  {/* 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
              </BrowserRouter>
            </UnifiedFavoritesProvider>
          </FavoritesProvider>
        </CartProvider>
      </SearchProvider>
    </QueryProvider>
  )
}

export default App
