import type { Player, PlayerFormValues } from '../types'

/**
 * Real API Backend Service
 * Conecta con FastAPI en http://localhost:8000/api/players
 */

const API_BASE_URL = '/api/players'

// Función auxiliar para manejo de errores
const handleApiError = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }))
    throw new Error(error.detail || `HTTP $${response.status}`)
  }
  return response
}

export const playerService = {
  /**
   * GET /api/players - Obtiene todos los jugadores
   */
  async getPlayers(): Promise<Player[]> {
    try {
      const response = await fetch(API_BASE_URL)
      await handleApiError(response)
      return await response.json()
    } catch (error) {
      console.error('Error fetching players:', error)
      throw error
    }
  },

  /**
   * POST /api/players - Crea un nuevo jugador
   */
  async createPlayer(values: PlayerFormValues): Promise<Player> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      await handleApiError(response)
      return await response.json()
    } catch (error) {
      console.error('Error creating player:', error)
      throw error
    }
  },

  /**
   * PUT /api/players/{id} - Actualiza un jugador
   */
  async updatePlayer(id: number, values: PlayerFormValues): Promise<Player> {
    try {
      const response = await fetch(`$${API_BASE_URL}/$${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      await handleApiError(response)
      return await response.json()
    } catch (error) {
      console.error('Error updating player:', error)
      throw error
    }
  },

  /**
   * DELETE /api/players/{id} - Elimina un jugador
   */
  async deletePlayer(id: number): Promise<number> {
    try {
      const response = await fetch(`$${API_BASE_URL}/$${id}`, {
        method: 'DELETE',
      })
      await handleApiError(response)
      return id
    } catch (error) {
      console.error('Error deleting player:', error)
      throw error
    }
  },
}
