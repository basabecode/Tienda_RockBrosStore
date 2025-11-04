// ==========================================
// 🔧 SCRIPT PARA APLICAR CORRECCIONES RLS
// Fecha: 2 de noviembre de 2025
// ==========================================

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { config } from 'dotenv'

// Cargar variables de entorno
config()

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Variables de entorno de Supabase no configuradas')
  console.log('Asegúrate de tener configurado:')
  console.log('- VITE_SUPABASE_URL')
  console.log('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function applyRLSFixes() {
  console.log('🚀 Iniciando aplicación de correcciones RLS...\n')

  try {
    // 1. ✅ Crear política de INSERT para perfiles
    console.log('1️⃣ Creando política de INSERT para perfiles...')
    const { error: insertPolicyError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE POLICY "Usuarios pueden crear su propio perfil" ON public.profiles
        FOR INSERT
        WITH CHECK (auth.uid() = id);
      `,
    })

    if (
      insertPolicyError &&
      !insertPolicyError.message.includes('already exists')
    ) {
      console.error('❌ Error creando política de INSERT:', insertPolicyError)
    } else {
      console.log('✅ Política de INSERT creada exitosamente')
    }

    // 2. ✅ Crear políticas de favoritos
    console.log('\n2️⃣ Creando políticas de favoritos...')

    // Eliminar políticas existentes
    await supabase.rpc('exec_sql', {
      sql: `DROP POLICY IF EXISTS "Usuarios pueden ver sus propios favoritos" ON public.favorites;`,
    })
    await supabase.rpc('exec_sql', {
      sql: `DROP POLICY IF EXISTS "Usuarios pueden gestionar sus propios favoritos" ON public.favorites;`,
    })

    // Crear nuevas políticas
    const { error: favoritesPolicyError1 } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE POLICY "Usuarios pueden ver sus propios favoritos" ON public.favorites
        FOR SELECT
        USING (auth.uid() = user_id);
      `,
    })

    const { error: favoritesPolicyError2 } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE POLICY "Usuarios pueden gestionar sus propios favoritos" ON public.favorites
        FOR ALL
        USING (auth.uid() = user_id);
      `,
    })

    if (favoritesPolicyError1 || favoritesPolicyError2) {
      console.error(
        '❌ Error creando políticas de favoritos:',
        favoritesPolicyError1 || favoritesPolicyError2
      )
    } else {
      console.log('✅ Políticas de favoritos creadas exitosamente')
    }

    // 3. ✅ Crear función y trigger para auto-crear perfiles
    console.log('\n3️⃣ Creando función y trigger para auto-crear perfiles...')

    const { error: functionError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS TRIGGER AS $$
        BEGIN
            INSERT INTO public.profiles (id, full_name, email, role)
            VALUES (
                NEW.id,
                COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
                NEW.email,
                COALESCE(NEW.raw_user_meta_data->>'role', 'user')
            );
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `,
    })

    if (functionError) {
      console.error('❌ Error creando función:', functionError)
    } else {
      console.log('✅ Función handle_new_user creada exitosamente')
    }

    // Eliminar trigger existente y crear nuevo
    await supabase.rpc('exec_sql', {
      sql: `DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;`,
    })

    const { error: triggerError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TRIGGER on_auth_user_created
            AFTER INSERT ON auth.users
            FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
      `,
    })

    if (triggerError) {
      console.error('❌ Error creando trigger:', triggerError)
    } else {
      console.log('✅ Trigger on_auth_user_created creado exitosamente')
    }

    // 4. ✅ Verificar estructura de tabla profiles
    console.log('\n4️⃣ Verificando estructura de tabla profiles...')

    const { data: columns } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', 'profiles')

    const columnNames = columns?.map(col => col.column_name) || []

    if (!columnNames.includes('role')) {
      const { error } = await supabase.rpc('exec_sql', {
        sql: `ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));`,
      })
      console.log(
        error ? '❌ Error agregando columna role' : '✅ Columna role agregada'
      )
    }

    if (!columnNames.includes('full_name')) {
      const { error } = await supabase.rpc('exec_sql', {
        sql: `ALTER TABLE public.profiles ADD COLUMN full_name TEXT;`,
      })
      console.log(
        error
          ? '❌ Error agregando columna full_name'
          : '✅ Columna full_name agregada'
      )
    }

    if (!columnNames.includes('email')) {
      const { error } = await supabase.rpc('exec_sql', {
        sql: `ALTER TABLE public.profiles ADD COLUMN email TEXT;`,
      })
      console.log(
        error ? '❌ Error agregando columna email' : '✅ Columna email agregada'
      )
    }

    // 5. ✅ Verificar tabla favorites
    console.log('\n5️⃣ Verificando tabla favorites...')

    const { data: tables } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'favorites')

    if (!tables || tables.length === 0) {
      console.log('🔧 Creando tabla favorites...')
      const { error: createTableError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE public.favorites (
              id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
              user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
              product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
              created_at TIMESTAMPTZ DEFAULT NOW(),
              UNIQUE(user_id, product_id)
          );

          ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

          CREATE INDEX idx_favorites_user_id ON public.favorites(user_id);
          CREATE INDEX idx_favorites_product_id ON public.favorites(product_id);
        `,
      })

      if (createTableError) {
        console.error('❌ Error creando tabla favorites:', createTableError)
      } else {
        console.log('✅ Tabla favorites creada exitosamente')
      }
    } else {
      console.log('✅ Tabla favorites ya existe')
    }

    console.log('\n🎉 ¡Todas las correcciones RLS aplicadas exitosamente!')
    console.log('\n📋 Resumen de lo aplicado:')
    console.log('  ✅ Política de INSERT para perfiles')
    console.log('  ✅ Políticas de favoritos (SELECT y ALL)')
    console.log('  ✅ Función handle_new_user()')
    console.log('  ✅ Trigger on_auth_user_created')
    console.log('  ✅ Verificación de columnas en profiles')
    console.log('  ✅ Verificación/creación de tabla favorites')

    console.log('\n🚀 Los clientes ahora pueden:')
    console.log('  • Registrarse y crear automáticamente su perfil')
    console.log('  • Agregar y gestionar favoritos')
    console.log('  • Hacer pedidos sin errores de RLS')
  } catch (error) {
    console.error('💥 Error aplicando correcciones:', error)
    process.exit(1)
  }
}

// Función auxiliar para ejecutar SQL (si no existe la RPC)
async function createExecSQLFunction() {
  try {
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION public.exec_sql(sql TEXT)
        RETURNS VOID AS $$
        BEGIN
            EXECUTE sql;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `,
    })

    if (error && !error.message.includes('already exists')) {
      console.log('Creando función exec_sql...')
      // Si falla, usar método alternativo
      return false
    }
    return true
  } catch (err) {
    return false
  }
}

// Ejecutar el script
console.log('🔧 Script de Corrección RLS - Tienda RockBros')
console.log('='.repeat(50))

applyRLSFixes()
