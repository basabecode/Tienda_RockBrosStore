import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { supabase } from '@/lib/supabase'
import { toast } from '@/hooks/use-toast'
import {
  Eye,
  EyeOff,
  Check,
  X,
  Shield,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from 'lucide-react'

// Tipos para validación
interface ValidationRule {
  test: (password: string) => boolean
  message: string
  met?: boolean
}

interface PasswordStrength {
  score: number
  level: 'weak' | 'fair' | 'good' | 'strong'
  color: string
}

// Reglas de validación constantes
const PASSWORD_RULES: ValidationRule[] = [
  {
    test: (password: string) => password.length >= 8,
    message: 'Al menos 8 caracteres',
  },
  {
    test: (password: string) => /[a-z]/.test(password),
    message: 'Una letra minúscula',
  },
  {
    test: (password: string) => /[A-Z]/.test(password),
    message: 'Una letra mayúscula',
  },
  {
    test: (password: string) => /\d/.test(password),
    message: 'Un número',
  },
  {
    test: (password: string) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
    message: 'Un carácter especial',
  },
]

export const ChangePassword = () => {
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  // Calcular fuerza de la contraseña
  const calculatePasswordStrength = useCallback(
    (password: string): PasswordStrength => {
      if (!password) return { score: 0, level: 'weak', color: 'bg-red-500' }

      const metRules = PASSWORD_RULES.filter(rule => rule.test(password)).length
      const score = (metRules / PASSWORD_RULES.length) * 100

      if (score >= 80) return { score, level: 'strong', color: 'bg-green-500' }
      if (score >= 60) return { score, level: 'good', color: 'bg-blue-500' }
      if (score >= 40) return { score, level: 'fair', color: 'bg-yellow-500' }
      return { score, level: 'weak', color: 'bg-red-500' }
    },
    []
  )

  // Validar contraseña en tiempo real
  const validatePassword = useCallback((password: string): string[] => {
    const errors: string[] = []

    if (!password) {
      errors.push('La contraseña es requerida')
      return errors
    }

    PASSWORD_RULES.forEach(rule => {
      if (!rule.test(password)) {
        errors.push(rule.message)
      }
    })

    return errors
  }, [])

  // Validar coincidencia de contraseñas
  const validatePasswordMatch = useCallback(
    (newPassword: string, confirmPassword: string): boolean => {
      return newPassword === confirmPassword && newPassword.length > 0
    },
    []
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setIsLoading(true)

    try {
      // Validaciones exhaustivas
      const passwordErrors = validatePassword(passwords.new)
      if (passwordErrors.length > 0) {
        setValidationErrors(passwordErrors)
        setError('Por favor, corrige los errores de validación')
        return
      }

      if (passwords.new !== passwords.confirm) {
        setError('Las contraseñas nuevas no coinciden')
        return
      }

      if (passwords.new === passwords.current) {
        setError('La nueva contraseña debe ser diferente a la actual')
        return
      }

      if (!passwords.current) {
        setError('Debes ingresar tu contraseña actual')
        return
      }

      // Verificar fuerza de contraseña
      const strength = calculatePasswordStrength(passwords.new)
      if (strength.level === 'weak') {
        setError(
          'La contraseña es muy débil. Por favor, usa una contraseña más segura.'
        )
        return
      }

      // Cambiar contraseña en Supabase con manejo robusto de errores
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwords.new,
      })

      if (updateError) {
        console.error('Error from Supabase:', updateError)

        // Manejar diferentes tipos de errores
        if (updateError.message.includes('same_password')) {
          throw new Error('La nueva contraseña debe ser diferente a la actual')
        } else if (updateError.message.includes('weak_password')) {
          throw new Error(
            'La contraseña no cumple con los requisitos de seguridad'
          )
        } else if (updateError.message.includes('network')) {
          throw new Error(
            'Error de conexión. Verifica tu internet e intenta nuevamente.'
          )
        } else {
          throw new Error(
            updateError.message || 'Error desconocido al cambiar contraseña'
          )
        }
      }

      // Éxito
      setSuccess(true)
      setValidationErrors([])

      toast({
        title: '✅ Contraseña actualizada',
        description: 'Tu contraseña ha sido cambiada exitosamente',
      })

      // Limpiar form después de un delay para mostrar el éxito
      setTimeout(() => {
        setPasswords({ current: '', new: '', confirm: '' })
        setSuccess(false)
      }, 2000)
    } catch (error: unknown) {
      console.error('Error in handleSubmit:', error)

      let errorMessage = 'Error inesperado al cambiar la contraseña'

      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      }

      setError(errorMessage)

      toast({
        title: '❌ Error al cambiar contraseña',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof typeof passwords, value: string) => {
    setPasswords(prev => ({ ...prev, [field]: value }))

    // Limpiar estados de error cuando el usuario empiece a escribir
    if (error) setError('')
    if (success) setSuccess(false)

    // Validar nueva contraseña en tiempo real
    if (field === 'new') {
      const errors = validatePassword(value)
      setValidationErrors(errors)
    }
  }

  // Función para alternar visibilidad de contraseñas
  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  // Calcular fuerza de la nueva contraseña
  const passwordStrength = calculatePasswordStrength(passwords.new)
  const passwordsMatch = validatePasswordMatch(passwords.new, passwords.confirm)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Shield className="h-7 w-7 text-blue-600" />
          Cambiar Contraseña
        </h1>
        <p className="text-gray-600">
          Actualiza tu contraseña para mantener tu cuenta segura
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Configurar Nueva Contraseña
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Estado de éxito */}
          {success && (
            <Alert className="mb-4 border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                ¡Contraseña actualizada exitosamente! Tu cuenta ahora es más
                segura.
              </AlertDescription>
            </Alert>
          )}

          {/* Estado de error */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contraseña Actual */}
            <div className="space-y-2">
              <Label htmlFor="current" className="text-sm font-medium">
                Contraseña Actual *
              </Label>
              <div className="relative">
                <Input
                  id="current"
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwords.current}
                  onChange={e => handleInputChange('current', e.target.value)}
                  placeholder="Ingresa tu contraseña actual"
                  required
                  disabled={isLoading}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => togglePasswordVisibility('current')}
                  disabled={isLoading}
                >
                  {showPasswords.current ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            {/* Nueva Contraseña */}
            <div className="space-y-2">
              <Label htmlFor="new" className="text-sm font-medium">
                Nueva Contraseña *
              </Label>
              <div className="relative">
                <Input
                  id="new"
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwords.new}
                  onChange={e => handleInputChange('new', e.target.value)}
                  placeholder="Crea una contraseña segura"
                  required
                  disabled={isLoading}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => togglePasswordVisibility('new')}
                  disabled={isLoading}
                >
                  {showPasswords.new ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>

              {/* Indicador de fuerza de contraseña */}
              {passwords.new && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700">
                      Fuerza de la contraseña
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        passwordStrength.level === 'strong'
                          ? 'border-green-500 text-green-700'
                          : passwordStrength.level === 'good'
                          ? 'border-blue-500 text-blue-700'
                          : passwordStrength.level === 'fair'
                          ? 'border-yellow-500 text-yellow-700'
                          : 'border-red-500 text-red-700'
                      }`}
                    >
                      {passwordStrength.level === 'strong'
                        ? 'Fuerte'
                        : passwordStrength.level === 'good'
                        ? 'Buena'
                        : passwordStrength.level === 'fair'
                        ? 'Regular'
                        : 'Débil'}
                    </Badge>
                  </div>
                  <Progress value={passwordStrength.score} className="h-2" />
                </div>
              )}

              {/* Requisitos de contraseña */}
              {passwords.new && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-700">
                    Requisitos:
                  </p>
                  <div className="space-y-1">
                    {PASSWORD_RULES.map((rule, index) => {
                      const isMet = rule.test(passwords.new)
                      return (
                        <div key={index} className="flex items-center gap-2">
                          {isMet ? (
                            <Check className="h-3 w-3 text-green-600" />
                          ) : (
                            <X className="h-3 w-3 text-red-500" />
                          )}
                          <span
                            className={`text-xs ${
                              isMet ? 'text-green-700' : 'text-red-600'
                            }`}
                          >
                            {rule.message}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Confirmar Nueva Contraseña */}
            <div className="space-y-2">
              <Label htmlFor="confirm" className="text-sm font-medium">
                Confirmar Nueva Contraseña *
              </Label>
              <div className="relative">
                <Input
                  id="confirm"
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwords.confirm}
                  onChange={e => handleInputChange('confirm', e.target.value)}
                  placeholder="Repite la nueva contraseña"
                  required
                  disabled={isLoading}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => togglePasswordVisibility('confirm')}
                  disabled={isLoading}
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>

              {/* Validación de coincidencia */}
              {passwords.confirm && (
                <div className="flex items-center gap-2">
                  {passwordsMatch ? (
                    <>
                      <Check className="h-3 w-3 text-green-600" />
                      <span className="text-xs text-green-700">
                        Las contraseñas coinciden
                      </span>
                    </>
                  ) : (
                    <>
                      <X className="h-3 w-3 text-red-500" />
                      <span className="text-xs text-red-600">
                        Las contraseñas no coinciden
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Botón de envío */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
              disabled={
                isLoading ||
                !passwords.current ||
                !passwords.new ||
                !passwords.confirm ||
                !passwordsMatch ||
                validationErrors.length > 0 ||
                passwordStrength.level === 'weak'
              }
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Cambiando contraseña...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Shield className="h-4 w-4" />
                  Cambiar Contraseña
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Consejos de seguridad */}
      <Card className="max-w-2xl bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Consejos de Seguridad
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul className="text-sm text-blue-800 space-y-2">
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                Usa al menos 8 caracteres con mayúsculas, minúsculas, números y
                símbolos
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                Evita información personal como nombres o fechas
              </li>
            </ul>
            <ul className="text-sm text-blue-800 space-y-2">
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                No reutilices contraseñas de otras cuentas
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                Considera usar un gestor de contraseñas
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
