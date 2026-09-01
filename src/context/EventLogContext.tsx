import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export interface EventLog {
  id: string
  timestamp: string
  type: 'create' | 'update' | 'delete' | 'search' | 'sort' | 'theme' | 'page'
  category: string
  message: string
  details?: Record<string, unknown>
}

interface EventLogContextValue {
  events: EventLog[]
  addEvent: (type: EventLog['type'], category: string, message: string, details?: Record<string, unknown>) => void
  clearEvents: () => void
}

const EventLogContext = createContext<EventLogContextValue | undefined>(undefined)

export function EventLogProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<EventLog[]>([])

  const addEvent = useCallback((type: EventLog['type'], category: string, message: string, details?: Record<string, unknown>) => {
    const event: EventLog = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      type,
      category,
      message,
      details,
    }
    setEvents((current) => [event, ...current].slice(0, 500)) // Keep last 500 events
  }, [])

  const clearEvents = useCallback(() => {
    setEvents([])
  }, [])

  return (
    <EventLogContext.Provider value={{ events, addEvent, clearEvents }}>
      {children}
    </EventLogContext.Provider>
  )
}

export function useEventLog() {
  const context = useContext(EventLogContext)
  if (!context) throw new Error('useEventLog must be used inside EventLogProvider')
  return context
}
