# 📋 COMPONENTES REMOVIDOS - BACKUP

## 🗂️ **Education Component**

**Fecha de remoción:** 26 de octubre de 2025
**Archivo:** `backup/components/Education.tsx`
**Estado:** Completamente funcional, listo para restauración

### 📝 **Descripción del componente**

Sección educativa que incluía:

- **Videos tutoriales** de mantenimiento de bicicletas
- **Artículos** sobre seguridad y equipamiento
- **Guías** técnicas para ciclistas
- **Sesiones en vivo** con expertos
- **Sistema de rating** y visualizaciones
- **Contenido categorizado** por dificultad

### 🔧 **Funcionalidades implementadas**

- ✅ Grid responsive de contenido educativo
- ✅ Video player integrado con overlay
- ✅ Sistema de badges (tipo, dificultad)
- ✅ Ratings con estrellas
- ✅ Contadores de visualizaciones
- ✅ Sección destacada de video en vivo
- ✅ Integración completa con paleta corporativa
- ✅ Accesibilidad WCAG implementada

### 🔄 **Para restaurar el componente:**

1. **Mover archivo de vuelta:**

```bash
Move-Item -Path "backup\components\Education.tsx" -Destination "src\components\Education.tsx"
```

2. **Agregar import en Index.tsx:**

```tsx
import Education from '@/components/Education'
```

3. **Incluir en el layout:**

```tsx
<Categories />
<Education />
<Brands />
```

4. **Restaurar navegación en Header.tsx:**

```tsx
const navigationItems = [
  { name: 'Inicio', path: '/', sectionId: 'home' },
  { name: 'Productos', path: '/', sectionId: 'shop' },
  { name: 'Categoria', path: '/', sectionId: 'categories' },
  { name: 'Noticias', path: '/', sectionId: 'education' }, // ← Agregar esta línea
  { name: 'Marca', path: '/', sectionId: 'brands' },
]
```

5. **Restaurar sección en detector de scroll:**

```tsx
const sections = [
  'home',
  'shop',
  'categories',
  'education', // ← Agregar esta línea
  'brands',
  'contact',
]

const sectionNames: { [key: string]: string } = {
  home: 'inicio',
  shop: 'productos',
  categories: 'categoria',
  education: 'noticias', // ← Agregar esta línea
  brands: 'marca',
  contact: 'contacto',
}
```

### 🎨 **Paleta de colores aplicada**

El componente ya incluye la nueva paleta corporativa RockBros:

- Verde bosque (#06BA63) para elementos principales
- Verde neón (#0FFF95) para accents y hovers
- Gris corporativo (#383838, #656565) para texto
- Transiciones y efectos armonizados

### 📊 **Contenido incluido**

- 3 elementos de contenido educativo predefinidos
- Thumbnails de Unsplash optimizadas
- Metadata completa (duración, vistas, ratings)
- Categorías: Mantenimiento, Seguridad, Componentes

---

_Componente preservado para uso futuro_
_Totalmente funcional y listo para restauración_
