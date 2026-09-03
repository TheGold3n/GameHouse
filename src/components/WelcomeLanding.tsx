import { ArrowDown, Cpu, Database, Flame, Globe, Layers, Plus, Shield, Sparkles, Terminal, User, ShieldCheck, Users } from 'lucide-react'

interface WelcomeLandingProps {
  onAddPlayer: () => void
  onGoToPlayers?: () => void
  totalPlayers: number
  activePlayers: number
  userRole?: 'guest' | 'admin'
}

export function WelcomeLanding({ onAddPlayer, onGoToPlayers, totalPlayers, activePlayers, userRole = 'guest' }: WelcomeLandingProps) {
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
          <span>FULL-STACK ECOSYSTEM • POSTGRESQL & DOCKER</span>
        </div>

        {/* ROLE NOTICE BANNER */}
        {userRole === 'guest' ? (
          <div className="role-mode-banner role-mode-guest">
            <User size={14} />
            <span>Vista de <strong>Visitante / Usuario Nuevo</strong> — Explora los juegos más jugados y regístrate en el roster.</span>
          </div>
        ) : (
          <div className="role-mode-banner role-mode-admin">
            <ShieldCheck size={14} />
            <span>Vista de <strong>Administrador (velvyn)</strong> — Edición y eliminación de jugadores habilitadas.</span>
          </div>
        )}

        <h1 className="hero-title">
          Bienvenido a <em>GameHouse</em>
        </h1>

        <p className="hero-subtitle">
          Plataforma gamer de gestión de jugadores diseñada con arquitectura moderna, 
          API REST en FastAPI, base de datos relacional PostgreSQL/SQLite y vitrina de títulos competitivos.
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
          {onGoToPlayers && (
            <button className="button button-primary hero-btn-main" onClick={onGoToPlayers}>
              <Users size={16} /> Ver Roster de Jugadores ({totalPlayers})
            </button>
          )}
          <button className="button button-secondary hero-btn-sub" onClick={() => scrollToSection('top-games')}>
            <Flame size={16} /> Juegos Más Jugados
          </button>
          <button className="button button-secondary hero-btn-sub" onClick={() => scrollToSection('architecture-story')}>
            <Layers size={16} /> Arquitectura & Render
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
            <div className="card-tag">CAPA DE DATOS • POSTGRESQL & RENDER</div>
            <h3>PostgreSQL 15 & SQLite Persistente</h3>
            <p>
              Persistencia relacional empresarial con <strong>PostgreSQL 15</strong> y compatibilidad con <strong>SQLite</strong> local mediante <strong>SQLAlchemy 2.0 ORM</strong>. 
              Listo para despliegue en <strong>Render</strong> con soporte de <code>TIMESTAMPTZ</code>, pool_pre_ping y conversión automática de dialectos.
            </p>
            <div className="tech-tags">
              <span>PostgreSQL 15</span>
              <span>SQLAlchemy 2.0</span>
              <span>Render Ready</span>
              <span>Psycopg2</span>
              <span>TIMESTAMPTZ</span>
            </div>
          </div>

          {/* Card 4: Docker */}
          <div className="story-card">
            <div className="card-icon card-icon-blue">
              <Terminal size={22} />
            </div>
            <div className="card-tag">INFRAESTRUCTURA & DEVOPS</div>
            <h3>Docker Compose Multi-Contenedor</h3>
            <p>
              Empaquetado en microservicios independientes: <code>db</code> (PostgreSQL 15 Alpine con healthcheck), <code>backend</code> (FastAPI) y <code>frontend</code> (Nginx). 
              Con volúmenes persistentes y sin colisiones de CORS.
            </p>
            <div className="tech-tags">
              <span>Docker</span>
              <span>Docker Compose</span>
              <span>Postgres 15</span>
              <span>Nginx Proxy</span>
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
            <span className="eyebrow">GESTIÓN DE LA COMUNIDAD</span>
            <h3>Explora el Roster de Jugadores en su página dedicada</h3>
            <p>Administra jugadores en la base de datos PostgreSQL: busca en tiempo real, ordena, registra o actualiza perfiles.</p>
          </div>
          {onGoToPlayers ? (
            <button className="button button-primary" onClick={onGoToPlayers}>
              Ir a la Página de Jugadores <Users size={16} />
            </button>
          ) : (
            <button className="button button-primary" onClick={() => scrollToSection('roster')}>
              Ir al Panel de Control <ArrowDown size={15} />
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

