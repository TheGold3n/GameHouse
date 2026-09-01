# 📱 GameHouse - Frontend Documentation

**Versión:** 1.0.0  
**Fecha:** 31 de Agosto, 2026  
**Estado:** ✅ Completado y Listo para Integración Backend

---

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Componentes](#componentes)
5. [Funcionalidades](#funcionalidades)
6. [Flujo en Tiempo Real](#flujo-en-tiempo-real)
7. [Guía de Instalación](#guía-de-instalación)
8. [Comandos Disponibles](#comandos-disponibles)
9. [Integración con Backend](#integración-con-backend)
10. [Próximos Pasos](#próximos-pasos)

---

## 🎮 Descripción General

**GameHouse** es una aplicación web administrativa para gestión de jugadores con interfaz moderna, responsiva y con soporte para temas claro/oscuro. 

### Características Principales:
- ✅ CRUD completo de jugadores (Create, Read, Update, Delete)
- ✅ Búsqueda en tiempo real
- ✅ Ordenamiento por múltiples columnas
- ✅ Paginación (10 jugadores por página)
- ✅ Validación de formularios
- ✅ Tema claro y oscuro
- ✅ Flujo en tiempo real de eventos
- ✅ Notificaciones (toasts) elegantes
- ✅ Diseño responsive (mobile-friendly)
- ✅ 30 jugadores de ejemplo (mock data)

---

## 🛠 Stack Tecnológico

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| **React** | 18+ | Framework UI |
| **TypeScript** | 5+ | Tipado estático |
| **Vite** | 8.2.2 | Build tool y dev server |
| **Tailwind CSS** | 4 | Estilos utilities |
| **Lucide React** | - | Iconografía |
| **CSS Puro** | - | Estilos personalizados |

### Dependencias Clave:
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "lucide-react": "^0.408.0"
}
```

### DevDependencies:
- `@vitejs/plugin-react`
- `@tailwindcss/vite`
- `@tailwindcss/typography`
- TypeScript
- Vitest (para testing futuro)

---

## 📁 Estructura del Proyecto

```
proyecto-crud/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx              # Navegación principal
│   │   ├── Footer.tsx              # Pie de página
│   │   ├── PlayerForm.tsx           # Formulario create/edit
│   │   ├── PlayerTable.tsx          # Tabla de jugadores
│   │   ├── PlayerModal.tsx          # Modal de edición
│   │   ├── Toast.tsx                # Notificaciones
│   │   └── RealTimeFlow.tsx         # Visor de eventos en tiempo real
│   │
│   ├── context/
│   │   ├── PlayerContext.tsx        # Estado global de jugadores
│   │   └── EventLogContext.tsx      # Estado global de eventos
│   │
│   ├── services/
│   │   └── playerService.ts         # API mock (será reemplazada)
│   │
│   ├── hooks/
│   │   └── usePlayers.ts            # Hook público para acceder a contexto
│   │
│   ├── pages/
│   │   └── PlayersPage.tsx          # Boundary de página (placeholder)
│   │
│   ├── types/
│   │   └── types.ts                 # Interfaces TypeScript
│   │
│   ├── styles/
│   │   ├── tailwind.css             # Configuración Tailwind
│   │   ├── realtime-flow.css        # Estilos del flujo en tiempo real
│   │
│   ├── utils/
│   │   └── formatters.ts            # Funciones reutilizables
│   │
│   ├── App.tsx                      # Componente raíz
│   ├── App.css                      # Estilos globales
│   ├── index.css                    # Reset y estilos base
│   └── main.tsx                     # Punto de entrada
│
├── dist/                            # Build producción (generado)
├── public/                          # Assets estáticos
├── index.html                       # HTML base
├── vite.config.ts                   # Configuración Vite
├── tsconfig.json                    # Configuración TypeScript
├── tailwind.config.ts               # Configuración Tailwind
├── package.json                     # Dependencias y scripts
└── README.md                        # Este archivo
```

---

## 🧩 Componentes

### 1. **Navbar** (`src/components/Navbar.tsx`)
- Navegación entre Dashboard y Real-time Flow
- Selector de tema (claro/oscuro)
- Responsive con menú hamburguesa
- Chip de perfil de usuario

### 2. **Dashboard** (`src/App.tsx`)
- Página principal con métricas
- CRUD de jugadores
- Búsqueda y filtrado
- Ordenamiento y paginación

### 3. **PlayerTable** (`src/components/PlayerTable.tsx`)
- Tabla responsive con 4 columnas
- Iconos de estado
- Botones de edición y eliminación
- Ordenamiento interactivo

### 4. **PlayerForm** (`src/components/PlayerForm.tsx`)
- Formulario validado
- Campos: Nombre, Email, Teléfono, Estado
- Modo crear y editar
- Validaciones en tiempo real

### 5. **PlayerModal** (`src/components/PlayerModal.tsx`)
- Modal de edición para jugadores existentes
- Cierre con ESC o click fuera
- Carga de datos previos

### 6. **Toast** (`src/components/Toast.tsx`)
- Notificaciones elegantes
- Tipos: success, error, info
- Auto-dismissable en 3.5 segundos

### 7. **RealTimeFlow** (`src/components/RealTimeFlow.tsx`)
- Visor de eventos en tiempo real
- Captura CREATE, UPDATE, DELETE, SEARCH, SORT, THEME, PAGE
- Timestamps y detalles expandibles
- Contador de eventos activos

### 8. **Footer** (`src/components/Footer.tsx`)
- Pie de página con branding
- Versión y ambiente

---

## ✨ Funcionalidades

### 🎯 CRUD de Jugadores

#### Create (Crear)
```typescript
- Formulario con validaciones
- Campos obligatorios: Nombre, Email
- Teléfono y Estado opcionales
- Toast de confirmación
- Nuevo jugador aparece en el tope de la lista
```

#### Read (Leer)
```typescript
- Carga automática de 30 jugadores mock
- Búsqueda por nombre o email
- Paginación: 10 jugadores por página
- Estados: Active / Inactive
- Registros de fecha
```

#### Update (Actualizar)
```typescript
- Edición modal de jugador
- Cambio de nombre, email, teléfono, estado
- Validaciones iguales a create
- Toast de confirmación
- Los cambios se reflejan inmediatamente
```

#### Delete (Eliminar)
```typescript
- Confirmación de seguridad con modal nativo
- Toast de confirmación
- Jugador se elimina de la lista inmediatamente
- Paginación se ajusta automáticamente
```

### 🔍 Búsqueda
- Búsqueda en tiempo real mientras escribes
- Busca en: Nombre y Email
- Case-insensitive
- Botón para limpiar búsqueda
- Muestra contador de resultados

### 📊 Ordenamiento
- Ordenamiento por: Nombre, Email, Fecha Registro, Estado
- Dirección: Ascendente / Descendente
- Toggle inteligente (misma columna = cambiar dirección)
- Indicadores visuales del orden actual

### 📄 Paginación
- 10 jugadores por página
- Navegación con botones Previous/Next
- Contador de página actual
- Botones deshabilitados en límites

### 🎨 Temas
- **Tema Oscuro**: Negro/Gris con acentos dorados
- **Tema Claro**: Celeste/Fríos con detalles dorados
- Toggle en navbar
- Persistencia visual en sesión
- Transiciones suaves

### 📱 Responsive
- Mobile First Design
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Menú hamburguesa en mobile
- Tabla adaptativa
- Formularios optimizados

### ✅ Validaciones
- Nombre: Requerido, mín 2 caracteres
- Email: Formato válido y requerido
- Teléfono: Número válido (opcional)
- Estado: Dropdown con valores fijos
- Mensajes de error en línea

---

## 📡 Flujo en Tiempo Real

### Eventos Capturados

| Tipo | Icono | Evento | Detalles |
|------|-------|--------|----------|
| **PAGE** | 📄 | Carga de recursos | totalPlayers |
| **CREATE** | ➕ | Nuevo jugador | playerId, playerName, email |
| **UPDATE** | ✏️ | Actualización | playerId, playerName, status |
| **DELETE** | 🗑️ | Eliminación | playerId, playerName |
| **SEARCH** | 🔍 | Búsqueda | query string |
| **SORT** | ↕️ | Ordenamiento | sortKey, direction |
| **THEME** | 🎨 | Cambio de tema | theme (light/dark) |

### Características
- ✅ Almacena últimos 500 eventos
- ✅ Timestamps ISO con hora local
- ✅ Detalles expandibles en JSON
- ✅ Botón para limpiar log
- ✅ Información sobre Jmeter para load testing
- ✅ Colores distintivos por tipo de evento

---

## 🚀 Guía de Instalación

### Requisitos Previos
- Node.js 18+ 
- npm o yarn
- Terminal/PowerShell

### Pasos de Instalación

```bash
# 1. Entrar a la carpeta del proyecto
cd "c:\Users\Tokyotech\Desktop\mini proyecto crud usando api"

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev

# 4. Abrir en navegador
# http://127.0.0.1:5173/ (o el puerto que indique)
```

### Build para Producción
```bash
npm run build

# Genera carpeta 'dist/' lista para deploy
```

---

## 📝 Comandos Disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor local con hot-reload

# Build
npm run build            # Compila TypeScript y Vite

# Type Check
npm run typecheck        # Verifica tipos TypeScript

# Preview
npm run preview          # Preview del build de producción

# Lint (si está configurado)
npm run lint             # Verifica código
```

---

## 🔌 Integración con Backend

### Estado Actual
- ✅ Mock data en `src/services/playerService.ts`
- ✅ Interfaz de contexto definida
- ✅ Llamadas async preparadas
- ✅ Error handling implementado
- ✅ Loading states listos

### Estructura de API Esperada

La API debe cumplir con este contrato:

```typescript
// GET /api/players
Response: Player[]

// POST /api/players
Body: PlayerFormValues
Response: Player

// PUT /api/players/{id}
Body: PlayerFormValues
Response: Player

// DELETE /api/players/{id}
Response: { success: boolean }
```

### Tipos Esperados
```typescript
interface Player {
  id: number
  playerName: string
  phone: string
  email: string
  registeredAt: string    // ISO date
  status: 'active' | 'inactive'
}

interface PlayerFormValues {
  playerName: string
  phone: string
  email: string
  status: 'active' | 'inactive'
}
```

### Cómo Reemplazar Mock API

1. Actualizar `src/services/playerService.ts`:
```typescript
// Antes (mock)
export const playerService = {
  async getPlayers() {
    return [...mockPlayers]
  },
  // ...
}

// Después (real)
const API_BASE = 'http://tu-api.com/api'

export const playerService = {
  async getPlayers() {
    const res = await fetch(`${API_BASE}/players`)
    return res.json()
  },
  // ...
}
```

2. El resto del código **no cambia** (gracias a la abstracción)
3. Los eventos de flujo en tiempo real se registrarán automáticamente

---

## 📊 Datos Mock Incluidos

- **30 jugadores** con nombres y emails realistas
- **Emails** con patrón: `username_id@tempgaming.local`
- **Teléfonos** con formato válido
- **Estados** distribuidos entre active e inactive
- **Fechas de registro** variadas en últimos 30 días

```typescript
// Ejemplo de estructura
{
  id: 1,
  playerName: 'ShadowNinja_42',
  phone: '+1-234-567-8901',
  email: 'shadowninja_42_1001@tempgaming.local',
  registeredAt: '2026-08-15T10:30:00.000Z',
  status: 'active'
}
```

---

## 🧪 Testing y Monitoreo

### Para Jmeter
- El flujo en tiempo real captura **todos los eventos de usuario**
- Usa las herramientas de dev (F12 > Network) para capturar tráfico
- Los eventos están disponibles en la pestaña "Real-time" para análisis

### Eventos para Monitorear
```
→ Clicks en buttons
→ Cambios en búsqueda
→ Ordenamientos
→ Creación de jugadores
→ Edición de jugadores
→ Eliminación de jugadores
→ Cambios de tema
→ Navegación
```

---

## ⚠️ Consideraciones de Seguridad

- ⚠️ **Validaciones frontend**: Presentes pero no suficientes
- ⚠️ **Autenticación**: No implementada (requiere backend)
- ⚠️ **HTTPS**: Usar en producción
- ⚠️ **CORS**: Configurar en backend si está en diferente dominio
- ⚠️ **Sanitización**: Implementar en backend para inputs de usuario

---

## 🎨 Paleta de Colores

### Tema Oscuro
```
Background: #000000 (Negro)
Secondary: #1f2937 (Gris oscuro)
Text: #f3f4f6 (Blanco)
Accent: #d4a574 (Dorado)
Success: #10b981 (Verde)
Error: #ef4444 (Rojo)
```

### Tema Claro
```
Background: #ffffff (Blanco)
Secondary: #f3f4f6 (Gris claro)
Text: #111827 (Negro)
Accent: #d4a574 (Dorado)
Success: #10b981 (Verde)
Error: #ef4444 (Rojo)
```

---

## 📈 Métricas Incluidas

Dashboard muestra:
- **Total Players**: Cuenta total de jugadores
- **Active Now**: Jugadores activos (status='active')
- **% Activos**: Porcentaje del total
- **New This Month**: Métrica estática (placeholder)

---

## 🔄 Flujo de Datos

```
┌─────────────────────────────────────────┐
│         User Interaction (UI)           │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│      Components (React/TypeScript)      │
│  Navbar, PlayerTable, PlayerForm, etc.  │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│   Context (PlayerContext + EventLog)    │
│   - Estado global de jugadores          │
│   - Registro de eventos                 │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│      Service Layer (playerService)      │
│      Mock API → Real Backend (futuro)   │
└──────────────┬──────────────────────────┘
               │
               ↓
         [Backend API]
      (FastAPI - Próximo)
```

---

## 🚀 Próximos Pasos

### Backend (Fase 2)
- [ ] Crear API FastAPI
- [ ] Implementar endpoints CRUD
- [ ] Base de datos (SQL/NoSQL)
- [ ] Autenticación y autorización
- [ ] Validaciones backend
- [ ] Logging y auditoría

### Frontend (Mejoras Futuras)
- [ ] Routing con React Router
- [ ] Autenticación (JWT/OAuth)
- [ ] Paginación backend
- [ ] Filtros avanzados
- [ ] Export a CSV/Excel
- [ ] Bulk operations
- [ ] Caché y optimizaciones
- [ ] PWA features

### DevOps
- [ ] Containerización (Docker)
- [ ] CI/CD Pipeline
- [ ] Deploy a producción
- [ ] Monitoreo y logging
- [ ] Load testing con Jmeter

---

## 📞 Contacto y Soporte

**Estado del Proyecto:** ✅ Frontend Completado  
**Última Actualización:** 31/08/2026  
**Versión:** 1.0.0

---

## 📄 Licencia

Este proyecto es de uso interno/educativo.

---

**¡El frontend está listo para recibir el backend! 🚀**
