import { useEffect, useState } from 'react'
import type { PlayerFormValues, PlayerStatus } from '../types'

interface PlayerFormProps { initialValues?: PlayerFormValues; isEditing?: boolean; isSaving?: boolean; onSubmit: (values: PlayerFormValues) => Promise<void>; onCancel?: () => void }
const emptyValues: PlayerFormValues = { playerName: '', phone: '', email: '', status: 'active' }

export function PlayerForm({ initialValues = emptyValues, isEditing = false, isSaving = false, onSubmit, onCancel }: PlayerFormProps) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof PlayerFormValues, string>>>({})
  useEffect(() => setValues(initialValues), [initialValues])
  const update = (field: keyof PlayerFormValues, value: string) => setValues((current) => ({ ...current, [field]: value }))
  const validate = () => {
    const next: typeof errors = {}
    if (!values.playerName.trim()) next.playerName = 'Player name is required.'
    if (!/^\+?[0-9 ()-]{8,}$/.test(values.phone)) next.phone = 'Use a valid phone number.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = 'Use a valid email address.'
    setErrors(next)
    return Object.keys(next).length === 0
  }
  const submit = async (event: React.FormEvent) => { event.preventDefault(); if (validate()) await onSubmit(values) }
  return <form className="player-form" onSubmit={submit} noValidate>
    <div className="form-heading"><div><span className="eyebrow">{isEditing ? 'PLAYER PROFILE' : 'NEW PLAYER'}</span><h2>{isEditing ? 'Edit player' : 'Register player'}</h2></div>{!isEditing && <span className="form-step">01 <i>/</i> 01</span>}</div>
    <label>Player name<input value={values.playerName} onChange={(e) => update('playerName', e.target.value)} placeholder="e.g. ShadowNinja_42" aria-invalid={!!errors.playerName} />{errors.playerName && <small className="field-error">{errors.playerName}</small>}</label>
    <label>Phone number<input value={values.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+54 9 11 0000-0000" aria-invalid={!!errors.phone} />{errors.phone && <small className="field-error">{errors.phone}</small>}</label>
    <label>Email address<input type="email" value={values.email} onChange={(e) => update('email', e.target.value)} placeholder="player@tempgaming.local" aria-invalid={!!errors.email} />{errors.email && <small className="field-error">{errors.email}</small>}</label>
    {isEditing && <label>Status<select value={values.status} onChange={(e) => update('status', e.target.value as PlayerStatus)}><option value="active">Active</option><option value="inactive">Inactive</option></select></label>}
    <div className="form-actions">{onCancel && <button type="button" className="button button-secondary" onClick={onCancel}>Cancel</button>}<button type="submit" className="button button-primary" disabled={isSaving}>{isSaving ? 'Saving...' : isEditing ? 'Save changes' : 'Create player'}</button></div>
  </form>
}
