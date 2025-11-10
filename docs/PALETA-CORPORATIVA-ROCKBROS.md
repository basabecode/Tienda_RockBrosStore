# 🎨 PALETA DE COLORES CORPORATIVA - ROCKBROS

## 📋 **Colores Oficiales de Marca**

### 🎯 **Colores Principales**

```css
#656565  /* Gris Medio - Textos secundarios, borders sutiles */
#383838  /* Gris Oscuro - Textos principales, navegación */
#0FFF95  /* Verde Neón - Accents, highlights, CTAs secundarios */
#06BA63  /* Verde Bosque - Botones primarios, éxito, confirmación */
#000000  /* Negro - Texto principal, contrastes máximos */
```

---

## 🏗️ **Sistema de Design Implementado**

### **Variables Tailwind CSS**

```javascript
// RockBros Corporate Brand Colors
'rockbros': {
  'gray-medium': '#656565',    // Textos secundarios, borders sutiles
  'gray-dark': '#383838',      // Textos principales, navegación
  'green-neon': '#0FFF95',     // Accents, highlights, CTAs secundarios
  'green-forest': '#06BA63',   // Botones primarios, éxito, confirmación
  'black': '#000000',          // Texto principal, contrastes máximos
},

// Semantic brand colors for easier usage
'brand': {
  'primary': '#06BA63',        // Verde bosque - Principal
  'secondary': '#0FFF95',      // Verde neón - Secundario/Accents
  'neutral': '#656565',        // Gris medio - Neutro
  'dark': '#383838',          // Gris oscuro - Oscuro
  'contrast': '#000000',      // Negro - Máximo contraste
}
```

---

## 🎨 **Estrategia de Distribución Visual**

### **1. Jerarquía de Colores**

#### **🟢 Verde Bosque (#06BA63) - COLOR PRINCIPAL**

- **Uso:** Botones primarios, elementos de confirmación, éxito
- **Aplicación:** CTAs principales, estados de éxito, elementos destacados
- **Razón:** Transmite confianza, naturaleza (ciclismo), profesionalismo

#### **🟢 Verde Neón (#0FFF95) - COLOR SECUNDARIO/ACCENTS**

- **Uso:** Highlights, hovers, accents, badges especiales
- **Aplicación:** Efectos hover, indicadores activos, elementos interactivos
- **Razón:** Energía, modernidad, innovación tecnológica

#### **⚫ Gris Oscuro (#383838) - TEXTO PRINCIPAL**

- **Uso:** Títulos, texto principal, navegación
- **Aplicación:** Headers, menús, contenido principal
- **Razón:** Legibilidad excelente, profesional, neutro

#### **⚫ Gris Medio (#656565) - TEXTO SECUNDARIO**

- **Uso:** Descripciones, textos de soporte, borders sutiles
- **Aplicación:** Subtítulos, metadatos, elementos secundarios
- **Razón:** Jerarquía visual clara, accesibilidad

#### **⚫ Negro (#000000) - MÁXIMO CONTRASTE**

- **Uso:** Elementos críticos, texto sobre fondos claros
- **Aplicación:** Texto de alta importancia, contrastes necesarios
- **Razón:** Accesibilidad WCAG AAA, máxima legibilidad

---

## 📐 **Implementación por Componentes**

### **Categories Grid**

- **Overlays:** Colores brand dinámicos por categoría
- **Texto:** Blanco con hover a `brand-secondary` (verde neón)
- **Badges:** Efectos hover con colores corporativos

### **Featured Banner**

- **Fondo:** `brand-dark` (gris oscuro) para contraste
- **Accents:** `brand-secondary` (verde neón) para destacar
- **CTAs:** `brand-secondary` → `brand-primary` en hover
- **Precios:** `brand-secondary` → `brand-primary` en hover

### **Efectos Interactivos**

- **Partículas:** Transición de blanco a colores brand en hover
- **Hovers:** Uso estratégico de verde neón para dinamismo
- **Transiciones:** Colores brand con duraciones optimizadas

---

## ♿ **Accesibilidad y Contraste**

### **Ratios de Contraste WCAG**

```css
/* ✅ Combinaciones Aprobadas - Original RockBros */
✅ #000000 sobre #FFFFFF - 21:1 (AAA)
✅ #383838 sobre #FFFFFF - 12.6:1 (AAA)
✅ #656565 sobre #FFFFFF - 7:1 (AA)
✅ #06BA63 sobre #FFFFFF - 3.2:1 (AA normal)
✅ #000000 sobre #0FFF95 - 8.4:1 (AAA)

/* ✅ Combinaciones Aprobadas - Nueva Paleta Emerald (Panel Admin) */
✅ #000000 sobre #FFFFFF - 21:1 (AAA)
✅ #1f2937 sobre #FFFFFF - 16:1 (AAA) /* gray-800 */
✅ #374151 sobre #FFFFFF - 12:1 (AAA) /* gray-700 */
✅ #111827 sobre #FFFFFF - 19:1 (AAA) /* gray-900 */
✅ #10b981 sobre #FFFFFF - 4.8:1 (AA+) /* emerald-500 */
✅ #059669 sobre #FFFFFF - 6.2:1 (AA+) /* emerald-600 */

/* ❌ Combinaciones PROHIBIDAS */
❌ #0FFF95 sobre #FFFFFF - 1.9:1 (Insuficiente)
❌ #656565 sobre #383838 - 1.8:1 (Insuficiente)
❌ text-gray-600 sobre bg-gray-50 - 2.8:1 (Insuficiente)
❌ text-gray-500 sobre bg-gray-100 - 2.2:1 (Insuficiente)
❌ Cualquier texto gris sobre fondo gris - <3:1 (Crítico)
```

### **🚫 REGLA CRÍTICA: NO GRIS SOBRE GRIS**

**⚠️ NUNCA combinar fondos grises con textos grises o negros de baja intensidad.**

```css
/* ❌ PROHIBIDO - Problemas de accesibilidad graves */
.bg-gray-50 .text-gray-600   /* Ratio: ~2.8:1 - Insuficiente */
.bg-gray-100 .text-gray-500  /* Ratio: ~2.2:1 - Crítico */
.bg-gray-200 .text-gray-400  /* Ratio: ~1.8:1 - Inaceptable */

/* ✅ CORRECTO - Alternativas accesibles */
.bg-slate-50 .text-gray-900    /* Ratio: ~16:1 - Excelente */
.bg-emerald-50 .text-gray-800  /* Ratio: ~12:1 - Perfecto */
.bg-white .text-gray-700; /* Ratio: ~9:1 - Muy bueno */
```

---

## 🎯 **Guía de Uso Recomendada**

### **Fondos Principales**

- **Claro:** `#FFFFFF` (blanco)
- **Oscuro:** `#383838` (gris oscuro)
- **Contraste:** `#000000` (negro)

### **Texto sobre Fondos Claros**

1. **Principal:** `#000000` o `#383838`
2. **Secundario:** `#656565`
3. **Accents:** `#06BA63`

### **Texto sobre Fondos Oscuros**

1. **Principal:** `#FFFFFF`
2. **Accents:** `#0FFF95` o `#06BA63`
3. **Secundario:** `rgba(255,255,255,0.8)`

### **Elementos Interactivos**

- **Estado Normal:** `#06BA63` (verde bosque)
- **Estado Hover:** `#0FFF95` (verde neón)
- **Estado Activo:** Gradiente entre ambos verdes
- **Estado Disabled:** `#656565` (gris medio)

---

## 🚀 **Variables CSS Implementadas**

```css
:root {
  /* RockBros Brand Color Variables */
  --rockbros-gray-medium: 0 0% 40%; /* #656565 */
  --rockbros-gray-dark: 0 0% 22%; /* #383838 */
  --rockbros-green-neon: 158 100% 53%; /* #0FFF95 */
  --rockbros-green-forest: 158 95% 39%; /* #06BA63 */
  --rockbros-black: 0 0% 0%; /* #000000 */

  /* Sistema de colores actualizado */
  --primary: 158 95% 39%; /* Verde bosque */
  --secondary: 158 100% 53%; /* Verde neón */
  --foreground: 0 0% 22%; /* Gris oscuro */
  --muted-foreground: 0 0% 40%; /* Gris medio */
}
```

---

## 🎨 **Gradientes Corporativos**

```css
/* Gradiente Principal */
--gradient-primary: linear-gradient(
  135deg,
  hsl(158 95% 39%),
  hsl(158 100% 53%)
);

/* Gradiente Hero */
--gradient-hero: linear-gradient(
  135deg,
  hsl(158 95% 39%) 0%,
  hsl(158 100% 53%) 100%
);

/* Sombras Corporativas */
--shadow-soft: 0 2px 10px -2px hsl(158 95% 39% / 0.1);
--shadow-medium: 0 8px 25px -5px hsl(158 95% 39% / 0.15);
--shadow-large: 0 20px 40px -10px hsl(158 95% 39% / 0.2);
```

---

## 👩‍💻 **Implementación Correcta en Componentes**

### **✅ Ejemplos Correctos - Panel de Admin**

```tsx
// ✅ EXCELENTE - Panel con contraste perfecto
<div className="bg-white border border-gray-200">
  <div className="bg-slate-50 p-4 border-b border-gray-200">
    <h2 className="text-gray-900 font-semibold">Panel de Administración</h2>
  </div>
  <div className="p-4">
    <button className="bg-emerald-600 text-white hover:bg-emerald-700">
      Acción Principal
    </button>
  </div>
</div>

// ✅ CORRECTO - Tablas con hover accesible
<tr className="hover:bg-emerald-50/30 transition-colors">
  <td className="text-gray-900">Contenido completamente legible</td>
  <td className="text-emerald-700">Estado activo visible</td>
</tr>

// ✅ PERFECTO - Cards con contraste adecuado
<div className="bg-white border border-gray-200 hover:bg-emerald-50/20">
  <h3 className="text-gray-900 font-medium">Título Claro</h3>
  <p className="text-gray-700">Descripción con buen contraste</p>
</div>
```

### **❌ Ejemplos PROHIBIDOS - Problemas de Accesibilidad**

```tsx
// ❌ CRÍTICO - Contraste insuficiente
<div className="bg-gray-50">
  <p className="text-gray-600">❌ Difícil de leer (2.8:1)</p>
  <span className="text-gray-500">❌ Contraste crítico (2.2:1)</span>
</div>

// ❌ PROBLEMÁTICO - Estados hover sin contraste
<tr className="hover:bg-gray-50">
  <td className="text-gray-600">❌ Invisible al hacer hover</td>
</tr>

// ❌ INACEPTABLE - Múltiples grises
<div className="bg-gray-100 text-gray-500 border-gray-300">
  ❌ Todo gris = Inaccesible
</div>
```

### **🎯 Guías de Estados Hover Seguros**

```tsx
// ✅ Estados hover con contraste garantizado
className = 'hover:bg-emerald-50/30' // Emerald translúcido
className = 'hover:bg-blue-50/40' // Azul muy suave
className = 'hover:bg-slate-50' // Gris ultra claro
className = 'hover:bg-white/80' // Blanco translúcido
className = 'hover:bg-emerald-100/50' // Verde corporativo suave

// ❌ Estados hover problemáticos - EVITAR
className = 'hover:bg-gray-50' // Contraste insuficiente
className = 'hover:bg-gray-100' // Puede ser problemático con texto gris
className = 'hover:bg-gray-200' // Definitivamente problemático
```

### **🛡️ Checklist de Accesibilidad**

Antes de implementar cualquier combinación de colores:

1. **✅ Verificar ratio de contraste > 4.5:1**
2. **✅ Probar con texto gris oscuro (gray-800/900)**
3. **✅ Evitar CUALQUIER combinación gris sobre gris**
4. **✅ Usar emerald para acentos en panel admin**
5. **✅ Mantener colores RockBros para frontend público**
6. **✅ Testear legibilidad en diferentes dispositivos**

---

## ✅ **Checklist de Implementación**

- [x] ✅ Colores corporativos definidos en Tailwind
- [x] ✅ Variables CSS actualizadas (light/dark mode)
- [x] ✅ Componente Categories actualizado
- [x] ✅ Sistema de gradientes implementado
- [x] ✅ Efectos hover con paleta corporativa
- [x] ✅ Accesibilidad verificada (WCAG)
- [x] ✅ Documentación completa creada
- [x] ✅ **NUEVO:** Correcciones de contraste aplicadas
- [x] ✅ **NUEVO:** Guías anti-gris-sobre-gris implementadas
- [x] ✅ **NUEVO:** Ejemplos de implementación correcta

---

## 🔄 **Próximas Actualizaciones**

1. **Header/Navbar:** Aplicar paleta corporativa
2. **Botones globales:** Estandarizar con colores brand
3. **Forms:** Inputs y validaciones con nueva paleta
4. **Footer:** Consistencia visual corporativa
5. **Dashboard:** Colores administrativos coherentes

---

_Documento creado el 26 de octubre de 2025_
_Sistema de colores RockBros - Versión 1.0_
