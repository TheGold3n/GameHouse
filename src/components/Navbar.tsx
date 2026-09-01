import { Gamepad2, LayoutDashboard, Menu, Moon, Sun, Activity, X } from 'lucide-react'
import { useState } from 'react'

interface NavbarProps {
  isDark: boolean
  onToggleTheme: () => void
  currentPage: 'dashboard' | 'flow'
  onPageChange: (page: 'dashboard' | 'flow') => void
}

export function Navbar({ isDark, onToggleTheme, currentPage, onPageChange }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <a className="brand" href="#top" aria-label="GameGrid home"><span className="brand-mark"><Gamepad2 size={21} /></span><span>GAME<span>GRID</span></span></a>
        <button className="icon-button menu-toggle" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
        <nav className={menuOpen ? 'main-nav open' : 'main-nav'}>
          <button className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`} onClick={() => { onPageChange('dashboard'); setMenuOpen(false) }}><LayoutDashboard size={17} /> Dashboard</button>
          <button className={`nav-link ${currentPage === 'flow' ? 'active' : ''}`} onClick={() => { onPageChange('flow'); setMenuOpen(false) }}><Activity size={17} /> Real-time</button>
          <button className="theme-toggle" onClick={onToggleTheme} aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}>{isDark ? <Sun size={17} /> : <Moon size={17} />}</button>
          <div className="profile-chip"><span className="avatar">AD</span><span className="profile-name">Admin user</span></div>
        </nav>
      </div>
    </header>
  )
}
