# 📋 Instrucciones para subir a GitHub

## 🎯 Paso 1: Crear el repositorio en GitHub

1. **Ve a GitHub**: https://github.com/new
2. **Configuración del repositorio**:
   - **Repository name**: `tienda_RockBrosStore`
   - **Description**: `🚴‍♂️ Tienda online completa de accesorios para ciclismo con React + TypeScript + Supabase. Sistema de autenticación, panel admin, carrito de compras y más.`
   - **Visibility**: Public (o Private si prefieres)
   - **⚠️ NO marques**: "Add a README file"
   - **⚠️ NO marques**: "Add .gitignore"
   - **⚠️ NO marques**: "Choose a license"

3. **Clic en**: "Create repository"

## 🔗 Paso 2: Conectar el repositorio local

Después de crear el repositorio en GitHub, ejecuta estos comandos en el terminal:

```bash
# Navegar al directorio del proyecto
cd "C:/Users/Usuario/Desktop/tienda_ciclismo"

# Agregar el remote origin (reemplaza 'tu-usuario' con tu username de GitHub)
git remote add origin https://github.com/basabecode/tienda_RockBrosStore.git

# Verificar que se agregó correctamente
git remote -v

# Subir todos los archivos a GitHub
git push -u origin main
```

## 🚀 Paso 3: Verificar que se subió correctamente

1. **Refresca la página** del repositorio en GitHub
2. **Verifica que aparezcan** todos los archivos:
   - README.md actualizado
   - Carpeta `src/` con todos los componentes
   - Carpeta `supabase/` con esquemas SQL
   - Carpeta `docs/` con documentación
   - Scripts de configuración en `scripts/`

## 📝 Paso 4: Crear releases y tags (opcional)

```bash
# Crear un tag para la primera versión
git tag -a v1.0.0 -m "Release inicial: Sistema completo de tienda de ciclismo"

# Subir el tag a GitHub
git push origin v1.0.0
```

## 🎉 ¡Listo!

Una vez completados estos pasos, tendrás tu proyecto completamente subido a GitHub como:
**https://github.com/basabecode/tienda_RockBrosStore**

### 📋 Checklist de verificación:

- [ ] Repositorio creado en GitHub
- [ ] Remote origin configurado
- [ ] Código subido con `git push`
- [ ] README.md visible en GitHub
- [ ] Todos los archivos presentes
- [ ] Tag v1.0.0 creado (opcional)

---

## 🛠️ Comandos de respaldo (si algo sale mal):

```bash
# Si necesitas cambiar la URL del remote
git remote set-url origin https://github.com/basabecode/tienda_RockBrosStore.git

# Si necesitas forzar el push (solo si es necesario)
git push -f origin main

# Si quieres ver el estado actual
git status

# Si quieres ver el historial de commits
git log --oneline
```
