// Local storage utilities for non-shampoo records

export interface NoShampooRecord {
  date: string; // YYYY-MM-DD format
  timestamp: number;
  reason?: string;
}

const STORAGE_KEY = 'shampoo-tracker-no-shampoo-records';

export const saveNoShampooRecord = (record: Omit<NoShampooRecord, 'timestamp'>): void => {
  try {
    // Check if we're in the browser
    if (typeof window === 'undefined') return;
    
    const existingRecords = getNoShampooRecords();
    const newRecord: NoShampooRecord = {
      ...record,
      timestamp: Date.now(),
    };
    
    // Check if record for today already exists
    const existingIndex = existingRecords.findIndex(r => r.date === record.date);
    
    if (existingIndex >= 0) {
      // Update existing record
      existingRecords[existingIndex] = newRecord;
    } else {
      // Add new record
      existingRecords.push(newRecord);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingRecords));
  } catch (error) {
    console.error('Failed to save no-shampoo record:', error);
  }
};

export const getNoShampooRecords = (): NoShampooRecord[] => {
  try {
    // Check if we're in the browser
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to get no-shampoo records:', error);
    return [];
  }
};

export const getNoShampooRecordForDate = (date: string): NoShampooRecord | null => {
  const records = getNoShampooRecords();
  return records.find(r => r.date === date) || null;
};

export const deleteNoShampooRecord = (date: string): void => {
  try {
    // Check if we're in the browser
    if (typeof window === 'undefined') return;
    
    const records = getNoShampooRecords();
    const filteredRecords = records.filter(r => r.date !== date);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredRecords));
  } catch (error) {
    console.error('Failed to delete no-shampoo record:', error);
  }
};

export const getTodayDateString = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // YYYY-MM-DD format
};