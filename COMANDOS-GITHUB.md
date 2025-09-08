# Comandos para conectar con GitHub

## Reemplaza TU_USUARIO con tu nombre de usuario de GitHub

```bash
# 1. Agregar remote origin
git remote add origin https://github.com/TU_USUARIO/tienda_RockBrosStore.git

# 2. Verificar remote
git remote -v

# 3. Hacer push inicial
git push -u origin main

# 4. Verificar en GitHub
# Ve a: https://github.com/TU_USUARIO/tienda_RockBrosStore
```

## Si hay errores de autenticación:

```bash
# Configurar credenciales (si es necesario)
git config --global user.name "Tu Nombre"
git config --global user.email "tu-email@ejemplo.com"
```

¡Listo para subir a GitHub! 🚀
