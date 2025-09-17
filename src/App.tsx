import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryProvider } from './components/QueryProvider'
import { CartProvider } from './hooks/use-cart.tsx'
import { FavoritesProvider } from './hooks/use-favorites.tsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Index from './pages/Index'
import Profile from './pages/Profile'
import Orders from './pages/Orders'
import Favorites from './pages/Favorites'
import Addresses from './pages/Addresses'
import { ChangePassword } from './pages/ChangePassword'
import NotFound from './pages/NotFound'
import AdminDashboard from './pages/AdminDashboard'
import AdminLogin from './pages/AdminLogin'
import Login from './pages/Login'
import ProductManagement from './pages/ProductManagement'
import UserManagement from './pages/UserManagement'
import SalesManagement from './pages/SalesManagement'
import ProductDetail from './pages/ProductDetail'
import TestProducts from './pages/TestProducts'
import DashboardLayout from './components/DashboardLayout'
import DashboardOverview from './pages/DashboardOverview'
import { ProtectedRoute } from './components/ProtectedRoute'
import AdminEcommerceDashboard from './pages/AdminEcommerceDashboard'

const App = () => {
  console.log('App component rendering')
  return (
    <QueryProvider>
      <CartProvider>
        <FavoritesProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/test-products" element={<TestProducts />} />

                {/* Rutas del dashboard de usuario con layout anidado */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      {/* Si es admin, mostrar el panel unificado */}
                      {window.localStorage.getItem('isAdmin') === 'true' ? (
                        <AdminEcommerceDashboard />
                      ) : (
                        <DashboardLayout />
                      )}
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<DashboardOverview />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="addresses" element={<Addresses />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="favorites" element={<Favorites />} />
                  <Route path="change-password" element={<ChangePassword />} />
                </Route>

                {/* Rutas de administrador */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminEcommerceDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/products"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <ProductManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <UserManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/sales"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <SalesManagement />
                    </ProtectedRoute>
                  }
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </FavoritesProvider>
      </CartProvider>
    </QueryProvider>
  )
}

export default App
