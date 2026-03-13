"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, User, BookOpen, Calendar, MapPin, ChevronRight, LayoutGrid } from "lucide-react";

interface TimetableEntry {
  id: string;
  grade: string;
  dayOfWeek: string;
  period: string;
  time: string;
  subject: string;
  teacher: string;
}

const DAYS = [
  { key: "MON", label: "월요일" },
  { key: "TUE", label: "화요일" },
  { key: "WED", label: "수요일" },
  { key: "THU", label: "목요일" },
  { key: "FRI", label: "금요일" },
];

export default function TimetablePage() {
  const { data: session } = useSession();
  const [userGrade, setUserGrade] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("MON");
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user && (session.user as any).grade) {
      setUserGrade((session.user as any).grade);
    }
  }, [session]);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const url = userGrade 
          ? `/api/admin/collab/timetable?grade=${encodeURIComponent(userGrade)}`
          : "/api/admin/collab/timetable";
        const res = await fetch(url);
        const data = await res.json();
        if (data.timetables) {
          setTimetable(data.timetables);
        }
      } catch (error) {
        console.error("Failed to fetch timetable:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
    
    // Set active tab to today if it's a weekday
    const today = new Date().getDay(); // 0 is Sun, 1 is Mon, 6 is Sat
    const dayMap: Record<number, string> = { 1: "MON", 2: "TUE", 3: "WED", 4: "THU", 5: "FRI" };
    if (dayMap[today]) {
        setActiveTab(dayMap[today]);
    }
  }, [userGrade]);

  const dailyEntries = timetable
    .filter(item => item.dayOfWeek === activeTab)
    .sort((a, b) => a.period.localeCompare(b.period));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-8 h-8 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-12"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold mb-4">
          <Calendar size={14} />
          MY SCHEDULE
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight mb-2">
          {userGrade ? `${userGrade} 학급` : "로그인 필요"} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">시간표</span>
        </h1>
        <p className="text-gray-400 max-w-xl">
           내 학급의 주간 수업 일정을 한눈에 확인하고 준비하세요.
        </p>
      </motion.div>

      {/* Day Selector Tabs */}
      <div className="flex p-1 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 mb-8 overflow-x-auto no-scrollbar">
        {DAYS.map((day) => (
          <button
            key={day.key}
            onClick={() => setActiveTab(day.key)}
            className={`flex-1 min-w-[80px] py-3 rounded-xl text-sm font-bold transition-all relative ${
              activeTab === day.key ? "text-white" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {activeTab === day.key && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-lg shadow-purple-500/20"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{day.label}</span>
          </button>
        ))}
      </div>

      {/* Timetable List */}
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {dailyEntries.length > 0 ? (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid gap-4"
            >
              {dailyEntries.map((entry, idx) => (
                <div 
                  key={entry.id}
                  className="group bg-zinc-900/40 hover:bg-zinc-800/40 backdrop-blur-xl border border-white/5 hover:border-purple-500/30 p-5 rounded-[1.5rem] transition-all duration-300 flex items-center justify-between"
                >
                  <div className="flex items-center gap-6">
                    <div className="hidden sm:flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl border border-white/5 text-purple-400 font-black min-w-[64px]">
                      <span className="text-xs opacity-50 font-bold">PERIOD</span>
                      <span className="text-xl">{entry.period}</span>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="sm:hidden text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-md font-bold mr-1">{entry.period}교시</span>
                        <h4 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors uppercase tracking-tight">
                          {entry.subject}
                        </h4>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Clock size={14} className="opacity-70" />
                          <span className="font-mono">{entry.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <User size={14} className="opacity-70" />
                          <span>{entry.teacher}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="hidden md:flex p-2 bg-white/5 rounded-full text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity">
                      <BookOpen size={16} />
                    </div>
                    <ChevronRight className="text-zinc-700 group-hover:text-purple-500 transition-all group-hover:translate-x-1" size={20} />
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center flex flex-col items-center justify-center gap-4 bg-zinc-900/20 rounded-[2.5rem] border border-dashed border-white/10"
            >
              <div className="p-4 bg-white/5 rounded-full text-zinc-500">
                <LayoutGrid size={48} strokeWidth={1} />
              </div>
              <div>
                <p className="text-gray-400 font-medium">등록된 수업 일정이 없습니다.</p>
                <p className="text-gray-600 text-sm">관리자가 시간표를 업데이트할 때까지 기다려 주세요.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-16 flex items-start gap-4 p-6 bg-zinc-900/30 border border-white/5 rounded-3xl"
      >
        <div className="bg-purple-500/10 p-3 rounded-2xl text-purple-400 shrink-0">
          <Clock size={20} />
        </div>
        <div>
          <h5 className="text-white font-bold text-sm mb-1">시간표 알림</h5>
          <p className="text-xs text-gray-500 leading-relaxed">
            시간표는 학교 사정에 따라 변동될 수 있습니다. 중요한 변동 사항은 공지사항 페이지를 통해 안내됩니다.
            수업 시작 5분 전까지 교실에 입실하여 차분한 마음으로 기도로 수업을 준비합시다.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
