import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'

interface LoginResult {
  error?: { message: string }
  data?: { user?: { id: string; email?: string; role?: string } }
}

interface LoginFormProps {
  title?: string
  onLogin: (email: string, password: string) => Promise<LoginResult>
  loading?: boolean
  extraValidation?: (
    data: LoginResult['data']
  ) => Promise<{ error?: { message: string } }>
  redirect?: () => void
  showPasswordToggle?: boolean
}

const LoginForm = ({
  title = 'Iniciar sesión',
  onLogin,
  loading = false,
  extraValidation,
  redirect,
  showPasswordToggle = false,
}: LoginFormProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [localLoading, setLocalLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (localLoading || loading) return
    setLocalLoading(true)
    try {
      const { error, data } = await onLogin(email, password)
      if (error) {
        toast({
          title: 'Error de inicio de sesión',
          description: error.message,
          variant: 'destructive',
        })
        return
      }
      if (extraValidation) {
        const { error: extraError } = await extraValidation(data)
        if (extraError) {
          toast({
            title: 'Acceso denegado',
            description: extraError.message,
            variant: 'destructive',
          })
          return
        }
      }
      toast({
        title: 'Éxito',
        description: 'Iniciando sesión...',
      })
      if (redirect) redirect()
    } catch (err) {
      toast({
        title: 'Error inesperado',
        description: 'Hubo un problema al iniciar sesión',
        variant: 'destructive',
      })
    } finally {
      setLocalLoading(false)
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
      <div>
        <Input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="relative">
        <Input
          type={
            showPasswordToggle
              ? showPassword
                ? 'text'
                : 'password'
              : 'password'
          }
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {showPasswordToggle && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2"
            onClick={() => setShowPassword(v => !v)}
          >
            {showPassword ? 'Ocultar' : 'Mostrar'}
          </Button>
        )}
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={localLoading || loading}
      >
        {localLoading || loading ? 'Ingresando...' : 'Ingresar'}
      </Button>
    </form>
  )
}

export default LoginForm
