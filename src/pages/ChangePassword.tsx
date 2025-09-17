import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { supabase } from '@/lib/supabase'
import { toast } from '@/hooks/use-toast'

export const ChangePassword = () => {
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Validaciones
    if (passwords.new !== passwords.confirm) {
      setError('Las contraseñas nuevas no coinciden')
      setIsLoading(false)
      return
    }

    if (passwords.new.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      setIsLoading(false)
      return
    }

    if (passwords.new === passwords.current) {
      setError('La nueva contraseña debe ser diferente a la actual')
      setIsLoading(false)
      return
    }

    try {
      // Cambiar contraseña en Supabase
      const { error } = await supabase.auth.updateUser({
        password: passwords.new,
      })

      if (error) throw error

      toast({
        title: '✅ Contraseña actualizada',
        description: 'Tu contraseña ha sido cambiada exitosamente',
      })

      // Limpiar form
      setPasswords({ current: '', new: '', confirm: '' })
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Error al cambiar la contraseña'
      setError(errorMessage)

      toast({
        title: '❌ Error',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof typeof passwords, value: string) => {
    setPasswords(prev => ({ ...prev, [field]: value }))
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          🔐 Cambiar Contraseña
        </h1>
        <p className="text-gray-600">
          Actualiza tu contraseña para mantener tu cuenta segura
        </p>
      </div>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="text-lg">Nueva Contraseña</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="current">Contraseña Actual</Label>
              <Input
                id="current"
                type="password"
                value={passwords.current}
                onChange={e => handleInputChange('current', e.target.value)}
                placeholder="Ingresa tu contraseña actual"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="new">Nueva Contraseña</Label>
              <Input
                id="new"
                type="password"
                value={passwords.new}
                onChange={e => handleInputChange('new', e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="confirm">Confirmar Nueva Contraseña</Label>
              <Input
                id="confirm"
                type="password"
                value={passwords.confirm}
                onChange={e => handleInputChange('confirm', e.target.value)}
                placeholder="Repite la nueva contraseña"
                required
                minLength={6}
                disabled={isLoading}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Cambiando...
                </div>
              ) : (
                '🔐 Cambiar Contraseña'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Consejos de seguridad */}
      <Card className="max-w-md bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-blue-900 mb-3">
            💡 Consejos de Seguridad
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Usa al menos 6 caracteres</li>
            <li>• Combina letras, números y símbolos</li>
            <li>• No uses información personal</li>
            <li>• Cambia tu contraseña regularmente</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
