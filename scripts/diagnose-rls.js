// ==========================================
// 🔧 SCRIPT SIMPLIFICADO PARA CORRECCIONES RLS
// Fecha: 2 de noviembre de 2025
// ==========================================

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Cargar variables de entorno
config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Variables de entorno de Supabase no configuradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function testConnection() {
  console.log('🔗 Probando conexión a Supabase...\n')

  try {
    // Probar consulta simple
    const { data, error } = await supabase
      .from('products')
      .select('id')
      .limit(1)

    if (error) {
      console.error('❌ Error conectando a Supabase:', error)
      return false
    }

    console.log('✅ Conexión exitosa a Supabase')
    return true
  } catch (err) {
    console.error('❌ Error de conexión:', err)
    return false
  }
}

async function checkProfiles() {
  console.log('\n📊 Verificando tabla profiles...')

  try {
    const { data, error } = await supabase.from('profiles').select('*').limit(1)

    if (error) {
      console.error('❌ Error accediendo a profiles:', error)
      return false
    }

    console.log('✅ Tabla profiles accesible')

    // Verificar estructura
    if (data && data.length > 0) {
      const columns = Object.keys(data[0])
      console.log('📋 Columnas encontradas:', columns.join(', '))

      const requiredColumns = ['id', 'role', 'full_name', 'email']
      const missingColumns = requiredColumns.filter(
        col => !columns.includes(col)
      )

      if (missingColumns.length > 0) {
        console.log('⚠️ Columnas faltantes:', missingColumns.join(', '))
      } else {
        console.log('✅ Todas las columnas requeridas están presentes')
      }
    }

    return true
  } catch (err) {
    console.error('❌ Error verificando profiles:', err)
    return false
  }
}

async function checkFavorites() {
  console.log('\n💖 Verificando tabla favorites...')

  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .limit(1)

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('⚠️ Tabla favorites no existe o no es accesible')
        console.log('📝 Esto puede indicar que faltan políticas RLS o la tabla')
        return false
      } else {
        console.error('❌ Error accediendo a favorites:', error)
        return false
      }
    }

    console.log('✅ Tabla favorites accesible')

    if (data) {
      console.log(`📊 Registros de favoritos encontrados: ${data.length}`)
    }

    return true
  } catch (err) {
    console.error('❌ Error verificando favorites:', err)
    return false
  }
}

async function showCurrentIssues() {
  console.log('\n🔍 Diagnosticando problemas actuales...\n')

  // 1. Verificar si puede crear un perfil de prueba
  console.log('1️⃣ Probando creación de perfil...')
  try {
    const testUserId = '00000000-0000-0000-0000-000000000000'
    const { error } = await supabase.from('profiles').insert([
      {
        id: testUserId,
        full_name: 'Test User',
        email: 'test@test.com',
        role: 'user',
      },
    ])

    if (error) {
      console.log('❌ No se puede insertar perfil:', error.message)
      if (error.code === '42501') {
        console.log('🔐 Problema: Falta política RLS de INSERT para profiles')
      }
    } else {
      console.log('✅ Inserción de perfil funciona')
      // Limpiar el registro de prueba
      await supabase.from('profiles').delete().eq('id', testUserId)
    }
  } catch (err) {
    console.log('❌ Error probando inserción:', err.message)
  }

  // 2. Verificar favoritos
  console.log('\n2️⃣ Probando tabla favorites...')
  try {
    const { error } = await supabase
      .from('favorites')
      .select('count(*)')
      .limit(1)

    if (error) {
      console.log('❌ No se puede acceder a favorites:', error.message)
      if (error.code === 'PGRST116') {
        console.log(
          '🔐 Problema: Tabla favorites no existe o faltan políticas RLS'
        )
      }
    } else {
      console.log('✅ Acceso a favorites funciona')
    }
  } catch (err) {
    console.log('❌ Error accediendo a favorites:', err.message)
  }
}

async function provideSolutions() {
  console.log('\n💡 SOLUCIONES RECOMENDADAS:\n')

  console.log('🔧 Para aplicar las correcciones manualmente:')
  console.log('1. Abre el SQL Editor en tu dashboard de Supabase')
  console.log('2. Copia y pega el contenido del archivo:')
  console.log('   📄 supabase/FIX-RLS-POLICIES-OCT29-2025.sql')
  console.log('3. Ejecuta el script completo')

  console.log('\n🌐 URL del dashboard de Supabase:')
  console.log(
    `   https://supabase.com/dashboard/project/${
      supabaseUrl.split('//')[1].split('.')[0]
    }`
  )

  console.log('\n📋 Correcciones que se aplicarán:')
  console.log('   ✅ Política de INSERT para tabla profiles')
  console.log('   ✅ Políticas completas para tabla favorites')
  console.log('   ✅ Trigger automático para crear perfiles')
  console.log('   ✅ Verificación de columnas requeridas')

  console.log('\n🎯 Resultado esperado:')
  console.log('   • Los clientes podrán registrarse sin errores')
  console.log('   • Los favoritos funcionarán correctamente')
  console.log('   • Se crearán perfiles automáticamente al registrarse')
}

async function main() {
  console.log('🔧 Diagnóstico RLS - Tienda RockBros')
  console.log('='.repeat(50))

  const connected = await testConnection()
  if (!connected) {
    console.log(
      '\n❌ No se pudo conectar a Supabase. Verifica las variables de entorno.'
    )
    return
  }

  await checkProfiles()
  await checkFavorites()
  await showCurrentIssues()
  await provideSolutions()

  console.log('\n✨ Diagnóstico completado')
  console.log(
    '\n🚀 Siguiente paso: Ejecuta el script SQL en el dashboard de Supabase'
  )
}

main().catch(console.error)
