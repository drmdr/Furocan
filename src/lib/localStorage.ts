export interface NoShampooRecord {
  id: string
  date: string
  time: string
  timestamp: number
}

export interface ShampooLog {
  id: string
  date: string
  time: string
  shampooed: boolean
  timestamp: number
}

const NO_SHAMPOO_KEY = 'no-shampoo-records'
const SHAMPOO_LOGS_KEY = 'shampoo-logs'

export function saveNoShampooRecord(): NoShampooRecord {
  const now = new Date()
  const record: NoShampooRecord = {
    id: crypto.randomUUID(),
    date: now.toISOString().split('T')[0],
    time: now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
    timestamp: now.getTime()
  }
  
  const existing = getNoShampooRecords()
  const updated = [record, ...existing].slice(0, 50) // Keep only last 50 records
  
  localStorage.setItem(NO_SHAMPOO_KEY, JSON.stringify(updated))
  
  // Also add to general logs
  addToShampooLogs(false)
  
  return record
}

export function getNoShampooRecords(): NoShampooRecord[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(NO_SHAMPOO_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function getNoShampooRecordForDate(date: string): NoShampooRecord | null {
  const records = getNoShampooRecords()
  return records.find(record => record.date === date) || null
}

export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0]
}

export function addToShampooLogs(shampooed: boolean): ShampooLog {
  const now = new Date()
  const log: ShampooLog = {
    id: crypto.randomUUID(),
    date: now.toISOString().split('T')[0],
    time: now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
    shampooed,
    timestamp: now.getTime()
  }
  
  const existing = getShampooLogs()
  const updated = [log, ...existing].slice(0, 50) // Keep only last 50 records
  
  localStorage.setItem(SHAMPOO_LOGS_KEY, JSON.stringify(updated))
  
  return log
}

export function getShampooLogs(): ShampooLog[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(SHAMPOO_LOGS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}