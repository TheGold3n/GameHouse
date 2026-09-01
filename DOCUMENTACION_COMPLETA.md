# 🎮 GAMEHOUSE - DOCUMENTACIÓN COMPLETA DEL SISTEMA
> **Sistema Full-Stack de Gestión de Jugadores con Arquitectura Contenerizada**  
> **Autor & Administrador del Sistema:** `velvyn`  
> **Versión:** 2.0.0 (Producción Contenerizada)  
> **Fecha de Consolidación:** Septiembre 2026  

---

## 📑 ÍNDICE GENERAL

1. [Visión General del Proyecto](#1-visión-general-del-proyecto)
2. [Arquitectura y Stack Tecnológico](#2-arquitectura-y-stack-tecnológico)
3. [Frontend (React 19 + TypeScript + Vite)](#3-frontend-react-19--typescript--vite)
   - [Estructura de Archivos](#31-estructura-de-archivos)
   - [Landing Page & Hero de Bienvenida](#32-landing-page--hero-de-bienvenida)
   - [Sistema de Roles y Vistas Duales (Visitante vs Admin)](#33-sistema-de-roles-y-vistas-duales-visitante-vs-admin)
   - [Gestión de Estado y Consumo de API](#34-gestión-de-estado-y-consumo-de-api)
4. [Backend (FastAPI + Python 3.11)](#4-backend-fastapi--python-311)
   - [Estructura del Backend](#41-estructura-del-backend)
   - [Ciclo de Vida Lifespan](#42-ciclo-de-vida-lifespan)
   - [Modelos SQLAlchemy 2.0 & Pydantic v2](#43-modelos-sqlalchemy-20--pydantic-v2)
   - [Catálogo de Endpoints REST API](#44-catálogo-de-endpoints-rest-api)
5. [Base de Datos (SQLite Persistente)](#5-base-de-datos-sqlite-persistente)
   - [Estructura de la Tabla `players`](#51-estructura-de-la-tabla-players)
   - [Usuario Administrador (`velvyn`)](#52-usuario-administrador-velvyn)
   - [Persistencia y Auto-Seed](#53-persistencia-y-auto-seed)
6. [Contenerización con Docker & Docker Compose](#6-contenerización-con-docker--docker-compose)
   - [Dockerfile del Backend](#61-dockerfile-del-backend)
   - [Dockerfile del Frontend (Multi-Stage)](#62-dockerfile-del-frontend-multi-stage)
   - [Configuración de Nginx Reverse Proxy](#63-configuración-de-nginx-reverse-proxy)
   - [Orquestación con `docker-compose.yml`](#64-orquestación-con-docker-composeyml)
   - [Comandos de Gestión de Contenedores](#65-comandos-de-gestión-de-contenedores)
7. [Guía para la Prueba de Fuego con Apache JMeter](#7-guía-para-la-prueba-de-fuego-con-apache-jmeter)
   - [Objetivo de la Prueba](#71-objetivo-de-la-prueba)
   - [Configuración del Plan de Pruebas](#72-configuración-del-plan-de-pruebas)
   - [Endpoints para Carga Masiva](#73-endpoints-para-carga-masiva)
   - [Buenas Prácticas para Evitar Errores de Unicidad](#74-buenas-prácticas-para-evitar-errores-de-unicidad)
8. [Acceso Externo y Despliegue en la Nube](#8-acceso-externo-y-despliegue-en-la-nube)
   - [Compartir por Túnel Seguro (Localtunnel / Cloudflare)](#81-compartir-por-túnel-seguro-localtunnel--cloudflare)
   - [Despliegue Permanente (Render / Railway)](#82-despliegue-permanente-render--railway)

---

## 1. VISIÓN GENERAL DEL PROYECTO

**GameHouse** es una plataforma web completa desarrollada para la administración, monitoreo y auditoría en tiempo real de jugadores de videojuegos.

El proyecto nació inicialmente como un frontend interactivo en React y fue evolucionando progresivamente:
1. **Fase 1**: Frontend SPA en React con almacenamiento temporal simulado.
2. **Fase 2**: Creación de una API REST asíncrona con FastAPI en Python.
3. **Fase 3**: Migración de memoria volátil a una base de datos relacional física persistente con **SQLite** y **SQLAlchemy 2.0 ORM**.
4. **Fase 4**: Empaquetado completo en microservicios contenerizados mediante **Docker**, **Docker Compose** y un servidor web **Nginx** de alto rendimiento.
5. **Fase 5**: Implementación de modelo de roles (`admin` para `velvyn` y `player` para usuarios estándar), vistas diferenciadas de seguridad y landing page interactiva con historia técnica del proyecto.

---

## 2. ARQUITECTURA Y STACK TECNOLÓGICO

```
               [ NAVEGADOR / CLIENTE EXTERNO / JMETER ]
                                 │
                   Puerto 5173 (Host) : Puerto 80 (Nginx)
                                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        CONTENEDOR FRONTEND                             │
│                                                                        │
│   ┌────────────────────────────────┐    ┌──────────────────────────┐   │
│   │     Nginx Web Server           │    │ React 19 + TypeScript    │   │
│   │  • Sirve archivos SPA (dist)   │───▶│ • Tailwind CSS + Lucide  │   │
│   │  • Compresión gzip             │    │ • Dual Mode (Guest/Admin)│   │
│   └────────────────┬───────────────┘    └──────────────────────────┘   │
│                    │ Proxy inverso para /api/*                         │
└────────────────────┼───────────────────────────────────────────────────┘
                     │ Red interna Docker (gamehouse-network)
                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        CONTENEDOR BACKEND                              │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ FastAPI + Uvicorn (Puerto 8000)                                │   │
│   │  • Endpoints CRUD /api/players                                 │   │
│   │  • Validaciones Pydantic v2                                    │   │
│   │  • Ciclo de vida Lifespan & Healthcheck                        │   │
│   └────────────────┬───────────────────────────────────────────────┘   │
│                    │ SQLAlchemy 2.0 ORM (Mapped Columns)               │
│                    ▼                                                   │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ Base de Datos SQLite (players.db)                              │   │
│   │ Almacenada en Volumen Docker Persistente: gamehouse-backend-data│  │
│   └────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

### Tabla de Tecnologías:

| Capa | Tecnología | Versión | Rol |
| :--- | :--- | :--- | :--- |
| **Frontend** | React | 19.2.8 | Biblioteca de interfaz de usuario |
| **Lenguaje Frontend** | TypeScript | 5.0+ | Tipado estático y seguridad de tipos |
| **Build Tool** | Vite | 8.2.2 | Compilador y empaquetador ultrarrápido |
| **Estilos** | Tailwind CSS + CSS3 | 4.3.3 | Diseño responsivo con temas Dark/Light |
| **Iconografía** | Lucide React | 1.38.0 | Iconos vectoriales optimizados |
| **Backend** | FastAPI | 0.141.1 | Framework web moderno y asíncrono |
| **Servidor ASGI** | Uvicorn | 0.52.4 | Servidor de aplicaciones HTTP/ASGI |
| **ORM** | SQLAlchemy | 2.0.52 | Mapeo objeto-relacional tipado |
| **Validación de Datos** | Pydantic | 2.13.5 | Esquemas y validación estricta de tipos |
| **Base de Datos** | SQLite 3 | Nativa | Motor SQL ligero y autocontenido |
| **Servidor Web / Proxy** | Nginx | Alpine 1.31 | Servidor web estático y reverse proxy |
| **Contenerización** | Docker & Compose | 29.5 / v5.1 | Empaquetado y orquestación de servicios |
| **Testing de Carga** | Apache JMeter | Compatible | Pruebas de estrés y benchmarking |

---

## 3. FRONTEND (REACT 19 + TYPESCRIPT + VITE)

### 3.1 Estructura de Archivos

```
src/
├── assets/                  # Imágenes y recursos estáticos
├── components/
│   ├── WelcomeLanding.tsx   # Hero de bienvenida y showcase de arquitectura
│   ├── Navbar.tsx           # Barra superior con selector de rol y navegación
│   ├── PlayerTable.tsx      # Tabla interactiva con protección de permisos
│   ├── PlayerForm.tsx       # Formulario para registro y edición de jugadores
│   ├── PlayerModal.tsx      # Modal emergente para edición
│   ├── RealTimeFlow.tsx     # Monitor y visor de logs de auditoría en vivo
│   ├── Toast.tsx            # Sistema de notificaciones emergentes
│   └── Footer.tsx           # Pie de página informativo
├── context/
│   ├── PlayerContext.tsx    # Gestión del estado global de jugadores
│   └── EventLogContext.tsx  # Registro y almacenamiento de eventos en vivo
├── services/
│   └── playerService.ts     # Cliente HTTP fetch para conectar con /api/players
├── types.ts                 # Definiciones e interfaces de TypeScript
├── App.tsx                  # Componente principal y enrutamiento interno
├── App.css                  # Estilos globales y personalizaciones
└── main.tsx                 # Punto de entrada de React
```

### 3.2 Landing Page & Hero de Bienvenida

Al ingresar a la aplicación, los usuarios son recibidos por el componente [WelcomeLanding.tsx](file:///c:/Users/Tokyotech/Desktop/mini%20proyecto%20crud%20usando%20api/src/components/WelcomeLanding.tsx):
* **Insignia Superior**: Identificador `⚡ FULL-STACK ECOSYSTEM • DOCKERIZED`.
* **Insignia del Administrador**: Reconocimiento visible de **`velvyn`** como creador y administrador del sistema.
* **Barra de Métricas**: Estadísticas instantáneas de jugadores totales, jugadores en línea, latencia de la API y nivel de dockerización.
* **Sección "Cómo se construyó esta plataforma"**: Tarjetas informativas que detallan la arquitectura técnica conforme el visitante se desplaza hacia abajo:
  1. Frontend React 19 + Vite
  2. Backend con FastAPI + Python
  3. Base de Datos SQLite Persistente
  4. Docker Compose & Nginx Proxy
  5. Optimización para JMeter
  6. Control de Acceso y Auditoría

### 3.3 Sistema de Roles y Vistas Duales (Visitante vs Admin)

El sistema cuenta con un control de acceso interactivo en el cliente:

#### A) Modo Visitante (Usuario Nuevo / Invitado)
* **Asignación automática**: Todos los usuarios nuevos que abren la web ingresan en este modo.
* **Seguridad de datos**: Los botones de **Editar** ✏️ y **Eliminar** 🗑️ se ocultan de la tabla. Nadie puede borrar o modificar los registros de la base de datos.
* **Funcionalidades permitidas**:
  * Navegación completa y lectura de la arquitectura.
  * Búsqueda en tiempo real por nombre o correo electrónico.
  * Ordenamiento dinámico por columnas (jugador, contacto, fecha, estado).
  * **Auto-registro**: Botón destacado **`+ Registrarme`** para sumarse al roster de jugadores.

#### B) Modo Administrador (`velvyn`)
* **Autenticación requerida**: Al hacer clic en **`[ 🛡️ Acceso Admin ]`**, se despliega el modal de seguridad solicitando la contraseña maestra de administrador (`Velvyn.1234`).
* **Protección contra intrusos**: Si un usuario externo no ingresa la clave correcta, el acceso es denegado de inmediato y permanece como Visitante.
* **Cierre de sesión seguro**: Botón **`[ 🚪 Cerrar Sesión ]`** en la barra superior para volver al modo Visitante en cualquier momento.
* **Seguridad a nivel de Backend**: Los endpoints de edición (`PUT`) y eliminación (`DELETE`) exigen la cabecera `x-admin-key`. Cualquier intento no autorizado (incluso vía Postman o cURL) es rechazado automáticamente con **`403 Forbidden`**.
* **Permisos completos**:
  * Acceso total a edición de cualquier jugador (nombre, teléfono, correo, estado activo/inactivo).
  * Eliminación permanente de registros con diálogo de confirmación.
  * Identificación especial en la tabla con la insignia violeta **`ADMIN`**.

### 3.4 Gestión de Estado y Consumo de API

El servicio [playerService.ts](file:///c:/Users/Tokyotech/Desktop/mini%20proyecto%20crud%20usando%20api/src/services/playerService.ts) se comunica mediante peticiones relativas a `/api/players`:
* `getPlayers()`: `GET /api/players` → Obtiene la lista completa.
* `createPlayer(data)`: `POST /api/players` → Crea un jugador.
* `updatePlayer(id, data)`: `PUT /api/players/{id}` → Modifica un jugador existente.
* `deletePlayer(id)`: `DELETE /api/players/{id}` → Elimina el jugador.

---

## 4. BACKEND (FASTAPI + PYTHON 3.11)

### 4.1 Estructura del Backend

El backend reside en la carpeta `backend/`:
* `main.py`: Código principal con endpoints, modelos y configuración de base de datos.
* `requirements.txt`: Lista de dependencias modernas compatibles con Python 3.11+.
* `Dockerfile`: Especificación de empaquetado del contenedor Python.

### 4.2 Ciclo de Vida Lifespan

En lugar del evento obsoleto `@app.on_event("startup")`, se implementa un manejador asíncrono moderno con context manager:

```python
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Iniciando GameHouse Player Management API")
    init_mock_data()  # Crea tablas y datos iniciales si no existen
    yield
    print("🛑 Deteniendo servidor")

app = FastAPI(title="GameHouse Player Management API", lifespan=lifespan)
```

### 4.3 Modelos SQLAlchemy 2.0 & Pydantic v2

Se utiliza la sintaxis moderna con `Mapped` y `mapped_column`, garantizando compatibilidad con analizadores de tipos y evitando advertencias:

```python
class PlayerModel(Base):
    __tablename__ = "players"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    playerName: Mapped[str] = mapped_column(String(100), nullable=False)
    phone: Mapped[str] = mapped_column(String(20), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    status: Mapped[str] = mapped_column(String(20), default="active")
    role: Mapped[str] = mapped_column(String(20), default="player")
    registeredAt: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )
```

### 4.4 Catálogo de Endpoints REST API

| Método | Ruta | Descripción | Código Éxito | Códigos Error |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/` | Información general y catálogo de rutas | 200 OK | - |
| `GET` | `/health` | Diagnóstico de salud y conteo de jugadores | 200 OK | 500 Internal |
| `GET` | `/api/players` | Obtiene el listado de todos los jugadores | 200 OK | - |
| `POST` | `/api/players` | Registra un nuevo jugador (valida email único) | 201 Created | 400 Bad Request |
| `PUT` | `/api/players/{id}` | Actualiza los datos de un jugador por ID | 200 OK | 400 / 404 |
| `DELETE`| `/api/players/{id}` | Elimina un jugador por ID | 200 OK | 404 Not Found |
| `GET` | `/docs` | Interfaz interactiva Swagger UI | 200 OK | - |
| `GET` | `/redoc` | Documentación ReDoc | 200 OK | - |

---

## 5. BASE DE DATOS (SQLITE PERSISTENTE)

### 5.1 Estructura de la Tabla `players`

La base de datos SQLite física se ubica en el contenedor en `/app/data/players.db`:

```
players.db
└── Tabla: players
    ├── id            INTEGER (Primary Key, Autoincremental)
    ├── playerName    VARCHAR(100) NOT NULL
    ├── phone         VARCHAR(20) NOT NULL
    ├── email         VARCHAR(255) NOT NULL UNIQUE
    ├── status        VARCHAR(20) DEFAULT 'active' ('active' | 'inactive')
    ├── role          VARCHAR(20) DEFAULT 'player' ('admin' | 'player')
    └── registeredAt  DATETIME (UTC)
```

### 5.2 Usuario Administrador (`velvyn`)

La base de datos incluye el usuario principal con privilegios de administrador:
* **ID**: `31`
* **Player Name**: `velvyn`
* **Email**: `velvyn@gamehouse.admin`
* **Phone**: `+1-555-0100`
* **Status**: `active`
* **Role**: `admin`

### 5.3 Persistencia y Auto-Seed

1. **Auto-Seed**: Al primer inicio, la función `init_mock_data()` comprueba si la tabla `players` tiene datos. Si está vacía, genera 30 jugadores de prueba para que la plataforma sea interactiva de inmediato.
2. **Preservación**: Si la tabla ya contiene registros, la función no sobrescribe nada, garantizando que los datos creados por los usuarios permanezcan intactos.
3. **Volumen Docker**: Mediante el volumen `gamehouse-backend-data`, el archivo `.db` se conserva en el disco del anfitrión aunque los contenedores se reinicien o se reconstruyan con `docker compose down`.

---

## 6. CONTENERIZACIÓN CON DOCKER & DOCKER COMPOSE

### 6.1 Dockerfile del Backend (`backend/Dockerfile`)

```dockerfile
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
RUN mkdir -p /app/data

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 6.2 Dockerfile del Frontend Multi-Stage (`Dockerfile`)

```dockerfile
# Etapa 1: Compilación de React con Node.js
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Servidor Nginx ligero para producción
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 6.3 Configuración de Nginx Reverse Proxy (`nginx.conf`)

Nginx cumple dos funciones cruciales:
1. Sirve los archivos estáticos compilados de la SPA (HTML, CSS, JS, imágenes).
2. Actúa como **proxy inverso**: cualquier petición que el navegador haga a `/api/*` es enviada de forma transparente por la red interna al contenedor `backend:8000/api/*`. Esto elimina por completo los problemas de CORS.

```nginx
server {
    listen 80;
    server_name localhost;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml image/svg+xml;

    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend:8000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 6.4 Orquestación con `docker-compose.yml`

```yaml
services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: gamehouse-backend
    restart: unless-stopped
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=sqlite:////app/data/players.db
    volumes:
      - backend-data:/app/data

  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: gamehouse-frontend
    restart: unless-stopped
    ports:
      - "5173:80"
    depends_on:
      - backend

volumes:
  backend-data:
    name: gamehouse-backend-data
```

### 6.5 Comandos de Gestión de Contenedores

| Acción | Comando |
| :--- | :--- |
| **Construir e iniciar en segundo plano** | `docker compose up --build -d` |
| **Ver estado de los contenedores** | `docker compose ps` |
| **Ver logs en tiempo real** | `docker compose logs -f` |
| **Reiniciar un servicio específico** | `docker compose restart backend` |
| **Detener y apagar los contenedores** | `docker compose down` |
| **Acceder al contenedor del backend** | `docker exec -it gamehouse-backend bash` |

---

## 7. GUÍA PARA LA PRUEBA DE FUEGO CON APACHE JMETER

### 7.1 Objetivo de la Prueba

Evaluar la estabilidad, latencia y tasa de transferencia del servidor bajo condiciones de alta concurrencia mediante peticiones simultáneas de lectura (`GET`) y escritura (`POST`).

### 7.2 Configuración del Plan de Pruebas

1. **Crear un `Thread Group` (Grupo de Hilos)**:
   * **Number of Threads (Users)**: 50 a 200 usuarios virtuales concurrentes.
   * **Ramp-Up Period (seconds)**: 5 a 10 segundos.
   * **Loop Count**: 5 a 10 iteraciones (o Forever con límite de tiempo).

2. **Configurar `HTTP Request Defaults`**:
   * **Server Name or IP**: `localhost` (o `127.0.0.1`)
   * **Port Number**: `8000` (Directo al backend) o `5173` (A través del proxy Nginx).

### 7.3 Endpoints para Carga Masiva

#### Prueba 1: Petición de Lectura Masiva (Read Load)
* **Método**: `GET`
* **Path**: `/api/players`
* **Expectativa**: Tiempo de respuesta < 25ms, código 200 OK en el 100% de las peticiones.

#### Prueba 2: Petición de Escritura Masiva (Write Stress)
* **Método**: `POST`
* **Path**: `/api/players`
* **HTTP Header Manager**:
  * `Content-Type`: `application/json`
* **Body Data**:
  ```json
  {
    "playerName": "JMeter_User_${__threadNum}",
    "phone": "+1-555-01${__Random(10,99)}",
    "email": "loadtest_${__threadNum}_${__UUID()}@jmeter.local",
    "status": "active"
  }
  ```

### 7.4 Buenas Prácticas para Evitar Errores de Unicidad

> [!IMPORTANT]
> El backend valida estrictamente que **no existan dos correos idénticos**. Si en JMeter envías un correo fijo en el cuerpo de la petición, la primera petición responderá `201 Created`, pero las siguientes fallarán con `400 Bad Request` indicando *"Email already registered"*.  
> **Solución:** Utiliza siempre la función generadora `${__UUID()}` o `${__time()}` en el correo electrónico como se muestra arriba.

---

## 8. ACCESO EXTERNO Y DESPLIEGUE EN LA NUBE

### 8.1 Compartir por Túnel Seguro (Localtunnel / Cloudflare)

Para que otra persona acceda desde su casa o móvil sin abrir puertos de red:

```powershell
# Opción A: Con npx localtunnel (Inmediato)
npx localtunnel --port 5173

# Opción B: Con Cloudflare Quick Tunnels
cloudflared tunnel --url http://localhost:5173
```
* La persona recibirá un enlace público HTTPS seguro.
* Ingresará automáticamente en **Modo Visitante**.

### 8.2 Despliegue Permanente (Render / Railway)

Para dejar la aplicación encendida 24/7 en la nube:
1. Subir este repositorio a **GitHub**.
2. Conectar el repositorio en **Render.com** o **Railway.app**.
3. Seleccionar despliegue por `Dockerfile` para Backend y Frontend.
4. Definir las variables de entorno (`DATABASE_URL`).

---

> 🏁 **Fin de la Documentación**  
> *GameHouse Player Management System — Diseñado y configurado por velvyn.*

