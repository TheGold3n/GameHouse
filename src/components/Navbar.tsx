import { Gamepad2, LayoutDashboard, Menu, Moon, Sun, Activity, X, ShieldCheck, User, LogOut, Users, Flame, Layers } from 'lucide-react'
import { useState } from 'react'

export type AppPage = 'dashboard' | 'players' | 'architecture' | 'flow'

interface NavbarProps {
  isDark: boolean
  onToggleTheme: () => void
  currentPage: AppPage
  onPageChange: (page: AppPage) => void
  userRole: 'guest' | 'admin'
  onToggleRole: () => void
  onOpenLogin: () => void
  onLogout: () => void
}

export function Navbar({
  isDark,
  onToggleTheme,
  currentPage,
  onPageChange,
  userRole,
  onToggleRole,
  onOpenLogin,
  onLogout
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleNavClick = (page: AppPage, scrollId?: string) => {
    onPageChange(page)
    setMenuOpen(false)
    if (scrollId) {
      setTimeout(() => {
        document.getElementById(scrollId)?.scrollIntoView({ behavior: 'smooth' })
      }, 80)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <a 
          className="brand" 
          href="#top" 
          onClick={(e) => { e.preventDefault(); handleNavClick('dashboard') }} 
          aria-label="GameHouse home"
        >
          <span className="brand-mark"><Gamepad2 size={21} /></span>
          <span>GAME<span>HOUSE</span></span>
        </a>

        <button 
          className="icon-button menu-toggle" 
          aria-label="Toggle menu" 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        <nav className={menuOpen ? 'main-nav open' : 'main-nav'}>
          <button 
            className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`} 
            onClick={() => handleNavClick('dashboard')}
          >
            <LayoutDashboard size={16} /> Inicio
          </button>

          <button 
            className="nav-link" 
            onClick={() => handleNavClick('dashboard', 'top-games')}
          >
            <Flame size={16} /> Top Juegos
          </button>

          <button 
            className={`nav-link ${currentPage === 'players' ? 'active' : ''}`} 
            onClick={() => handleNavClick('players')}
          >
            <Users size={16} /> Roster Jugadores
          </button>

          <button 
            className={`nav-link ${currentPage === 'architecture' ? 'active' : ''}`} 
            onClick={() => handleNavClick('architecture')}
          >
            <Layers size={16} /> Cómo se construyó
          </button>

          <button 
            className={`nav-link ${currentPage === 'flow' ? 'active' : ''}`} 
            onClick={() => handleNavClick('flow')}
          >
            <Activity size={16} /> Auditoría
          </button>

          <button 
            className="theme-toggle" 
            onClick={onToggleTheme} 
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          
          {/* PERFIL Y SELECTOR DE ROL */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {userRole === 'admin' ? (
              <div className="profile-chip">
                <span className="avatar" style={{ background: '#7c3aed', color: '#fff' }}>VL</span>
                <span className="profile-name">velvyn <small style={{ color: '#a78bfa', marginLeft: '4px' }}>(Admin)</small></span>
              </div>
            ) : (
              <div className="profile-chip">
                <span className="avatar" style={{ background: '#222831', color: '#6fc8e8' }}>VI</span>
                <span className="profile-name">Visitante <small style={{ color: '#89909a', marginLeft: '4px' }}>(Invitado)</small></span>
              </div>
            )}

            {userRole === 'admin' ? (
              <>
                <button
                  className="role-switch-btn"
                  onClick={onToggleRole}
                  title="Alternar a vista de Visitante para pruebas"
                >
                  <User size={13} /> <span>Ver como Visitante</span>
                </button>
                <button
                  className="role-switch-btn"
                  onClick={onLogout}
                  title="Cerrar sesión de Administrador"
                  style={{ background: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.4)', color: '#fca5a5' }}
                >
                  <LogOut size={13} /> <span>Cerrar Sesión</span>
                </button>
              </>
            ) : (
              <button
                className="role-switch-btn"
                onClick={onOpenLogin}
                title="Ingresar clave de Administrador (velvyn)"
              >
                <ShieldCheck size={13} /> <span>Acceso Admin</span>
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
