"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ChevronLeft, Sparkles, Search, HeartHandshake, 
  BookOpen, CheckCircle2, ChevronRight, Loader2
} from "lucide-react";

interface ChapelItem {
  id: string;
  month: number;
  day: number;
  dayOfWeek: string;
  speaker: string;
  organizer: string;
  note?: string | null;
  type: string;
}

export default function ChapelSchedulePage() {
  const [events, setEvents] = useState<ChapelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<"ALL" | "MISSION" | "GRADE" | "SPECIAL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadChapelData() {
      try {
        const res = await fetch("/api/collab/chapel");
        const data = await res.json();
        if (data.schedules) {
          setEvents(data.schedules);
        }
      } catch (err) {
        console.error("Failed to load chapel schedules:", err);
      } finally {
        setLoading(false);
      }
    }
    loadChapelData();
  }, []);

  const filteredEvents = events.filter((event) => {
    // 1. Category Filter
    if (selectedFilter === "MISSION" && event.type !== "MISSION") return false;
    if (selectedFilter === "GRADE" && event.type !== "GRADE") return false;
    if (selectedFilter === "SPECIAL" && event.type !== "SPECIAL" && event.type !== "SCHOOL" && event.type !== "EXAM") return false;

    // 2. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchOrganizer = event.organizer.toLowerCase().includes(q);
      const matchSpeaker = event.speaker.toLowerCase().includes(q);
      const matchNote = event.note?.toLowerCase().includes(q) || false;
      const matchDate = `${event.month}월 ${event.day}일`.includes(q);
      return matchOrganizer || matchSpeaker || matchNote || matchDate;
    }

    return true;
  });

  const nextMissionEvent = events.find(e => e.type === "MISSION");

  return (
    <div className="min-h-screen pt-24 sm:pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10 sm:space-y-12">
      {/* Top Breadcrumb Header */}
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

      {/* Hero Header */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-blue-400 font-bold">
          <Sparkles size={12} />
          <span>Wednesday Chapel Schedule</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          수요채플 일정표
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 font-light max-w-2xl leading-relaxed">
          매주 수요일 마한아 공동체가 함께 드리는 예배 일정과 주관 부서(선교팀/학년) 및 설교자 안내입니다.
        </p>
      </div>

      {/* Spotlight Banner */}
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
                    {nextMissionEvent.month}월 {nextMissionEvent.day}일 ({nextMissionEvent.dayOfWeek})
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

      {/* Filters & Search Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setSelectedFilter("ALL")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedFilter === "ALL"
                ? "bg-white text-black shadow-lg"
                : "bg-zinc-900/60 text-zinc-400 hover:text-white border border-white/5"
            }`}
          >
            전체 ({events.length}회)
          </button>
          <button
            onClick={() => setSelectedFilter("MISSION")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
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
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
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
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedFilter === "SPECIAL"
                ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                : "bg-zinc-900/60 text-zinc-400 hover:text-white border border-white/5"
            }`}
          >
            <Sparkles size={14} />
            <span>특별/절기/시험</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="주관/설교자/날짜 검색..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-zinc-900/60 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
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
          {filteredEvents.length === 0 ? (
            <div className="text-center py-16 bg-zinc-900/20 rounded-3xl border border-white/5 space-y-2">
              <p className="text-sm text-zinc-400 font-bold">검색 결과가 없습니다</p>
              <p className="text-xs text-zinc-600">다른 검색어나 필터를 선택해 보세요.</p>
            </div>
          ) : (
            filteredEvents.map((item, index) => {
              const isMission = item.type === "MISSION";
              const isGrade = item.type === "GRADE";
              const isExam = item.type === "EXAM";

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group ${
                    isMission
                      ? "bg-blue-950/20 border-blue-500/20 hover:border-blue-500/40"
                      : isGrade
                      ? "bg-purple-950/20 border-purple-500/20 hover:border-purple-500/40"
                      : isExam
                      ? "bg-red-950/20 border-red-500/20 hover:border-red-500/40"
                      : "bg-zinc-900/30 border-white/5 hover:border-white/15"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-zinc-950/80 border border-white/10 flex flex-col items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
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
                      <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
                        {item.organizer}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block">설교자</span>
                      <span className="text-xs font-semibold text-zinc-300">{item.speaker}</span>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-zinc-500 group-hover:text-white transition-colors">
                      <CheckCircle2 size={14} />
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
