import { usePlayers } from '../hooks/usePlayers'

// Reserved page boundary for future routing and API-backed player views.
export function PlayersPage() {
  const { players, isLoading } = usePlayers()
  return <>{isLoading ? 'Loading...' : `${players.length} players`}</>
}
