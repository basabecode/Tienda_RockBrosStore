import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'
import LoginForm from '@/components/LoginForm'

const AdminLogin = () => {
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleLogin = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { data, error } = await signIn(email, password)
      return { data, error }
    } finally {
      setLoading(false)
    }
  }

  interface ValidateAdminData {
    user?: { id: string }
  }
  const validateAdmin = async (data: ValidateAdminData) => {
    if (!data?.user) return { error: { message: 'Usuario no encontrado' } }
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()
    if (profileError) {
      return { error: { message: 'No se pudo verificar el rol del usuario' } }
    }
    if (profile?.role !== 'admin') {
      return {
        error: {
          message: 'Solo los administradores pueden acceder a esta sección',
        },
      }
    }
    return {}
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md shadow-xl bg-white rounded-lg p-6">
        <LoginForm
          title="🔐 Acceso Administrador"
          onLogin={handleLogin}
          loading={loading}
          extraValidation={validateAdmin}
          redirect={() => navigate('/admin')}
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
