"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Utensils, Clock, Info, Sparkles, ArrowLeft, Plus, X, Check, Copy, ExternalLink, Download } from "lucide-react";
import Link from "next/link";
import { getMealOrder } from "@/lib/meal-utils";
import { getGoogleCalendarEventUrl, generateIcsContent, downloadIcsFile } from "@/lib/calendar-export";

interface Meal {
  id: string;
  date: string;
  dayOfWeek: string;
  menu: string;
}

export default function MealsPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [todayMeal, setTodayMeal] = useState<Meal | null>(null);
  const [syncModalOpen, setSyncModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const isWeekend = today.getDay() === 0 || today.getDay() === 6;

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await fetch("/api/collab/meals");
        const data = await res.json();
        if (data.meals) {
          const sortedMeals = data.meals.sort((a: Meal, b: Meal) => a.date.localeCompare(b.date));
          setMeals(sortedMeals);
          const foundToday = sortedMeals.find((m: Meal) => m.date === todayStr);
          setTodayMeal(foundToday || null);
        }
      } catch (error) {
        console.error("Failed to fetch meals:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, [todayStr]);

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

  const mealOrder = getMealOrder(today);

  const feedUrl = typeof window !== "undefined"
    ? `${window.location.origin}/api/collab/meals/feed`
    : "https://mhawithus.shop/api/collab/meals/feed";

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

  const handleDownloadIcs = () => {
    const currentMonth = String(today.getMonth() + 1).padStart(2, "0");
    const monthMeals = meals.filter(m => m.date.startsWith(`${today.getFullYear()}-${currentMonth}`));
    const items = (monthMeals.length > 0 ? monthMeals : meals).map(m => ({
      id: m.id,
      title: `[MHA 급식] ${m.menu.split(',')[0].trim()} 외`,
      startDate: m.date,
      description: `📍 마닐라한국아카데미 급식\n\n${m.menu.split(',').map((item: string) => `• ${item.trim()}`).join('\n')}\n\nhttps://mhawithus.shop/collab/meals`,
      location: "마닐라한국아카데미 급식실",
    }));
    const icsContent = generateIcsContent(`MHA ${today.getMonth() + 1}월 급식표`, items);
    downloadIcsFile(`mha-meals-${today.getFullYear()}-${currentMonth}.ics`, icsContent);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-8 h-8 border-4 border-white/10 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Top Nav */}
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
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all text-xs font-bold shadow-lg shadow-emerald-500/5 active:scale-95"
        >
          <Utensils size={14} />
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
          <Utensils size={12} />
          School Meals
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-6">
          오늘의 <span className="text-zinc-500">메뉴</span>
        </h1>
        <p className="text-zinc-500 max-w-xl mx-auto font-medium">
          균형 잡힌 영양과 맛을 담은<br />
          우리 학교의 건강한 식단을 확인하세요.
        </p>
      </motion.div>

      {/* Today's Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-20">
        {/* Today's Highlight Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-8 group"
        >
          <div className="h-full bg-zinc-900/30 backdrop-blur-xl border border-white/5 rounded-3xl sm:rounded-[3rem] p-6 sm:p-12 relative overflow-hidden transition-all duration-500 hover:border-white/10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full group-hover:bg-emerald-500/10 transition-colors" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-emerald-400">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-xl">오늘의 식단</h2>
                    <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest">{todayStr} • {new Date().toLocaleDateString('ko-KR', { weekday: 'long' })}</p>
                  </div>
                </div>
                {todayMeal && !isWeekend && (
                  <button
                    onClick={() => window.open(getGoogleCalendarEventUrl({
                      title: `[MHA 급식] ${todayMeal.menu.split(',')[0].trim()} 외`,
                      startDate: todayMeal.date,
                      description: `📍 마닐라한국아카데미 급식\n\n${todayMeal.menu.split(',').map((i: string) => `• ${i.trim()}`).join('\n')}`,
                      location: "마닐라한국아카데미 급식실"
                    }), "_blank")}
                    className="p-3 rounded-2xl bg-zinc-900 border border-white/10 hover:border-emerald-500/40 hover:bg-emerald-500/10 text-zinc-400 hover:text-emerald-400 transition-all flex items-center gap-1.5 text-xs font-bold"
                    title="Google 캘린더에 추가"
                  >
                    <Plus size={16} />
                    <span className="hidden sm:inline">Google 캘린더</span>
                  </button>
                )}
              </div>

              {todayMeal && !isWeekend ? (
                <div className="space-y-8">
                  <div className="flex flex-wrap gap-x-6 gap-y-4">
                    {todayMeal.menu.split(',').map((item, idx) => (
                      <span key={idx} className="text-xl sm:text-2xl text-white font-bold tracking-tight group-hover:text-emerald-400 transition-colors">
                        {item.trim()}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-4">
                    <span className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black text-zinc-500 uppercase tracking-widest">Balanced</span>
                    <span className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black text-zinc-500 uppercase tracking-widest">Nutritious</span>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center sm:text-left">
                  {isWeekend ? (
                    <div className="space-y-3">
                      <p className="text-2xl text-emerald-400 font-black tracking-tight">즐거운 주말 보충!</p>
                      <p className="text-zinc-500 font-medium">월요일에 더 맛있는 식단으로 만나요.</p>
                    </div>
                  ) : (
                    <p className="text-xl text-zinc-600 font-bold italic">등록된 정보가 없습니다.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Meal Order Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-4 group"
        >
          <div className="h-full bg-zinc-900/30 backdrop-blur-xl border border-white/5 rounded-[3rem] p-8 sm:p-10 relative overflow-hidden flex flex-col justify-between transition-all duration-500 hover:border-white/10">
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-500/5 blur-[80px] rounded-full group-hover:bg-blue-500/10 transition-colors" />

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-blue-400">
                  <Clock size={20} />
                </div>
                <div>
                  <h2 className="text-white font-bold text-xl">식사 순서</h2>
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Priority</p>
                </div>
              </div>

              {mealOrder && !isWeekend ? (
                <div className="space-y-8">
                  <div className="relative pl-6 border-l border-emerald-500/30">
                    <div className="absolute -left-[3.5px] top-0 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-1">12:00 Entry</p>
                    <p className="text-white text-xl font-bold tracking-tight">
                      {mealOrder.firstGroup} <span className="text-zinc-600 font-medium text-sm">학년</span>
                    </p>
                  </div>
                  <div className="relative pl-6 border-l border-white/5">
                    <div className="absolute -left-[3.5px] top-0 w-1.5 h-1.5 rounded-full bg-zinc-700" />
                    <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-1">12:10 Entry</p>
                    <p className="text-zinc-400 text-xl font-bold tracking-tight">
                      {mealOrder.secondGroup} <span className="text-zinc-700 font-medium text-sm">학년</span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-6 italic text-zinc-600 text-sm font-medium">
                  순서 정보가 없습니다.
                </div>
              )}
            </div>

            <div className="mt-12 relative z-10 p-5 bg-white/5 rounded-[2rem] border border-white/5">
              <div className="flex items-start gap-3">
                <Info size={14} className="text-blue-400 mt-0.5" />
                <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">
                  학년별 식사 순서는 매주 교차되며,<br />
                  질서 있는 식사 문화를 위해 협조 바랍니다.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Weekly Preview */}
      <div className="space-y-8">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Sparkles size={18} className="text-emerald-400" />
            <h3 className="text-white font-bold text-lg">이번 주 식단표</h3>
          </div>
          <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Weekly Preview</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(() => {
            const filteredUpcoming = meals.filter(m => {
              const d = new Date(m.date);
              const day = d.getDay();
              return m.date >= todayStr && m.date !== todayStr && day !== 0 && day !== 6;
            });

            if (filteredUpcoming.length === 0) return (
              <div className="col-span-full py-20 text-center bg-zinc-900/20 border border-dashed border-white/10 rounded-[3rem] text-zinc-600 font-bold">
                다음 주 일정이 아직 등록되지 않았습니다.
              </div>
            );

            return filteredUpcoming.slice(0, 4).map((meal, index) => (
              <motion.div
                key={meal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 + 0.3 }}
                className="group bg-zinc-900/30 backdrop-blur-sm border border-white/5 hover:border-white/20 rounded-3xl sm:rounded-[2.5rem] p-5 sm:p-8 transition-all duration-500"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-black font-mono text-zinc-600 tracking-wider mb-1 block uppercase">{meal.date}</span>
                    <h4 className="text-white font-bold text-lg">{meal.dayOfWeek}</h4>
                  </div>
                  <button
                    onClick={() => window.open(getGoogleCalendarEventUrl({
                      title: `[MHA 급식] ${meal.menu.split(',')[0].trim()} 외`,
                      startDate: meal.date,
                      description: `📍 마닐라한국아카데미 급식\n\n${meal.menu.split(',').map((i: string) => `• ${i.trim()}`).join('\n')}`,
                      location: "마닐라한국아카데미 급식실"
                    }), "_blank")}
                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-400 flex items-center justify-center text-zinc-500 transition-all"
                    title="Google 캘린더에 추가"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <p className="text-zinc-500 text-sm font-medium leading-relaxed line-clamp-4 group-hover:text-zinc-300 transition-colors">
                  {meal.menu}
                </p>
              </motion.div>
            ));
          })()}
        </div>
      </div>

      {/* Footer Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 sm:mt-20 p-6 sm:p-8 bg-zinc-900/30 border border-white/5 rounded-3xl sm:rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8 group"
      >
        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-zinc-600 shrink-0 group-hover:scale-110 transition-transform duration-500">
          <Info size={28} />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h4 className="text-white font-bold mb-1">식단 안내 및 주의사항</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">
            식단은 시장 및 학교 상황에 따라 변경될 수 있습니다.
            알레르기 유발 식품이 포함되어 있을 수 있으니 식품 알레르기가 있는 학생은 급식 시 각별히 주의하시기 바랍니다.
          </p>
        </div>
      </motion.div>

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
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Utensils size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">급식표 캘린더 연동</h3>
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
                        <Utensils size={18} />
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
                        ? "bg-emerald-950/30 border border-emerald-500/40 hover:border-emerald-500/60"
                        : "bg-zinc-950/80 border border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center group-hover:scale-105 transition-transform ${
                        deviceType !== "apple"
                          ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                          : "bg-white/5 border-white/10 text-zinc-400"
                      }`}>
                        <Utensils size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-white">Google 캘린더에 추가</h4>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide ${
                            deviceType !== "apple"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : "bg-white/10 text-zinc-400"
                          }`}>
                            {deviceType !== "apple" ? "추천 · Android / PC" : "Android / PC"}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-0.5">구글 캘린더 계정에 1클릭 실시간 동기화</p>
                      </div>
                    </div>
                    <ExternalLink size={14} className={`${deviceType !== "apple" ? "text-emerald-400" : "text-zinc-500 group-hover:text-white"} transition-colors mr-1`} />
                  </button>
                </div>

                {/* Option 2: Download .ics */}
                <div className="p-4 bg-zinc-950/40 border border-zinc-800/80 rounded-2xl space-y-2">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <Download size={13} className="text-zinc-400" />
                    <span>이번 달 급식 .ics 파일 다운로드</span>
                  </h4>
                  <p className="text-[11px] text-zinc-500">
                    갤럭시 캘린더, 아웃룩 등에 파일로 가져오기 할 수 있습니다.
                  </p>
                  <button
                    onClick={handleDownloadIcs}
                    className="w-full mt-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold transition-all"
                  >
                    {today.getMonth() + 1}월 급식 캘린더 파일 (.ics)
                  </button>
                </div>

                {/* Option 3: Copy iCal URL */}
                <div className="p-4 bg-zinc-950/40 border border-zinc-800/80 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white">직접 iCal URL 구독</h4>
                    <button
                      onClick={handleCopyFeed}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
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
    </div>
  );
}
