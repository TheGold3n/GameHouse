import { ArrowLeft, Cpu, Database, Flame, Globe, Shield, Terminal, Users } from 'lucide-react'

interface ArchitectureStoryProps {
  onBackToHome: () => void
  onGoToPlayers: () => void
}

export function ArchitectureStory({ onBackToHome, onGoToPlayers }: ArchitectureStoryProps) {
  return (
    <div className="architecture-page-view players-view-section">
      {/* HEADER DE LA PÁGINA */}
      <section className="page-intro">
        <div>
          <button 
            className="button button-secondary" 
            onClick={onBackToHome}
            style={{ marginBottom: '18px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <ArrowLeft size={16} /> Volver al Inicio
          </button>
          <span className="eyebrow">HISTORIA & ARQUITECTURA <b>•</b> INGENIERÍA FULL-STACK</span>
          <h1>Cómo se construyó <em>GameHouse</em></h1>
          <p>
            Análisis técnico integral: desde el prototipo local hasta la arquitectura modular cloud-ready
            con PostgreSQL 15, FastAPI, Docker Compose y React 19.
          </p>
        </div>
        <div className="system-status">
          <span className="pulse" />
          Cloud Architecture • Render Ready
        </div>
      </section>

      {/* GRID DE ARQUITECTURA (6 PILARES) */}
      <div className="story-grid">
        {/* Card 1: Frontend */}
        <div className="story-card">
          <div className="card-icon card-icon-cyan">
            <Globe size={24} />
          </div>
          <div className="card-tag">CAPA DE PRESENTACIÓN • UI / UX</div>
          <h3>Frontend Moderno en React 19</h3>
          <p>
            Construido sobre <strong>React 19 + TypeScript</strong> y empaquetado con <strong>Vite</strong>.
            Diseñado con estética gamer neón, vistas modulares desacopladas (Inicio, Vitrina de Juegos, Roster y Auditoría),
            búsqueda reactiva instantánea por jugador o juego, y selector de tema claro/oscuro con efectos <em>mesh glassmorphism</em>.
          </p>
          <div className="tech-tags">
            <span>React 19</span>
            <span>TypeScript</span>
            <span>Vite</span>
            <span>Lucide Icons</span>
            <span>Glassmorphism</span>
          </div>
        </div>

        {/* Card 2: Backend */}
        <div className="story-card">
          <div className="card-icon card-icon-orange">
            <Cpu size={24} />
          </div>
          <div className="card-tag">CAPA DE SERVICIOS • API REST</div>
          <h3>API de Alto Rendimiento en FastAPI</h3>
          <p>
            Servidor asíncrono en Python impulsado por <strong>FastAPI</strong> y <strong>Uvicorn</strong>.
            Aprovecha el ciclo de vida moderno <code>lifespan</code>, esquemas de validación estricta con Pydantic v2,
            inyección de dependencias para sesiones de base de datos y documentación interactiva automática en Swagger OpenAPI.
          </p>
          <div className="tech-tags">
            <span>FastAPI</span>
            <span>Python 3.11</span>
            <span>Pydantic v2</span>
            <span>Uvicorn ASGI</span>
            <span>Swagger Docs</span>
          </div>
        </div>

        {/* Card 3: Base de Datos */}
        <div className="story-card">
          <div className="card-icon card-icon-gold">
            <Database size={24} />
          </div>
          <div className="card-tag">PERSISTENCIA DE DATOS • POSTGRESQL & RENDER</div>
          <h3>PostgreSQL 15 & SQLAlchemy 2.0</h3>
          <p>
            Migración de arquitectura de persistencia de SQLite a <strong>PostgreSQL 15</strong> empresarial para despliegues en la nube en <strong>Render</strong>.
            Implementa fallback inteligente a SQLite para desarrollo sin conexión, parseo dinámico de URL (<code>postgres://</code> a <code>postgresql://</code>),
            <code>pool_pre_ping</code> contra caídas y soporte nativo de <code>TIMESTAMPTZ</code>.
          </p>
          <div className="tech-tags">
            <span>PostgreSQL 15</span>
            <span>SQLAlchemy 2.0</span>
            <span>Psycopg2</span>
            <span>TIMESTAMPTZ</span>
            <span>Render Cloud</span>
          </div>
        </div>

        {/* Card 4: Docker Multi-Contenedor */}
        <div className="story-card">
          <div className="card-icon card-icon-blue">
            <Terminal size={24} />
          </div>
          <div className="card-tag">INFRAESTRUCTURA & DEVOPS</div>
          <h3>Docker Compose Multi-Servicio</h3>
          <p>
            Entorno orquestado en microservicios independientes: servicio <code>db</code> (PostgreSQL 15 Alpine con <em>healthcheck</em> y volumen persistente),
            servicio <code>backend</code> (FastAPI con variables seguras) y <code>frontend</code> con proxy Nginx para evitar problemas de CORS en producción.
          </p>
          <div className="tech-tags">
            <span>Docker</span>
            <span>Docker Compose</span>
            <span>Postgres Alpine</span>
            <span>Healthchecks</span>
            <span>Nginx Proxy</span>
          </div>
        </div>

        {/* Card 5: Rendimiento y QA */}
        <div className="story-card story-card-highlight">
          <div className="card-icon card-icon-fire">
            <Flame size={24} />
          </div>
          <div className="card-tag">RENDIMIENTO & PRUEBAS DE CARGA</div>
          <h3>Validación de Carga con Apache JMeter</h3>
          <p>
            Arquitectura y conexiones optimizadas para responder a alta concurrencia de peticiones simultáneas con latencias ultra bajas (&lt; 5ms).
            Validada con planes de prueba de estrés en Apache JMeter sobre los endpoints de listado, creación, filtrado y actualización.
          </p>
          <div className="tech-tags">
            <span>Apache JMeter</span>
            <span>Stress Testing</span>
            <span>High Concurrency</span>
            <span>Low Latency</span>
          </div>
        </div>

        {/* Card 6: Seguridad & Roles */}
        <div className="story-card">
          <div className="card-icon card-icon-purple">
            <Shield size={24} />
          </div>
          <div className="card-tag">SEGURIDAD & AUDITORÍA EN TIEMPO REAL</div>
          <h3>Control de Acceso (RBAC) & Event Flow</h3>
          <p>
            Diferenciación estricta entre visitantes (modo invitado de sólo lectura) y el rol de <strong>Administrador (velvyn)</strong> protegido por contraseña maestra.
            Integra un bus de auditoría en vivo que registra cada acción CRUD, búsqueda y cambio de estado con metadatos técnicos.
          </p>
          <div className="tech-tags">
            <span>RBAC Security</span>
            <span>Admin Token</span>
            <span>Real-time Audit</span>
            <span>Event Streaming</span>
          </div>
        </div>
      </div>

      {/* BANNER INFERIOR DE NAVEGACIÓN */}
      <div className="story-footer-callout" style={{ marginTop: '30px' }}>
        <div>
          <span className="eyebrow">EXPERIMENTA EL SISTEMA</span>
          <h3>¿Listo para ver la base de datos en acción?</h3>
          <p>Visita el Roster de Jugadores conectado a PostgreSQL o regresa al Inicio para explorar la vitrina de juegos.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="button button-secondary" onClick={onBackToHome}>
            <ArrowLeft size={15} /> Volver al Inicio
          </button>
          <button className="button button-primary" onClick={onGoToPlayers}>
            <Users size={16} /> Ir al Roster de Jugadores
          </button>
        </div>
      </div>
    </div>
  )
}
