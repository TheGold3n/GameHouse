import { useEffect, useState } from 'react'
import type { PlayerFormValues, PlayerStatus } from '../types'

interface PlayerFormProps { initialValues?: PlayerFormValues; isEditing?: boolean; isSaving?: boolean; onSubmit: (values: PlayerFormValues) => Promise<void>; onCancel?: () => void }
const emptyValues: PlayerFormValues = { playerName: '', phone: '', email: '', status: 'active', game: 'Minecraft' }

export function PlayerForm({ initialValues = emptyValues, isEditing = false, isSaving = false, onSubmit, onCancel }: PlayerFormProps) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof PlayerFormValues, string>>>({})
  useEffect(() => setValues(initialValues), [initialValues])
  const update = (field: keyof PlayerFormValues, value: string) => setValues((current) => ({ ...current, [field]: value }))
  const validate = () => {
    const next: typeof errors = {}
    if (!values.playerName.trim()) next.playerName = 'El nombre de jugador es obligatorio.'
    if (!/^\+?[0-9 ()-]{8,}$/.test(values.phone)) next.phone = 'Ingresa un número de teléfono válido.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = 'Ingresa un correo electrónico válido.'
    setErrors(next)
    return Object.keys(next).length === 0
  }
  const submit = async (event: React.FormEvent) => { event.preventDefault(); if (validate()) await onSubmit(values) }
  return <form className="player-form" onSubmit={submit} noValidate>
    <div className="form-heading"><div><span className="eyebrow">{isEditing ? 'PERFIL DE JUGADOR' : 'NUEVO JUGADOR'}</span><h2>{isEditing ? 'Editar jugador' : 'Registrar jugador'}</h2></div>{!isEditing && <span className="form-step">01 <i>/</i> 01</span>}</div>
    <label>Gamertag / Nombre de jugador<input value={values.playerName} onChange={(e) => update('playerName', e.target.value)} placeholder="Ej. Kael_Sniper" aria-invalid={!!errors.playerName} />{errors.playerName && <small className="field-error">{errors.playerName}</small>}</label>
    <label>Juego principal / en curso
      <select value={values.game || 'Minecraft'} onChange={(e) => update('game', e.target.value)}>
        <option value="Minecraft">⛏️ Minecraft</option>
        <option value="Valorant">🎯 Valorant</option>
        <option value="Fortnite">⚡ Fortnite</option>
        <option value="Counter-Strike 2">💣 Counter-Strike 2</option>
        <option value="Apex Legends">🚀 Apex Legends</option>
        <option value="Call of Duty: Warzone">💥 Call of Duty: Warzone</option>
        <option value="Overwatch 2">🛡️ Overwatch 2</option>
        <option value="Rainbow Six Siege">🔒 Rainbow Six Siege</option>
        <option value="Casual / Variado">🎮 Casual / Variado</option>
      </select>
    </label>
    <label>Teléfono de contacto<input value={values.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+34 612 345 678" aria-invalid={!!errors.phone} />{errors.phone && <small className="field-error">{errors.phone}</small>}</label>
    <label>Correo electrónico<input type="email" value={values.email} onChange={(e) => update('email', e.target.value)} placeholder="jugador@gmail.com" aria-invalid={!!errors.email} />{errors.email && <small className="field-error">{errors.email}</small>}</label>
    {isEditing && <label>Estado de conexión<select value={values.status} onChange={(e) => update('status', e.target.value as PlayerStatus)}><option value="active">En línea (Activo)</option><option value="inactive">Desconectado (Inactivo)</option></select></label>}
    <div className="form-actions">{onCancel && <button type="button" className="button button-secondary" onClick={onCancel}>Cancelar</button>}<button type="submit" className="button button-primary" disabled={isSaving}>{isSaving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Registrar jugador'}</button></div>
  </form>
}
