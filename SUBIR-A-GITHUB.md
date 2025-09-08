# 🚀 INSTRUCCIONES PARA SUBIR A GITHUB

## 📋 Pasos para crear el repositorio "tienda_RockBrosStore"

### 1. Crear Repositorio en GitHub

1. Ve a [GitHub.com](https://github.com) e inicia sesión
2. Haz clic en el botón **"+"** en la esquina superior derecha
3. Selecciona **"New repository"**
4. Completa la información:
   - **Repository name:** `tienda_RockBrosStore`
   - **Description:** `🚴‍♂️ Tienda online de accesorios y repuestos RockBros para ciclismo - Sistema completo con autenticación admin, gestión de productos y funcionalidades modernas`
   - **Visibility:** Public ✅
   - **NO marques** "Add a README file" (ya tenemos uno)
   - **NO marques** "Add .gitignore" (ya tenemos uno)
   - **NO marques** "Choose a license" (podemos agregarlo después)

5. Haz clic en **"Create repository"**

### 2. Conectar Repositorio Local

Después de crear el repositorio en GitHub, ejecuta estos comandos en orden:

```bash
# 1. Agregar el remote origin
git remote add origin https://github.com/TU_USUARIO/tienda_RockBrosStore.git

# 2. Verificar que se agregó correctamente
git remote -v

# 3. Subir el código a GitHub
git push -u origin main
```

**IMPORTANTE:** Reemplaza `TU_USUARIO` con tu nombre de usuario de GitHub.

### 3. Verificar que se subió correctamente

1. Ve a tu repositorio en GitHub: `https://github.com/TU_USUARIO/tienda_RockBrosStore`
2. Verifica que todos los archivos estén presentes
3. Revisa que el README.md se muestre correctamente

## 🔧 Comandos Preparados

Una vez que tengas la URL del repositorio, ejecuta:

```bash
cd "C:/Users/Usuario/Desktop/tienda_ciclismo"
git remote add origin https://github.com/TU_USUARIO/tienda_RockBrosStore.git
git push -u origin main
```

## 📊 Estado Actual del Proyecto

✅ **Listo para GitHub:**
- Repositorio git inicializado
- Todos los archivos commiteados
- .gitignore configurado
- README.md completo
- Documentación incluida
- Sistema admin funcional

## 🎯 Después de subir a GitHub

1. **Configurar GitHub Pages** (opcional):
   - Settings → Pages → Source: Deploy from a branch → main
   
2. **Configurar protección de branches** (recomendado):
   - Settings → Branches → Add rule for `main`
   
3. **Invitar colaboradores** (si es necesario):
   - Settings → Manage access → Invite a collaborator

## ⚠️ Importante

- **NO subas las variables de entorno** (.env.local está en .gitignore)
- **Configura las variables de entorno** en tu plataforma de deployment
- **Revisa que no hay información sensible** en el código

## 🚀 Deployment

Para deployar la aplicación:

1. **Vercel** (recomendado): Conecta tu repositorio GitHub
2. **Netlify**: Conecta tu repositorio GitHub  
3. **GitHub Pages**: Configura build action para Vite

¡Tu proyecto está listo para ser subido a GitHub! 🎉
