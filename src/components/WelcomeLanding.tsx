import { ArrowDown, Flame, Layers, Plus, Sparkles, User, ShieldCheck, Users } from 'lucide-react'

interface WelcomeLandingProps {
  onAddPlayer: () => void
  onGoToPlayers?: () => void
  onGoToArchitecture?: () => void
  totalPlayers: number
  activePlayers: number
  userRole?: 'guest' | 'admin'
}

export function WelcomeLanding({
  onAddPlayer,
  onGoToPlayers,
  onGoToArchitecture,
  totalPlayers,
  activePlayers,
  userRole = 'guest'
}: WelcomeLandingProps) {
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
          {onGoToArchitecture && (
            <button className="button button-secondary hero-btn-sub" onClick={onGoToArchitecture}>
              <Layers size={16} /> Cómo se construyó
            </button>
          )}
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
        <div className="scroll-indicator" onClick={() => scrollToSection('top-games')}>
          <span>Explora los juegos más populares abajo</span>
          <ArrowDown size={15} className="bounce-arrow" />
        </div>
      </div>
    </section>
  )
}

