# 🧪 Carpeta de Testing - Guía Rápida

Bienvenido a la carpeta de testing de **Tienda RockBros Store**. Aquí se encuentran todos los scripts, herramientas y recursos para testing.

---

## 📁 Contenido de la Carpeta

```
tests/
├── README.md (este archivo)
├── test-supabase.js                    # Suite completa de tests Supabase
├── verify-supabase.js                  # Verificación rápida de conexión
├── supabase-test.html                  # Tests en navegador
├── validate-error-handling.js          # ✨ Tests de error handling
├── validate-routes-navigation.js       # ✨ Tests de rutas y navegación
├── run-all-tests.js                    # ✨ Ejecutor principal de tests
├── cleanup-temp-files.sh               # Limpieza de archivos temporales
├── cleanup-unused-deps.sh              # Limpieza de dependencias
└── identify-temp-files.sh              # Identificar archivos temporales
```

---

## 🚀 Ejecución Rápida

### ✨ Tests de Validación (NUEVO)

```bash
# Ejecutar todos los tests de validación
npm run test:all

# Solo test de error handling
npm run test:error-handling

# Solo test de rutas y navegación
npm run test:routes

# Alias para todos los tests
npm run test:validation
```

### Tests de Supabase

```bash
# Test básico (Recomendado para empezar)
npm run test:supabase

# Test detallado
npm run test:supabase:verbose

# Test en navegador
npm run test:supabase:html
# Luego abre: http://localhost:3001/supabase-test.html

# Verificación rápida
npm run verify:supabase
```

---

## 📋 Scripts Disponibles

### test-supabase.js

Suite completa de tests que verifica:

- ✅ Conexión a Supabase
- ✅ Autenticación
- ✅ Base de datos (lectura/escritura)
- ✅ Storage
- ✅ Funciones backend
- ✅ RLS (Row Level Security)
- ✅ Performance

**Uso**:

```bash
# Ejecución normal
npm run test:supabase

# Con logs detallados
npm run test:supabase:verbose

# Con output JSON (para CI/CD)
npm run test:supabase:json

# Directo
node scripts/test-supabase.js
node scripts/test-supabase.js --verbose
node scripts/test-supabase.js --json
```

### verify-supabase.js

Verificación rápida de elementos críticos:

- ✅ Conexión básica
- ✅ Tabla products
- ✅ Tabla profiles
- ✅ Storage

**Uso**:

```bash
npm run verify:supabase
node scripts/verify-supabase.js
```

### supabase-test.html

Tests ejecutables desde el navegador:

- 🌐 UI interactiva
- 📊 Resultados visuales
- 🔄 Actualizaciones en tiempo real

**Uso**:

```bash
# Opción 1: Sirve los archivos en puerto 3001
npm run test:supabase:html

# Opción 2: Manual
cd /ruta/al/proyecto
python -m http.server 3000
# Abre: http://localhost:3000/tests/supabase-test.html
```

---

## 🧹 Limpieza y Mantenimiento

### Limpiar Archivos Temporales

```bash
# Identificar temporales
bash tests/identify-temp-files.sh

# Limpiar
bash tests/cleanup-temp-files.sh
```

### Limpiar Dependencias No Usadas

```bash
bash tests/cleanup-unused-deps.sh
```

---

## 📊 Resultados de Tests

### Salida Estándar

```
✅ Test 1: Conexión a Supabase
✅ Test 2: Autenticación
✅ Test 3: Lectura de Productos
...
━━━━━━━━━━━━━━━━━━━━━━━
RESUMEN: 15 tests pasados, 0 fallidos
```

### Salida Verbose

Incluye logs detallados de cada operación, tiempos de respuesta y detalles de errores.

### Salida JSON

```json
{
  "timestamp": "2025-10-26T20:38:00Z",
  "total": 15,
  "passed": 15,
  "failed": 0,
  "tests": [
    {
      "name": "Conexión a Supabase",
      "status": "passed",
      "duration": 245
    }
  ]
}
```

---

## 🐛 Troubleshooting

### Error: Cannot find module 'supabase'

```bash
npm install
```

### Error: VITE_SUPABASE_URL is not defined

```bash
# Asegúrate de tener .env.local configurado
cp .env.example .env.local
# Editar con tus credenciales
```

### Error en Navegador: CORS

- Verificar que el servidor está corriendo correctamente
- Limpiar caché del navegador (Ctrl+Shift+Delete)
- Usar incógnito

### Timeout en Tests

```bash
# Aumentar timeout (algunos tests demoran)
npm run test:supabase:verbose
```

---

## 🔍 Qué Verifican los Tests

### Conectividad

- ✅ URL de Supabase válida
- ✅ Credenciales correctas
- ✅ Conexión de red activa

### Autenticación

- ✅ JWT tokens válidos
- ✅ Refresh tokens funcionan
- ✅ Logout limpia correctamente

### Base de Datos

- ✅ Tablas existen
- ✅ Índices están optimizados
- ✅ RLS está activado
- ✅ Lectura/escritura funciona

### Storage

- ✅ Buckets existen
- ✅ Políticas de acceso correctas
- ✅ Upload/download funciona

### Funciones

- ✅ Edge Functions están activadas
- ✅ Endpoints responden

---

## 📈 Performance Testing

Los tests incluyen medición de:

- ⏱️ Tiempo de respuesta de queries
- 🔄 Velocidad de conexión
- 💾 Uso de memoria
- 📊 Operaciones por segundo

---

## 🔐 Seguridad

Los tests verifican:

- ✅ RLS está habilitado
- ✅ Políticas de acceso correcto
- ✅ No hay datos sensibles expuestos
- ✅ Tokens se manejan correctamente

---

## 🚀 CI/CD Integration

### GitHub Actions

```yaml
- name: Run Tests
  run: npm run test:supabase:json

- name: Parse Results
  run: |
    RESULTS=$(npm run test:supabase:json)
    echo "$RESULTS" | jq .
```

### Pre-commit Hook

```bash
#!/bin/bash
npm run verify:supabase || exit 1
```

---

## 📚 Referencias

- [Documentación Principal](./README.md)
- [TESTS-README.md](../docs/TESTS-README.md) - Guía completa de testing
- [Troubleshooting](../README.md#-troubleshooting)

---

## 💡 Tips y Trucos

### Test Rápido Antes de Commit

```bash
npm run verify:supabase
```

### Test Completo con Logs

```bash
npm run test:supabase:verbose 2>&1 | tee test-results.log
```

### Monitorear Tests Continuamente

```bash
watch -n 5 "npm run verify:supabase"
```

### Export Resultados

```bash
npm run test:supabase:json > test-results.json
```

---

## ✨ NUEVOS TESTS DE VALIDACIÓN

### 🧪 validate-error-handling.js

Valida que las páginas críticas implementen correctamente el manejo de errores:

**Qué valida:**

- ✅ Estados de error con mensajes claros
- ✅ Estados de carga (loading/skeleton)
- ✅ Lógica de retry para recuperación
- ✅ Error boundaries para captura de errores
- ✅ Try/catch en operaciones async
- ✅ Notificaciones de usuario (toasts)

**Páginas analizadas:**

- DashboardOverview.tsx
- Orders.tsx
- Favorites.tsx
- ChangePassword.tsx
- AdminEcommerceDashboard.tsx

**Uso:**

```bash
npm run test:error-handling
node tests/validate-error-handling.js
```

### 🧪 validate-routes-navigation.js

Valida la configuración correcta de rutas y navegación:

**Qué valida:**

- ✅ Configuración de rutas en App.tsx
- ✅ Componentes ProtectedRoute y AdminRoute
- ✅ Layouts y estructura consistente
- ✅ Páginas críticas implementadas
- ✅ Componentes de navegación funcionales

**Componentes analizados:**

- App.tsx (configuración de rutas)
- ProtectedRoute.tsx & AdminRoute.tsx
- Layouts (DashboardLayout, AdminPageLayout, etc.)
- Páginas críticas (Login, Dashboard, etc.)
- Componentes de navegación (Header, Sidebar, etc.)

**Uso:**

```bash
npm run test:routes
node tests/validate-routes-navigation.js
```

### 🧪 run-all-tests.js

Ejecutor principal que combina todos los tests y genera un reporte completo:

**Características:**

- ✅ Ejecuta todos los tests de validación
- ✅ Genera reporte final con scoring
- ✅ Crea archivo JSON con resultados detallados
- ✅ Proporciona plan de acción recomendado
- ✅ Estadísticas y métricas completas

**Uso:**

```bash
npm run test:all
npm run test:validation
node tests/run-all-tests.js
```

**Output esperado:**

- Score general del proyecto
- Detalles por componente
- Recomendaciones específicas
- Plan de acción prioritario
- Reporte JSON en `tests/test-results.json`

---

## 📊 Interpretación de Resultados

### Scoring System

- **90-100%**: 🏆 Excelente - Mantener el nivel
- **80-89%**: ✅ Muy bueno - Pequeñas mejoras
- **70-79%**: ⚡ Bueno - Algunas mejoras recomendadas
- **60-69%**: ⚠️ Aceptable - Necesita mejoras
- **<60%**: 🚨 Crítico - Requiere atención inmediata

### Archivos de Output

```
tests/
└── test-results.json    # Reporte detallado en JSON
```

---

## 🤝 Contribuir

Si encuentras un bug o tienes una sugerencia:

1. Abre una Issue en GitHub
2. Describe el problema detalladamente
3. Incluye los logs de los tests

---

## 📞 Soporte

- **Documentación completa**: [docs/](../docs/)
- **README**: [README.md](../README.md)
- **Issues**: [GitHub Issues](https://github.com/basabecode/tienda_RockBrosStore/issues)

---

**Última actualización**: 26 de octubre de 2025

¡Happy Testing! 🧪✨
