#!/usr/bin/env node

/**
 * 👥 GESTOR DE USUARIOS SUPABASE
 * ==============================
 * Herramientas para gestionar usuarios y roles desde línea de comandos
 * Fecha: 15 de septiembre de 2025
 *
 * Uso:
 *   node scripts/manage-users.js list
 *   node scripts/manage-users.js promote <user_id>
 *   node scripts/manage-users.js demote <user_id>
 *   node scripts/manage-users.js toggle <user_id>
 *   node scripts/manage-users.js check
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// ==========================================
// 📋 CONFIGURACIÓN
// ==========================================

// Cargar variables de entorno
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
    console.warn(
      '⚠️ No se pudo cargar .env, usando variables de entorno del sistema'
    )
    return {}
  }
}

const env = loadEnv()
const supabaseUrl = env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey =
  env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno no encontradas')
  console.error(
    '   Asegúrate de tener VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY configuradas'
  )
  process.exit(1)
}

// Crear cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

// Intentar autenticarse opcionalmente si se proveen credenciales de admin
async function maybeSignInAdmin() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  if (!email || !password) return { signedIn: false }
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      console.warn(
        '⚠️ No se pudo iniciar sesión con ADMIN_EMAIL/ADMIN_PASSWORD:',
        error.message
      )
      return { signedIn: false }
    }
    console.log(`🔐 Sesión iniciada como ${email}`)
    return { signedIn: true }
  } catch (err) {
    console.warn('⚠️ Error iniciando sesión como admin:', err.message)
    return { signedIn: false }
  }
}

// ==========================================
// 👥 FUNCIONES DE GESTIÓN
// ==========================================

async function listUsers() {
  try {
    await maybeSignInAdmin()
    console.log('👥 LISTA DE USUARIOS')
    console.log('===================')

    const { data, error } = await supabase.rpc('get_users_list', {
      limit_count: 20,
      offset_count: 0,
    })

    if (error) {
      console.error('❌ Error al obtener lista de usuarios:', error.message)
      console.log('💡 Asegúrate de haber aplicado USER-MANAGEMENT-FIX.sql')
      return
    }

    if (!data || data.length === 0) {
      console.log('📝 No hay usuarios registrados')
      console.log('💡 Los usuarios se crearán automáticamente al registrarse')
      return
    }

    console.log(`Total de usuarios: ${data.length}`)
    console.log('')

    data.forEach((user, index) => {
      const status = user.is_active ? '✅' : '❌'
      const roleIcon =
        user.role === 'admin' ? '👑' : user.role === 'moderator' ? '🛡️' : '👤'
      const lastSignIn = user.last_sign_in
        ? new Date(user.last_sign_in).toLocaleDateString()
        : 'Nunca'

      console.log(`${index + 1}. ${roleIcon} ${user.full_name || user.email}`)
      console.log(`   📧 ${user.email}`)
      console.log(`   🔑 Rol: ${user.role}`)
      console.log(
        `   📅 Creado: ${new Date(user.created_at).toLocaleDateString()}`
      )
      console.log(`   🕐 Último acceso: ${lastSignIn}`)
      console.log(
        `   ${status} Estado: ${user.is_active ? 'Activo' : 'Inactivo'}`
      )
      console.log(`   🆔 ID: ${user.id}`)
      console.log('')
    })
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

async function promoteUser(userId) {
  try {
    await maybeSignInAdmin()
    console.log(`👑 PROMOVIENDO USUARIO A ADMIN`)
    console.log('==============================')
    console.log(`ID del usuario: ${userId}`)
    console.log('')

    const { data, error } = await supabase.rpc('promote_to_admin', {
      target_user_id: userId,
    })

    if (error) {
      console.error('❌ Error al promocionar usuario:', error.message)
      return
    }

    if (data.success) {
      console.log('✅ Éxito:', data.message)
    } else {
      console.log('❌ Error:', data.message)
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

async function demoteUser(userId) {
  try {
    await maybeSignInAdmin()
    console.log(`👤 DEGRADANDO USUARIO A COMÚN`)
    console.log('==============================')
    console.log(`ID del usuario: ${userId}`)
    console.log('')

    const { data, error } = await supabase.rpc('demote_from_admin', {
      target_user_id: userId,
    })

    if (error) {
      console.error('❌ Error al degradar usuario:', error.message)
      return
    }

    if (data.success) {
      console.log('✅ Éxito:', data.message)
    } else {
      console.log('❌ Error:', data.message)
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

async function toggleUserStatus(userId) {
  try {
    await maybeSignInAdmin()
    console.log(`🔄 CAMBIANDO ESTADO DEL USUARIO`)
    console.log('================================')
    console.log(`ID del usuario: ${userId}`)
    console.log('')

    const { data, error } = await supabase.rpc('toggle_user_status', {
      target_user_id: userId,
    })

    if (error) {
      console.error('❌ Error al cambiar estado:', error.message)
      return
    }

    if (data.success) {
      console.log('✅ Éxito:', data.message)
      console.log(`📊 Nuevo estado: ${data.new_status}`)
    } else {
      console.log('❌ Error:', data.message)
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

async function checkUsersSetup() {
  try {
    await maybeSignInAdmin()
    console.log('🔍 VERIFICACIÓN DE CONFIGURACIÓN DE USUARIOS')
    console.log('============================================')

    const { data, error } = await supabase.rpc('check_users_setup')

    if (error) {
      console.error('❌ Error al verificar configuración:', error.message)
      console.log('💡 Asegúrate de haber aplicado USER-MANAGEMENT-FIX.sql')
      return
    }

    const setup = data.users_setup
    console.log('📊 Estado actual:')
    console.log(`   👥 Total de usuarios: ${setup.total_users}`)
    console.log(`   👑 Administradores: ${setup.admin_users}`)
    console.log(`   👤 Usuarios comunes: ${setup.regular_users}`)
    console.log(`   ✅ Usuarios activos: ${setup.active_users}`)
    console.log('')
    console.log('💡 Recomendación:', data.recommendations)
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

function showHelp() {
  console.log('👥 GESTOR DE USUARIOS SUPABASE')
  console.log('=============================')
  console.log('')
  console.log('Comandos disponibles:')
  console.log('  list          - Lista todos los usuarios')
  console.log('  promote <id>  - Promociona usuario a administrador')
  console.log('  demote <id>   - Degrada administrador a usuario común')
  console.log('  toggle <id>   - Activa/desactiva usuario')
  console.log('  check         - Verifica configuración de usuarios')
  console.log('  help          - Muestra esta ayuda')
  console.log('')
  console.log('Variables opcionales:')
  console.log(
    '  ADMIN_EMAIL, ADMIN_PASSWORD  - Credenciales para ejecutar RPCs protegidos'
  )
  console.log('')
  console.log('Ejemplos:')
  console.log('  node scripts/manage-users.js list')
  console.log(
    '  node scripts/manage-users.js promote 123e4567-e89b-12d3-a456-426614174000'
  )
  console.log('  node scripts/manage-users.js check')
}

// ==========================================
// 🎬 EJECUCIÓN
// ==========================================

async function main() {
  const command = process.argv[2]
  const userId = process.argv[3]

  switch (command) {
    case 'list':
      await listUsers()
      break

    case 'promote':
      if (!userId) {
        console.error('❌ Error: Debes proporcionar el ID del usuario')
        console.log(
          'Ejemplo: node scripts/manage-users.js promote 123e4567-e89b-12d3-a456-426614174000'
        )
        process.exit(1)
      }
      await promoteUser(userId)
      break

    case 'demote':
      if (!userId) {
        console.error('❌ Error: Debes proporcionar el ID del usuario')
        console.log(
          'Ejemplo: node scripts/manage-users.js demote 123e4567-e89b-12d3-a456-426614174000'
        )
        process.exit(1)
      }
      await demoteUser(userId)
      break

    case 'toggle':
      if (!userId) {
        console.error('❌ Error: Debes proporcionar el ID del usuario')
        console.log(
          'Ejemplo: node scripts/manage-users.js toggle 123e4567-e89b-12d3-a456-426614174000'
        )
        process.exit(1)
      }
      await toggleUserStatus(userId)
      break

    case 'check':
      await checkUsersSetup()
      break

    case 'help':
    default:
      showHelp()
      break
  }
}

// Ejecutar
main().catch(error => {
  console.error('❌ Error fatal:', error.message)
  process.exit(1)
})
