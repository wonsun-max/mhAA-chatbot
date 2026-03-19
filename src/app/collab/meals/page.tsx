"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Utensils, ChevronRight, Clock, Info } from "lucide-react";

interface Meal {
  id: string;
  date: string;
  dayOfWeek: string;
  menu: string;
}

const GROUP_1 = "7, 9, 11";
const GROUP_2 = "8, 10, 12-1, 12-2";

// Friday, March 20, 2026 is part of the week starting March 16, 2026.
// Reverting to the user's information: "this week was group 2 (8,10,12-1,12-2) ate fast."
// Let's assume the week starts on Sunday or Monday.
// March 16, 2026 (Monday) -> Group 2 is priority.

export default function MealsPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [todayMeal, setTodayMeal] = useState<Meal | null>(null);

  // Get today's date in YYYY-MM-DD format (Local Time)
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

          // Find if there's a meal for today
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

  // Meal Order Logic
  const getMealOrder = () => {
    const day = today.getDay(); // 0 (Sun) to 6 (Sat)
    if (day === 0 || day === 6) return null;

    // Reference Monday: 2026-03-16
    // User clarified: This week Tuesday (day 2) and Thursday (day 4) Group 2 eats fast.
    // This means Monday (day 1), Wednesday (day 3), Friday (day 5) Group 1 eats fast.
    const refDate = new Date("2026-03-16");
    const diffTime = today.getTime() - refDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);

    // Swap base priority every week
    const isGroup1BaseWeek = diffWeeks % 2 === 0;

    // Based on user: This week (isGroup1BaseWeek=true), day 2 & 4 are Group 2 priority.
    // day 1, 3, 5 are Group 1 priority.
    // This aligns with: (day % 2 !== 0) ? Group 1 : Group 2

    let firstGroup, secondGroup;
    const isPriorityDay = (day % 2) !== 0; // Mon(1), Wed(3), Fri(5)

    if (isGroup1BaseWeek) {
      firstGroup = isPriorityDay ? GROUP_1 : GROUP_2;
      secondGroup = isPriorityDay ? GROUP_2 : GROUP_1;
    } else {
      // Next week, swap
      firstGroup = isPriorityDay ? GROUP_2 : GROUP_1;
      secondGroup = isPriorityDay ? GROUP_1 : GROUP_2;
    }

    return { firstGroup, secondGroup };
  };

  const mealOrder = getMealOrder();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-4">
          <Utensils size={14} />
          SCHOOL MEALS
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
          오늘의 <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">맛있는 식사</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          학교급식법 시행규칙에 따른 영양성분 및 알레르기 유발 식품 정보를 포함한 식단입니다.
        </p>
      </motion.div>

      {/* Today's Section: Menu & Meal Order */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 items-start">
        {/* Today's Highlight Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="relative lg:col-span-2"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-[2.5rem] blur-xl opacity-50" />
          <div className="relative bg-zinc-900/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] overflow-hidden p-8 sm:p-10 h-full">
            <div className="flex flex-col sm:flex-row gap-8 items-start">
              <div className="flex-1 w-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-emerald-500/20 p-3 rounded-2xl text-emerald-400">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-xl">오늘의 메뉴</h2>
                    <p className="text-gray-500 text-sm font-mono">{todayStr} ({new Date().toLocaleDateString('ko-KR', { weekday: 'long' })})</p>
                  </div>
                </div>

                {todayMeal && !isWeekend ? (
                  <div className="space-y-6">
                    <p className="text-2xl sm:text-3xl text-gray-100 font-medium leading-relaxed">
                      {todayMeal.menu.split(',').map((item, idx) => (
                        <span key={idx} className="inline-block mr-3">
                          {item.trim()}{idx < todayMeal.menu.split(',').length - 1 && ","}
                        </span>
                      ))}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-4">
                      <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-400">#맛있게드세요</span>
                      <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-400">#균형잡힌식단</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-8">
                    {isWeekend ? (
                      <div className="space-y-2">
                        <p className="text-xl text-emerald-400 font-bold italic">즐거운 주말 보충!</p>
                        <p className="text-gray-500 text-sm">월요일에 다시 만나요.</p>
                      </div>
                    ) : (
                      <p className="text-xl text-gray-500 italic font-medium">등록된 정보가 없습니다.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Meal Order Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="relative lg:col-span-1 h-full"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-[2.5rem] blur-xl opacity-30" />
          <div className="relative bg-zinc-900/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-blue-500/20 p-3 rounded-2xl text-blue-400">
                  <Clock size={24} />
                </div>
                <div>
                  <h2 className="text-white font-bold text-xl">식사 순서</h2>
                  <p className="text-gray-500 text-xs uppercase tracking-widest">Entry Priority</p>
                </div>
              </div>

              {mealOrder && !isWeekend ? (
                <div className="space-y-8">
                  <div className="relative pl-6 border-l-2 border-emerald-500/30">
                    <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <p className="text-emerald-400 text-xs font-bold uppercase tracking-tighter mb-1">12:00  식사</p>
                    <p className="text-white text-lg font-medium tracking-tight leading-tight">
                      {mealOrder.firstGroup} <span className="text-white/40 font-light text-sm">학년</span>
                    </p>
                  </div>

                  <div className="relative pl-6 border-l-2 border-white/10">
                    <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-gray-600" />
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-tighter mb-1">12:10 늦게 식사</p>
                    <p className="text-white/70 text-lg font-medium tracking-tight leading-tight">
                      {mealOrder.secondGroup} <span className="text-white/30 font-light text-sm">학년</span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center">
                  <p className="text-gray-500 italic text-sm">주말에는 식사 순서가 없습니다.</p>
                </div>
              )}
            </div>

            <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/5">
              <p className="text-[10px] text-gray-500 leading-relaxed">
                <span className="text-blue-400 font-bold">INFO:</span> 매주 순서가 교차되며, 해당 주 내에서도 매일 순환됩니다.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Weekly View */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-white font-bold flex items-center gap-2">
            <Clock size={18} className="text-emerald-400" />
            다가오는 식단표
          </h3>
          <span className="text-xs text-gray-500 uppercase tracking-widest">Upcoming Menu</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(() => {
            const filteredUpcoming = meals.filter(m => {
              const d = new Date(m.date);
              const day = d.getDay();
              return m.date >= todayStr && m.date !== todayStr && day !== 0 && day !== 6;
            });

            if (filteredUpcoming.length === 0) return (
              <div className="col-span-full py-12 text-center bg-white/5 border border-dashed border-white/10 rounded-2xl text-gray-500">
                추후 일정이 아직 등록되지 않았습니다.
              </div>
            );

            // Logic to limit view to Monday-Friday of the first upcoming week
            const firstDate = new Date(filteredUpcoming[0].date);
            const firstDay = firstDate.getDay(); // 1 (Mon) to 5 (Fri)
            const diffToFriday = 5 - firstDay;
            const fridayDate = new Date(firstDate);
            fridayDate.setDate(firstDate.getDate() + diffToFriday);
            const fridayStr = `${fridayDate.getFullYear()}-${String(fridayDate.getMonth() + 1).padStart(2, '0')}-${String(fridayDate.getDate()).padStart(2, '0')}`;

            return filteredUpcoming
              .filter(m => m.date <= fridayStr)
              .slice(0, 5)
              .map((meal, index) => (
                <motion.div
                  key={meal.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 + 0.3 }}
                  className="group bg-white/5 hover:bg-white/10 border border-white/5 hover:border-emerald-500/30 rounded-2xl p-6 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-xs font-mono text-emerald-400/70">{meal.date}</span>
                      <h4 className="text-white font-bold">{meal.dayOfWeek}</h4>
                    </div>
                    <div className="p-2 bg-white/5 rounded-lg text-gray-500 group-hover:text-emerald-400 transition-colors">
                      <ChevronRight size={16} />
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 group-hover:text-gray-200 transition-colors">
                    {meal.menu}
                  </p>
                </motion.div>
              ));
          })()}
        </div>
      </div>

      {/* Footer Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-16 flex items-start gap-3 p-6 bg-zinc-900/30 border border-white/5 rounded-2xl"
      >
        <div className="bg-blue-500/10 p-2 rounded-lg text-blue-400 shrink-0">
          <Info size={16} />
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">
          식단은 시장 및 학교 상황에 따라 변경될 수 있습니다.
          알레르기 유발 식품(난류, 우유, 메밀, 땅콩, 대두, 밀, 고등어, 게, 새우, 돼지고기, 복숭아, 토마토, 아황산염, 호두, 닭고기, 쇠고기, 오징어, 조개류 등)이 포함되어 있을 수 있으니 주의하시기 바랍니다.
        </p>
      </motion.div>
    </div>
  );
}
