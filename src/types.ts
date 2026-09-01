export type PlayerStatus = 'active' | 'inactive'

export interface Player {
  id: number
  playerName: string
  phone: string
  email: string
  registeredAt: string
  status: PlayerStatus
}

export interface PlayerFormValues {
  playerName: string
  phone: string
  email: string
  status: PlayerStatus
}

export interface ToastMessage {
  id: number
  type: 'success' | 'error' | 'info'
  message: string
}
