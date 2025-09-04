'use client'

import { useState } from 'react'

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  
  // 安全な日付計算
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const today = new Date()
    
    // 月の最初の日
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    
    // カレンダーの開始日（日曜日から開始）
    const startDate = new Date(firstDay)
    startDate.setDate(firstDay.getDate() - firstDay.getDay())
    
    const days = []
    const currentDateIter = new Date(startDate)
    
    // 6週間分の日付を生成
    for (let i = 0; i < 42; i++) {
      const isCurrentMonth = currentDateIter.getMonth() === month
      const isToday = 
        currentDateIter.getDate() === today.getDate() &&
        currentDateIter.getMonth() === today.getMonth() &&
        currentDateIter.getFullYear() === today.getFullYear()
      
      days.push({
        date: currentDateIter.getDate(),
        isCurrentMonth,
        isToday
      })
      
      currentDateIter.setDate(currentDateIter.getDate() + 1)
    }
    
    return days
  }
  
  const days = generateCalendarDays()
  const monthNames = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ]
  
  const weekDays = ['日', '月', '火', '水', '木', '金', '土']
  
  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }
  
  return (
    <div className="w-full max-w-sm mx-auto space-y-4">
      {/* カレンダーヘッダー */}
      <div className="p-4 bg-card rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-primary/10 rounded-lg transition-colors text-lg"
          >
            ←
          </button>
          <h2 className="text-lg font-semibold">
            {currentDate.getFullYear()}年 {monthNames[currentDate.getMonth()]}
          </h2>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-primary/10 rounded-lg transition-colors text-lg"
          >
            →
          </button>
        </div>
        
        {/* 曜日ヘッダー */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground p-1">
              {day}
            </div>
          ))}
        </div>
        
        {/* カレンダーグリッド */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <div
              key={index}
              className={`
                aspect-square flex items-center justify-center text-xs rounded-md
                ${day.isCurrentMonth 
                  ? 'text-foreground hover:bg-primary/10' 
                  : 'text-muted-foreground/30'
                }
                ${day.isToday 
                  ? 'bg-primary text-primary-foreground font-bold' 
                  : ''
                }
                transition-colors cursor-pointer
              `}
            >
              {day.date}
            </div>
          ))}
        </div>
      </div>
      
      {/* 凡例 */}
      <div className="p-3 bg-card rounded-lg border">
        <div className="flex items-center justify-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>シャンプー</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>パス</span>
          </div>
        </div>
      </div>
    </div>
  )
}