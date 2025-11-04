import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import LoginForm from '@/components/LoginForm'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'

const Login = () => {
  const { signIn, signInWithGoogle, user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  // Redireccionar si ya está autenticado
  useEffect(() => {
    if (user && !authLoading) {
      window.localStorage.setItem(
        'isAdmin',
        user.role === 'admin' ? 'true' : 'false'
      )
      // Redirección inmediata sin setTimeout
      if (user.role === 'admin') {
        navigate('/admin', { replace: true })
      } else {
        navigate('/dashboard', { replace: true })
      }
    }
  }, [user, authLoading, navigate])

  const handleGoogleSignIn = async () => {
    if (loading || authLoading) return
    setLoading(true)
    try {
      await signInWithGoogle()
      // La redirección se maneja por el efecto de arriba
    } catch (error) {
      console.error('Error en Google login:', error)
      toast({
        title: 'Error inesperado',
        description: 'Hubo un problema con la autenticación de Google',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  // Mostrar loading si está autenticando o si ya está autenticado (durante redirección)
  if (authLoading || user) {
    return (
      <div className="container mx-auto py-20">
        <div className="max-w-md mx-auto bg-card p-6 rounded-lg shadow text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>{user ? 'Redirigiendo...' : 'Verificando autenticación...'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-20">
      <div className="max-w-md mx-auto bg-card p-6 rounded-lg shadow">
        <LoginForm
          title="Iniciar sesión"
          // El LoginForm debe llamar a signIn y dejar que el efecto maneje la redirección
          onLogin={signIn}
          loading={loading || authLoading}
          redirect={() => navigate('/perfil')}
        />
        <div className="mt-4 text-center">
          <span className="text-sm text-muted-foreground">o</span>
        </div>

        <div className="mt-4">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            {loading ? 'Autenticando...' : 'Continuar con Google'}
          </Button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            ¿No tienes cuenta?{' '}
            <button
              type="button"
              className="text-primary hover:underline"
              onClick={() => navigate('/register')}
            >
              Regístrate aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
