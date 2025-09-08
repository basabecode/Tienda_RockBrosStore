import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'

const Login = () => {
  const {
    signIn,
    signInWithGoogle,
    isAuthenticated,
    loading: authLoading,
  } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  // Redireccionar si ya está autenticado
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate('/profile')
    }
  }, [isAuthenticated, authLoading, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (loading || authLoading) return

    setLoading(true)

    try {
      const { error } = await signIn(email, password)

      if (error) {
        toast({
          title: 'Error de inicio de sesión',
          description: error.message,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Éxito',
          description: 'Iniciando sesión...',
        })
        // El useEffect de arriba se encargará de la navegación
      }
    } catch (error) {
      console.error('Error en login:', error)
      toast({
        title: 'Error inesperado',
        description: 'Hubo un problema al iniciar sesión',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    if (loading || authLoading) return

    setLoading(true)

    try {
      const { error } = await signInWithGoogle()

      if (error) {
        toast({
          title: 'Error de autenticación',
          description: error.message,
          variant: 'destructive',
        })
        setLoading(false)
      }
      // No setear loading(false) si no hay error -
      // Google manejará la redirección
    } catch (error) {
      console.error('Error en Google login:', error)
      toast({
        title: 'Error inesperado',
        description: 'Hubo un problema con la autenticación de Google',
        variant: 'destructive',
      })
      setLoading(false)
    }
  }

  // Mostrar loading si está autenticando
  if (authLoading) {
    return (
      <div className="container mx-auto py-20">
        <div className="max-w-md mx-auto bg-card p-6 rounded-lg shadow text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  // Si ya está autenticado, mostrar mensaje
  if (isAuthenticated) {
    return (
      <div className="container mx-auto py-20">
        <div className="max-w-md mx-auto bg-card p-6 rounded-lg shadow text-center">
          <p>Ya tienes sesión iniciada. Redirigiendo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-20">
      <div className="max-w-md mx-auto bg-card p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Iniciar sesión</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <Input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={loading || !email || !password}
          >
            {loading ? 'Accediendo...' : 'Ingresar'}
          </Button>
        </form>

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
