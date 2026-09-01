# 🎮 GameHouse - Player Management System

**Frontend Dashboard para Gestión de Jugadores**

[![React](https://img.shields.io/badge/React-18.3+-blue?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8.2.2-purple?logo=vite)](https://vitejs.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwindcss)](https://tailwindcss.com)

---

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build
```

Abre [http://127.0.0.1:5173](http://127.0.0.1:5173) en tu navegador.

---

## ✨ Características

### 🎯 CRUD Completo
- ✅ **Crear**: Registrar nuevos jugadores con validación
- ✅ **Leer**: Lista de jugadores con datos realistas
- ✅ **Actualizar**: Editar información de jugadores
- ✅ **Eliminar**: Remover jugadores con confirmación

### 🔍 Búsqueda & Filtrado
- Búsqueda en tiempo real por nombre o email
- Ordenamiento por múltiples columnas
- Paginación inteligente (10 por página)

### 🎨 UI/UX Moderno
- Tema claro y oscuro
- Diseño responsive (mobile-friendly)
- Animaciones suaves
- Notificaciones elegantes (toasts)

### 📡 Monitoreo en Tiempo Real
- Flujo de eventos live
- Captura: CREATE, UPDATE, DELETE, SEARCH, SORT, THEME
- Timestamps y detalles expandibles
- Listo para load testing con Jmeter

### 🎮 Mock Data Incluido
- 30 jugadores de ejemplo
- Datos realistas y variados
- Listo para reemplazar con API real

---

## 📁 Estructura

```
src/
├── components/      # Componentes React reutilizables
├── context/        # Estado global (Context API)
├── services/       # Capa de API (mock → real)
├── types/          # Tipos TypeScript
├── hooks/          # Custom hooks
└── styles/         # Estilos globales y personalizados
```

---

## 🔌 Integración Backend

### Estado Actual
- ✅ Frontend completamente funcional
- ✅ Mock API lista en `src/services/playerService.ts`
- ✅ Interfaz preparada para API real

### Próximo Paso: Backend FastAPI
El endpoint esperado es:
```
GET    /api/players
POST   /api/players
PUT    /api/players/{id}
DELETE /api/players/{id}
```

### Tipos de Datos
```typescript
interface Player {
  id: number
  playerName: string
  phone: string
  email: string
  registeredAt: string
  status: 'active' | 'inactive'
}
```

---

## 📊 Comandos

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo con hot-reload |
| `npm run build` | Compilar para producción |
| `npm run typecheck` | Verificar tipos TypeScript |
| `npm run preview` | Preview del build |

---

## 🎨 Temas

### Oscuro (Default)
- Paleta: Negro/Gris + Dorado
- Diseño gaming moderno

### Claro
- Paleta: Blanco/Azul + Dorado  
- Interfaz limpia y profesional

Toggle en la navbar con el icono del sol/luna.

---

## 🧪 Testing & Monitoreo

### Para Jmeter
1. Ve a la pestaña **"Real-time"** en la navbar
2. Realiza acciones en el dashboard
3. Todos los eventos aparecerán en tiempo real
4. Usa DevTools (F12 > Network) para capturar tráfico

### Eventos Capturados
```
📄 PAGE   - Carga de recursos
➕ CREATE - Nuevo jugador
✏️ UPDATE - Edición de jugador
🗑️ DELETE - Eliminación de jugador
🔍 SEARCH - Búsqueda
↕️ SORT   - Ordenamiento
🎨 THEME  - Cambio de tema
```

---

## 📈 Métricas del Dashboard

- **Total Players**: Cantidad total de jugadores
- **Active Now**: Jugadores activos (status='active')
- **Percentage**: % de jugadores activos

---

## 🛠 Stack Tecnológico

| Tecnología | Uso |
|-----------|-----|
| **React 18** | Framework UI |
| **TypeScript** | Tipado estático |
| **Vite 8.2** | Build tool |
| **Tailwind CSS 4** | Estilos |
| **Lucide React** | Iconografía |

---

## 📝 Archivos Importantes

- **`src/App.tsx`** - Componente principal y lógica de navegación
- **`src/context/PlayerContext.tsx`** - Estado global de jugadores
- **`src/context/EventLogContext.tsx`** - Sistema de eventos en tiempo real
- **`src/services/playerService.ts`** - Capa de API (MODIFICAR AQUÍ para backend real)
- **`src/components/`** - Componentes reutilizables
- **`FRONTEND_DOCUMENTATION.md`** - Documentación completa

---

## 🚀 Próximos Pasos

1. **Backend API (FastAPI)**
   - Crear endpoints CRUD
   - Conectar base de datos
   - Implementar autenticación

2. **Integración**
   - Reemplazar mock API en `playerService.ts`
   - Configurar CORS
   - Testing end-to-end

3. **Deploy**
   - Containerizar con Docker
   - CI/CD pipeline
   - Hosting

---

## 📄 Documentación Completa

Para más detalles, ver: **[FRONTEND_DOCUMENTATION.md](./FRONTEND_DOCUMENTATION.md)**

---

## 📞 Resumen

✅ **Frontend:** Completo y funcional  
✅ **Mock Data:** 30 jugadores incluidos  
✅ **Eventos:** Sistema en tiempo real listo  
✅ **Responsive:** Mobile-friendly  
✅ **Listo para:** Conectar backend

🎮 **¡El frontend está listo para recibir el backend!**
