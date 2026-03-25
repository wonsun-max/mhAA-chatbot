"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Calendar, Users, Info, Star, ChevronRight, Sparkles, Clock, MapPin } from "lucide-react";
import { lunchPrayerSchedule, getLunchPrayerByDate } from "@/lib/lunch-prayer";

export default function LunchPrayerPage() {
  const currentDate = new Date();
  const yyyy = currentDate.getFullYear();
  const mm = String(currentDate.getMonth() + 1).padStart(2, '0');
  const dd = String(currentDate.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;

  const todayPrayer = getLunchPrayerByDate(currentDate);
  const upcomingSchedules = lunchPrayerSchedule.filter(item => item.date >= todayStr);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-center"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
          <BookOpen size={12} />
          Spiritual Life
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-6">
          점심기도실 <span className="text-zinc-500">안내</span>
        </h1>
        <p className="text-zinc-500 max-w-xl mx-auto font-medium">
          매일 정오, 도서관 방향 기도실에서 열리는<br />
          따뜻한 기도의 자리에 여러분을 초대합니다.
        </p>
      </motion.div>

      {/* Operation Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="group bg-zinc-900/30 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 transition-all duration-500 hover:border-purple-500/20"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-purple-400">
              <Sparkles size={20} />
            </div>
            <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest">Regular Meeting</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-4">화 · 목 기도회</h3>
          <ul className="space-y-4 text-sm font-medium text-zinc-500">
            <li className="flex items-center gap-3">
              <Clock size={16} className="text-purple-400/50" />
              12:25 — 12:45
            </li>
            <li className="flex items-center gap-3">
              <Users size={16} className="text-purple-400/50" />
              지정된 QT조 및 신앙부 의무 참석
            </li>
            <li className="flex items-start gap-3">
              <Info size={16} className="text-purple-400/50 mt-0.5" />
              <span>콘서트 콰이어 참여 학생은 자율 선택</span>
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="group bg-zinc-900/30 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 transition-all duration-500 hover:border-blue-500/20"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-blue-400">
              <Users size={20} />
            </div>
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Open Prayer</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-4">월 · 수 · 금 기도</h3>
          <ul className="space-y-4 text-sm font-medium text-zinc-500">
            <li className="flex items-center gap-3">
              <Clock size={16} className="text-blue-400/50" />
              12:20 — 12:45
            </li>
            <li className="flex items-center gap-3">
              <Sparkles size={16} className="text-blue-400/50" />
              교사, 학생 누구나 자율 참여
            </li>
            <li className="flex items-start gap-3">
              <Info size={16} className="text-blue-400/50 mt-0.5" />
              <span>지정된 당번 없이 자유롭게 기도</span>
            </li>
          </ul>
        </motion.div>
      </div>

      {/* Today's Highlight */}
      <div className="mb-20">
        <div className="flex items-center justify-between px-4 mb-8">
          <div className="flex items-center gap-3">
            <Star size={20} className="text-amber-400 fill-amber-400/20" />
            <h2 className="text-white font-bold text-xl">오늘의 기도실 안내</h2>
          </div>
          <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">{todayStr}</span>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/30 backdrop-blur-xl border border-white/5 rounded-[3rem] p-10 sm:p-14 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/5 blur-[100px] rounded-full group-hover:bg-purple-500/10 transition-colors duration-500" />
          
          <div className="relative z-10">
            {todayPrayer ? (
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-6">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                      todayPrayer.type === 'prayer_meeting' 
                        ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' 
                        : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                    }`}>
                      {todayPrayer.type === 'prayer_meeting' ? 'Regular Meeting' : 'Open Prayer'}
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>

                  {todayPrayer.type === 'prayer_meeting' && 'qtGroup' in todayPrayer ? (
                    <div className="space-y-6">
                      <h3 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
                        {todayPrayer.qtGroup}조 담당
                      </h3>
                      <div className="flex flex-wrap items-center gap-6 text-zinc-400 font-medium">
                         <div className="flex items-center gap-2">
                           <Users size={18} className="text-purple-400" />
                           <span className="text-lg">신앙부: {todayPrayer.faithMembers?.join(', ')}</span>
                         </div>
                         <div className="flex items-center gap-2">
                           <MapPin size={18} className="text-zinc-600" />
                           <span className="text-lg">2층 기도실</span>
                         </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                        {todayPrayer.label}
                      </h3>
                      <p className="text-lg text-zinc-500 font-medium">누구나 자유롭게 참여하여 기도할 수 있습니다.</p>
                    </div>
                  )}
                </div>

                <div className="lg:w-48 p-8 bg-white/5 rounded-[2.5rem] border border-white/5 flex flex-col items-center justify-center gap-2">
                   <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Time</span>
                   <div className="text-xl font-black text-white whitespace-nowrap">
                      {todayPrayer.type === 'prayer_meeting' ? '12:25 — 12:45' : '12:20 — 12:45'}
                   </div>
                </div>
              </div>
            ) : (
              <div className="py-10 text-center">
                 <h3 className="text-2xl font-bold text-zinc-600 italic">공식 일정이 없습니다.</h3>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Upcoming Schedule */}
      {upcomingSchedules.length > 0 && (
        <div className="space-y-8">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <Calendar size={20} className="text-zinc-500" />
              <h2 className="text-white font-bold text-xl">향후 당번 일정</h2>
            </div>
            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Next Sessions</span>
          </div>
          
          <div className="grid gap-3">
            {upcomingSchedules.map((item, idx) => {
              const isToday = item.date === todayStr;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className={`group bg-zinc-900/30 backdrop-blur-xl border rounded-[2rem] p-6 transition-all duration-500 flex flex-col sm:flex-row sm:items-center justify-between gap-6 ${
                    isToday ? "border-purple-500/30 bg-purple-500/5 ring-1 ring-purple-500/20" : "border-white/5 hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-8">
                    <div className="text-left min-w-[100px]">
                      <span className="text-[10px] font-black font-mono text-zinc-600 uppercase tracking-widest mb-1 block">{item.date}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${isToday ? "text-purple-400" : "text-white"}`}>
                          {isToday ? "Today" : new Date(item.date).toLocaleDateString('ko-KR', { weekday: 'long' })}
                        </span>
                      </div>
                    </div>
                    
                    <div className="h-8 w-px bg-white/5 hidden sm:block" />
                    
                    <div>
                      {item.type === 'prayer_meeting' ? (
                        <div className="flex items-center gap-4">
                          <span className="text-lg font-bold text-white tracking-tight">{item.qtGroup}조</span>
                          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-xl text-xs font-medium text-zinc-500">
                             <Users size={14} className="opacity-30" />
                             {item.faithMembers?.join(', ')}
                          </div>
                        </div>
                      ) : (
                        <span className="text-zinc-500 font-medium">{item.label}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                      item.type === 'prayer_meeting' 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                        : 'bg-zinc-900 border-white/5 text-zinc-600'
                    }`}>
                      {item.type === 'prayer_meeting' ? 'Active' : 'Closed'}
                    </span>
                    <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-zinc-800 group-hover:text-white group-hover:border-white/20 transition-all">
                      <ChevronRight size={18} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
