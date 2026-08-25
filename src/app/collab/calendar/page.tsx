"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar as CalendarIcon, Clock, Tag, Bell, Award, Sparkles, 
  PartyPopper, ArrowLeft, Plus, Download, ExternalLink, Check, Copy, X
} from "lucide-react";
import Link from "next/link";
import { getGoogleCalendarEventUrl, generateIcsContent, downloadIcsFile } from "@/lib/calendar-export";

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
  const [syncModalOpen, setSyncModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/collab/calendar");
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

  const [deviceType, setDeviceType] = useState<"apple" | "android" | "other">("other");

  useEffect(() => {
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      const ua = navigator.userAgent || "";
      if (/iPhone|iPad|iPod|Macintosh|Mac OS X/i.test(ua)) {
        setDeviceType("apple");
      } else if (/Android/i.test(ua)) {
        setDeviceType("android");
      } else {
        setDeviceType("other");
      }
    }
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

  const handleDownloadIcs = (onlyMonth = false) => {
    const targetEvents = onlyMonth && activeMonth !== "upcoming" 
      ? events.filter(e => parseInt(e.startDate.split("-")[1]).toString() === activeMonth)
      : events;

    const items = targetEvents.map(e => ({
      id: e.id,
      title: `[${e.eventType || "학사일정"}] ${e.name}`,
      startDate: e.startDate,
      endDate: e.endDate,
      description: `마닐라한국아카데미 학사일정: ${e.name}\n일정 구분: ${e.eventType}`,
      location: "마닐라한국아카데미",
    }));

    const filename = onlyMonth && activeMonth !== "upcoming"
      ? `mha-calendar-${activeMonth}월.ics`
      : "mha-academic-calendar.ics";

    const icsContent = generateIcsContent("MHA 학사일정 (WITHUS)", items);
    downloadIcsFile(filename, icsContent);
  };

  const feedUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/api/collab/calendar/feed` 
    : "https://mhawithus.shop/api/collab/calendar/feed";

  const handleCopyFeed = () => {
    navigator.clipboard.writeText(feedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAppleCalendarWebSub = () => {
    // webcal:// protocol automatically triggers native iOS/macOS Apple Calendar subscription sheet
    const webcalUrl = feedUrl.replace(/^https?:\/\//, "webcal://");
    window.location.href = webcalUrl;
  };

  const handleGoogleCalendarWebSub = () => {
    // Google Calendar Web subscription requires webcal:// protocol in cid parameter
    const webcalUrl = feedUrl.replace(/^https?:\/\//, "webcal://");
    const googleSubUrl = `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(webcalUrl)}`;
    window.open(googleSubUrl, "_blank");
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/collab"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold">Back to Hub</span>
        </Link>

        <button
          onClick={() => setSyncModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white transition-all text-xs font-bold shadow-lg shadow-blue-500/5 active:scale-95"
        >
          <CalendarIcon size={14} />
          <span className="hidden sm:inline">캘린더 실시간 연동 (iPhone / Android)</span><span className="sm:hidden">캘린더 연동</span>
        </button>
      </div>

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
            <div className="bg-zinc-900/30 backdrop-blur-xl border border-white/5 rounded-3xl sm:rounded-[3rem] p-6 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative group">
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

               <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4">
                  <div className="bg-white text-black rounded-[2.5rem] px-6 sm:px-12 py-6 sm:py-8 flex flex-col items-center shadow-2xl shadow-white/10">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-50">Countdown</span>
                    <span className="text-5xl font-black tracking-tighter">
                      {getDDay(nearestEvent.startDate)}
                    </span>
                  </div>

                  <button
                    onClick={() => window.open(getGoogleCalendarEventUrl({
                      title: `[${nearestEvent.eventType}] ${nearestEvent.name}`,
                      startDate: nearestEvent.startDate,
                      endDate: nearestEvent.endDate,
                      description: `마닐라한국아카데미 학사일정: ${nearestEvent.name} (${nearestEvent.eventType})`,
                      location: "마닐라한국아카데미"
                    }), "_blank")}
                    className="p-4 rounded-2xl bg-zinc-800 border border-white/10 hover:bg-blue-500 hover:text-white transition-all text-zinc-400 flex items-center justify-center"
                    title="Google 캘린더에 바로 추가"
                  >
                    <Plus size={20} />
                  </button>
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
         <div className="flex p-1 bg-zinc-900/40 backdrop-blur-xl rounded-2xl border border-white/5 w-full sm:w-fit overflow-x-auto max-w-full scrollbar-hide">
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

                      <div className="flex items-center justify-between sm:justify-end gap-4">
                         {event.startDate >= todayStr && (
                            <div className="text-right mr-2">
                               <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-0.5">D-Day</div>
                               <div className="text-lg font-black text-white tracking-tight">{getDDay(event.startDate)}</div>
                            </div>
                         )}

                         {/* Add to Google Calendar Button */}
                         <button
                           onClick={() => window.open(getGoogleCalendarEventUrl({
                             title: `[${event.eventType}] ${event.name}`,
                             startDate: event.startDate,
                             endDate: event.endDate,
                             description: `마닐라한국아카데미 학사일정: ${event.name} (${event.eventType})\n기간: ${event.startDate} ~ ${event.endDate}`,
                             location: "마닐라한국아카데미"
                           }), "_blank")}
                           className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 hover:border-blue-500/40 hover:bg-blue-500/10 text-zinc-400 hover:text-blue-400 transition-all text-xs font-bold flex items-center gap-1.5"
                           title="내 Google 캘린더에 일정 추가"
                         >
                           <Plus size={14} />
                           <span className="hidden sm:inline">Google 추가</span>
                         </button>
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

      {/* Sync & Export Modal */}
      <AnimatePresence>
        {syncModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6 relative overflow-y-auto max-h-[85vh] my-auto"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <CalendarIcon size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">학사일정 캘린더 연동</h3>
                    <p className="text-xs text-zinc-500">Google / Apple / Outlook 캘린더에 연동하세요</p>
                  </div>
                </div>
                <button
                  onClick={() => setSyncModalOpen(false)}
                  className="p-2 text-zinc-500 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {/* 1-Click Dual Live Sync Options: Apple (iPhone/Mac) vs Google (Android/PC) */}
                <div className="space-y-2.5">
                  <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider pl-1">원클릭 실시간 자동 동기화</p>
                  
                  {/* Apple Calendar Button (iPhone / iPad / Mac) */}
                  <button
                    type="button"
                    onClick={handleAppleCalendarWebSub}
                    className={`w-full p-4 rounded-2xl text-left transition-all group flex items-center justify-between shadow-lg ${
                      deviceType === "apple"
                        ? "bg-blue-950/30 border border-blue-500/40 hover:border-blue-500/60"
                        : "bg-zinc-950/80 border border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center group-hover:scale-105 transition-transform ${
                        deviceType === "apple"
                          ? "bg-blue-500/20 border-blue-500/30 text-blue-400"
                          : "bg-white/5 border-white/10 text-zinc-400"
                      }`}>
                        <CalendarIcon size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-white">Apple 캘린더에 추가</h4>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide ${
                            deviceType === "apple"
                              ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                              : "bg-white/10 text-zinc-400"
                          }`}>
                            {deviceType === "apple" ? "추천 · iPhone / Mac" : "iPhone / Mac"}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-0.5">아이폰 기본 캘린더 앱에서 1초 만에 실시간 구독</p>
                      </div>
                    </div>
                    <ExternalLink size={14} className={`${deviceType === "apple" ? "text-blue-400" : "text-zinc-500 group-hover:text-white"} transition-colors mr-1`} />
                  </button>

                  {/* Google Calendar Button (Android / PC) */}
                  <button
                    type="button"
                    onClick={handleGoogleCalendarWebSub}
                    className={`w-full p-4 rounded-2xl text-left transition-all group flex items-center justify-between shadow-lg ${
                      deviceType !== "apple"
                        ? "bg-blue-950/30 border border-blue-500/40 hover:border-blue-500/60"
                        : "bg-zinc-950/80 border border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center group-hover:scale-105 transition-transform ${
                        deviceType !== "apple"
                          ? "bg-blue-500/20 border-blue-500/30 text-blue-400"
                          : "bg-white/5 border-white/10 text-zinc-400"
                      }`}>
                        <CalendarIcon size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-white">Google 캘린더에 추가</h4>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide ${
                            deviceType !== "apple"
                              ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                              : "bg-white/10 text-zinc-400"
                          }`}>
                            {deviceType !== "apple" ? "추천 · Android / PC" : "Android / PC"}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-0.5">구글 캘린더 계정에 1클릭 실시간 동기화</p>
                      </div>
                    </div>
                    <ExternalLink size={14} className={`${deviceType !== "apple" ? "text-blue-400" : "text-zinc-500 group-hover:text-white"} transition-colors mr-1`} />
                  </button>
                </div>

                {/* Option 2: Download .ics file */}
                <div className="p-4 bg-zinc-950/40 border border-zinc-800/80 rounded-2xl space-y-2">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <Download size={13} className="text-zinc-400" />
                    <span>.ics 캘린더 파일 다운로드</span>
                  </h4>
                  <p className="text-[11px] text-zinc-500">
                    갤럭시 캘린더, 아웃룩 등 원하는 캘린더 앱에 파일로 가져오기 할 수 있습니다.
                  </p>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleDownloadIcs(false)}
                      className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold transition-all"
                    >
                      전체 일정 파일 (.ics)
                    </button>
                    {activeMonth !== "upcoming" && (
                      <button
                        onClick={() => handleDownloadIcs(true)}
                        className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold transition-all"
                      >
                        {activeMonth}월 일정 파일
                      </button>
                    )}
                  </div>
                </div>

                {/* Option 3: Copy iCal URL */}
                <div className="p-4 bg-zinc-950/40 border border-zinc-800/80 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white">직접 iCal URL 구독</h4>
                    <button
                      onClick={handleCopyFeed}
                      className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1"
                    >
                      {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      <span>{copied ? "복사됨!" : "URL 복사"}</span>
                    </button>
                  </div>
                  <div className="p-2.5 bg-black rounded-xl border border-zinc-800 font-mono text-[10px] text-zinc-400 truncate">
                    {feedUrl}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer Info */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-12 sm:mt-24 p-6 sm:p-10 rounded-3xl sm:rounded-[2.5rem] bg-zinc-900/30 border border-white/5 flex flex-col md:flex-row items-center gap-10 group"
      >
        <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center text-zinc-500 shrink-0 group-hover:scale-110 transition-transform duration-500">
           <Bell size={32} strokeWidth={1.5} />
        </div>
        <div className="text-center md:text-left flex-1">
           <h4 className="text-white font-bold text-xl mb-2">학사 일정 안내</h4>
           <p className="text-sm text-zinc-500 leading-relaxed font-medium">
              모든 학사 일정은 학교 사정에 따라 변경될 수 있습니다. 
              상단의 **Google 캘린더 연동**을 등록해두시면 휴대폰 캘린더 위젯으로 학교 일정을 실시간으로 편리하게 확인하실 수 있습니다.
           </p>
        </div>
      </motion.div>
    </div>
  );
}
