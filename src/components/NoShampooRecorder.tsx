'use client'

import { useState, useEffect } from 'react'
import { saveNoShampooRecord, getTodayDateString, getNoShampooRecordForDate, NoShampooRecord } from '../lib/localStorage'

export default function NoShampooRecorder() {
  const [showSuccess, setShowSuccess] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [existingRecord, setExistingRecord] = useState<NoShampooRecord | null>(null)
  const [todayDate, setTodayDate] = useState('')
  
  useEffect(() => {
    // Only run on client side
    const today = getTodayDateString()
    setTodayDate(today)
    setExistingRecord(getNoShampooRecordForDate(today))
  }, [])

  const handleRecordNoShampoo = async () => {
    setIsRecording(true)
    
    try {
      saveNoShampooRecord({
        date: todayDate,
        reason: '今日はシャンプーしなかった'
      })
      
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
      
      // Update existing record state
      setExistingRecord(getNoShampooRecordForDate(todayDate))
    } catch (error) {
      console.error('Error recording no-shampoo:', error)
    } finally {
      setIsRecording(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="p-4 bg-green-100 border border-green-400 rounded-lg text-center animate-pulse">
          <p className="text-green-800 text-lg font-semibold">
            💚 生きててえらい！
          </p>
          <p className="text-green-600 text-sm">
            ローカルに記録されました
          </p>
        </div>
      )}

      {/* No Shampoo Record Button */}
      <div className="p-6 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          今日のシャンプー記録
        </h2>
        
        {existingRecord ? (
          <div className="text-center">
            <p className="text-gray-600 mb-2">今日は既に記録済みです</p>
            <p className="text-sm text-gray-500">
              記録時刻: {new Date(existingRecord.timestamp).toLocaleTimeString('ja-JP')}
            </p>
          </div>
        ) : (
          <>
            <button
              onClick={handleRecordNoShampoo}
              disabled={isRecording}
              className="w-full py-4 px-6 bg-gray-500 text-white text-lg font-semibold rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isRecording ? '記録中...' : '🚿 今日シャンプーしなかった'}
            </button>
            
            <p className="text-sm text-gray-500 mt-2">
              ローカルストレージに保存されます
            </p>
          </>
        )}
      </div>
    </div>
  )
}