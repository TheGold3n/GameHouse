import { ArrowDown, ArrowUp, ChevronsUpDown, Edit3, Trash2 } from 'lucide-react'
import type { Player } from '../types'

interface PlayerTableProps {
  players: Player[]
  sortKey: keyof Player
  sortDirection: 'asc' | 'desc'
  onSort: (key: keyof Player) => void
  onEdit: (player: Player) => void
  onDelete: (player: Player) => void
  isAdmin?: boolean
}

const columns: { key: keyof Player; label: string }[] = [
  { key: 'playerName', label: 'Jugador' },
  { key: 'game', label: 'Juego en Curso' },
  { key: 'email', label: 'Contacto' },
  { key: 'registeredAt', label: 'Registro' },
  { key: 'status', label: 'Estado' }
]

function SortButton({
  column,
  sortKey,
  sortDirection,
  onSort
}: {
  column: keyof Player
  sortKey: keyof Player
  sortDirection: 'asc' | 'desc'
  onSort: (key: keyof Player) => void
}) {
  const Icon = sortKey !== column ? ChevronsUpDown : sortDirection === 'asc' ? ArrowUp : ArrowDown
  return (
    <button className="sort-button" onClick={() => onSort(column)} aria-label={`Ordenar por ${column}`}>
      <Icon size={14} />
    </button>
  )
}

function GameBadge({ game, status }: { game?: string; status: string }) {
  if (status === 'inactive') {
    return (
      <span className="game-table-pill pill-inactive" title="Jugador desconectado">
        <span className="game-pill-dot dot-inactive" /> Desconectado
      </span>
    )
  }

  const name = game || 'Minecraft'
  let pillClass = 'pill-minecraft'
  let icon = '⛏️'

  if (name.includes('Valorant')) {
    pillClass = 'pill-valorant'
    icon = '🎯'
  } else if (name.includes('Fortnite')) {
    pillClass = 'pill-fortnite'
    icon = '⚡'
  } else if (name.includes('Counter') || name.includes('CS2')) {
    pillClass = 'pill-cs2'
    icon = '💣'
  } else if (name.includes('Apex')) {
    pillClass = 'pill-apex'
    icon = '🚀'
  } else if (name.includes('Warzone') || name.includes('Call of Duty')) {
    pillClass = 'pill-warzone'
    icon = '💥'
  } else if (name.includes('Overwatch')) {
    pillClass = 'pill-overwatch'
    icon = '🛡️'
  } else if (name.includes('Rainbow') || name.includes('R6')) {
    pillClass = 'pill-r6'
    icon = '🔒'
  }

  return (
    <span className={`game-table-pill ${pillClass}`} title={`Jugando a ${name}`}>
      <span className="game-pill-dot dot-active" />
      <span className="game-icon">{icon}</span>
      <span className="game-name">{name}</span>
    </span>
  )
}

export function PlayerTable({
  players,
  sortKey,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
  isAdmin = false
}: PlayerTableProps) {
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>
                <span>{column.label}</span>
                <SortButton
                  column={column.key}
                  sortKey={sortKey}
                  sortDirection={sortDirection}
                  onSort={onSort}
                />
              </th>
            ))}
            <th style={{ textAlign: 'right', paddingRight: '25px' }}>
              {isAdmin ? 'Acciones' : 'Tipo'}
            </th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.id}>
              <td>
                <div className="player-cell">
                  <span className="player-avatar">
                    {player.playerName.slice(0, 2).toUpperCase()}
                  </span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <strong>{player.playerName}</strong>
                      {player.role === 'admin' && (
                        <span style={{ fontSize: '10px', background: '#7c3aed', color: '#fff', padding: '1px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                          ADMIN
                        </span>
                      )}
                    </div>
                    <small>ID-{player.id}</small>
                  </div>
                </div>
              </td>
              <td>
                <GameBadge game={player.game} status={player.status} />
              </td>
              <td>
                <span className="email">{player.email}</span>
                <small className="phone">{player.phone}</small>
              </td>
              <td>
                <span>
                  {new Date(player.registeredAt).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
                <small>
                  {new Date(player.registeredAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </small>
              </td>
              <td>
                <span className={`status status-${player.status}`}>
                  <i />
                  {player.status === 'active' ? 'En línea' : 'Inactivo'}
                </span>
              </td>
              <td>
                {isAdmin ? (
                  <div className="row-actions">
                    <button
                      className="icon-button"
                      onClick={() => onEdit(player)}
                      aria-label={`Editar ${player.playerName}`}
                      title="Editar"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      className="icon-button danger-hover"
                      onClick={() => onDelete(player)}
                      aria-label={`Eliminar ${player.playerName}`}
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        color: player.role === 'admin' ? '#a78bfa' : 'var(--muted)',
                        font: '10px "DM Mono", monospace',
                        textTransform: 'uppercase'
                      }}
                    >
                      {player.role === 'admin' ? '🛡️ Admin' : '🎮 Jugador'}
                    </span>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
