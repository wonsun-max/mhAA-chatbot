"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Utensils, ChevronRight, Clock, Info, Sparkles } from "lucide-react";

import { GROUP_1, GROUP_2, getMealOrder } from "@/lib/meal-utils";

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

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const isWeekend = today.getDay() === 0 || today.getDay() === 6;

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await fetch("/api/admin/collab/meals");
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

  const mealOrder = getMealOrder(today);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-8 h-8 border-4 border-white/10 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
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
          <div className="h-full bg-zinc-900/30 backdrop-blur-xl border border-white/5 rounded-[3rem] p-8 sm:p-12 relative overflow-hidden transition-all duration-500 hover:border-white/10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full group-hover:bg-emerald-500/10 transition-colors" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-emerald-400">
                  <Calendar size={20} />
                </div>
                <div>
                  <h2 className="text-white font-bold text-xl">오늘의 식단</h2>
                  <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest">{todayStr} • {new Date().toLocaleDateString('ko-KR', { weekday: 'long' })}</p>
                </div>
              </div>

              {todayMeal && !isWeekend ? (
                <div className="space-y-8">
                  <div className="flex flex-wrap gap-x-6 gap-y-4">
                    {todayMeal.menu.split(',').map((item, idx) => (
                      <span key={idx} className="text-2xl sm:text-3xl text-white font-bold tracking-tight group-hover:text-emerald-400 transition-colors">
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
                className="group bg-zinc-900/30 backdrop-blur-sm border border-white/5 hover:border-white/20 rounded-[2.5rem] p-8 transition-all duration-500"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-black font-mono text-zinc-600 tracking-wider mb-1 block uppercase">{meal.date}</span>
                    <h4 className="text-white font-bold text-lg">{meal.dayOfWeek}</h4>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-700 group-hover:text-white group-hover:border-white/20 transition-all">
                    <ChevronRight size={16} />
                  </div>
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
        className="mt-20 p-8 bg-zinc-900/30 border border-white/5 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8 group"
      >
        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-zinc-600 shrink-0 group-hover:scale-110 transition-transform duration-500">
          <Info size={28} />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h4 className="text-white font-bold mb-1">식단 안내 및 주의사항</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">
            식단은 시장 및 학교 상황에 따라 변경될 수 있습니다. 
            알레르기 유발 식품(난류, 우유, 메밀, 땅콩, 대두, 밀, 고등어, 게, 새우, 돼지고기, 복숭아, 토마토, 아황산염, 호두, 닭고기, 쇠고기, 오징어, 조개류 등)이 포함되어 있을 수 있으니 식품 알레르기가 있는 학생은 급식 시 각별히 주의하시기 바랍니다.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
