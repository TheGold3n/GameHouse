# 🚀 Backend FastAPI - GameHouse

Servidor FastAPI para gestión de jugadores con endpoints CRUD.

## 📋 Requisitos

- Python 3.8+
- pip (gestor de paquetes)

## 🛠 Instalación

### 1. Navegar a la carpeta backend

```bash
cd backend
```

### 2. Crear entorno virtual (recomendado)

**En Windows (PowerShell):**
```bash
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**En Windows (CMD):**
```bash
python -m venv venv
venv\Scripts\activate.bat
```

**En macOS/Linux:**
```bash
python -m venv venv
source venv/bin/activate
```

### 3. Instalar dependencias

```bash
pip install -r requirements.txt
```

## ▶️ Ejecutar el servidor

```bash
python main.py
```

O si estás fuera de la carpeta backend:

```bash
cd backend && python main.py
```

### Salida esperada:

```
╔════════════════════════════════════════════════════════╗
║  🎮 GameHouse Backend - FastAPI Server                 ║
╠════════════════════════════════════════════════════════╣
║  📡 URL:          http://localhost:8000                 ║
║  📚 Docs:         http://localhost:8000/docs            ║
║  ⚙️  ReDoc:        http://localhost:8000/redoc           ║
║  🔌 API Base:     http://localhost:8000/api/players     ║
╚════════════════════════════════════════════════════════╝
```

## 📡 Endpoints Disponibles

### GET `/api/players`
Obtiene la lista de todos los jugadores.

```bash
curl http://localhost:8000/api/players
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "playerName": "ShadowNinja_42",
    "phone": "+1-234-567-8901",
    "email": "shadowninja_42@tempgaming.local",
    "registeredAt": "2026-08-31T23:43:00Z",
    "status": "active"
  }
]
```

### POST `/api/players`
Crea un nuevo jugador.

```bash
curl -X POST http://localhost:8000/api/players \
  -H "Content-Type: application/json" \
  -d '{
    "playerName": "NewPlayer",
    "phone": "+1-555-123-4567",
    "email": "newplayer@example.com",
    "status": "active"
  }'
```

**Respuesta (201 Created):**
```json
{
  "id": 31,
  "playerName": "NewPlayer",
  "phone": "+1-555-123-4567",
  "email": "newplayer@example.com",
  "registeredAt": "2026-08-31T23:44:15.123456Z",
  "status": "active"
}
```

### PUT `/api/players/{id}`
Actualiza un jugador existente.

```bash
curl -X PUT http://localhost:8000/api/players/1 \
  -H "Content-Type: application/json" \
  -d '{
    "playerName": "UpdatedPlayer",
    "phone": "+1-555-123-4567",
    "email": "updated@example.com",
    "status": "inactive"
  }'
```

**Respuesta (200 OK):**
```json
{
  "id": 1,
  "playerName": "UpdatedPlayer",
  "phone": "+1-555-123-4567",
  "email": "updated@example.com",
  "registeredAt": "2026-08-31T23:43:00Z",
  "status": "inactive"
}
```

### DELETE `/api/players/{id}`
Elimina un jugador.

```bash
curl -X DELETE http://localhost:8000/api/players/1
```

**Respuesta (200 OK):**
```json
{
  "success": true
}
```

## 📚 Documentación Interactiva

Abre tu navegador e ir a uno de estos:

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

Puedes probar todos los endpoints directamente desde el navegador.

## 🔗 Conectar con Frontend

El frontend en `http://127.0.0.1:5173` está configurado para conectar con este backend.

1. Asegúrate que el backend está corriendo en `http://localhost:8000`
2. Ejecuta el frontend: `npm run dev`
3. Los cambios en el dashboard se sincronizarán automáticamente

## 🐛 Troubleshooting

### Python no encontrado
```bash
# Windows
python --version
# Si no funciona, prueba
py --version
```

### Puerto 8000 ocupado
Modifica el puerto en `main.py`:

```python
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001)  # Cambiar puerto aquí
```

### Error de CORS
Asegúrate que el frontend está en uno de estos orígenes:
- `http://localhost:5173`
- `http://127.0.0.1:5173`

### Entorno virtual no activado
```bash
# Windows PowerShell
.\venv\Scripts\Activate.ps1

# Windows CMD
venv\Scripts\activate.bat

# macOS/Linux
source venv/bin/activate
```

## 📁 Estructura

```
backend/
├── main.py           # Código principal
├── requirements.txt  # Dependencias
└── venv/            # Entorno virtual (crear)
```

## 🔒 Seguridad

Este backend está configurado para desarrollo local. Para producción:

1. ✅ Cambiar de base de datos en memoria a persistente (PostgreSQL)
2. ✅ Agregar autenticación (JWT tokens)
3. ✅ Validar CORS solo con dominios permitidos
4. ✅ HTTPS obligatorio
5. ✅ Rate limiting
6. ✅ Logging y monitoreo

## 📊 Datos Iniciales

El backend carga 30 jugadores de ejemplo al iniciar. Los datos son en memoria y se pierden al reiniciar el servidor.

Para persistencia, mirar próximas versiones con PostgreSQL.

## 📞 API Contract

| Endpoint | Método | Body | Response |
|----------|--------|------|----------|
| `/api/players` | GET | - | `[Player]` |
| `/api/players` | POST | `PlayerFormValues` | `Player` |
| `/api/players/{id}` | PUT | `PlayerFormValues` | `Player` |
| `/api/players/{id}` | DELETE | - | `{ success: boolean }` |

## ✅ Validaciones

- **playerName:** String de 2-100 caracteres
- **phone:** String de 5-20 caracteres
- **email:** Formato válido con regex
- **status:** `'active'` o `'inactive'`
- **id:** Verificación de existencia (PUT/DELETE)

---

**Backend Version:** 1.0.0  
**FastAPI Version:** 0.104.1  
**Uvicorn Version:** 0.24.0  
**Fecha:** 31/08/2026
