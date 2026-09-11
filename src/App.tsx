import { useEffect, useMemo, useState, useCallback } from 'react'
import { Activity, ChevronLeft, ChevronRight, Plus, Search, ShieldCheck, Users, X, Info } from 'lucide-react'
import { Footer } from './components/Footer'
import { Navbar, type AppPage } from './components/Navbar'
import { PlayerForm } from './components/PlayerForm'
import { PlayerModal } from './components/PlayerModal'
import { PlayerTable } from './components/PlayerTable'
import { Toast } from './components/Toast'
import { RealTimeFlow } from './components/RealTimeFlow'
import { WelcomeLanding } from './components/WelcomeLanding'
import { TopGames } from './components/TopGames'
import { ArchitectureStory } from './components/ArchitectureStory'
import { AdminLoginModal } from './components/AdminLoginModal'
import { PlayerProvider, usePlayers } from './context/PlayerContext'
import { EventLogProvider, useEventLog } from './context/EventLogContext'
import type { Player, PlayerFormValues, ToastMessage } from './types'
import './App.css'

function Dashboard() {
  const { players, isLoading, error, createPlayer, updatePlayer, deletePlayer } = usePlayers()
  const { addEvent } = useEventLog()
  const [currentPage, setCurrentPage] = useState<AppPage>('dashboard')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [sortKey, setSortKey] = useState<keyof Player>('registeredAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const [isDark, setIsDark] = useState(true)
  const [userRole, setUserRole] = useState<'guest' | 'admin'>(() => {
    return (localStorage.getItem('gamehouse_user_role') as 'guest' | 'admin') || 'guest'
  })

  const handleToggleRole = useCallback(() => {
    setUserRole((current) => {
      const next = current === 'admin' ? 'guest' : 'admin'
      localStorage.setItem('gamehouse_user_role', next)
      addToast('info', next === 'admin' ? '👑 Modo Administrador activado (velvyn)' : '👤 Cambiado a Modo Visitante')
      return next
    })
  }, [])
  const handleAdminLoginSuccess = () => {
    setUserRole('admin')
    localStorage.setItem('gamehouse_user_role', 'admin')
    addToast('success', '👑 Bienvenido velvyn. Sesión de Administrador iniciada.')
    setShowAdminLogin(false)
  }

  const handleAdminLogout = () => {
    setUserRole('guest')
    localStorage.removeItem('gamehouse_user_role')
    localStorage.removeItem('gamehouse_admin_token')
    addToast('info', '👤 Sesión de Administrador cerrada. Modo Visitante activo.')
  }

  const addToast = (type: ToastMessage['type'], message: string) => {
    const id = Date.now()
    setToasts((current) => [...current, { id, type, message }])
    window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 3500)
  }

  const handleSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery)
    setPage(1)
  }, [])

  useEffect(() => {
    if (!query.trim()) return
    const timer = setTimeout(() => {
      addEvent('search', 'Players', `Searching for: "${query}"`, { query })
    }, 500)
    return () => clearTimeout(timer)
  }, [query, addEvent])

  const handleSort = useCallback((key: keyof Player) => {
    const nextDirection = (sortKey === key && sortDirection === 'asc') ? 'desc' : 'asc'
    setSortDirection(nextDirection)
    setSortKey(key)
    setPage(1)
    addEvent('sort', 'Players', `Sorted by ${String(key)} (${nextDirection})`, { sortKey: key, direction: nextDirection })
  }, [sortKey, sortDirection, addEvent])

  const handleThemeToggle = useCallback(() => {
    setIsDark(!isDark)
    addEvent('theme', 'UI', `Theme changed to ${isDark ? 'light' : 'dark'}`, { theme: isDark ? 'light' : 'dark' })
  }, [isDark, addEvent])

  const filteredPlayers = useMemo(
    () =>
      players
        .filter((player) =>
          `${player.playerName} ${player.email} ${player.game || ''}`
            .toLowerCase()
            .includes(query.toLowerCase())
        )
        .sort((a, b) => {
          const left = String(a[sortKey] || '')
          const right = String(b[sortKey] || '')
          return sortDirection === 'asc'
            ? left.localeCompare(right)
            : right.localeCompare(left)
        }),
    [players, query, sortKey, sortDirection]
  )
  const totalPages = Math.max(1, Math.ceil(filteredPlayers.length / 10))
  useEffect(() => { if (page > totalPages) setPage(totalPages) }, [page, totalPages])
  const visiblePlayers = filteredPlayers.slice((page - 1) * 10, page * 10)
  const submitCreate = async (values: PlayerFormValues) => { setSaving(true); try { await createPlayer(values); setShowCreate(false); addToast('success', 'Player registered successfully') } catch { addToast('error', 'Could not register player') } finally { setSaving(false) } }
  const submitEdit = async (values: PlayerFormValues) => { if (!editingPlayer) return; setSaving(true); try { await updatePlayer(editingPlayer.id, values); setEditingPlayer(null); addToast('success', 'Player profile updated') } catch { addToast('error', 'Could not update player') } finally { setSaving(false) } }
  const confirmDelete = async (player: Player) => { if (!window.confirm(`Delete ${player.playerName}? This action cannot be undone.`)) return; try { await deletePlayer(player.id); addToast('success', 'Player removed from the roster') } catch { addToast('error', 'Could not delete player') } }
  const activeCount = players.filter((player) => player.status === 'active').length

  const handleNavigateToPlayers = () => {
    setCurrentPage('players')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNavigateToArchitecture = () => {
    setCurrentPage('architecture')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className={isDark ? 'app dark' : 'app light'} id="top">
      <Navbar
        isDark={isDark}
        onToggleTheme={handleThemeToggle}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        userRole={userRole}
        onToggleRole={handleToggleRole}
        onOpenLogin={() => setShowAdminLogin(true)}
        onLogout={handleAdminLogout}
      />
      <main className="main-content">
        {currentPage === 'dashboard' && (
          <>
            <WelcomeLanding
              onAddPlayer={() => { setCurrentPage('players'); setShowCreate(true) }}
              onGoToPlayers={handleNavigateToPlayers}
              onGoToArchitecture={handleNavigateToArchitecture}
              totalPlayers={players.length}
              activePlayers={activeCount}
              userRole={userRole}
            />
            <TopGames onExploreCommunity={handleNavigateToPlayers} />
          </>
        )}

        {currentPage === 'architecture' && (
          <ArchitectureStory
            onBackToHome={() => { setCurrentPage('dashboard'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            onGoToPlayers={handleNavigateToPlayers}
          />
        )}

        {currentPage === 'players' && (
          <div id="roster" className="players-view-section">
            <section className="page-intro">
              <div>
                <span className="eyebrow">CONTROL CENTER <b>•</b> BASE DE DATOS POSTGRESQL</span>
                <h1>Roster de <em>Jugadores</em></h1>
                <p>Mesa de control y operaciones: consulta, búsqueda reactiva, registro y edición en tiempo real.</p>
              </div>
              <div className="system-status"><span className="pulse" />PostgreSQL Conectado</div>
            </section>

            <section className="metrics-grid">
              <div className="metric-card metric-main">
                <div className="metric-icon"><Users size={19} /></div>
                <span className="metric-label">TOTAL JUGADORES</span>
                <strong>{players.length}</strong>
                <span className="metric-trend"><b>↗ 12.4%</b> vs mes anterior</span>
                <div className="sparkline"><i /><i /><i /><i /><i /><i /><i /></div>
              </div>
              <div className="metric-card">
                <div className="metric-top">
                  <span className="metric-label">ACTIVOS EN LÍNEA</span>
                  <Activity size={17} />
                </div>
                <strong>{activeCount}</strong>
                <div className="progress"><span style={{ width: `${players.length ? activeCount / players.length * 100 : 0}%` }} /></div>
                <small>{players.length ? Math.round(activeCount / players.length * 100) : 0}% del total del roster</small>
              </div>
              <div className="metric-card">
                <div className="metric-top">
                  <span className="metric-label">NUEVOS ESTE MES</span>
                  <ShieldCheck size={17} />
                </div>
                <strong>08</strong>
                <span className="metric-trend"><b>↗ 8.7%</b> crecimiento constante</span>
                <small className="metric-note">Últimos 30 días</small>
              </div>
            </section>

            <section className="workspace-panel">
              <div className="panel-header">
                <div>
                  <span className="eyebrow">DIRECTORIO EN VIVO</span>
                  <h2>Todos los Jugadores <span>{filteredPlayers.length}</span></h2>
                </div>
                <button className="button button-primary" onClick={() => setShowCreate(true)}>
                  <Plus size={17} /> {userRole === 'admin' ? 'Agregar Jugador' : 'Registrarme'}
                </button>
              </div>
              {userRole === 'guest' && (
                <div className="guest-info-banner">
                  <Info size={14} />
                  <span>Estás explorando en <strong>Modo Visitante</strong>: Tienes acceso de lectura al roster. Para sumarte a la lista, haz clic en <strong>"+ Registrarme"</strong>.</span>
                </div>
              )}
              <div className="toolbar">
                <div className="search-box">
                  <Search size={17} />
                  <input value={query} onChange={(e) => handleSearch(e.target.value)} placeholder="Buscar por nombre o correo..." />
                  {query && <button className="clear-search" onClick={() => handleSearch('')} aria-label="Clear search"><X size={15} /></button>}
                </div>
                <span className="result-count">{isLoading ? 'Sincronizando roster...' : `Mostrando ${visiblePlayers.length} de ${filteredPlayers.length}`}</span>
              </div>
              {error ? <div className="empty-state">{error}</div> : isLoading ? <div className="loading-state"><span className="spinner" />Cargando roster de jugadores...</div> : visiblePlayers.length ? <PlayerTable players={visiblePlayers} sortKey={sortKey} sortDirection={sortDirection} onSort={handleSort} onEdit={setEditingPlayer} onDelete={confirmDelete} isAdmin={userRole === 'admin'} /> : <div className="empty-state">No se encontraron jugadores que coincidan con la búsqueda.</div>}
              <div className="pagination">
                <span>Página {page} de {totalPages}</span>
                <div>
                  <button className="icon-button" disabled={page === 1} onClick={() => setPage(page - 1)} aria-label="Previous page"><ChevronLeft size={17} /></button>
                  <button className="icon-button" disabled={page === totalPages} onClick={() => setPage(page + 1)} aria-label="Next page"><ChevronRight size={17} /></button>
                </div>
              </div>
            </section>

            {!isLoading && (
              <section className="create-strip">
                <div>
                  <span className="eyebrow">EXPANDE LA COMUNIDAD</span>
                  <h2>Únete a la red de jugadores de GameHouse</h2>
                  <p>Registra tu perfil y prepárate para los próximos torneos y partidas.</p>
                </div>
                <button className="button button-outline" onClick={() => setShowCreate(true)}>Registrar Jugador <Plus size={16} /></button>
              </section>
            )}
          </div>
        )}

        {currentPage === 'flow' && (
          <RealTimeFlow />
        )}
      </main>
      <Footer />
      {showCreate && (
        <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setShowCreate(false)}>
          <section className="modal" role="dialog" aria-modal="true">
            <button className="icon-button modal-close" onClick={() => setShowCreate(false)} aria-label="Close dialog"><X /></button>
            <PlayerForm isSaving={saving} onSubmit={submitCreate} onCancel={() => setShowCreate(false)} />
          </section>
        </div>
      )}
      {editingPlayer && <PlayerModal player={editingPlayer} isSaving={saving} onClose={() => setEditingPlayer(null)} onSubmit={submitEdit} />}
      <AdminLoginModal
        isOpen={showAdminLogin}
        onClose={() => setShowAdminLogin(false)}
        onSuccess={handleAdminLoginSuccess}
      />
      <div className="toast-stack">{toasts.map((toast) => <Toast key={toast.id} toast={toast} onDismiss={(id) => setToasts((current) => current.filter((item) => item.id !== id))} />)}</div>
    </div>
  )
}

function App() {
  return (
    <EventLogProvider>
      <PlayerProvider>
        <Dashboard />
      </PlayerProvider>
    </EventLogProvider>
  )
}
export default App
