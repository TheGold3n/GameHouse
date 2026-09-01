import { Trash2, RotateCcw } from 'lucide-react'
import { useEventLog } from '../context/EventLogContext'
import '../styles/realtime-flow.css'

const eventTypeColors: Record<string, string> = {
  create: '#10b981',
  update: '#3b82f6',
  delete: '#ef4444',
  search: '#f59e0b',
  sort: '#8b5cf6',
  theme: '#ec4899',
  page: '#06b6d4',
}

const eventTypeLabels: Record<string, string> = {
  create: '➕ CREATE',
  update: '✏️ UPDATE',
  delete: '🗑️ DELETE',
  search: '🔍 SEARCH',
  sort: '↕️ SORT',
  theme: '🎨 THEME',
  page: '📄 PAGE',
}

export function RealTimeFlow() {
  const { events, clearEvents } = useEventLog()

  const formatTime = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleTimeString('en-US', { hour12: false })
  }

  const formatDate = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleDateString('en-US')
  }

  return (
    <div className="realtime-flow-container">
      <section className="page-intro">
        <div>
          <span className="eyebrow">MONITORING <b>•</b> REAL-TIME FLOW</span>
          <h1>Live <em>activity stream</em></h1>
          <p>Monitor all events and interactions happening in real-time. Perfect for debugging, monitoring, and load testing with Jmeter.</p>
        </div>
        <div className="system-status">
          <span className="pulse" />
          Live monitoring
        </div>
      </section>

      <section className="workspace-panel">
        <div className="panel-header">
          <div>
            <span className="eyebrow">ACTIVITY LOG</span>
            <h2>Real-time events <span>{events.length}</span></h2>
          </div>
          <div className="header-actions">
            <button className="button button-secondary" onClick={clearEvents}>
              <RotateCcw size={17} /> Clear log
            </button>
            <button className="button button-outline" disabled>
              <Trash2 size={17} /> Auto-clear disabled
            </button>
          </div>
        </div>

        <div className="event-log-viewer">
          {events.length === 0 ? (
            <div className="empty-state">
              <p>Waiting for events...</p>
              <small>Events will appear here as you interact with the application.</small>
            </div>
          ) : (
            <div className="event-list">
              {events.map((event) => (
                <div key={event.id} className="event-item">
                  <div className="event-header">
                    <span
                      className="event-type-badge"
                      style={{ backgroundColor: eventTypeColors[event.type] || '#6b7280' }}
                    >
                      {eventTypeLabels[event.type] || event.type.toUpperCase()}
                    </span>
                    <span className="event-category">{event.category}</span>
                    <span className="event-time">{formatTime(event.timestamp)}</span>
                    <span className="event-date">{formatDate(event.timestamp)}</span>
                  </div>
                  <div className="event-message">{event.message}</div>
                  {event.details && Object.keys(event.details).length > 0 && (
                    <details className="event-details">
                      <summary>Details</summary>
                      <pre>{JSON.stringify(event.details, null, 2)}</pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="create-strip">
        <div>
          <span className="eyebrow">JMETER INTEGRATION</span>
          <h2>Ready for load testing</h2>
          <p>This event stream logs all user interactions. Use the developer tools or API monitoring to capture traffic for your Jmeter test plans.</p>
        </div>
        <button className="button button-outline" onClick={() => window.open('https://jmeter.apache.org/', '_blank')}>
          Jmeter Documentation
        </button>
      </section>
    </div>
  )
}
