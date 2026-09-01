# Estado del Proyecto: CRUD de Jugadores

**Fecha de actualización:** 01/09/2026  
**Carpeta:** `gemini/`  
**Estado general:** Frontend creado, backend FastAPI implementado y conexión HTTP configurada.

## 1. Resumen

El proyecto es un dashboard web para administrar jugadores. Inicialmente el frontend utilizaba datos simulados en el navegador. Actualmente existe un backend FastAPI independiente y el servicio del frontend está configurado para consumir la API mediante `fetch`.

La base de datos actual es **en memoria**, por lo que los cambios se pierden cuando se reinicia el backend.

## 2. Arquitectura Actual

```text
Navegador
  |
  | React + Vite
  | http://127.0.0.1:5173
  v
src/services/playerService.ts
  |
  | fetch HTTP / JSON
  v
FastAPI
  | http://localhost:8000
  v
PlayerDatabase
  |
  | Lista Python en memoria
  v
30 jugadores iniciales
```

## 3. Frontend

### Tecnologías

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React
- Context API

### Funcionalidades existentes

- Dashboard de jugadores
- Crear jugadores
- Consultar jugadores
- Editar jugadores
- Eliminar jugadores
- Búsqueda
- Ordenamiento
- Paginación
- Tema claro y oscuro
- Notificaciones toast
- Registro de eventos en tiempo real

### Archivo de integración

`src/services/playerService.ts` contiene la comunicación con el backend.

La URL configurada es:

```text
http://localhost:8000/api/players
```

El resto de la aplicación utiliza `PlayerContext`, por lo que los componentes no necesitan conocer los detalles de HTTP.

## 4. Backend FastAPI

### Archivos creados

```text
backend/
├── main.py
├── requirements.txt
└── README.md
```

### Dependencias

El archivo `backend/requirements.txt` contiene:

```text
fastapi==0.104.1
uvicorn==0.24.0
pydantic==2.5.0
python-multipart==0.0.6
```

### CORS

El backend permite solicitudes desde:

- `http://localhost:5173`
- `http://127.0.0.1:5173`
- `http://localhost:3000`
- `http://127.0.0.1:3000`

Los métodos y headers están habilitados para desarrollo local.

## 5. Endpoints Implementados

| Método | Ruta | Resultado |
|---|---|---|
| GET | `/api/players` | Devuelve todos los jugadores |
| POST | `/api/players` | Crea un jugador con `id` y `registeredAt` |
| PUT | `/api/players/{id}` | Actualiza un jugador existente |
| DELETE | `/api/players/{id}` | Elimina un jugador y devuelve `success: true` |
| GET | `/health` | Devuelve el estado del servidor |
| GET | `/docs` | Abre Swagger UI |

Los endpoints `PUT` y `DELETE` devuelven `404` cuando el identificador no existe. Los datos inválidos producen un error de validación HTTP `422`.

## 6. Contrato de Datos

### Player

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

### PlayerFormValues

```typescript
interface PlayerFormValues {
  playerName: string
  phone: string
  email: string
  status: 'active' | 'inactive'
}
```

### Validaciones del backend

- `playerName`: entre 2 y 100 caracteres
- `phone`: entre 5 y 20 caracteres
- `email`: formato validado mediante expresión regular
- `status`: únicamente `active` o `inactive`
- `registeredAt`: generado por el servidor en formato ISO
- `id`: generado automáticamente por el backend

## 7. Datos Iniciales

Al iniciar el backend se cargan 30 jugadores de ejemplo desde `backend/main.py`.

Cada registro contiene:

- ID numérico
- Nombre de jugador
- Teléfono
- Email con dominio `@tempgaming.local`
- Fecha de registro ISO
- Estado activo o inactivo

Estos datos reemplazaron al array mock que originalmente vivía en el servicio del frontend.

## 8. Cómo Ejecutar el Proyecto

### Backend

Desde la raíz del proyecto:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python main.py
```

El backend debe quedar disponible en:

```text
http://localhost:8000
```

### Frontend

En otra terminal:

```powershell
npm install
npm run dev
```

El frontend debe quedar disponible en:

```text
http://127.0.0.1:5173
```

## 9. Problema Actual Conocido

Si el backend no está iniciado, el frontend no recibe jugadores y el dashboard queda sin datos. Esto afecta especialmente a:

- Total Players
- Active Players
- Inactive Players
- Tabla de jugadores
- Actividad basada en jugadores cargados

Además, el archivo `src/services/playerService.ts` tiene actualmente estas URLs:

```typescript
`$${API_BASE_URL}/$${id}`
```

Para que `PUT` y `DELETE` funcionen correctamente, deben quedar así:

```typescript
`${API_BASE_URL}/${id}`
```

La consulta inicial `GET /api/players` y la creación `POST /api/players` ya utilizan la URL base correctamente.

## 10. Eventos En Tiempo Real

El frontend conserva un `EventLogContext` para registrar acciones como:

- Carga del roster
- Creación de jugadores
- Actualización de jugadores
- Eliminación de jugadores
- Búsquedas
- Ordenamiento
- Cambio de tema
- Navegación entre páginas

La vista de eventos se encuentra en el componente `RealTimeFlow`.

El registro de eventos vive en el frontend y no se guarda en el backend. Se conserva únicamente durante la sesión actual del navegador.

## 11. Carpetas De Documentación

```text
gemini/
├── BACKEND_IDEAS.md
└── PROJECT_STATUS.md

claude/
└── IMPLEMENTATION.md
```

### Significado

- `BACKEND_IDEAS.md`: propuesta conceptual inicial
- `PROJECT_STATUS.md`: estado real consolidado hasta el 01/09/2026
- `claude/IMPLEMENTATION.md`: detalles de la implementación realizada

## 12. Estado Por Área

| Área | Estado |
|---|---|
| Frontend React | Completado |
| Dashboard CRUD | Completado |
| Backend FastAPI | Implementado |
| Endpoints CRUD | Implementados |
| CORS | Configurado |
| Validación Pydantic | Implementada |
| Persistencia permanente | Pendiente |
| Autenticación | Pendiente |
| Pruebas automatizadas | Pendiente |
| Corrección de URLs PUT/DELETE | Pendiente |
| Despliegue en producción | Pendiente |

## 13. Próximos Pasos Recomendados

1. Corregir las URLs de `PUT` y `DELETE` en `src/services/playerService.ts`.
2. Iniciar backend y frontend en terminales separadas.
3. Verificar `http://localhost:8000/api/players` en el navegador.
4. Probar el CRUD desde Swagger en `http://localhost:8000/docs`.
5. Probar el CRUD desde el dashboard.
6. Añadir pruebas automatizadas.
7. Migrar la lista en memoria a SQLite o PostgreSQL.
8. Añadir autenticación y configuración de variables de entorno.

## 14. Conclusión

La idea inicial de Gemini ya se transformó en una estructura funcional: el backend FastAPI existe, ofrece los endpoints CRUD y el frontend está preparado para consumirlos. Para visualizar nuevamente los jugadores en el dashboard es necesario mantener el backend levantado y corregir la incidencia de las URLs parametrizadas antes de probar actualizar o eliminar.
