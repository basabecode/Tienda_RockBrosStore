/**
 * Script para configurar y gestionar usuarios admin
 * Requiere aplicar previamente supabase/USER-MANAGEMENT-FIX.sql (incluye RPCs)
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Cargar variables de entorno desde .env (opcional)
function loadEnv() {
  try {
    const envPath = join(__dirname, '..', '.env')
    const envContent = readFileSync(envPath, 'utf8')
    const envVars = {}

    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=')
      if (key && key.startsWith('VITE_')) {
        const value = valueParts.join('=').trim()
        if (value) {
          envVars[key] = value.replace(/['"]/g, '')
        }
      }
    })

    return envVars
  } catch (error) {
    return {}
  }
}

// Configurar Supabase (usar las mismas variables de entorno)
const env = loadEnv()
const supabaseUrl = env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseAnonKey =
  env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY

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
    // 1. Verificar conexión a Supabase (count exact con head)
    const { count, error: testError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    if (testError) {
      console.error('❌ Error conectando a Supabase:', testError.message)
      return
    }

    console.log('✅ Conexión a Supabase exitosa')

    // 2. Obtener todos los usuarios existentes
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, full_name, role')
      .order('created_at', { ascending: true })

    if (profilesError) {
      console.error('❌ Error obteniendo perfiles:', profilesError.message)
      return
    }

    console.log(`📊 Encontrados ${profiles.length} perfiles:`)
    profiles.forEach((profile, index) => {
      console.log(
        `  ${index + 1}. ${profile.email} - Rol: ${profile.role || 'user'}`
      )
    })

    // 3. Verificar si ya hay un admin
    const existingAdmins = profiles.filter(p => p.role === 'admin')

    if (existingAdmins.length > 0) {
      console.log('✅ Ya existen usuarios admin:')
      existingAdmins.forEach(admin => {
        console.log(`  - ${admin.email}`)
      })
      return
    }

    // 4. Si no hay admins, promover al primer usuario con RPC bootstrap (SECURO)
    if (profiles.length === 0) {
      console.log(
        '⚠️  No hay usuarios registrados. Registra un usuario primero.'
      )
      return
    }

    const firstUser = profiles[0]
    console.log(
      `🔄 Promoviendo a ${firstUser.email} como administrador (bootstrap)...`
    )

    // Llamar RPC que sólo permite bootstrap si no existen admins
    const { data, error: rpcError } = await supabase.rpc(
      'bootstrap_first_admin',
      { target_user_id: firstUser.id }
    )

    if (rpcError) {
      console.error('❌ Error en bootstrap_first_admin:', rpcError.message)
      return
    }

    if (!data?.success) {
      console.error(
        `❌ No se pudo promover: ${data?.message || 'Error desconocido'}`
      )
      return
    }

    console.log('✅ Usuario promovido exitosamente!')
    console.log(`🎉 ${firstUser.email} ahora es administrador`)

    // 5. Verificar el cambio
    const { data: updatedProfile, error: verifyError } = await supabase
      .from('profiles')
      .select('email, role')
      .eq('id', firstUser.id)
      .single()

    if (verifyError) {
      console.error('❌ Error verificando cambio:', verifyError.message)
      return
    }

    console.log('🔍 Verificación:')
    console.log(`  Email: ${updatedProfile.email}`)
    console.log(`  Rol: ${updatedProfile.role}`)
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
      .select('id, email, full_name, role, created_at')
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

    const adminCount = profiles.filter(p => p.role === 'admin').length
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
      .select('id, email, role')
      .eq('email', email)
      .single()

    if (findError) {
      console.error(`❌ Usuario no encontrado: ${email}`)
      return false
    }

    if (profile.role === 'admin') {
      console.log(`✅ ${email} ya es administrador`)
      return true
    }

    // Usar RPC segura que valida permisos
    const { data, error: rpcError } = await supabase.rpc('promote_to_admin', {
      target_user_id: profile.id,
    })

    if (rpcError) {
      console.error('❌ Error promoviendo usuario:', rpcError.message)
      return false
    }

    if (!data?.success) {
      console.error(
        '❌ No se pudo promover:',
        data?.message || 'Error desconocido'
      )
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
const isDirectRun = (() => {
  try {
    return import.meta.url === pathToFileURL(process.argv[1]).href
  } catch {
    return false
  }
})()

if (isDirectRun) {
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
        console.error('❌ Proporciona un email. Ejemplos:')
        console.error(
          '   node scripts/setup-admin.js promote usuario@ejemplo.com'
        )
        console.error(
          '   npm run admin:promote -- usuario@ejemplo.com  (con NPM)'
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
        '  npm run admin:setup             - Configurar primer admin automáticamente'
      )
      console.log(
        '  npm run admin:check             - Ver estado de todos los usuarios'
      )
      console.log(
        '  npm run admin:promote <email>   - Promover usuario específico a admin'
      )
      console.log('')
      console.log('Ejemplos:')
      console.log('  npm run admin:setup')
      console.log('  npm run admin:promote -- usuario@ejemplo.com')
  }
}
