import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { playerService } from '../services/playerService'
import { useEventLog } from './EventLogContext'
import type { Player, PlayerFormValues } from '../types'

interface PlayerContextValue {
  players: Player[]
  isLoading: boolean
  error: string | null
  createPlayer: (values: PlayerFormValues) => Promise<void>
  updatePlayer: (id: number, values: PlayerFormValues) => Promise<void>
  deletePlayer: (id: number) => Promise<void>
}

const PlayerContext = createContext<PlayerContextValue | undefined>(undefined)

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [players, setPlayers] = useState<Player[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { addEvent } = useEventLog()

  useEffect(() => {
    playerService.getPlayers().then(setPlayers).catch(() => setError('Unable to load player data.')).finally(() => {
      setIsLoading(false)
      addEvent('page', 'PlayerContext', 'Player roster loaded', { totalPlayers: players.length })
    })
  }, [addEvent])

  const value = useMemo<PlayerContextValue>(() => ({
    players,
    isLoading,
    error,
    async createPlayer(values) {
      const player = await playerService.createPlayer(values)
      setPlayers((current) => [player, ...current])
      addEvent('create', 'Player', `New player created: ${values.playerName}`, { playerId: player.id, playerName: player.playerName, email: player.email })
    },
    async updatePlayer(id, values) {
      const player = await playerService.updatePlayer(id, values)
      setPlayers((current) => current.map((item) => item.id === id ? { ...item, ...player, registeredAt: item.registeredAt } : item))
      addEvent('update', 'Player', `Player updated: ${values.playerName}`, { playerId: id, playerName: player.playerName, status: player.status })
    },
    async deletePlayer(id) {
      const player = players.find((p) => p.id === id)
      await playerService.deletePlayer(id)
      setPlayers((current) => current.filter((item) => item.id !== id))
      addEvent('delete', 'Player', `Player removed: ${player?.playerName || 'Unknown'}`, { playerId: id, playerName: player?.playerName })
    },
  }), [players, isLoading, error, addEvent])

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}

export function usePlayers() {
  const context = useContext(PlayerContext)
  if (!context) throw new Error('usePlayers must be used inside PlayerProvider')
  return context
}
