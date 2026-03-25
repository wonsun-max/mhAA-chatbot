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
  const { data: session, status } = useSession();
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("MON");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (status === "loading") return;

    if (session?.user && (session.user as any).grade) {
      setSelectedGrade((session.user as any).grade);
    } else {
      setSelectedGrade("7");
    }
  }, [session, status]);

  useEffect(() => {
    const fetchTimetable = async () => {
      if (!selectedGrade) return;
      
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
    const today = new Date().getDay();
    const dayMap: Record<number, string> = { 1: "MON", 2: "TUE", 3: "WED", 4: "THU", 5: "FRI" };
    if (dayMap[today]) {
      setActiveTab(dayMap[today]);
    } else {
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
        <div className="w-8 h-8 border-4 border-white/10 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-16">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            <Sparkles size={12} className="text-purple-400" />
            Interactive Scheduler
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4">
            <span className="text-zinc-500">{selectedGrade}</span> 시간표
          </h1>
          <p className="text-zinc-500 max-w-xl font-medium">
            실시간 수업 정보를 확인하고<br />
            당신의 일과를 스마트하게 관리하세요.
          </p>
        </motion.div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Grade Selector */}
          <div className="flex items-center gap-3 bg-zinc-900/40 p-1.5 rounded-2xl border border-white/5">
            <div className="pl-3 text-zinc-600">
              <Search size={16} />
            </div>
            <select 
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="bg-transparent text-white text-sm font-black pr-8 py-2 outline-none appearance-none cursor-pointer"
            >
              {GRADES.map(g => <option key={g} value={g} className="bg-zinc-900">{g} 반</option>)}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-zinc-900/40 p-1 rounded-2xl border border-white/5">
            <button 
              onClick={() => setViewMode("list")}
              className={`p-2.5 rounded-xl transition-all ${viewMode === "list" ? "bg-white text-black shadow-xl shadow-white/5" : "text-zinc-600 hover:text-white"}`}
            >
              <List size={20} />
            </button>
            <button 
              onClick={() => setViewMode("grid")}
              className={`p-2.5 rounded-xl transition-all ${viewMode === "grid" ? "bg-white text-black shadow-xl shadow-white/5" : "text-zinc-600 hover:text-white"}`}
            >
              <LayoutGrid size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Day Selector */}
      <div className="flex p-1 bg-zinc-900/40 backdrop-blur-xl rounded-[1.5rem] border border-white/5 mb-12 overflow-x-auto no-scrollbar max-w-3xl">
        {DAYS.map((day) => (
          <button
            key={day.key}
            onClick={() => setActiveTab(day.key)}
            className={`flex-1 min-w-[100px] py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all relative ${
              activeTab === day.key ? "text-white" : "text-zinc-600 hover:text-zinc-400"
            }`}
          >
            {activeTab === day.key && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-white/5 rounded-2xl border border-white/10"
                transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
              />
            )}
            <span className="relative z-10 flex items-center justify-center gap-2">
              {day.label}
              {activeTab === day.key && <div className="w-1 h-1 rounded-full bg-white animate-pulse" />}
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
              className="grid gap-3"
            >
              {dailyEntries.length > 0 ? (
                dailyEntries.map((entry, idx) => {
                  const active = isCurrentPeriod(entry.time, entry.dayOfWeek);
                  return (
                    <motion.div 
                      key={entry.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className={`group relative overflow-hidden bg-zinc-900/30 backdrop-blur-xl border transition-all duration-500 p-5 sm:px-8 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                        active 
                          ? "border-purple-500/30 bg-purple-500/5 ring-1 ring-purple-500/20" 
                          : "border-white/5 hover:border-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-8 relative z-10">
                        <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl border font-black transition-all ${
                          active 
                            ? "bg-purple-500 border-purple-400 text-white shadow-xl shadow-purple-500/20" 
                            : "bg-zinc-900 border-white/5 text-zinc-600 group-hover:text-zinc-400"
                        }`}>
                          <span className="text-[10px] mb-[-2px] opacity-50 uppercase tracking-tighter">{entry.period}교시</span>
                        </div>
                        
                        <div>
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h4 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
                               <span className={active ? "text-white" : "text-purple-400"}>{getSubjectIcon(entry.subject)}</span>
                               {entry.subject}
                            </h4>
                            {active && (
                              <span className="px-3 py-1 rounded-full bg-purple-500 text-[10px] font-black text-white uppercase tracking-widest animate-pulse">Now</span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-6 text-xs text-zinc-500 font-medium">
                            <div className="flex items-center gap-2 group-hover:text-zinc-400 transition-colors">
                              <Clock size={14} className="opacity-30" />
                              <span className="font-mono">{entry.time}</span>
                            </div>
                            <div className="flex items-center gap-2 group-hover:text-zinc-400 transition-colors">
                              <User size={14} className="opacity-30" />
                              <span>{entry.teacher}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {active && (
                        <div className="md:w-64 flex flex-col gap-3 relative z-10">
                           <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                             <span>Progress</span>
                             <span className="text-purple-400">{Math.round(getProgress(entry.time))}%</span>
                           </div>
                           <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-[2px] border border-white/5">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${getProgress(entry.time)}%` }}
                                className="h-full bg-purple-500 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                              />
                           </div>
                        </div>
                      )}

                      {!active && (
                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0 hidden md:block">
                           <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center text-zinc-800 hover:text-white hover:border-white/20 transition-all">
                              <ChevronRight size={20} />
                           </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })
              ) : (
                <div className="text-center py-32 bg-zinc-900/20 rounded-[3rem] border border-dashed border-white/10">
                   <div className="w-20 h-20 bg-white/5 rounded-3xl inline-flex items-center justify-center text-zinc-700 mb-6">
                      <LayoutGrid size={32} strokeWidth={1} />
                   </div>
                   <p className="text-zinc-500 font-bold mb-1">일정이 없습니다.</p>
                   <p className="text-zinc-700 text-sm font-medium">현재 등록된 수업 정보가 없어요.</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-zinc-900/30 backdrop-blur-xl border border-white/5 rounded-[3rem] p-6 sm:p-10 overflow-x-auto no-scrollbar"
            >
               <table className="w-full min-w-[800px] border-separate border-spacing-3">
                  <thead>
                    <tr>
                      <th className="w-24"></th>
                      {DAYS.map(day => (
                        <th key={day.key} className={`p-4 text-[10px] font-black tracking-[0.2em] uppercase ${activeTab === day.key ? "text-white" : "text-zinc-600"}`}>
                          {day.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5, 6, 7].map(period => (
                      <tr key={period}>
                        <td className="text-center py-4">
                           <div className="text-2xl font-black text-zinc-800">{period}</div>
                           <div className="text-[8px] font-black text-zinc-700 uppercase tracking-tighter">Period</div>
                        </td>
                        {DAYS.map(day => {
                          const entry = timetable.find(t => t.dayOfWeek === day.key && parseInt(t.period) === period);
                          const active = entry ? isCurrentPeriod(entry.time, day.key) : false;
                          return (
                            <td key={day.key} className="p-0">
                               {entry ? (
                                  <div className={`p-5 rounded-3xl h-36 flex flex-col justify-between transition-all border group/cell ${
                                    active 
                                      ? "bg-purple-500 border-purple-400 shadow-2xl shadow-purple-500/20" 
                                      : "bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/10"
                                  }`}>
                                     <div className="flex justify-between items-start">
                                        <div className={`p-2 rounded-xl ${active ? "bg-white/20 text-white" : "bg-zinc-900 border border-white/5 text-purple-400 group-hover/cell:scale-110 transition-transform"}`}>
                                           {getSubjectIcon(entry.subject)}
                                        </div>
                                        {active && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                                     </div>
                                     <div className="mt-4">
                                        <div className={`text-sm font-black tracking-tight leading-tight mb-1 truncate ${active ? "text-white" : "text-zinc-200"}`}>
                                           {entry.subject}
                                        </div>
                                        <div className={`text-[10px] font-bold ${active ? "text-purple-100/60" : "text-zinc-600"}`}>
                                           {entry.teacher}
                                        </div>
                                     </div>
                                  </div>
                               ) : (
                                  <div className="h-36 rounded-3xl bg-zinc-900/40 border border-dashed border-white/5 flex items-center justify-center">
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

      {/* Footer Info Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-20 p-10 rounded-[3rem] bg-zinc-900/30 border border-white/5 flex flex-col md:flex-row items-center gap-10 group"
      >
        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-zinc-600 shrink-0 group-hover:scale-110 transition-transform duration-500">
           <Info size={32} strokeWidth={1.5} />
        </div>
        <div className="text-center md:text-left flex-1">
           <h4 className="text-white font-bold text-lg mb-2 flex items-center justify-center md:justify-start gap-2">
              스마트 시간표 활용 가이드
           </h4>
           <p className="text-sm text-zinc-500 leading-relaxed font-medium">
              본 시간표는 학급별 공식 일정을 기반으로 실시간 업데이트됩니다. <br className="hidden lg:block" />
              **리스트 뷰**는 모바일에서 현재 수업과 다음 수업을 빠르게 확인하기 좋으며, **그리드 뷰**는 데스크톱에서 한 주의 전체 흐름을 파악하기에 최적화되어 있습니다. 
              수업 시간 및 교실 정보는 학교 사정에 따라 변경될 수 있으니 주의해 주세요.
           </p>
        </div>
        <div className="hidden lg:flex flex-col items-center bg-zinc-900/40 px-8 py-5 rounded-[2rem] border border-white/5">
           <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Local Time</div>
           <div className="text-2xl font-mono text-white font-black">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      </motion.div>
    </div>
  );
}
