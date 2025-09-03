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
    <div className="space-y-4">
      {/* Success Message */}
      {showSuccess && (
        <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl text-center backdrop-blur-sm animate-pulse">
          <p className="text-purple-300 text-lg font-semibold mb-1">
            💜 生きててえらい！
          </p>
          <p className="text-purple-200 text-sm">
            ローカルに記録されました
          </p>
        </div>
      )}

      {/* No Shampoo Record Button */}
      <div className="p-6 bg-gradient-to-br from-gray-500/20 to-slate-500/20 backdrop-blur-sm border border-gray-500/30 rounded-2xl">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">😴</div>
          <h2 className="text-xl font-bold text-white mb-2">
            今日はパス
          </h2>
          <p className="text-gray-300 text-sm">
            ローカルに記録（それでもえらい）
          </p>
        </div>
        
        {existingRecord ? (
          <div className="text-center">
            <div className="p-4 bg-gray-600/30 rounded-xl border border-gray-500/30">
              <p className="text-gray-300 mb-2">今日は既に記録済み</p>
              <p className="text-gray-400 text-sm">
                記録時刻: {new Date(existingRecord.timestamp).toLocaleTimeString('ja-JP')}
              </p>
            </div>
          </div>
        ) : (
          <>
            <button
              onClick={handleRecordNoShampoo}
              disabled={isRecording}
              className="w-full py-4 px-6 bg-gradient-to-r from-gray-600 to-slate-600 text-white text-lg font-bold rounded-xl hover:from-gray-700 hover:to-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              {isRecording ? '記録中...' : '😴 今日はパス'}
            </button>
            
            <p className="text-gray-400 text-xs mt-2 text-center">
              ※ ローカルストレージに保存
            </p>
          </>
        )}
      </div>
    </div>
  )
}