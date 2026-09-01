# 🚀 QUICK START - GameHouse Frontend

**Guía rápida para iniciar el proyecto**

---

## 📦 Instalación (1 minuto)

```bash
cd "c:\Users\Tokyotech\Desktop\mini proyecto crud usando api"
npm install
npm run dev
```

✅ Abre: **http://127.0.0.1:5173**

---

## 🎮 ¿Qué Puedo Hacer?

### Dashboard (Pestaña por defecto)
```
✓ Ver 30 jugadores de ejemplo
✓ Crear nuevo jugador (botón "Add player")
✓ Buscar por nombre o email
✓ Ordenar columnas (click en encabezado)
✓ Editar jugador (click en fila)
✓ Eliminar jugador (icono papelera)
✓ Cambiar página (botones Next/Prev)
```

### Real-time Flow (Pestaña de monitoreo)
```
✓ Ver todos los eventos en tiempo real
✓ Crear/editar/eliminar = evento registrado
✓ Búsqueda = evento registrado
✓ Ordenamiento = evento registrado
✓ Cambiar tema = evento registrado
✓ Limpiar log con botón "Clear log"
```

### Tema
```
✓ Click en icono Sol/Luna en navbar
✓ Alterna entre tema oscuro y claro
```

---

## 📋 Datos de Jugador

```json
{
  "playerName": "ShadowNinja_42",
  "email": "shadowninja_42@tempgaming.local",
  "phone": "+1-234-567-8901",
  "status": "active"  // o "inactive"
}
```

---

## 🔌 Próximo Paso: Backend

El frontend está listo para conectarse a una API. 

### Dónde cambiar:
**`src/services/playerService.ts`**

```typescript
// Cambiar esto:
export const playerService = {
  async getPlayers() {
    return [...mockPlayers]  // ← Mock data
  }
}

// Por esto (cuando tengas backend):
const API_BASE = 'http://tu-api.com/api'

export const playerService = {
  async getPlayers() {
    const res = await fetch(`${API_BASE}/players`)
    return res.json()  // ← API real
  }
}
```

---

## 📊 Comandos Útiles

```bash
# Desarrollo con hot-reload
npm run dev

# Compilar
npm run build

# Ver compilación en local
npm run preview

# Verificar tipos TypeScript
npm run typecheck
```

---

## 🆘 Troubleshooting

### Puerto 5173 ocupado
```bash
npm run dev -- --host 127.0.0.1 --port 5174
```

### TypeScript errors
```bash
npm run typecheck
```

### Limpiar caché
```bash
rm -r node_modules
rm package-lock.json
npm install
```

---

## 📁 Archivos Clave

```
src/
├── App.tsx                          # Punto de entrada
├── services/playerService.ts        # ← MODIFICAR AQUÍ para backend
├── context/PlayerContext.tsx        # Estado global
├── context/EventLogContext.tsx      # Eventos en tiempo real
└── components/
    ├── RealTimeFlow.tsx             # Visor de eventos
    ├── PlayerTable.tsx              # Tabla de jugadores
    └── ...
```

---

## 🎯 Estados de Jugador

```typescript
type PlayerStatus = 'active' | 'inactive'

// En formulario, selecciona uno u otro
```

---

## 📡 API Esperada (Para el Backend)

```
GET    /api/players              → Player[]
POST   /api/players              → Player (con body)
PUT    /api/players/{id}         → Player (con body)
DELETE /api/players/{id}         → { success: boolean }
```

### Response Format:
```json
{
  "id": 1,
  "playerName": "ShadowNinja_42",
  "phone": "+1-234-567-8901",
  "email": "shadowninja_42@tempgaming.local",
  "registeredAt": "2026-08-15T10:30:00.000Z",
  "status": "active"
}
```

---

## 🧪 Testing con Jmeter

1. Abre la app en navegador
2. Ve a pestaña "Real-time"
3. Realiza acciones (crear, editar, buscar)
4. Todos los eventos se capturan aquí
5. Abre DevTools (F12 > Network) para ver requests
6. Usa los datos capturados para crear test plans en Jmeter

---

## 📈 Mock Data

30 jugadores precargados con:
- Nombres realistas
- Emails con patrón: `username_id@tempgaming.local`
- Estados variados (active/inactive)
- Fechas diferentes

---

## ✅ Checklist

- [ ] ¿npm install completado?
- [ ] ¿npm run dev ejecutándose?
- [ ] ¿Navegador abierto en http://127.0.0.1:5173?
- [ ] ¿Puedes ver 30 jugadores en el dashboard?
- [ ] ¿Puedes crear un jugador?
- [ ] ¿Puedes editar un jugador?
- [ ] ¿Puedes eliminar un jugador?
- [ ] ¿Puedes buscar jugadores?
- [ ] ¿Puedes ver eventos en Real-time?
- [ ] ¿Puedes cambiar tema?

Si todo está ✓, **¡El frontend está listo!**

---

## 🔗 Documentación Completa

- **README.md** - Visión general del proyecto
- **FRONTEND_DOCUMENTATION.md** - Documentación detallada
- **QUICK_START.md** - Este archivo

---

## 💡 Tips

- La búsqueda filtra en tiempo real
- El ordenamiento es click-to-sort
- Las notificaciones se cierran automáticamente
- Los eventos incluyen timestamps
- La paginación se reinicia tras búsqueda
- El tema persiste en la sesión

---

**Fecha:** 31/08/2026  
**Estado:** ✅ Frontend Completado  
**Siguiente:** Backend FastAPI
