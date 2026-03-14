"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, Clock, Tag, Bell, Filter, Award, Sparkles, PartyPopper } from "lucide-react";

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
  { key: "Event", label: "행사", icon: <CalendarIcon size={14} /> },
];

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeMonth, setActiveMonth] = useState<string>("upcoming"); // "upcoming" or month string "1", "2", etc.

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
    
    // 1. Month/Upcoming Filter
    if (activeMonth === "upcoming") {
      result = upcomingEvents;
    } else {
      result = events.filter(evt => {
        const m = parseInt(evt.startDate.split("-")[1]).toString();
        return m === activeMonth;
      });
    }

    // 2. Category Filter
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
        <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-zinc-300">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-4 uppercase tracking-widest">
          <CalendarIcon size={14} />
          Student Life Calendar
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter mb-4 lowercase">
          학사 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">일정</span>
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
          중요한 시험부터 즐거운 행사까지, 학교 생활의 모든 순간을 놓치지 마세요.
        </p>
      </motion.div>

      {/* D-Day Highlight Card */}
      <AnimatePresence>
        {nearestEvent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-16 relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-zinc-900/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden">
               {/* Background Decorative Element */}
               <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
               
               <div className="flex-1 text-center md:text-left">
                  <span className="text-blue-500 font-black text-sm uppercase tracking-widest mb-2 block">UPCOMING HIGHLIGHT</span>
                  <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight">
                    {nearestEvent.name}
                  </h2>
                  <div className="flex items-center justify-center md:justify-start gap-4 text-gray-400 text-sm font-mono">
                    <div className="flex items-center gap-1.5"><Clock size={16} /> {nearestEvent.startDate}</div>
                    <span>•</span>
                    <span className="px-2 py-0.5 bg-white/5 rounded-md border border-white/10 text-xs">{nearestEvent.eventType}</span>
                  </div>
               </div>

               <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-[2px] rounded-3xl shadow-2xl shadow-blue-500/20">
                  <div className="bg-black/40 backdrop-blur-md rounded-[calc(1.5rem-1px)] px-10 py-6 flex flex-col items-center">
                    <span className="text-xs font-bold text-blue-300 uppercase mb-1">Countdown</span>
                    <span className="text-5xl font-black text-white tracking-tighter">
                      {getDDay(nearestEvent.startDate)}
                    </span>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Month Selector Section */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-2 text-zinc-500 px-2">
           <Filter size={14} />
           <span className="text-[10px] uppercase font-black tracking-widest">Filter by Month</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
           <button
             onClick={() => setActiveMonth("upcoming")}
             className={`px-4 py-2 rounded-xl text-xs font-black transition-all border ${
               activeMonth === "upcoming" 
                 ? "bg-white text-black border-white" 
                 : "bg-zinc-900/50 text-zinc-500 border-white/5 hover:border-white/10"
             }`}
           >
             UPCOMING
           </button>
           <div className="w-px h-4 bg-white/10 mx-1" />
           {months.map(m => (
             <button
               key={m}
               onClick={() => setActiveMonth(m)}
               className={`px-4 py-2 rounded-xl text-xs font-black transition-all border ${
                 activeMonth === m 
                   ? "bg-blue-500 text-white border-blue-500" 
                   : "bg-zinc-900/50 text-zinc-500 border-white/5 hover:border-white/10"
               }`}
             >
               {m}월
             </button>
           ))}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 px-1">
         <div className="flex p-1.5 bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-white/10 w-fit">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all relative whitespace-nowrap ${
                  activeCategory === cat.key ? "text-white" : "text-zinc-500 hover:text-white"
                }`}
              >
                {activeCategory === cat.key && (
                  <motion.div
                    layoutId="activeCat"
                    className="absolute inset-0 bg-white/10 rounded-xl border border-white/10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <span className={activeCategory === cat.key ? "text-blue-400" : "opacity-50"}>{cat.icon}</span>
                  {cat.label}
                </span>
              </button>
            ))}
         </div>
         <div className="flex items-center gap-4 text-zinc-500 bg-zinc-900/40 px-4 py-2 rounded-xl border border-white/5">
            <Tag size={14} className="text-blue-500" />
            <span className="text-xs font-bold text-zinc-300">
               {activeMonth === "upcoming" ? "다가오는 전체 일정" : `${activeMonth}월 모든 일정`}
            </span>
         </div>
      </div>

      {/* Events Timeline */}
      <div className="relative">
        <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/0 via-blue-500/20 to-blue-500/0" />

        <div className="space-y-12 relative min-h-[400px]">
          <AnimatePresence mode="popLayout">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event, index) => {
                const isPast = event.endDate < todayStr;
                return (
                  <motion.div
                    key={event.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className={`relative flex items-center justify-between gap-12 flex-col sm:flex-row ${
                      index % 2 === 1 ? "sm:flex-row-reverse" : ""
                    } ${isPast ? "opacity-50 grayscale-[0.5]" : ""}`}
                  >
                    {/* Timeline Dot */}
                    <div className={`absolute left-6 sm:left-1/2 top-8 sm:top-1/2 -ml-[5px] sm:-mt-[5px] w-2.5 h-2.5 rounded-full z-10 hidden sm:block ${
                      event.startDate === todayStr 
                        ? "bg-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.8)]" 
                        : isPast ? "bg-zinc-800" : "bg-zinc-600"
                    }`} />

                    {/* Content Card */}
                    <div className="w-full sm:w-[46%] group">
                      <div className={`bg-zinc-900/40 backdrop-blur-xl border border-white/5 hover:border-blue-500/30 rounded-[2rem] p-6 transition-all duration-300 relative overflow-hidden ${
                        event.startDate === todayStr ? "ring-1 ring-blue-500/30 bg-blue-500/5" : ""
                      }`}>
                          <div className="flex items-center justify-between mb-4">
                             <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${
                                  event.eventType === 'Holiday' ? 'border-red-500/20 bg-red-500/10 text-red-400' : 
                                  event.eventType === 'Exam' ? 'border-amber-500/20 bg-amber-500/10 text-amber-400' :
                                  'border-blue-500/20 bg-blue-500/10 text-blue-400'
                                }`}>
                                  {event.eventType}
                                </span>
                                {isPast && (
                                   <span className="px-2 py-0.5 bg-zinc-800 text-[8px] font-black text-zinc-500 rounded border border-white/5">PAST</span>
                                )}
                             </div>
                             {event.startDate >= todayStr && (
                                <span className="text-[10px] font-black text-blue-500/70">{getDDay(event.startDate)}</span>
                             )}
                          </div>

                          <h3 className={`text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors tracking-tight ${isPast ? "text-zinc-500" : "text-white"}`}>
                            {event.name}
                          </h3>

                          <div className="flex flex-col gap-2 pt-2 text-zinc-500">
                             <div className="flex items-center gap-2 text-xs font-mono">
                               <Clock size={14} className="opacity-50" />
                               <span>{event.startDate} {event.startDate !== event.endDate && `~ ${event.endDate}`}</span>
                             </div>
                          </div>
                      </div>
                    </div>

                    {/* Spacer for center-aligned timeline */}
                    <div className="hidden sm:block sm:w-[46%]" />
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center flex flex-col items-center justify-center gap-4 bg-zinc-900/20 rounded-[3rem] border border-dashed border-white/10"
              >
                <div className="p-4 bg-white/5 rounded-full text-zinc-600">
                   <CalendarIcon size={40} strokeWidth={1} />
                </div>
                <p className="text-zinc-500 font-bold">
                   {activeMonth === "upcoming" ? "다가오는 일정이 없습니다." : `${activeMonth}월 일정이 없습니다.`}
                </p>
                <button 
                  onClick={() => { setActiveMonth("upcoming"); setActiveCategory("all"); }}
                  className="text-xs text-blue-500 hover:underline font-bold"
                >
                  기본 뷰로 돌아가기
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Info Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-24 p-8 rounded-3xl bg-zinc-900/30 border border-white/5 flex flex-col md:flex-row items-center gap-8"
      >
        <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 shrink-0 shadow-inner">
           <Bell size={32} />
        </div>
        <div className="text-center md:text-left">
           <h4 className="text-white font-bold text-lg mb-1">학생들을 위한 스마트 알림</h4>
           <p className="text-sm text-zinc-500 leading-relaxed max-w-2xl">
              시험 기간, 주요 축제, 장기 공휴일 일주일 전에는 등록하신 이메일과 모바일 앱 알림을 통해 한 번 더 안내해 드립니다. 
              학사 일정은 학교 사정에 따라 변경될 수 있으니 정기적으로 확인해 주세요.
           </p>
        </div>
      </motion.div>
    </div>
  );
}
