import { X } from 'lucide-react'
import { PlayerForm } from './PlayerForm'
import type { Player, PlayerFormValues } from '../types'

interface PlayerModalProps { player: Player; isSaving: boolean; onClose: () => void; onSubmit: (values: PlayerFormValues) => Promise<void> }
export function PlayerModal({ player, isSaving, onClose, onSubmit }: PlayerModalProps) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="edit-player-title"><button className="icon-button modal-close" onClick={onClose} aria-label="Close dialog"><X /></button><div id="edit-player-title"><PlayerForm initialValues={{ playerName: player.playerName, phone: player.phone, email: player.email, status: player.status }} isEditing isSaving={isSaving} onSubmit={onSubmit} onCancel={onClose} /></div></section></div>
}
