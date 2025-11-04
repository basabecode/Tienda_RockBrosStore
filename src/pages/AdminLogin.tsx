import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import LoginForm from '@/components/LoginForm'

const AdminLogin = () => {
  const [loading, setLoading] = useState(false)
  const { signIn, user, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  // Verificar si ya está autenticado y es admin
  useEffect(() => {
    if (user && !authLoading) {
      if (user.role === 'admin') {
        navigate('/admin', { replace: true })
      } else {
        toast({
          title: 'Acceso denegado',
          description: 'Solo los administradores pueden acceder a esta sección',
          variant: 'destructive',
        })
        navigate('/', { replace: true })
      }
    }
  }, [user, authLoading, navigate, toast])

  const handleLogin = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { data, error } = await signIn(email, password)
      // El useEffect se encargará de manejar la navegación después del login
      return { data, error }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md shadow-xl bg-white rounded-lg p-6">
        <LoginForm
          title="🔐 Acceso Administrador"
          onLogin={handleLogin}
          loading={loading}
          showPasswordToggle={true}
        />
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Información</h4>
          <p className="text-sm text-blue-700">
            Solo los usuarios con rol de administrador pueden acceder a esta
            sección. Si no tienes credenciales, contacta al administrador del
            sistema.
          </p>
        </div>
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-800 text-sm underline"
          >
            ← Volver al inicio
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
