# 🔍 REFERENCIA RÁPIDA - Backend FastAPI

**Tamaño:** Una página  
**Tiempo lectura:** 2 minutos  
**Propósito:** Consulta rápida sin necesidad de leer documentación completa

---

## ⚡ ARRANQUE RÁPIDO

```bash
# Terminal 1: Backend
cd backend && python -m venv venv && .\venv\Scripts\Activate.ps1
pip install -r requirements.txt && python main.py

# Terminal 2: Frontend  
npm run dev

# Navegador
http://127.0.0.1:5173      # Frontend
http://localhost:8000/docs  # Backend Docs
```

---

## 📡 ENDPOINTS (Copiar-Pegar)

### Obtener todos los jugadores
```bash
curl http://localhost:8000/api/players
```

### Crear jugador
```bash
curl -X POST http://localhost:8000/api/players \
  -H "Content-Type: application/json" \
  -d '{"playerName":"Test","phone":"+1-555-1234","email":"test@example.com","status":"active"}'
```

### Actualizar jugador (reemplazar 1 con ID)
```bash
curl -X PUT http://localhost:8000/api/players/1 \
  -H "Content-Type: application/json" \
  -d '{"playerName":"Updated","phone":"+1-555-9999","email":"updated@example.com","status":"inactive"}'
```

### Eliminar jugador (reemplazar 1 con ID)
```bash
curl -X DELETE http://localhost:8000/api/players/1
```

### Verificar estado
```bash
curl http://localhost:8000/health
```

---

## 📁 ARCHIVOS CLAVE

| Archivo | Ubicación | Propósito |
|---------|-----------|----------|
| **main.py** | `backend/` | Código FastAPI (430+ líneas) |
| **requirements.txt** | `backend/` | Dependencias Python |
| **playerService.ts** | `src/services/` | HTTP calls al backend |
| **README.md** | `backend/` | Instalación y endpoints |
| **BACKEND_QUICK_START.md** | Raíz | Guía ejecutable rápida |

---

## 🔧 TROUBLESHOOTING EN 30 SEGUNDOS

| Problema | Solución |
|----------|----------|
| Puerto 8000 ocupado | `netstat -ano \| findstr :8000` → `taskkill /PID <PID> /F` |
| Python no encontrado | `python --version` o instalar desde python.org |
| CORS error | Verifica que frontend está en `localhost:5173` |
| 404 Player not found | Verifica que el ID existe |
| pip no funciona | Usa `python -m pip install` en lugar de `pip install` |

---

## 💻 ARCHIVOS MODIFICADOS

**Único archivo frontend modificado:**
- `src/services/playerService.ts` - Reemplazado mock con fetch HTTP

**Resto de frontend:** Sin cambios (funciona automáticamente)

---

## 📊 DATOS

| Aspecto | Valor |
|--------|-------|
| Jugadores iniciales | 30 |
| Base de datos | En memoria |
| Persistencia | Solo durante runtime |
| ID auto-increment | Comenzando desde 1 |

---

## ✅ CHECKLIST DE VERIFICACIÓN

- [ ] Backend corriendo (http://localhost:8000)
- [ ] Frontend corriendo (http://127.0.0.1:5173)
- [ ] Ves 30 jugadores en dashboard
- [ ] Puedes crear/editar/eliminar
- [ ] Swagger docs funcionan
- [ ] Sin errores en console (F12)

---

## 🎯 ESTRUCTURA DE DATOS

```typescript
Player {
  id: number,
  playerName: string,        // min 2, max 100 chars
  phone: string,             // 5-20 chars
  email: string,             // regex validated
  registeredAt: string,      // ISO format
  status: 'active' | 'inactive'
}
```

---

## 🔐 SEGURIDAD ACTUAL

✅ Validación Pydantic  
✅ CORS limitado  
⚠️ Sin autenticación (agregar JWT después)  
⚠️ Sin encriptación (TODO)  

---

## 📚 DOCS

- Full docs: `BACKEND_SUMMARY.md`
- Quick start: `BACKEND_QUICK_START.md`
- Technical: `claude/IMPLEMENTATION.md`
- Ideas: `gemini/BACKEND_IDEAS.md`

---

## 🆘 HELP

```bash
# Ver todas las dependencias instaladas
pip list

# Ver versión de Python
python --version

# Ver versión de Node.js
node --version

# Buscar puerto 8000
netstat -ano | findstr :8000
```

---

## 🎨 PUERTOS

- **Frontend:** http://127.0.0.1:5173
- **Backend API:** http://localhost:8000
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

---

**Versión:** 1.0.0 | **Fecha:** 31/08/2026 | **Estado:** ✅ LISTO
