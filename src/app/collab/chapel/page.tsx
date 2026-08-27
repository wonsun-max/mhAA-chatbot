"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, Sparkles, Search, HeartHandshake, 
  BookOpen, ChevronRight, Loader2, Calendar, 
  Clock, Plus, Tag, History
} from "lucide-react";
import { getGoogleCalendarEventUrl } from "@/lib/calendar-export";

interface ChapelItem {
  id: string;
  date: string;
  month: number;
  day: number;
  dayOfWeek: string;
  speaker: string;
  organizer: string;
  note?: string | null;
  type: string;
  year?: number;
  semester?: string;
}

/**
 * Wednesday Chapel Schedule page component.
 *
 * Implements real-time temporal filtering aligned with the Academic Calendar UX pattern.
 * Automatically filters out past worship services in default view to ensure active campus
 * relevance while preserving full historical auditability through monthly & past archives.
 */
export default function ChapelSchedulePage() {
  const [events, setEvents] = useState<ChapelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMonth, setActiveMonth] = useState<string>("upcoming");
  const [selectedFilter, setSelectedFilter] = useState<"ALL" | "MISSION" | "GRADE" | "SPECIAL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Base reference date formatted as YYYY-MM-DD for lexical date comparison
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  useEffect(() => {
    async function loadChapelData() {
      try {
        const res = await fetch("/api/collab/chapel");
        const data = await res.json();
        if (data.schedules) {
          // Normalize ISO dates to prevent inconsistencies with database seed formats
          const normalized: ChapelItem[] = data.schedules.map((s: any) => ({
            ...s,
            date: s.date || `${s.year || 2026}-${String(s.month).padStart(2, '0')}-${String(s.day).padStart(2, '0')}`
          })).sort((a: ChapelItem, b: ChapelItem) => a.date.localeCompare(b.date));
          setEvents(normalized);
        }
      } catch (err) {
        console.error("Failed to load chapel schedules:", err);
      } finally {
        setLoading(false);
      }
    }
    loadChapelData();
  }, []);

  // Distinct schedule months sorted chronologically
  const months = useMemo(() => {
    const mSet = new Set<string>();
    events.forEach(evt => {
      if (evt.month) {
        mSet.add(evt.month.toString());
      } else {
        const parts = evt.date.split("-");
        if (parts.length > 1) {
          mSet.add(parseInt(parts[1], 10).toString());
        }
      }
    });
    return Array.from(mSet).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
  }, [events]);

  // Future and ongoing worship events (date >= todayStr)
  const upcomingEvents = useMemo(() => {
    return events.filter(evt => evt.date >= todayStr);
  }, [events, todayStr]);

  // Historical completed worship events (date < todayStr)
  const pastEvents = useMemo(() => {
    return events.filter(evt => evt.date < todayStr);
  }, [events, todayStr]);

  // Immediate next upcoming worship service for hero spotlight
  const nearestEvent = upcomingEvents[0];

  // Dynamically spotlight next upcoming mission worship
  const nextMissionEvent = useMemo(() => {
    return upcomingEvents.find(e => e.type === "MISSION") || events.find(e => e.type === "MISSION");
  }, [upcomingEvents, events]);

  // Filtered dataset reflecting active month tab, category tag, and text search query
  const filteredEvents = useMemo(() => {
    let result = events;

    // 1. Month / Temporal Filter
    if (activeMonth === "upcoming") {
      result = upcomingEvents;
    } else if (activeMonth === "past") {
      result = pastEvents;
    } else {
      result = events.filter(evt => evt.month.toString() === activeMonth);
    }

    // 2. Category Filter
    if (selectedFilter === "MISSION") {
      result = result.filter(e => e.type === "MISSION");
    } else if (selectedFilter === "GRADE") {
      result = result.filter(e => e.type === "GRADE");
    } else if (selectedFilter === "SPECIAL") {
      result = result.filter(e => e.type === "SPECIAL" || e.type === "SCHOOL" || e.type === "EXAM");
    }

    // 3. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(event => {
        const matchOrganizer = event.organizer.toLowerCase().includes(q);
        const matchSpeaker = event.speaker.toLowerCase().includes(q);
        const matchNote = event.note?.toLowerCase().includes(q) || false;
        const matchDate = `${event.month}월 ${event.day}일`.includes(q) || event.date.includes(q);
        return matchOrganizer || matchSpeaker || matchNote || matchDate;
      });
    }

    return result;
  }, [events, upcomingEvents, pastEvents, activeMonth, selectedFilter, searchQuery]);

  /**
   * Generates localized D-Day relative string comparison for zero-hour day difference.
   */
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

  return (
    <div className="min-h-screen pt-24 sm:pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10 sm:space-y-12">
      {/* Top Navigation Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/collab"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors uppercase tracking-wider group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>콜라보 허브로 돌아가기</span>
        </Link>
        <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-bold">
          채플 캘린더
        </span>
      </div>

      {/* Hero Title Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3 text-center sm:text-left"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-blue-400 font-bold">
          <Sparkles size={12} />
          <span>Wednesday Chapel Schedule</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          수요채플 <span className="text-zinc-500">일정표</span>
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 font-light max-w-2xl leading-relaxed">
          매주 수요일 마한아 공동체가 함께 드리는 예배 일정과 주관 부서(선교팀/학년) 및 설교자 안내입니다.
        </p>
      </motion.div>

      {/* D-Day Highlight Card (Nearest Upcoming Worship) */}
      <AnimatePresence>
        {nearestEvent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <div className="bg-zinc-900/30 backdrop-blur-xl border border-white/10 rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full group-hover:bg-blue-500/10 transition-colors" />

              <div className="flex-1 text-center md:text-left relative z-10 space-y-3">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-blue-400 font-black text-[10px] uppercase tracking-widest">
                    Next Upcoming Worship
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {nearestEvent.organizer} 주관 예배
                </h2>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-zinc-400 text-xs font-medium">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/5">
                    <Clock size={13} className="text-blue-400" />
                    <span className="font-mono text-white font-bold">
                      {nearestEvent.month}월 {nearestEvent.day}일 ({nearestEvent.dayOfWeek || "수"})
                    </span>
                  </div>
                  <span className="px-3 py-1.5 bg-white/5 rounded-xl border border-white/5 text-zinc-300 font-semibold">
                    설교: {nearestEvent.speaker}
                  </span>
                  {nearestEvent.note && (
                    <span className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-300 rounded-xl font-bold">
                      {nearestEvent.note}
                    </span>
                  )}
                </div>
              </div>

              <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3">
                <div className="bg-white text-black rounded-3xl px-7 py-5 sm:px-9 sm:py-6 flex flex-col items-center shadow-2xl shadow-white/10">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] mb-0.5 opacity-50">
                    Countdown
                  </span>
                  <span className="text-4xl sm:text-5xl font-black tracking-tighter">
                    {getDDay(nearestEvent.date)}
                  </span>
                </div>

                <button
                  onClick={() => window.open(getGoogleCalendarEventUrl({
                    title: `[수요채플] ${nearestEvent.organizer} 주관 (${nearestEvent.speaker})`,
                    startDate: nearestEvent.date,
                    description: `마닐라한국아카데미 수요채플\n주관: ${nearestEvent.organizer}\n설교자: ${nearestEvent.speaker}${nearestEvent.note ? `\n비고: ${nearestEvent.note}` : ""}`,
                    location: "마닐라한국아카데미 예배당"
                  }), "_blank")}
                  className="p-4 rounded-2xl bg-zinc-800/80 border border-white/10 hover:bg-blue-500 hover:text-white transition-all text-zinc-400 flex items-center justify-center shadow-lg"
                  title="Google 캘린더에 바로 추가"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spotlight Banner: Next Mission Service */}
      {nextMissionEvent && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-purple-900/30 border border-blue-500/20 p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-blue-500/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <HeartHandshake size={24} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-mono font-bold">
                    선교 예배 안내
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">
                    {nextMissionEvent.month}월 {nextMissionEvent.day}일 ({nextMissionEvent.dayOfWeek || "수"})
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {nextMissionEvent.organizer} 주관 선교예배
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400">
                  선교팀 주관으로 온 성도와 학생이 함께 세계 선교를 위해 기도하는 시간입니다.
                </p>
              </div>
            </div>

            <Link
              href="/collab/teams"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-black hover:bg-zinc-200 font-bold text-xs transition-all whitespace-nowrap shadow-xl shrink-0"
            >
              <span>선교팀 명단 확인</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      )}

      {/* Month Selector Tabs (Academic Calendar Style) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
          <button
            onClick={() => setActiveMonth("upcoming")}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all border whitespace-nowrap flex items-center gap-1.5 ${
              activeMonth === "upcoming" 
                ? "bg-white text-black border-white shadow-lg" 
                : "bg-zinc-900/40 text-zinc-400 border-white/5 hover:border-white/10 hover:text-white"
            }`}
          >
            <Sparkles size={13} />
            <span>다가오는 예배 ({upcomingEvents.length}회)</span>
          </button>

          <div className="w-px h-6 bg-white/10 mx-1 flex-shrink-0" />

          {months.map(m => {
            const countInMonth = events.filter(e => e.month.toString() === m).length;
            return (
              <button
                key={m}
                onClick={() => setActiveMonth(m)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all border whitespace-nowrap ${
                  activeMonth === m 
                    ? "bg-zinc-100 text-black border-zinc-100 shadow-md" 
                    : "bg-zinc-900/40 text-zinc-400 border-white/5 hover:border-white/10 hover:text-white"
                }`}
              >
                {m}월 ({countInMonth})
              </button>
            );
          })}

          {pastEvents.length > 0 && (
            <>
              <div className="w-px h-6 bg-white/10 mx-1 flex-shrink-0" />
              <button
                onClick={() => setActiveMonth("past")}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border whitespace-nowrap flex items-center gap-1.5 ${
                  activeMonth === "past" 
                    ? "bg-zinc-200 text-black border-zinc-200 shadow-md" 
                    : "bg-zinc-900/40 text-zinc-500 border-white/5 hover:border-white/10 hover:text-zinc-300"
                }`}
              >
                <History size={13} />
                <span>지난 예배 ({pastEvents.length}회)</span>
              </button>
            </>
          )}
        </div>

        {/* Category Filters & Search Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => setSelectedFilter("ALL")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedFilter === "ALL"
                  ? "bg-white text-black shadow-lg"
                  : "bg-zinc-900/60 text-zinc-400 hover:text-white border border-white/5"
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setSelectedFilter("MISSION")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                selectedFilter === "MISSION"
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                  : "bg-zinc-900/60 text-zinc-400 hover:text-white border border-white/5"
              }`}
            >
              <HeartHandshake size={14} />
              <span>선교 예배</span>
            </button>
            <button
              onClick={() => setSelectedFilter("GRADE")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                selectedFilter === "GRADE"
                  ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20"
                  : "bg-zinc-900/60 text-zinc-400 hover:text-white border border-white/5"
              }`}
            >
              <BookOpen size={14} />
              <span>학년 주관</span>
            </button>
            <button
              onClick={() => setSelectedFilter("SPECIAL")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                selectedFilter === "SPECIAL"
                  ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                  : "bg-zinc-900/60 text-zinc-400 hover:text-white border border-white/5"
              }`}
            >
              <Sparkles size={14} />
              <span>특별/절기/시험</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-60">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="주관/설교자/날짜 검색..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-900/60 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="hidden sm:flex items-center gap-2 text-zinc-500 px-3 py-2 rounded-xl border border-white/5 bg-zinc-900/20 shrink-0">
              <Tag size={12} className="text-zinc-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                {activeMonth === "upcoming" ? "Upcoming View" : activeMonth === "past" ? "Past Archive" : `${activeMonth} Month View`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Loading & Timeline Event List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <Loader2 size={24} className="animate-spin text-blue-400" />
          <p className="text-xs font-mono text-zinc-500">데이터베이스에서 채플 일정을 불러오는 중...</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredEvents.length === 0 ? (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-24 text-center flex flex-col items-center justify-center gap-4 bg-zinc-900/20 rounded-3xl border border-dashed border-white/10"
              >
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-zinc-600">
                  <Calendar size={28} strokeWidth={1.5} />
                </div>
                <div className="space-y-1">
                  <p className="text-zinc-400 font-bold text-sm">해당 조건의 채플 일정이 없습니다.</p>
                  <p className="text-zinc-600 text-xs">필터를 초기화하거나 다른 월을 선택해 보세요.</p>
                </div>
                <button 
                  onClick={() => { setActiveMonth("upcoming"); setSelectedFilter("ALL"); setSearchQuery(""); }}
                  className="text-xs text-white bg-white/5 px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/10 transition-all font-bold"
                >
                  필터 초기화
                </button>
              </motion.div>
            ) : (
              filteredEvents.map((item, index) => {
                const isPast = item.date < todayStr;
                const isToday = item.date === todayStr;
                const isMission = item.type === "MISSION";
                const isGrade = item.type === "GRADE";
                const isExam = item.type === "EXAM";

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2, delay: index * 0.02 }}
                    className={`group relative ${isPast ? "opacity-40 grayscale" : ""}`}
                  >
                    <div className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isToday
                        ? "ring-1 ring-blue-500/40 bg-blue-500/10 border-blue-500/30 shadow-lg shadow-blue-500/10"
                        : isMission
                        ? "bg-blue-950/20 border-blue-500/20 hover:border-blue-500/40"
                        : isGrade
                        ? "bg-purple-950/20 border-purple-500/20 hover:border-purple-500/40"
                        : isExam
                        ? "bg-red-950/20 border-red-500/20 hover:border-red-500/40"
                        : "bg-zinc-900/30 border-white/5 hover:border-white/15"
                    }`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl border flex flex-col items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform ${
                          isToday 
                            ? "bg-blue-500/20 border-blue-500/40 text-blue-400" 
                            : "bg-zinc-950/80 border-white/10"
                        }`}>
                          <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase">
                            {item.month}월
                          </span>
                          <span className="text-base sm:text-lg font-black text-white leading-tight">
                            {item.day}일
                          </span>
                          <span className="text-[9px] text-zinc-500 font-mono">
                            ({item.dayOfWeek || "수"})
                          </span>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            {isToday && (
                              <span className="px-2 py-0.5 rounded-lg bg-blue-500 text-[9px] font-black text-white animate-pulse">
                                TODAY
                              </span>
                            )}
                            {isPast && (
                              <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400 text-[10px] font-mono font-bold border border-white/5">
                                종료됨
                              </span>
                            )}
                            {isMission && (
                              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-[10px] font-mono font-bold">
                                선교예배
                              </span>
                            )}
                            {isGrade && (
                              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[10px] font-mono font-bold">
                                학년주관
                              </span>
                            )}
                            {item.note && (
                              <span className="text-[11px] font-mono text-zinc-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                                {item.note}
                              </span>
                            )}
                          </div>
                          <h4 className="text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors">
                            {item.organizer}
                          </h4>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
                        <div className="text-left sm:text-right">
                          <span className="text-[10px] font-mono text-zinc-500 uppercase block">설교자</span>
                          <span className="text-xs font-semibold text-zinc-300">{item.speaker}</span>
                        </div>

                        {!isPast && (
                          <div className="text-right pl-2">
                            <div className="text-[9px] font-black text-zinc-500 uppercase tracking-wider">D-Day</div>
                            <div className="text-sm sm:text-base font-black text-blue-400 tracking-tight">
                              {getDDay(item.date)}
                            </div>
                          </div>
                        )}

                        <button
                          onClick={() => window.open(getGoogleCalendarEventUrl({
                            title: `[수요채플] ${item.organizer} 주관 (${item.speaker})`,
                            startDate: item.date,
                            description: `마닐라한국아카데미 수요채플\n주관: ${item.organizer}\n설교자: ${item.speaker}${item.note ? `\n비고: ${item.note}` : ""}`,
                            location: "마닐라한국아카데미 예배당"
                          }), "_blank")}
                          className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 hover:border-blue-500/40 hover:bg-blue-500/10 text-zinc-400 hover:text-blue-400 transition-all text-xs font-bold flex items-center gap-1.5"
                          title="Google 캘린더에 바로 추가"
                        >
                          <Plus size={13} />
                          <span className="hidden sm:inline">Google 추가</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
