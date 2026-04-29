"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft, Calculator, Sparkles, BookOpen,
  Globe, Languages, Microscope, Calendar, GraduationCap
} from "lucide-react";

// The grading scale up to 4.5
const GRADE_SCALE = [
  { label: "A+", value: 4.5, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  { label: "A0", value: 4.0, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  { label: "B+", value: 3.5, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { label: "B0", value: 3.0, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { label: "C+", value: 2.5, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  { label: "C0", value: 2.0, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  { label: "D+", value: 1.5, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  { label: "D0", value: 1.0, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  { label: "F", value: 0.0, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
  { label: "N/A", value: null, color: "text-zinc-500", bg: "bg-zinc-800/50", border: "border-white/5" },
];

const DEFAULT_SUBJECTS = [
  { id: "korean", name: "국어", icon: Languages, color: "text-rose-400", bg: "bg-rose-500/10" },
  { id: "english", name: "영어", icon: Globe, color: "text-blue-400", bg: "bg-blue-500/10" },
  { id: "math", name: "수학", icon: Calculator, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { id: "science", name: "과학", icon: Microscope, color: "text-purple-400", bg: "bg-purple-500/10" },
  { id: "social", name: "사회", icon: BookOpen, color: "text-amber-400", bg: "bg-amber-500/10" },
  { id: "history", name: "역사", icon: Calendar, color: "text-orange-400", bg: "bg-orange-500/10" },
  { id: "bible", name: "성경", icon: BookOpen, color: "text-cyan-400", bg: "bg-cyan-500/10" },
];

export default function GpaCalculatorPage() {
  const [grades, setGrades] = useState<Record<string, string>>(() => {
    // Initialize all to N/A
    const initial: Record<string, string> = {};
    DEFAULT_SUBJECTS.forEach((s) => (initial[s.id] = "N/A"));
    return initial;
  });

  const handleGradeChange = (subjectId: string, gradeLabel: string) => {
    setGrades((prev) => ({
      ...prev,
      [subjectId]: gradeLabel,
    }));
  };

  const { gpa, subjectsCount } = useMemo(() => {
    let totalScore = 0;
    let count = 0;

    Object.values(grades).forEach((label) => {
      const gradeDef = GRADE_SCALE.find((g) => g.label === label);
      if (gradeDef && gradeDef.value !== null) {
        totalScore += gradeDef.value;
        count += 1;
      }
    });

    return {
      gpa: count > 0 ? totalScore / count : 0,
      subjectsCount: count,
    };
  }, [grades]);

  // Determine ring color based on GPA
  const getRingColor = (gpaValue: number) => {
    if (gpaValue >= 4.0) return "text-emerald-500";
    if (gpaValue >= 3.0) return "text-blue-500";
    if (gpaValue >= 2.0) return "text-amber-500";
    if (gpaValue > 0) return "text-orange-500";
    return "text-zinc-700";
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <Link
          href="/collab"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold">Back to Hub</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            <Sparkles size={12} className="text-emerald-400" />
            GPA Calculator
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">BETAAAA 학점 계산기</span>
          </h1>
          <p className="text-zinc-500 max-w-xl font-medium text-lg leading-relaxed">
            나의 성취도를 한눈에 확인하세요.<br />
            정확한 4.5 만점 기준으로 평균 학점을 계산해 드립니다.
          </p>
        </motion.div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

        {/* Left Side: Subject Inputs */}
        <div className="flex-1 w-full space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid gap-3"
          >
            {DEFAULT_SUBJECTS.map((subject, idx) => {
              const currentGrade = grades[subject.id];
              const gradeDef = GRADE_SCALE.find(g => g.label === currentGrade)!;

              return (
                <div
                  key={subject.id}
                  className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-[2rem] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-white/10"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${subject.bg} ${subject.color}`}>
                      <subject.icon size={22} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-lg font-bold text-white">{subject.name}</h3>
                  </div>

                  {/* Grade Selector Strip */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide flex-nowrap">
                    {GRADE_SCALE.map((g) => {
                      const isSelected = currentGrade === g.label;
                      return (
                        <button
                          key={g.label}
                          onClick={() => handleGradeChange(subject.id, g.label)}
                          className={`
                            shrink-0 w-11 h-11 rounded-xl text-sm font-black transition-all duration-300 relative
                            ${isSelected ? `${g.bg} ${g.color} shadow-lg ring-1 ${g.border}` : "bg-zinc-900 text-zinc-500 hover:bg-zinc-800 hover:text-white"}
                          `}
                        >
                          {isSelected && (
                            <motion.div
                              layoutId={`active-grade-${subject.id}`}
                              className="absolute inset-0 rounded-xl border border-white/20"
                              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                          )}
                          <span className="relative z-10">{g.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Right Side: GPA Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-full lg:w-[380px] shrink-0 sticky top-32"
        >
          <div className="bg-zinc-900/60 backdrop-blur-2xl rounded-[3rem] border border-white/10 p-8 sm:p-12 relative overflow-hidden group">
            {/* Background glowing effects */}
            <div className={`absolute top-0 right-0 w-64 h-64 blur-[80px] rounded-full opacity-20 transition-colors duration-700 ${getRingColor(gpa).replace("text-", "bg-")}`} />

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-3xl bg-zinc-800/50 border border-white/5 flex items-center justify-center mb-8">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>

              <h2 className="text-zinc-400 font-bold tracking-widest uppercase text-xs mb-6">Your Average GPA</h2>

              <div className="relative w-48 h-48 flex items-center justify-center mb-8">
                {/* SVG Progress Ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                  {/* Background Track */}
                  <circle
                    cx="50" cy="50" r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-zinc-800"
                  />
                  {/* Progress Line */}
                  <motion.circle
                    cx="50" cy="50" r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className={`${getRingColor(gpa)} transition-colors duration-700`}
                    initial={{ strokeDasharray: "283", strokeDashoffset: "283" }}
                    animate={{ strokeDashoffset: 283 - (283 * gpa) / 4.5 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </svg>

                {/* Score Number */}
                <div className="flex items-baseline gap-1">
                  <span className="text-6xl font-black text-white tracking-tighter">
                    {gpa.toFixed(2)}
                  </span>
                  <span className="text-xl font-bold text-zinc-600">/4.5</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-6 w-full px-4 py-4 rounded-2xl bg-black/20 border border-white/5">
                <div className="text-center">
                  <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">Scale</p>
                  <p className="text-white font-bold">4.5</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="text-center">
                  <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">Subjects</p>
                  <p className="text-white font-bold">{subjectsCount}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
