"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, Clock, Tag, Bell, Award, Sparkles, PartyPopper, ChevronRight } from "lucide-react";

interface CalendarEvent {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  eventType: string;
}

const CATEGORIES = [
  { key: "all", label: "전체", icon: <Sparkles size={14} /> },
  { key: "Exam", label: "시험", icon: <Award size={14} /> },
  { key: "Holiday", label: "휴일/방학", icon: <PartyPopper size={14} /> },
  { key: "Events", label: "행사", icon: <CalendarIcon size={14} /> },
];

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeMonth, setActiveMonth] = useState<string>("upcoming");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/admin/collab/calendar");
        const data = await res.json();
        if (data.events) {
          const sortedEvents = data.events.sort((a: CalendarEvent, b: CalendarEvent) => 
            a.startDate.localeCompare(b.startDate)
          );
          setEvents(sortedEvents);
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const months = useMemo(() => {
    const mSet = new Set<string>();
    events.forEach(evt => {
      const parts = evt.startDate.split("-");
      if (parts.length > 1) {
        const m = parseInt(parts[1]).toString();
        mSet.add(m);
      }
    });
    return Array.from(mSet).sort((a, b) => parseInt(a) - parseInt(b));
  }, [events]);

  const upcomingEvents = useMemo(() => {
    return events.filter(evt => evt.endDate >= todayStr);
  }, [events, todayStr]);

  const nearestEvent = upcomingEvents[0];

  const filteredEvents = useMemo(() => {
    let result = events;

    if (activeMonth === "upcoming") {
      result = upcomingEvents;
    } else {
      result = events.filter(evt => {
        const m = parseInt(evt.startDate.split("-")[1]).toString();
        return m === activeMonth;
      });
    }

    if (activeCategory !== "all") {
      result = result.filter(evt => evt.eventType === activeCategory);
    }

    return result;
  }, [events, upcomingEvents, activeMonth, activeCategory]);

  const getDDay = (dateStr: string) => {
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    const todayBase = new Date(today);
    todayBase.setHours(0, 0, 0, 0);
    
    const diffTime = target.getTime() - todayBase.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "D-Day";
    if (diffDays < 0) return `D+${Math.abs(diffDays)}`;
    return `D-${diffDays}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-8 h-8 border-4 border-white/10 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-zinc-300">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-center"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
          <CalendarIcon size={12} />
          Academic Calendar
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-6">
          학사 <span className="text-zinc-500">일정</span>
        </h1>
        <p className="text-zinc-500 max-w-xl mx-auto font-medium">
          학교 생활의 주요 이벤트를 한눈에 확인하고<br />
          중요한 일정을 놓치지 마세요.
        </p>
      </motion.div>

      {/* D-Day Highlight Card */}
      <AnimatePresence>
        {nearestEvent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-20 relative"
          >
            <div className="bg-zinc-900/30 backdrop-blur-xl border border-white/5 rounded-[3rem] p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[100px] rounded-full group-hover:bg-white/10 transition-colors" />
               
               <div className="flex-1 text-center md:text-left relative z-10">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-blue-500 font-black text-[10px] uppercase tracking-widest">Upcoming Event</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">
                    {nearestEvent.name}
                  </h2>
                  <div className="flex items-center justify-center md:justify-start gap-4 text-zinc-500 text-sm font-medium">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/5">
                      <Clock size={14} className="text-blue-400" /> 
                      <span className="font-mono text-xs">{nearestEvent.startDate}</span>
                    </div>
                    <span className="px-3 py-1.5 bg-white/5 rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-wider">{nearestEvent.eventType}</span>
                  </div>
               </div>

               <div className="relative z-10">
                  <div className="bg-white text-black rounded-[2.5rem] px-12 py-8 flex flex-col items-center shadow-2xl shadow-white/10 active:scale-95 transition-transform">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-50">Countdown</span>
                    <span className="text-5xl font-black tracking-tighter">
                      {getDDay(nearestEvent.startDate)}
                    </span>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Month Selector */}
      <div className="mb-12">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-4">
           <button
             onClick={() => setActiveMonth("upcoming")}
             className={`px-6 py-3 rounded-2xl text-xs font-black transition-all border whitespace-nowrap ${
               activeMonth === "upcoming" 
                 ? "bg-white text-black border-white" 
                 : "bg-zinc-900/40 text-zinc-500 border-white/5 hover:border-white/10"
             }`}
           >
             전체 일정
           </button>
           <div className="w-px h-6 bg-white/10 mx-2 flex-shrink-0" />
           {months.map(m => (
             <button
               key={m}
               onClick={() => setActiveMonth(m)}
               className={`px-6 py-3 rounded-2xl text-xs font-black transition-all border whitespace-nowrap ${
                 activeMonth === m 
                   ? "bg-zinc-100 text-black border-zinc-100" 
                   : "bg-zinc-900/40 text-zinc-500 border-white/5 hover:border-white/10"
               }`}
             >
               {m}월
             </button>
           ))}
        </div>
      </div>

      {/* Category & Filter Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-16">
         <div className="flex p-1 bg-zinc-900/40 backdrop-blur-xl rounded-2xl border border-white/5 w-fit">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-[1.25rem] text-xs font-bold transition-all relative whitespace-nowrap ${
                  activeCategory === cat.key ? "text-white" : "text-zinc-500 hover:text-white"
                }`}
              >
                {activeCategory === cat.key && (
                  <motion.div
                    layoutId="activeCat"
                    className="absolute inset-0 bg-white/5 rounded-[1.25rem] border border-white/10"
                    transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <span className={activeCategory === cat.key ? "text-white" : "opacity-30"}>{cat.icon}</span>
                  {cat.label}
                </span>
              </button>
            ))}
         </div>
         <div className="flex items-center gap-3 text-zinc-500 px-4 py-2 rounded-2xl border border-white/5 bg-zinc-900/20">
            <Tag size={12} className="text-zinc-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
               {activeMonth === "upcoming" ? "Upcoming View" : `${activeMonth} Month View`}
            </span>
         </div>
      </div>

      {/* Events Timeline */}
      <div className="relative space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => {
              const isPast = event.endDate < todayStr;
              return (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4, delay: index * 0.03 }}
                  className={`group relative ${isPast ? "opacity-40 grayscale" : ""}`}
                >
                  <div className={`bg-zinc-900/30 backdrop-blur-sm border border-white/5 hover:border-white/20 rounded-3xl p-6 transition-all duration-500 flex flex-col sm:flex-row sm:items-center justify-between gap-6 ${
                    event.startDate === todayStr ? "ring-1 ring-blue-500/30 bg-blue-500/5" : ""
                  }`}>
                      <div className="flex items-center gap-6">
                         <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 font-black text-xs transition-colors ${
                           event.eventType === 'Holiday' ? 'bg-red-500/10 text-red-400' : 
                           event.eventType === 'Exam' ? 'bg-amber-500/10 text-amber-400' :
                           'bg-blue-500/10 text-blue-400'
                         }`}>
                           {event.eventType === 'Holiday' ? '휴일' : 
                            event.eventType === 'Exam' ? '시험' : '행사'}
                         </div>
                         
                         <div>
                            <div className="flex items-center gap-3 mb-1">
                               <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors">
                                 {event.name}
                               </h3>
                               {event.startDate === todayStr && (
                                  <span className="px-2 py-0.5 rounded-lg bg-blue-500 text-[8px] font-black text-white animate-pulse">TODAY</span>
                               )}
                            </div>
                            <div className="flex items-center gap-3 text-xs font-medium text-zinc-500">
                               <span className="font-mono">{event.startDate}</span>
                               {event.startDate !== event.endDate && (
                                 <>
                                   <span className="opacity-30">/</span>
                                   <span className="font-mono">{event.endDate}</span>
                                 </>
                               )}
                            </div>
                         </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6">
                         {event.startDate >= todayStr && (
                            <div className="text-right">
                               <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-0.5">D-Day</div>
                               <div className="text-lg font-black text-white tracking-tight">{getDDay(event.startDate)}</div>
                            </div>
                         )}
                         <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-zinc-700 group-hover:text-white group-hover:border-white/20 transition-all">
                            <ChevronRight size={18} />
                         </div>
                      </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-32 text-center flex flex-col items-center justify-center gap-6 bg-zinc-900/20 rounded-[3rem] border border-dashed border-white/10"
            >
              <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-zinc-700">
                 <CalendarIcon size={32} strokeWidth={1} />
              </div>
              <div className="space-y-1">
                <p className="text-zinc-500 font-bold">등록된 일정이 없습니다.</p>
                <p className="text-zinc-700 text-sm">해당 조건에 맞는 일정을 찾을 수 없어요.</p>
              </div>
              <button 
                onClick={() => { setActiveMonth("upcoming"); setActiveCategory("all"); }}
                className="text-xs text-white bg-white/5 px-6 py-3 rounded-2xl border border-white/10 hover:bg-white/10 transition-all font-bold"
              >
                필터 초기화
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-24 p-10 rounded-[2.5rem] bg-zinc-900/30 border border-white/5 flex flex-col md:flex-row items-center gap-10 group"
      >
        <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center text-zinc-500 shrink-0 group-hover:scale-110 transition-transform duration-500">
           <Bell size={32} strokeWidth={1.5} />
        </div>
        <div className="text-center md:text-left flex-1">
           <h4 className="text-white font-bold text-xl mb-2">학사 일정 안내</h4>
           <p className="text-sm text-zinc-500 leading-relaxed font-medium">
              모든 학사 일정은 학교 사정에 따라 변경될 수 있습니다. 
              주요 시험 및 행사는 일주일 전 푸시 알림으로 안내해 드리니 정기적으로 확인해 주세요. 
              자세한 사항은 담임 선생님 또는 학교 홈페이지를 참고하시기 바랍니다.
           </p>
        </div>
      </motion.div>
    </div>
  );
}
