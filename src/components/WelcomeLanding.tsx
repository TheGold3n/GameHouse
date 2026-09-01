import { ArrowDown, Cpu, Database, Flame, Globe, Layers, Plus, Shield, Sparkles, Terminal, User, ShieldCheck } from 'lucide-react'

interface WelcomeLandingProps {
  onAddPlayer: () => void
  totalPlayers: number
  activePlayers: number
  userRole?: 'guest' | 'admin'
}

export function WelcomeLanding({ onAddPlayer, totalPlayers, activePlayers, userRole = 'guest' }: WelcomeLandingProps) {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="welcome-container">
      {/* HERO / PANTALLA DE BIENVENIDA */}
      <div className="hero-section">
        <div className="hero-badge">
          <Sparkles size={14} className="hero-badge-icon" />
          <span>FULL-STACK ECOSYSTEM • DOCKERIZED</span>
        </div>

        {/* ROLE NOTICE BANNER */}
        {userRole === 'guest' ? (
          <div className="role-mode-banner role-mode-guest">
            <User size={14} />
            <span>Vista de <strong>Visitante / Usuario Nuevo</strong> — Explora el proyecto y regístrate abajo.</span>
          </div>
        ) : (
          <div className="role-mode-banner role-mode-admin">
            <ShieldCheck size={14} />
            <span>Vista de <strong>Administrador (velvyn)</strong> — Edición y eliminación habilitadas.</span>
          </div>
        )}

        <h1 className="hero-title">
          Bienvenido a <em>GameHouse</em>
        </h1>

        <p className="hero-subtitle">
          Plataforma interactiva de gestión de jugadores diseñada con arquitectura de micro-servicios, 
          API REST de alta velocidad y base de datos relacional persistente.
        </p>

        {/* ADMIN CREATOR TAG */}
        <div className="hero-creator">
          <span className="creator-avatar">VL</span>
          <div>
            <span className="creator-label">CREADOR & ADMIN</span>
            <strong className="creator-name">velvyn</strong>
          </div>
          <span className="creator-status">
            <span className="pulse" /> Servidor Activo
          </span>
        </div>

        {/* CALL TO ACTION BUTTONS */}
        <div className="hero-actions">
          <button className="button button-primary hero-btn-main" onClick={() => scrollToSection('roster')}>
            🎮 Explorar Jugadores ({totalPlayers})
          </button>
          <button className="button button-secondary hero-btn-sub" onClick={() => scrollToSection('architecture-story')}>
            <Layers size={16} /> Ver Arquitectura & Stack
          </button>
          <button className="button button-outline hero-btn-sub" onClick={onAddPlayer}>
            <Plus size={16} /> Registrarme
          </button>
        </div>

        {/* QUICK STATS PILL BAR */}
        <div className="hero-stats-bar">
          <div className="stat-item">
            <span className="stat-number">{totalPlayers}</span>
            <span className="stat-label">Jugadores Totales</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number">{activePlayers}</span>
            <span className="stat-label">Activos en Línea</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number">&lt; 5ms</span>
            <span className="stat-label">Latencia API</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number">100%</span>
            <span className="stat-label">Dockerizado</span>
          </div>
        </div>

        {/* SCROLL DOWN INDICATOR */}
        <div className="scroll-indicator" onClick={() => scrollToSection('architecture-story')}>
          <span>Desliza para ver todo lo que se construyó</span>
          <ArrowDown size={15} className="bounce-arrow" />
        </div>
      </div>

      {/* SECCIÓN "TODO LO QUE SE HIZO" (HISTORIA & ARQUITECTURA) */}
      <div id="architecture-story" className="story-section">
        <div className="story-header">
          <span className="eyebrow">ARQUITECTURA & DESARROLLO <b>•</b> FULL-STACK</span>
          <h2>Cómo se construyó esta plataforma</h2>
          <p>
            Desde la concepción inicial hasta la contenerización en producción, aquí están los componentes
            y tecnologías clave que hacen funcionar este sistema:
          </p>
        </div>

        <div className="story-grid">
          {/* Card 1: Frontend */}
          <div className="story-card">
            <div className="card-icon card-icon-cyan">
              <Globe size={22} />
            </div>
            <div className="card-tag">CAPA DE PRESENTACIÓN</div>
            <h3>Frontend Moderno en React 19</h3>
            <p>
              Desarrollado con <strong>React 19 + TypeScript</strong> y empaquetado con <strong>Vite</strong>.
              Ofrece búsqueda en tiempo real, filtros dinámicos, ordenamiento interactivo por columnas, paginación fluida y selector de tema claro/oscuro.
            </p>
            <div className="tech-tags">
              <span>React 19</span>
              <span>TypeScript</span>
              <span>Tailwind CSS</span>
              <span>Vite</span>
            </div>
          </div>

          {/* Card 2: Backend */}
          <div className="story-card">
            <div className="card-icon card-icon-orange">
              <Cpu size={22} />
            </div>
            <div className="card-tag">CAPA DE SERVICIOS</div>
            <h3>API REST con FastAPI</h3>
            <p>
              Backend en Python impulsado por <strong>FastAPI</strong> y <strong>Uvicorn</strong>. 
              Implementa ciclo de vida moderno <code>lifespan</code>, esquemas de validación estricta con Pydantic v2 y endpoints CRUD con documentación Swagger interactiva.
            </p>
            <div className="tech-tags">
              <span>FastAPI</span>
              <span>Python 3.11</span>
              <span>Pydantic v2</span>
              <span>Uvicorn</span>
            </div>
          </div>

          {/* Card 3: Base de Datos */}
          <div className="story-card">
            <div className="card-icon card-icon-gold">
              <Database size={22} />
            </div>
            <div className="card-tag">CAPA DE DATOS</div>
            <h3>Base de Datos SQLite Persistente</h3>
            <p>
              Migrado de almacenamiento volátil en memoria a <strong>SQLite</strong> con <strong>SQLAlchemy 2.0 ORM</strong>. 
              Garantiza integridad de correos únicos, control de roles (<code>admin</code> y <code>player</code>) y persistencia íntegra.
            </p>
            <div className="tech-tags">
              <span>SQLite</span>
              <span>SQLAlchemy 2.0</span>
              <span>Roles & Permisos</span>
              <span>Auto-seed</span>
            </div>
          </div>

          {/* Card 4: Docker */}
          <div className="story-card">
            <div className="card-icon card-icon-blue">
              <Terminal size={22} />
            </div>
            <div className="card-tag">INFRAESTRUCTURA & DEVOPS</div>
            <h3>Docker Compose & Nginx Proxy</h3>
            <p>
              Empaquetado en contenedores independientes. El frontend corre sobre un servidor <strong>Nginx</strong> multi-etapa 
              que redirige internamente las llamadas a <code>/api/</code> hacia FastAPI, eliminando problemas de CORS y con volúmenes persistentes.
            </p>
            <div className="tech-tags">
              <span>Docker</span>
              <span>Docker Compose</span>
              <span>Nginx Proxy</span>
              <span>Alpine Linux</span>
            </div>
          </div>

          {/* Card 5: Rendimiento */}
          <div className="story-card story-card-highlight">
            <div className="card-icon card-icon-fire">
              <Flame size={22} />
            </div>
            <div className="card-tag">RENDIMIENTO & QA</div>
            <h3>Listo para Pruebas de Estrés (JMeter)</h3>
            <p>
              Arquitectura optimizada para soportar alta concurrencia de peticiones simultáneas. 
              Validada y lista para ejecutar planes de prueba de carga con Apache JMeter en todos los endpoints.
            </p>
            <div className="tech-tags">
              <span>Apache JMeter</span>
              <span>Stress Testing</span>
              <span>High Concurrency</span>
              <span>Zero-downtime</span>
            </div>
          </div>

          {/* Card 6: Seguridad & Roles */}
          <div className="story-card">
            <div className="card-icon card-icon-purple">
              <Shield size={22} />
            </div>
            <div className="card-tag">CONTROL DE ACCESO</div>
            <h3>Gestión de Roles & Auditoría</h3>
            <p>
              Diferenciación clara de usuarios con credenciales de <strong>Admin (velvyn)</strong> y jugadores estándar. 
              Incluye registro de eventos en tiempo real para auditar cada creación, edición o eliminación.
            </p>
            <div className="tech-tags">
              <span>Event Logging</span>
              <span>Admin Badge</span>
              <span>Data Sanitization</span>
            </div>
          </div>
        </div>

        {/* TRANSICIÓN AL PANEL EN VIVO */}
        <div className="story-footer-callout">
          <div>
            <span className="eyebrow">SISTEMA EN TIEMPO REAL</span>
            <h3>Explora el Roster de Jugadores a continuación</h3>
            <p>Interactúa con la base de datos en vivo: busca, ordena, crea tu propio jugador o prueba la edición.</p>
          </div>
          <button className="button button-primary" onClick={() => scrollToSection('roster')}>
            Ir al Panel de Control <ArrowDown size={15} />
          </button>
        </div>
      </div>
    </section>
  )
}

