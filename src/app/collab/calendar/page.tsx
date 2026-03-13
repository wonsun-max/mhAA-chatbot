"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, MapPin, Clock, Tag, ChevronRight, Bell } from "lucide-react";

interface CalendarEvent {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  eventType: string;
}

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/admin/collab/calendar");
        const data = await res.json();
        if (data.events) {
          // Sort events by start date
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-center"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-4">
          <CalendarIcon size={14} />
          SCHOOL CALENDAR
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4 lowercase">
          학사 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">일정</span>
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          학교의 주요 행사와 공휴일, 시험 기간을 확인하여 미리 준비하세요.
        </p>
      </motion.div>

      {/* Events Timeline */}
      <div className="relative">
        {/* Timeline Vertical Line */}
        <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/0 via-blue-500/30 to-blue-500/0 hidden sm:block" />

        <div className="space-y-12 relative">
          {events.length > 0 ? (
            events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`relative flex items-center justify-between gap-8 flex-col sm:flex-row ${
                  index % 2 === 1 ? "sm:flex-row-reverse" : ""
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-4 sm:left-1/2 top-0 sm:top-1/2 -ml-[5px] sm:-mt-[5px] w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)] z-10 hidden sm:block" />

                {/* Content Card */}
                <div className={`w-full sm:w-[45%] group`}>
                   <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 hover:border-blue-500/20 rounded-3xl p-6 transition-all duration-300 relative overflow-hidden">
                      {/* Glow Effect on Hover */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/0 via-blue-600/5 to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                           <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${
                             event.eventType === 'Holiday' ? 'border-red-500/20 bg-red-500/10 text-red-400' : 'border-blue-500/20 bg-blue-500/10 text-blue-400'
                           }`}>
                             {event.eventType}
                           </span>
                           <span className="text-[10px] font-mono text-gray-500 tracking-tighter">ID: #{event.id.slice(0,4)}</span>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors tracking-tight leading-tight">
                          {event.name}
                        </h3>

                        <div className="flex flex-col gap-2 pt-2">
                           <div className="flex items-center gap-2 text-zinc-400">
                             <Clock size={14} className="text-blue-500/50" />
                             <span className="text-xs font-mono">{event.startDate} {event.startDate !== event.endDate && `~ ${event.endDate}`}</span>
                           </div>
                           <div className="flex items-center gap-2 text-zinc-500">
                             <Tag size={14} className="text-blue-500/50" />
                             <span className="text-xs">Category: {event.eventType === 'Holiday' ? '공휴일' : '학생 행사'}</span>
                           </div>
                        </div>
                      </div>
                   </div>
                </div>

                {/* Date Side Label (Visible on large screens) */}
                <div className={`hidden sm:flex w-[45%] text-gray-600 font-mono text-sm tracking-widest ${
                   index % 2 === 1 ? "justify-end" : "justify-start"
                }`}>
                   <div className="flex flex-col">
                      <span className="text-white font-black text-2xl mb-1">{event.startDate.split('-')[2]}</span>
                      <span className="opacity-50 uppercase">{new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                   </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-20 text-gray-500 bg-white/5 border border-dashed border-white/10 rounded-[3rem]">
               등록된 학사 일정이 없습니다.
            </div>
          )}
        </div>
      </div>

      {/* Footer CTA */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-20 p-8 rounded-[2rem] bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border border-blue-500/20 text-center relative overflow-hidden group"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
        <Bell className="mx-auto mb-4 text-blue-400 animate-bounce" size={32} />
        <h4 className="text-white font-bold text-xl mb-2 tracking-tight">알림을 켜두세요!</h4>
        <p className="text-gray-400 text-sm max-w-sm mx-auto leading-relaxed mb-6">
          중요한 시험 기간이나 학교 행사가 다가오면 모바일 앱을 통해 푸시 알림을 보내드립니다.
        </p>
        <button className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95">
          알림 설정하기
        </button>
      </motion.div>
    </div>
  );
}
