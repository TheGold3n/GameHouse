import { Gamepad2, LayoutDashboard, Menu, Moon, Sun, Activity, X, ShieldCheck, User } from 'lucide-react'
import { useState } from 'react'

interface NavbarProps {
  isDark: boolean
  onToggleTheme: () => void
  currentPage: 'dashboard' | 'flow'
  onPageChange: (page: 'dashboard' | 'flow') => void
  userRole: 'guest' | 'admin'
  onToggleRole: () => void
}

export function Navbar({ isDark, onToggleTheme, currentPage, onPageChange, userRole, onToggleRole }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <a className="brand" href="#top" aria-label="GameHouse home"><span className="brand-mark"><Gamepad2 size={21} /></span><span>GAME<span>HOUSE</span></span></a>
        <button className="icon-button menu-toggle" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
        <nav className={menuOpen ? 'main-nav open' : 'main-nav'}>
          <button className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`} onClick={() => { onPageChange('dashboard'); setMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }}><LayoutDashboard size={17} /> Inicio</button>
          <button className="nav-link" onClick={() => { onPageChange('dashboard'); setMenuOpen(false); setTimeout(() => document.getElementById('architecture-story')?.scrollIntoView({ behavior: 'smooth' }), 50) }}>Arquitectura</button>
          <button className="nav-link" onClick={() => { onPageChange('dashboard'); setMenuOpen(false); setTimeout(() => document.getElementById('roster')?.scrollIntoView({ behavior: 'smooth' }), 50) }}>Jugadores</button>
          <button className={`nav-link ${currentPage === 'flow' ? 'active' : ''}`} onClick={() => { onPageChange('flow'); setMenuOpen(false) }}><Activity size={17} /> Auditoría en Vivo</button>
          <button className="theme-toggle" onClick={onToggleTheme} aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}>{isDark ? <Sun size={17} /> : <Moon size={17} />}</button>
          
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

            <button
              className="role-switch-btn"
              onClick={onToggleRole}
              title={userRole === 'admin' ? 'Cambiar a modo Visitante' : 'Cambiar a modo Administrador (velvyn)'}
            >
              {userRole === 'admin' ? (
                <><User size={13} /> <span>Ver como Visitante</span></>
              ) : (
                <><ShieldCheck size={13} /> <span>Acceso Admin</span></>
              )}
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}
