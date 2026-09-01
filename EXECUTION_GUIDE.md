# 🎯 PLAN DE EJECUCIÓN - Cómo Empezar

Este archivo contiene las instrucciones paso a paso para ejecutar el proyecto completo.

## ⏱️ Tiempo Total: ~10 minutos

## 🎬 ESCENARIO A: Ejecución Completa (Recomendado)

### Paso 1: Preparar Backend (3 minutos)

```powershell
# Abre PowerShell y ejecuta:
cd "c:\Users\Tokyotech\Desktop\mini proyecto crud usando api"
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Paso 2: Iniciar Backend

```powershell
# Sigue en la misma terminal:
python main.py
```

**Deberías ver:**
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

**⏹️ DEJA ESTA TERMINAL ABIERTA**

---

### Paso 3: Iniciar Frontend (2 minutos)

```powershell
# Abre OTRA TERMINAL nueva (no cierres la anterior)
cd "c:\Users\Tokyotech\Desktop\mini proyecto crud usando api"
npm install    # Solo si no lo has hecho
npm run dev
```

**Deberías ver:**
```
  ➜  Local:   http://127.0.0.1:5173/
  ➜  press h + enter to show help
```

---

### Paso 4: Abrir en Navegador (1 minuto)

1. **Frontend:** http://127.0.0.1:5173
2. **Backend Docs:** http://localhost:8000/docs

---

### Paso 5: Verificar Conexión (2 minutos)

En el navegador (Frontend):

✅ Checklist:
- [ ] Ves 30 jugadores en la tabla
- [ ] Puedes **crear** un jugador (botón "Create")
- [ ] Puedes **editar** un jugador (lápiz en tabla)
- [ ] Puedes **eliminar** un jugador (X rojo en tabla)
- [ ] Puedes **buscar** jugadores (input arriba)
- [ ] Ve a la pestaña "Real-time Flow" y verás eventos
- [ ] Tema claro/oscuro funciona
- [ ] Los datos son de la API (no mock)

---

## 🎬 ESCENARIO B: Solo Verificar Backend

Si solo quieres verificar que el backend funciona:

```powershell
cd "c:\Users\Tokyotech\Desktop\mini proyecto crud usando api\backend"
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python main.py
```

Luego abre: http://localhost:8000/docs

Verás Swagger UI donde puedes probar todos los endpoints.

---

## 🎬 ESCENARIO C: Solo Frontend (Mock)

Si NO quieres backend (volverá a usar mock):

```powershell
cd "c:\Users\Tokyotech\Desktop\mini proyecto crud usando api"
npm run dev
```

**PERO:** El frontend está configurado para usar backend real. Para volver a mock, tendrías que editar `src/services/playerService.ts`.

---

## 🛠️ Troubleshooting Rápido

### "Python not found"
```powershell
# Verifica que Python está instalado
python --version

# Si no funciona, prueba
py --version

# Si tampoco, instala Python desde:
# https://www.python.org/downloads/
```

### "Puerto 8000 ocupado"
```powershell
# Encuentra el proceso
netstat -ano | findstr :8000

# Mata el proceso (reemplaza PID)
taskkill /PID <PID> /F
```

### "pip not found"
```powershell
# Usa Python directamente
python -m pip install -r requirements.txt
```

### "npm not found"
```powershell
# Verifica Node.js está instalado
node --version
npm --version

# Si no, instala desde: https://nodejs.org/
```

### Entorno virtual no funciona
```powershell
# Borra el venv y crea de nuevo
Remove-Item -Recurse -Force venv
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

---

## 📊 Verificación de Éxito

### Backend corriendo correctamente:
- ✅ Terminal muestra "Application startup complete"
- ✅ http://localhost:8000 responde
- ✅ http://localhost:8000/health retorna JSON

### Frontend corriendo correctamente:
- ✅ Terminal muestra "Local: http://127.0.0.1:5173"
- ✅ Navegador abre la página
- ✅ Ves tabla de jugadores

### Conexión entre Frontend-Backend:
- ✅ Puedes crear un jugador
- ✅ El jugador recibe ID del backend (no aleatorio)
- ✅ En DevTools Network ves requests a http://localhost:8000

---

## 📚 Documentación Complementaria

**Lee esto DESPUÉS de tener todo corriendo:**

1. `BACKEND_QUICK_START.md` - Guía rápida (recomendado)
2. `BACKEND_SUMMARY.md` - Resumen ejecutivo completo
3. `backend/README.md` - Documentación técnica
4. `claude/IMPLEMENTATION.md` - Detalles de implementación
5. `gemini/BACKEND_IDEAS.md` - Conceptualización

---

## 🎨 Interfaz Esperada

### Frontend (http://127.0.0.1:5173)
```
┌─────────────────────────────────────────────────┐
│ GAMEHOUSE | Dashboard | Real-time | 🌙         │
├─────────────────────────────────────────────────┤
│                                                 │
│  Total Players: 30 | Search... [Create] [Theme]│
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ Name | Email | Registered | Status | □ │   │
│  ├─────────────────────────────────────────┤   │
│  │ Player1 | email... | 2026-08-31 | ● | ✏ 🗑 │   │
│  │ Player2 | email... | 2026-08-31 | ● | ✏ 🗑 │   │
│  │ ...                                     │   │
│  │                          [Prev] 1 [Next]│   │
│  └─────────────────────────────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Backend Swagger (http://localhost:8000/docs)
```
┌─────────────────────────────────────────┐
│ GameHouse API                           │
├─────────────────────────────────────────┤
│                                         │
│ GET  /api/players                       │
│ POST /api/players                       │
│ PUT  /api/players/{id}                  │
│ DELETE /api/players/{id}                │
│                                         │
│ [Try it out] [Execute]                  │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🎯 Checklist Final

Antes de dar por completado:

- [ ] Backend instalado y corriendo
- [ ] Frontend instalado y corriendo
- [ ] Ves 30 jugadores en dashboard
- [ ] Puedes crear jugador
- [ ] Puedes editar jugador
- [ ] Puedes eliminar jugador
- [ ] Puedes buscar
- [ ] Puedes ordenar
- [ ] Puedes paginar
- [ ] Ves eventos en Real-time
- [ ] Swagger docs funcionan
- [ ] No hay errores en console (F12)
- [ ] Red tab muestra requests a :8000

---

## 🚀 Próximos Pasos (Después)

1. **Testing:**
   - Abrir DevTools (F12)
   - Ir a Network tab
   - Crear/editar/eliminar jugadores
   - Ver las requests HTTP en tiempo real

2. **Personalización:**
   - Cambiar datos mock en `backend/main.py`
   - Agregar más campos a jugadores
   - Cambiar colores en frontend

3. **Base de Datos Real:**
   - Cambiar de en-memoria a PostgreSQL
   - Ver próximas versiones

4. **Deployment:**
   - Desplegar backend a cloud (Heroku, AWS, etc.)
   - Desplegar frontend a Vercel o Netlify

---

## 💡 Tips

1. **Mantén ambas terminales abiertas** mientras desarrollas
2. **Backend no persiste datos** - se pierden al reiniciar
3. **CORS solo para localhost** - cambiar para producción
4. **Logs en terminal** muestran cada request
5. **DevTools Network** muestra tráfico HTTP real

---

## 📞 Errores Comunes Rápido

| Error | Solución |
|-------|----------|
| "Connection refused" | Backend no está corriendo |
| "CORS error" | Frontend no en localhost:5173 |
| "404 Not Found" | ID de jugador no existe |
| "Validation Error" | Datos no cumplen schema |
| "Port already in use" | Ver troubleshooting arriba |

---

## ✨ Conclusión

El sistema está **100% listo**. Solo sigue los pasos de "ESCENARIO A" y verás todo funcionando.

**Tiempo estimado:** 10 minutos  
**Dificultad:** Muy Fácil  
**Éxito garantizado:** ✅

---

**Fecha:** 31/08/2026  
**Versión:** 1.0.0  
**Estado:** ✅ LISTO PARA EJECUTAR
