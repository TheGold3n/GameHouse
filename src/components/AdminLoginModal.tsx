import { useState, type FormEvent } from 'react'
import { Eye, EyeOff, Lock, ShieldCheck, X } from 'lucide-react'

interface AdminLoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const ADMIN_PASSWORD = 'Velvyn.1234'

export function AdminLoginModal({ isOpen, onClose, onSuccess }: AdminLoginModalProps) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsVerifying(true)

    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        localStorage.setItem('gamehouse_admin_token', ADMIN_PASSWORD)
        setPassword('')
        setIsVerifying(false)
        onSuccess()
      } else {
        setError('Contraseña incorrecta. Solo el administrador velvyn tiene acceso autorizado.')
        setIsVerifying(false)
      }
    }, 400)
  }

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <section className="modal admin-login-modal" role="dialog" aria-modal="true">
        <button className="icon-button modal-close" onClick={onClose} aria-label="Cerrar diálogo">
          <X />
        </button>

        <div className="admin-login-content">
          <div className="admin-modal-header">
            <div className="admin-modal-icon">
              <ShieldCheck size={26} />
            </div>
            <div>
              <span className="eyebrow" style={{ color: '#a78bfa' }}>CONTROL DE ACCESO</span>
              <h2 style={{ fontSize: '20px', margin: '4px 0 6px' }}>Autenticación de Administrador</h2>
              <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0 }}>
                Ingresa la clave maestra para iniciar sesión como <strong>velvyn (Admin)</strong>.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="admin-login-form">
            <label style={{ display: 'block', margin: '18px 0 6px', fontSize: '12px', color: '#cbd5e1' }}>
              Contraseña de Administrador
              <div className="password-input-wrapper">
                <Lock size={15} className="password-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Introduce la contraseña..."
                  autoFocus
                  required
                  style={{
                    width: '100%',
                    padding: '11px 40px 11px 36px',
                    background: '#131619',
                    border: error ? '1px solid #ee6767' : '1px solid #353c42',
                    color: '#f4f4f0',
                    outline: 0,
                    borderRadius: '4px',
                    fontSize: '13px'
                  }}
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Ver u ocultar contraseña"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>

            {error && (
              <div className="admin-error-notice">
                <span>⚠️ {error}</span>
              </div>
            )}

            <div className="admin-modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '22px' }}>
              <button type="button" className="button button-secondary" onClick={onClose} disabled={isVerifying}>
                Cancelar
              </button>
              <button
                type="submit"
                className="button button-primary"
                style={{ background: '#7c3aed', color: '#fff' }}
                disabled={isVerifying || !password}
              >
                {isVerifying ? 'Verificando...' : 'Acceder como Admin'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}

