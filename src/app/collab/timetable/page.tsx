"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { 
  Clock, User, BookOpen, Calendar, MapPin, 
  ChevronRight, LayoutGrid, List, Info, 
  GraduationCap, Calculator, Globe, Languages, 
  Pencil, Microscope, Music, Palette, Trophy, 
  CircleDot, Sparkles, Search
} from "lucide-react";

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

const GRADES = ["7", "8", "9", "10", "11", "12-1", "12-2"];

const SUBJECT_ICONS: Record<string, React.ReactNode> = {
  "수학": <Calculator size={18} />,
  "영어": <Globe size={18} />,
  "국어": <Languages size={18} />,
  "과학": <Microscope size={18} />,
  "사회": <Globe size={18} />,
  "음악": <Music size={18} />,
  "미술": <Palette size={18} />,
  "체육": <Trophy size={18} />,
  "코딩": <CircleDot size={18} />,
  "성경": <BookOpen size={18} />,
  "예배": <Sparkles size={18} />,
};

const getSubjectIcon = (subject: string) => {
  for (const key in SUBJECT_ICONS) {
    if (subject.includes(key)) return SUBJECT_ICONS[key];
  }
  return <GraduationCap size={18} />;
};

export default function TimetablePage() {
  const { data: session } = useSession();
  const [selectedGrade, setSelectedGrade] = useState<string>("7");
  const [activeTab, setActiveTab] = useState<string>("MON");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (session?.user && (session.user as any).grade) {
      setSelectedGrade((session.user as any).grade);
    }
  }, [session]);

  useEffect(() => {
    const fetchTimetable = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/collab/timetable?grade=${encodeURIComponent(selectedGrade)}`);
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
  }, [selectedGrade]);

  useEffect(() => {
    // Set active tab to today if it's a weekday
    const today = new Date().getDay();
    const dayMap: Record<number, string> = { 1: "MON", 2: "TUE", 3: "WED", 4: "THU", 5: "FRI" };
    if (dayMap[today]) {
      setActiveTab(dayMap[today]);
    } else {
      // Default to Monday for weekends
      setActiveTab("MON");
    }
  }, []);

  const isCurrentPeriod = (timeRange: string, dayKey: string) => {
    if (!timeRange || !timeRange.includes(" - ")) return false;

    const today = new Date().getDay();
    const dayMap: Record<number, string> = { 1: "MON", 2: "TUE", 3: "WED", 4: "THU", 5: "FRI" };
    if (dayMap[today] !== dayKey) return false;

    const parts = timeRange.split(" - ");
    if (parts.length < 2) return false;
    
    const [start, end] = parts;
    if (!start.includes(":") || !end.includes(":")) return false;

    const [sH, sM] = start.split(":").map(Number);
    const [eH, eM] = end.split(":").map(Number);

    const nowH = currentTime.getHours();
    const nowM = currentTime.getMinutes();

    const startVal = sH * 60 + sM;
    const endVal = eH * 60 + eM;
    const nowVal = nowH * 60 + nowM;

    return nowVal >= startVal && nowVal < endVal;
  };

  const getProgress = (timeRange: string) => {
    if (!timeRange || !timeRange.includes(" - ")) return 0;

    const parts = timeRange.split(" - ");
    if (parts.length < 2) return 0;

    const [start, end] = parts;
    if (!start.includes(":") || !end.includes(":")) return 0;

    const [sH, sM] = start.split(":").map(Number);
    const [eH, eM] = end.split(":").map(Number);

    const startVal = sH * 60 + sM;
    const endVal = eH * 60 + eM;
    const nowVal = currentTime.getHours() * 60 + currentTime.getMinutes();

    const total = endVal - startVal;
    if (total <= 0) return 0;
    
    const current = nowVal - startVal;
    return Math.min(Math.max((current / total) * 100, 0), 100);
  };

  const dailyEntries = useMemo(() => {
    return timetable
      .filter(item => item.dayOfWeek === activeTab)
      .sort((a, b) => a.period.localeCompare(b.period));
  }, [timetable, activeTab]);

  if (loading && timetable.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-8 h-8 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold mb-4 uppercase tracking-widest">
            <Sparkles size={14} className="animate-pulse" />
            Interactive Scheduler
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">{selectedGrade}</span> 시간표
          </h1>
          <p className="text-gray-400 max-w-xl text-sm sm:text-base">
            실시간 수업 상태를 확인하고 다른 학급의 일정도 간편하게 조회해 보세요.
          </p>
        </motion.div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Grade Selector */}
          <div className="flex items-center gap-2 bg-zinc-900/50 p-1 rounded-xl border border-white/10">
            <div className="px-3 text-zinc-500">
              <Search size={16} />
            </div>
            <select 
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="bg-transparent text-white text-sm font-bold pr-4 py-2 outline-none appearance-none cursor-pointer"
            >
              {GRADES.map(g => <option key={g} value={g} className="bg-zinc-900 border-none">{g} 반</option>)}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-zinc-900/50 p-1 rounded-xl border border-white/10">
            <button 
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-purple-500 text-white shadow-lg" : "text-zinc-500 hover:text-white"}`}
            >
              <List size={20} />
            </button>
            <button 
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-purple-500 text-white shadow-lg" : "text-zinc-500 hover:text-white"}`}
            >
              <LayoutGrid size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex p-1.5 bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-white/10 mb-10 overflow-x-auto no-scrollbar max-w-3xl">
        {DAYS.map((day) => (
          <button
            key={day.key}
            onClick={() => setActiveTab(day.key)}
            className={`flex-1 min-w-[90px] py-3.5 rounded-xl text-sm font-black transition-all relative ${
              activeTab === day.key ? "text-white" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {activeTab === day.key && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
              />
            )}
            <span className="relative z-10 flex items-center justify-center gap-2">
              {day.label}
              {activeTab === day.key && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
            </span>
          </button>
        ))}
      </div>

      {/* Timetable Content */}
      <LayoutGroup>
        <AnimatePresence mode="wait">
          {viewMode === "list" ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid gap-2.5"
            >
              {dailyEntries.length > 0 ? (
                dailyEntries.map((entry, idx) => {
                  const active = isCurrentPeriod(entry.time, entry.dayOfWeek);
                  return (
                    <motion.div 
                      key={entry.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`group relative overflow-hidden bg-zinc-900/40 backdrop-blur-3xl border transition-all duration-500 p-3 px-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        active 
                          ? "border-purple-500/50 bg-purple-500/5 shadow-[0_0_30px_rgba(168,85,247,0.1)]" 
                          : "border-white/5 hover:border-white/10"
                      }`}
                    >
                      {/* Active Ripple Background */}
                      {active && (
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1.2, opacity: 1 }}
                          transition={{ repeat: Infinity, duration: 3, repeatType: "reverse" }}
                          className="absolute -right-20 -top-20 w-80 h-80 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none"
                        />
                      )}

                      <div className="flex items-center gap-6 relative z-10">
                        <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl border font-black transition-colors ${
                          active 
                            ? "bg-purple-500 border-purple-400 text-white shadow-lg shadow-purple-500/20" 
                            : "bg-white/5 border-white/5 text-zinc-500 group-hover:text-zinc-300"
                        }`}>
                          <span className="text-[8px] opacity-70">PER</span>
                          <span className="text-xl mt-[-2px]">{entry.period}</span>
                        </div>
                        
                        <div>
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h4 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                               <span className="text-purple-400">{getSubjectIcon(entry.subject)}</span>
                               {entry.subject}
                            </h4>
                            {active && (
                              <span className="px-2 py-0.5 rounded-md bg-pink-500 text-[10px] font-black text-white animate-bounce">NOW</span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 font-medium">
                            <div className="flex items-center gap-2 group-hover:text-zinc-300 transition-colors">
                              <Clock size={16} className="text-purple-500/50" />
                              <span className="font-mono">{entry.time}</span>
                            </div>
                            <div className="flex items-center gap-2 group-hover:text-zinc-300 transition-colors">
                              <User size={16} className="text-purple-500/50" />
                              <span>{entry.teacher}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Progress Section for active class */}
                      {active && (
                        <div className="md:w-48 lg:w-64 flex flex-col gap-2 relative z-10">
                           <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-400">
                             <span>Progress</span>
                             <span className="text-purple-400">{Math.round(getProgress(entry.time))}%</span>
                           </div>
                           <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${getProgress(entry.time)}%` }}
                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                              />
                           </div>
                        </div>
                      )}

                      {!active && (
                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                           <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-700 hover:text-purple-400 hover:border-purple-500/30 transition-colors">
                              <ChevronRight size={20} />
                           </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })
              ) : (
                <div className="text-center py-24 bg-zinc-900/20 rounded-[3rem] border border-dashed border-white/10">
                   <div className="p-5 bg-white/5 rounded-2xl inline-block text-zinc-600 mb-4">
                      <LayoutGrid size={40} strokeWidth={1} />
                   </div>
                   <p className="text-zinc-400 font-bold mb-1">앗! 일정이 없어요.</p>
                   <p className="text-zinc-600 text-sm">
                      현재 {DAYS.find(d => d.key === activeTab)?.label}에 등록된 수업이 없습니다.
                   </p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-zinc-900/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-4 sm:p-8 overflow-x-auto no-scrollbar"
            >
               <table className="w-full min-w-[600px] border-separate border-spacing-2">
                  <thead>
                    <tr>
                      <th className="w-20 p-4"></th>
                      {DAYS.map(day => (
                        <th key={day.key} className={`p-4 text-sm font-black tracking-widest uppercase ${activeTab === day.key ? "text-purple-400" : "text-zinc-600"}`}>
                          {day.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5, 6, 7].map(period => (
                      <tr key={period}>
                        <td className="p-4 text-center">
                           <div className="text-xs font-black text-zinc-700">PERIOD</div>
                           <div className="text-xl font-black text-zinc-500">{period}</div>
                        </td>
                        {DAYS.map(day => {
                          const entry = timetable.find(t => t.dayOfWeek === day.key && parseInt(t.period) === period);
                          const active = entry ? isCurrentPeriod(entry.time, day.key) : false;
                          return (
                            <td key={day.key} className="p-1">
                               {entry ? (
                                  <div className={`p-4 rounded-2xl h-32 flex flex-col justify-between transition-all border ${
                                    active 
                                      ? "bg-purple-500 shadow-xl shadow-purple-500/20 border-purple-400" 
                                      : "bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/10"
                                  }`}>
                                     <div className="flex justify-between items-start">
                                        <div className={`p-1.5 rounded-lg ${active ? "bg-white/20 text-white" : "bg-purple-500/10 text-purple-400"}`}>
                                           {getSubjectIcon(entry.subject)}
                                        </div>
                                        {active && <div className="w-2 h-2 rounded-full bg-white animate-ping" />}
                                     </div>
                                     <div>
                                        <div className={`text-sm font-black tracking-tight leading-tight mb-1 truncate ${active ? "text-white" : "text-zinc-200"}`}>
                                           {entry.subject}
                                        </div>
                                        <div className={`text-[10px] font-bold ${active ? "text-purple-100" : "text-zinc-500"}`}>
                                           {entry.teacher}
                                        </div>
                                     </div>
                                  </div>
                               ) : (
                                  <div className="h-32 rounded-2xl bg-zinc-900/20 border border-dashed border-white/5 flex items-center justify-center">
                                     <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                                  </div>
                                )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
               </table>
            </motion.div>
          )}
        </AnimatePresence>
      </LayoutGroup>

      {/* Footer Info Box */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-20 p-8 rounded-[2rem] bg-zinc-900/30 border border-white/5 flex flex-col md:flex-row items-center gap-8 group"
      >
        <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-500">
           <Info size={32} />
        </div>
        <div className="text-center md:text-left flex-1">
           <h4 className="text-white font-bold text-lg mb-1 flex items-center justify-center md:justify-start gap-2">
              최신 시간표 가이드
              <Sparkles size={16} className="text-amber-500" />
           </h4>
           <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
              선택한 학급의 시간표가 실시간으로 표시됩니다. ** grid 뷰**는 데스크톱에서 전체 주간 흐름을 보기에 최적화되어 있으며, 
              **list 뷰**는 모바일에서 현재 수업과 다음 수업을 빠르게 확인하는 데 좋습니다. 
              수업 교실 위치는 각 과목 정보를 클릭하여 확인하실 수 있습니다.
           </p>
        </div>
        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center px-8 hidden lg:block">
           <div className="text-[10px] font-black text-zinc-500 uppercase mb-1">Current Info</div>
           <div className="text-xl font-mono text-purple-400 font-bold">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      </motion.div>
    </div>
  );
}
