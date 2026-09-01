import { useEffect, useMemo, useState, useCallback } from 'react'
import { Activity, ChevronLeft, ChevronRight, Plus, Search, ShieldCheck, Users, X, Info } from 'lucide-react'
import { Footer } from './components/Footer'
import { Navbar } from './components/Navbar'
import { PlayerForm } from './components/PlayerForm'
import { PlayerModal } from './components/PlayerModal'
import { PlayerTable } from './components/PlayerTable'
import { Toast } from './components/Toast'
import { RealTimeFlow } from './components/RealTimeFlow'
import { WelcomeLanding } from './components/WelcomeLanding'
import { PlayerProvider, usePlayers } from './context/PlayerContext'
import { EventLogProvider, useEventLog } from './context/EventLogContext'
import type { Player, PlayerFormValues, ToastMessage } from './types'
import './App.css'

function Dashboard() {
  const { players, isLoading, error, createPlayer, updatePlayer, deletePlayer } = usePlayers()
  const { addEvent } = useEventLog()
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'flow'>('dashboard')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [sortKey, setSortKey] = useState<keyof Player>('registeredAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)
  const [showCreate, setShowCreate] = useState(false)
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

  const addToast = (type: ToastMessage['type'], message: string) => {
    const id = Date.now()
    setToasts((current) => [...current, { id, type, message }])
    window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 3500)
  }

  const handleSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery)
    setPage(1)
    if (searchQuery.trim()) {
      addEvent('search', 'Players', `Searching for: "${searchQuery}"`, { query: searchQuery })
    }
  }, [addEvent])

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

  const filteredPlayers = useMemo(() => players.filter((player) => `${player.playerName} ${player.email}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => { const left = String(a[sortKey]); const right = String(b[sortKey]); return sortDirection === 'asc' ? left.localeCompare(right) : right.localeCompare(left) }), [players, query, sortKey, sortDirection])
  const totalPages = Math.max(1, Math.ceil(filteredPlayers.length / 10))
  useEffect(() => { if (page > totalPages) setPage(totalPages) }, [page, totalPages])
  const visiblePlayers = filteredPlayers.slice((page - 1) * 10, page * 10)
  const submitCreate = async (values: PlayerFormValues) => { setSaving(true); try { await createPlayer(values); setShowCreate(false); addToast('success', 'Player registered successfully') } catch { addToast('error', 'Could not register player') } finally { setSaving(false) } }
  const submitEdit = async (values: PlayerFormValues) => { if (!editingPlayer) return; setSaving(true); try { await updatePlayer(editingPlayer.id, values); setEditingPlayer(null); addToast('success', 'Player profile updated') } catch { addToast('error', 'Could not update player') } finally { setSaving(false) } }
  const confirmDelete = async (player: Player) => { if (!window.confirm(`Delete ${player.playerName}? This action cannot be undone.`)) return; try { await deletePlayer(player.id); addToast('success', 'Player removed from the roster') } catch { addToast('error', 'Could not delete player') } }
  const activeCount = players.filter((player) => player.status === 'active').length
  return (
    <div className={isDark ? 'app dark' : 'app light'} id="top">
      <Navbar
        isDark={isDark}
        onToggleTheme={handleThemeToggle}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        userRole={userRole}
        onToggleRole={handleToggleRole}
      />
      <main className="main-content">
        {currentPage === 'dashboard' ? (
          <>
            <WelcomeLanding
              onAddPlayer={() => setShowCreate(true)}
              totalPlayers={players.length}
              activePlayers={activeCount}
              userRole={userRole}
            />
            <div id="roster">
              <section className="page-intro">
              <div>
                <span className="eyebrow">CONTROL CENTER <b>•</b> PLAYERS</span>
                <h1>Player <em>operations</em></h1>
                <p>Keep your player community in sync and ready for the next match.</p>
              </div>
              <div className="system-status"><span className="pulse" />System operational</div>
            </section>
            <section className="metrics-grid">
              <div className="metric-card metric-main">
                <div className="metric-icon"><Users size={19} /></div>
                <span className="metric-label">TOTAL PLAYERS</span>
                <strong>{players.length}</strong>
                <span className="metric-trend"><b>↗ 12.4%</b> vs last month</span>
                <div className="sparkline"><i /><i /><i /><i /><i /><i /><i /></div>
              </div>
              <div className="metric-card">
                <div className="metric-top">
                  <span className="metric-label">ACTIVE NOW</span>
                  <Activity size={17} />
                </div>
                <strong>{activeCount}</strong>
                <div className="progress"><span style={{ width: `${players.length ? activeCount / players.length * 100 : 0}%` }} /></div>
                <small>{players.length ? Math.round(activeCount / players.length * 100) : 0}% of total roster</small>
              </div>
              <div className="metric-card">
                <div className="metric-top">
                  <span className="metric-label">NEW THIS MONTH</span>
                  <ShieldCheck size={17} />
                </div>
                <strong>08</strong>
                <span className="metric-trend"><b>↗ 8.7%</b> steady growth</span>
                <small className="metric-note">Last 30 days</small>
              </div>
            </section>
            <section className="workspace-panel">
              <div className="panel-header">
                <div>
                  <span className="eyebrow">ROSTER DIRECTORY</span>
                  <h2>All players <span>{filteredPlayers.length}</span></h2>
                </div>
                <button className="button button-primary" onClick={() => setShowCreate(true)}>
                  <Plus size={17} /> {userRole === 'admin' ? 'Add player' : 'Registrarme'}
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
                  <input value={query} onChange={(e) => handleSearch(e.target.value)} placeholder="Search by name or email..." />
                  {query && <button className="clear-search" onClick={() => handleSearch('')} aria-label="Clear search"><X size={15} /></button>}
                </div>
                <span className="result-count">{isLoading ? 'Syncing roster...' : `Showing ${visiblePlayers.length} of ${filteredPlayers.length}`}</span>
              </div>
              {error ? <div className="empty-state">{error}</div> : isLoading ? <div className="loading-state"><span className="spinner" />Loading player roster...</div> : visiblePlayers.length ? <PlayerTable players={visiblePlayers} sortKey={sortKey} sortDirection={sortDirection} onSort={handleSort} onEdit={setEditingPlayer} onDelete={confirmDelete} isAdmin={userRole === 'admin'} /> : <div className="empty-state">No players match your search.</div>}
              <div className="pagination">
                <span>Page {page} of {totalPages}</span>
                <div>
                  <button className="icon-button" disabled={page === 1} onClick={() => setPage(page - 1)} aria-label="Previous page"><ChevronLeft size={17} /></button>
                  <button className="icon-button" disabled={page === totalPages} onClick={() => setPage(page + 1)} aria-label="Next page"><ChevronRight size={17} /></button>
                </div>
              </div>
            </section>
            {!isLoading && (
              <section className="create-strip">
                <div>
                  <span className="eyebrow">GROW THE COMMUNITY</span>
                  <h2>Bring a new player into the grid.</h2>
                  <p>Register a player and keep your roster ready for action.</p>
                </div>
                <button className="button button-outline" onClick={() => setShowCreate(true)}>Register player <Plus size={16} /></button>
              </section>
            )}
          </div>
        </>
        ) : (
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
