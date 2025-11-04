import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { listAddresses, addAddress } from '@/lib/userData'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Address = {
  id: string
  label: string | null
  address: string
  city: string | null
  department: string | null
  postal_code: string | null
  phone: string | null
}

const Addresses = () => {
  const { user } = useAuth()
  const [items, setItems] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)

  // formulario mejorado
  const [form, setForm] = useState({
    label: '',
    address: '',
    city: '',
    department: '',
    postal_code: '',
    phone: '',
  })

  const load = async () => {
    if (!user) {
      setItems([])
      setLoading(false)
      return
    }
    setLoading(true)
    const { data, error } = await listAddresses(user.id)
    if (error) {
      setError(error.message)
      setItems([])
    } else {
      setItems((data ?? []) as Address[])
    }
    setLoading(false)
  }

  useEffect(() => {
    const loadData = async () => {
      await load()
    }
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    try {
      // Adaptar la llamada a la función addAddress
      const addressToInsert = {
        user_id: user.id,
        name: form.label,
        street: form.address,
        city: form.city,
        state: form.department,
        postal_code: form.postal_code,
        phone: form.phone,
        country: '', // Puedes ajustar el valor según tu lógica
        is_default: false, // O true si quieres que sea la dirección principal
      }
      const { error } = await addAddress(addressToInsert)
      if (error) {
        setError(error.message)
        return
      }
      setForm({
        label: '',
        address: '',
        city: '',
        department: '',
        postal_code: '',
        phone: '',
      })
      setIsAddingNew(false)
      await load()
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Error al agregar dirección'
      )
    }
  }

  const handleDeleteAddress = (id: string) => {
    setItems(items.filter(addr => addr.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">📍 Mis Direcciones</h1>
          {/* ✅ CORREGIDO: text-gray-600 → text-muted-accessible para mejor contraste */}
          <p className="text-muted-accessible">
            Gestiona tus direcciones de envío
          </p>
        </div>
        <Button
          onClick={() => setIsAddingNew(true)}
          className="bg-brand-primary hover:bg-brand-secondary text-white"
        >
          ➕ Nueva Dirección
        </Button>
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">Error: {error}</p>
        </div>
      )}

      {/* Formulario para nueva dirección */}
      {isAddingNew && (
        <Card>
          <CardHeader>
            <CardTitle>Agregar Nueva Dirección</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="label">Etiqueta</Label>
                  <Input
                    id="label"
                    placeholder="Casa, Oficina, etc."
                    value={form.label}
                    onChange={e => setForm({ ...form, label: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="city">Ciudad</Label>
                  <Input
                    id="city"
                    placeholder="Ciudad"
                    value={form.city}
                    onChange={e => setForm({ ...form, city: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Dirección Completa</Label>
                <Input
                  id="address"
                  placeholder="Calle, número, apartamento, etc."
                  required
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="department">Departamento</Label>
                  <Input
                    id="department"
                    placeholder="Departamento"
                    value={form.department}
                    onChange={e =>
                      setForm({ ...form, department: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="postal_code">Código Postal</Label>
                  <Input
                    id="postal_code"
                    placeholder="Código postal"
                    value={form.postal_code}
                    onChange={e =>
                      setForm({ ...form, postal_code: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    placeholder="Teléfono"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit">✅ Guardar Dirección</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddingNew(false)
                    setForm({
                      label: '',
                      address: '',
                      city: '',
                      department: '',
                      postal_code: '',
                      phone: '',
                    })
                  }}
                >
                  ❌ Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de direcciones existentes */}
      {!loading && !error && (
        <div className="grid gap-4">
          {items.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                {/* ✅ MANTIENE: text-gray-400 para emoji está OK (no es texto crítico) */}
                <div className="text-gray-400 text-6xl mb-4">📍</div>
                {/* ✅ CORREGIDO: text-gray-500 → text-subtle-dark para mejor contraste */}
                <p className="text-subtle-dark mb-4">
                  No tienes direcciones guardadas
                </p>
                <Button onClick={() => setIsAddingNew(true)}>
                  Agregar Primera Dirección
                </Button>
              </CardContent>
            </Card>
          ) : (
            items.map(address => (
              <Card key={address.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">
                        {address.label || 'Sin etiqueta'}
                      </h3>
                      {/* ✅ CORREGIDO: text-gray-600 → text-secondary-dark para direcciones */}
                      <p className="text-secondary-dark">{address.address}</p>
                      <p className="text-secondary-dark">
                        {address.city && `${address.city}`}
                        {address.department && `, ${address.department}`}
                        {address.postal_code && ` ${address.postal_code}`}
                      </p>
                      {address.phone && (
                        <p className="text-secondary-dark">
                          📞 {address.phone}
                        </p>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteAddress(address.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      🗑️ Eliminar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default Addresses
