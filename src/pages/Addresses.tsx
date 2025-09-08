import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { listAddresses, addAddress } from '@/lib/userData';
import { Button } from '@/components/ui/button';

type Address = {
  id: string;
  label: string | null;
  address: string;
  city: string | null;
  department: string | null;
  postal_code: string | null;
  phone: string | null;
};

const Addresses = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // formulario mínimo
  const [form, setForm] = useState({
    label: '',
    address: '',
    city: '',
    department: '',
    postal_code: '',
    phone: '',
  });

  const load = async () => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await listAddresses(user.id);
    if (error) {
      setError(error.message);
      setItems([]);
    } else {
      setItems((data ?? []) as Address[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    const loadData = async () => {
      await load();
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const { error } = await addAddress(user.id, form);
    if (error) {
      setError(error.message);
      return;
    }
    setForm({
      label: '',
      address: '',
      city: '',
      department: '',
      postal_code: '',
      phone: '',
    });
    await load();
  };

  return (
    <div className="container mx-auto py-20">
      <div className="max-w-3xl mx-auto bg-card p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Direcciones</h1>
        {loading && <p>Cargando...</p>}
        {error && <p className="text-destructive">Error: {error}</p>}
        {!loading && !error && (
          <>
            <ul className="space-y-3 mb-6">
              {items.length === 0 && (
                <li className="text-sm">No hay direcciones guardadas.</li>
              )}
              {items.map(a => (
                <li key={a.id} className="text-sm">
                  <div className="font-medium">{a.label || 'Sin etiqueta'}</div>
                  <div className="text-muted-foreground">
                    {a.address} {a.city && `- ${a.city}`}{' '}
                    {a.department && `(${a.department})`}
                  </div>
                </li>
              ))}
            </ul>

            <form onSubmit={onSubmit} className="grid gap-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  className="input input-bordered p-2 rounded bg-background border"
                  placeholder="Etiqueta (Casa, Oficina)"
                  value={form.label}
                  onChange={e => setForm({ ...form, label: e.target.value })}
                />
                <input
                  className="input input-bordered p-2 rounded bg-background border"
                  placeholder="Ciudad"
                  value={form.city}
                  onChange={e => setForm({ ...form, city: e.target.value })}
                />
              </div>
              <input
                className="input input-bordered p-2 rounded bg-background border"
                placeholder="Dirección"
                required
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  className="input input-bordered p-2 rounded bg-background border"
                  placeholder="Departamento"
                  value={form.department}
                  onChange={e =>
                    setForm({ ...form, department: e.target.value })
                  }
                />
                <input
                  className="input input-bordered p-2 rounded bg-background border"
                  placeholder="Código postal"
                  value={form.postal_code}
                  onChange={e =>
                    setForm({ ...form, postal_code: e.target.value })
                  }
                />
                <input
                  className="input input-bordered p-2 rounded bg-background border"
                  placeholder="Teléfono"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div>
                <Button type="submit">Agregar dirección</Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Addresses;
