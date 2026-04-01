"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { AlertCircle, RefreshCcw } from "lucide-react"

/**
 * FakeErrorOverlay component for April Fools' prank.
 * Mimics a "Critical System Error" to surprise the user.
 * 
 * @param {Object} props
 * @param {Function} props.onDismiss - Callback to hide the overlay.
 */
export default function FakeErrorOverlay({ onDismiss }: { onDismiss: () => void }) {
  const [dots, setDots] = useState("")
  const [isRevealed, setIsRevealed] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length < 3 ? prev + "." : ""))
    }, 500)
    
    // Reveal the "April Fools" text after 3 seconds to not be TOO mean
    const timer = setTimeout(() => setIsRevealed(true), 3000)
    
    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [])

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[9999] bg-[#f8f9fa] text-black font-sans p-8 md:p-20 flex flex-col select-none"
    >
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-red-50 rounded-full">
            <AlertCircle className="text-red-500 w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 italic">Aw, Snap!</h1>
        </div>

        <div className="space-y-8 text-xl text-gray-600 leading-relaxed font-light">
          <p>
            마닐라한국아카데미 WITHUS 플랫폼에 예상치 못한 <span className="font-bold text-red-600">치명적인 오류(0x401)</span>가 발생했습니다. 
            중력 엔진의 과부하로 인해 모든 UI 요소가 균형을 잃었습니다.
          </p>

          <div className="p-8 bg-gray-50 rounded-2xl font-mono text-sm text-gray-400 border border-gray-100 shadow-inner">
            <p className="mb-2 uppercase tracking-widest text-[10px] text-gray-300">System Diagnostic Log</p>
            <p className="mb-1">Error: ANTIGRAVITY_SYSTEM_COLLAPSE</p>
            <p className="mb-1">Reason: TOO_MUCH_FLOAT_PRESSURE</p>
            <p className="mb-1">Timestamp: 2026-04-01 10:23:05</p>
            <p>Status: UI_LEAKING_TO_SPACE...</p>
          </div>

          <p className="flex items-center gap-2">
            시스템 복구 중{dots}
          </p>
        </div>

        <div className="mt-16 flex flex-col md:flex-row items-center gap-8">
           <button 
             onClick={onDismiss}
             className="w-full md:w-auto px-10 py-5 bg-gray-900 text-white rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-3"
           >
             <RefreshCcw className="w-5 h-5" />
             무중력 엔진 재부팅
           </button>
           
           <motion.p 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: isRevealed ? 1 : 0, y: isRevealed ? 0 : 10 }}
             className="text-sm font-medium text-blue-500 tracking-tight text-center md:text-left"
           >
             🎉 HAPPY APRIL FOOLS! 🎉 <br/>
             <span className="text-gray-400 font-normal">공부가 너무 힘들 땐 잠시 떠다녀도 괜찮아요.</span>
           </motion.p>
        </div>
      </div>
    </motion.div>
  )
}
