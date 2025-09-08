/**
 * Script para configurar el primer usuario admin
 * Ejecutar después de aplicar el esquema admin-schema-simple.sql
 */

import { createClient } from '@supabase/supabase-js'

// Configurar Supabase (usar las mismas variables de entorno)
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas')
  console.error(
    'Asegúrate de tener VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY configuradas'
  )
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function setupFirstAdmin() {
  console.log('🔧 Configurando primer usuario admin...')

  try {
    // 1. Verificar conexión a Supabase
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)

    if (testError) {
      console.error('❌ Error conectando a Supabase:', testError.message)
      return
    }

    console.log('✅ Conexión a Supabase exitosa')

    // 2. Obtener todos los usuarios existentes
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, full_name, is_admin')
      .order('created_at', { ascending: true })

    if (profilesError) {
      console.error('❌ Error obteniendo perfiles:', profilesError.message)
      return
    }

    console.log(`📊 Encontrados ${profiles.length} perfiles:`)
    profiles.forEach((profile, index) => {
      console.log(
        `  ${index + 1}. ${profile.email} - Admin: ${
          profile.is_admin ? '✅' : '❌'
        }`
      )
    })

    // 3. Verificar si ya hay un admin
    const existingAdmins = profiles.filter(p => p.is_admin)

    if (existingAdmins.length > 0) {
      console.log('✅ Ya existen usuarios admin:')
      existingAdmins.forEach(admin => {
        console.log(`  - ${admin.email}`)
      })
      return
    }

    // 4. Si no hay admins, promover al primer usuario
    if (profiles.length === 0) {
      console.log(
        '⚠️  No hay usuarios registrados. Registra un usuario primero.'
      )
      return
    }

    const firstUser = profiles[0]
    console.log(`🔄 Promoviendo a ${firstUser.email} como administrador...`)

    // 5. Actualizar el usuario a admin
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ is_admin: true })
      .eq('id', firstUser.id)

    if (updateError) {
      console.error('❌ Error promoviendo usuario:', updateError.message)
      return
    }

    console.log('✅ Usuario promovido exitosamente!')
    console.log(`🎉 ${firstUser.email} ahora es administrador`)

    // 6. Verificar el cambio
    const { data: updatedProfile, error: verifyError } = await supabase
      .from('profiles')
      .select('email, is_admin')
      .eq('id', firstUser.id)
      .single()

    if (verifyError) {
      console.error('❌ Error verificando cambio:', verifyError.message)
      return
    }

    console.log('🔍 Verificación:')
    console.log(`  Email: ${updatedProfile.email}`)
    console.log(`  Es Admin: ${updatedProfile.is_admin ? '✅' : '❌'}`)
  } catch (error) {
    console.error('💥 Error inesperado:', error.message)
  }
}

// Función para verificar el estado actual de usuarios
async function checkAdminStatus() {
  console.log('🔍 Verificando estado de usuarios admin...')

  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, is_admin, created_at')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('❌ Error:', error.message)
      return
    }

    console.log(`\n📊 Estado actual de usuarios (${profiles.length} total):`)
    console.log('────────────────────────────────────────────')

    profiles.forEach((profile, index) => {
      const adminStatus = profile.is_admin ? '👑 ADMIN' : '👤 USER'
      const created = new Date(profile.created_at).toLocaleDateString()
      console.log(`${index + 1}. ${profile.email}`)
      console.log(`   Nombre: ${profile.full_name || 'Sin nombre'}`)
      console.log(`   Estado: ${adminStatus}`)
      console.log(`   Creado: ${created}`)
      console.log('   ────────────────────────────────')
    })

    const adminCount = profiles.filter(p => p.is_admin).length
    console.log(
      `\n📈 Resumen: ${adminCount} administradores de ${profiles.length} usuarios totales`
    )
  } catch (error) {
    console.error('💥 Error inesperado:', error.message)
  }
}

// Función para promover un usuario específico por email
async function promoteUserByEmail(email) {
  console.log(`🔄 Promoviendo usuario: ${email}`)

  try {
    const { data: profile, error: findError } = await supabase
      .from('profiles')
      .select('id, email, is_admin')
      .eq('email', email)
      .single()

    if (findError) {
      console.error(`❌ Usuario no encontrado: ${email}`)
      return false
    }

    if (profile.is_admin) {
      console.log(`✅ ${email} ya es administrador`)
      return true
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ is_admin: true })
      .eq('id', profile.id)

    if (updateError) {
      console.error('❌ Error promoviendo usuario:', updateError.message)
      return false
    }

    console.log(`✅ ${email} promovido a administrador exitosamente!`)
    return true
  } catch (error) {
    console.error('💥 Error inesperado:', error.message)
    return false
  }
}

// Exportar funciones para uso
export { setupFirstAdmin, checkAdminStatus, promoteUserByEmail }

// Si se ejecuta directamente, mostrar menú
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2]
  const email = process.argv[3]

  switch (command) {
    case 'setup':
      await setupFirstAdmin()
      break
    case 'check':
      await checkAdminStatus()
      break
    case 'promote':
      if (!email) {
        console.error(
          '❌ Proporciona un email: npm run admin promote usuario@ejemplo.com'
        )
        break
      }
      await promoteUserByEmail(email)
      break
    default:
      console.log('🛠️  Utilidades de Admin para Supabase')
      console.log('')
      console.log('Comandos disponibles:')
      console.log(
        '  npm run admin setup           - Configurar primer admin automáticamente'
      )
      console.log(
        '  npm run admin check            - Ver estado de todos los usuarios'
      )
      console.log(
        '  npm run admin promote <email>  - Promover usuario específico a admin'
      )
      console.log('')
      console.log('Ejemplos:')
      console.log('  npm run admin setup')
      console.log('  npm run admin promote usuario@ejemplo.com')
  }
}
