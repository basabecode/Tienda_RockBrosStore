import { supabase } from './supabase'

// Tipos específicos para direcciones que coinciden con la DB
export interface Address {
  id: string
  created_at: string
  user_id: string
  name: string
  street: string
  city: string
  state: string
  postal_code: string
  country: string
  is_default: boolean
}

export type AddressInsert = Omit<Address, 'id' | 'created_at'>
export type AddressUpdate = Partial<Omit<Address, 'id' | 'created_at'>>

// Obtener direcciones del usuario
export async function listAddresses(userId: string) {
  try {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}

// Agregar nueva dirección
export async function addAddress(addressData: AddressInsert) {
  try {
    const { data, error } = await supabase
      .from('addresses')
      .insert([addressData])
      .select()
      .single()

    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}

// Actualizar dirección
export async function updateAddress(id: string, updates: AddressUpdate) {
  try {
    const { data, error } = await supabase
      .from('addresses')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}

// Eliminar dirección
export async function deleteAddress(id: string) {
  try {
    const { error } = await supabase.from('addresses').delete().eq('id', id)

    return { error }
  } catch (error) {
    return { error }
  }
}

// Establecer dirección como predeterminada
export async function setDefaultAddress(userId: string, addressId: string) {
  try {
    // Primero quitar default de todas las direcciones del usuario
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', userId)

    // Luego establecer la nueva como default
    const { data, error } = await supabase
      .from('addresses')
      .update({ is_default: true })
      .eq('id', addressId)
      .select()
      .single()

    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}
