# ⚡ GUÍA RÁPIDA: Frontend + Backend

Ejecutar ambos servicios para test completo (5 minutos).

## 🚀 Paso 1: Preparar Backend

### Terminal 1 (PowerShell/CMD)

```bash
# Navegar a la carpeta del proyecto
cd "c:\Users\Tokyotech\Desktop\mini proyecto crud usando api"

# Entrar a backend
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# O activar (Windows CMD)
venv\Scripts\activate.bat

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar servidor
python main.py
```

**Esperar a ver:**
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

## 🎨 Paso 2: Preparar Frontend

### Terminal 2 (PowerShell/CMD)

```bash
# Navegar a la carpeta del proyecto
cd "c:\Users\Tokyotech\Desktop\mini proyecto crud usando api"

# Instalar dependencias (solo primera vez)
npm install

# Ejecutar servidor
npm run dev
```

**Esperar a ver:**
```
  ➜  Local:   http://127.0.0.1:5173/
  ➜  press h + enter to show help
```

## 🌐 Paso 3: Abrir en Navegador

1. **Frontend:** http://127.0.0.1:5173
2. **Backend Docs:** http://localhost:8000/docs

## ✅ Verificar Conexión

En el frontend:

1. Verás 30 jugadores cargados desde la API
2. Crea un jugador → Verás el ID asignado por el backend
3. Edita un jugador → Los cambios se guardan en el backend
4. Elimina un jugador → Se elimina de la lista
5. Ve a "Real-time Flow" → Verás todos los eventos capturados

## 🔍 Troubleshooting

### Puerto 8000 ocupado
```bash
# Buscar proceso usando puerto 8000
netstat -ano | findstr :8000

# Matar proceso (reemplazar PID)
taskkill /PID <PID> /F
```

### Entorno virtual no activa
```bash
# Windows PowerShell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\venv\Scripts\Activate.ps1

# Windows CMD
venv\Scripts\activate.bat
```

### Cambiar puerto del Backend
Edita `backend/main.py` línea final:
```python
uvicorn.run("main:app", host="0.0.0.0", port=8001)  # Cambiar puerto aquí
```

## 📋 Checklist

- [ ] Backend corriendo en http://localhost:8000
- [ ] Frontend corriendo en http://127.0.0.1:5173
- [ ] Ves 30 jugadores en el dashboard
- [ ] Puedes crear jugadores
- [ ] Puedes editar jugadores
- [ ] Puedes eliminar jugadores
- [ ] Eventos aparecen en Real-time Flow
- [ ] Swagger docs disponibles en http://localhost:8000/docs

## 💡 Comandos Útiles

```bash
# Ver todas las dependencias del backend
pip list

# Ver versión de Python
python --version

# Limpiar cache npm
npm cache clean --force

# Reinstalar dependencias frontend
rm -r node_modules package-lock.json
npm install

# Actualizar dependencias frontend
npm update
```

## 🎯 Próximos Pasos

1. **Probar endpoints con curl:**
   ```bash
   curl http://localhost:8000/api/players
   ```

2. **Usar Swagger UI:**
   - Ir a http://localhost:8000/docs
   - Click en "Try it out"
   - Probar cada endpoint

3. **Monitorear Red:**
   - Abrir DevTools (F12 en navegador)
   - Tab "Network"
   - Hacer acciones en el dashboard
   - Ver requests HTTP reales

4. **Ver logs del Backend:**
   - Están en Terminal 1 donde corre `python main.py`
   - Muestra cada request recibido

---

**Tiempo total de setup:** ~5 minutos  
**Versión:** 1.0.0  
**Fecha:** 31/08/2026
