"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft, Calculator, Sparkles, GraduationCap,
  ChevronDown, Loader2, AlertCircle, RefreshCw,
  BookOpen, Music, Dumbbell, Globe, Languages,
  Microscope, Palette, PenLine, BookMarked, Cpu,
} from "lucide-react";
import { simplifyGradeLabel } from "@/lib/exam-grade";
import { getAcademicSemester, getAcademicYear } from "@/lib/academic-calendar";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SubjectCredit {
  id: string;
  grade: string;
  subject: string;
  credits: number;
  semester: string;
  year: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const GRADES = ["7", "8", "9", "10", "11", "12-1", "12-2"] as const;
type Grade = typeof GRADES[number];

// Score → letter + GPA point
const scoreToGrade = (score: number | null): { letter: string; point: number } | null => {
  if (score === null) return null;
  if (score >= 95) return { letter: "A+", point: 4.5 };
  if (score >= 90) return { letter: "A",  point: 4.0 };
  if (score >= 85) return { letter: "B+", point: 3.5 };
  if (score >= 80) return { letter: "B",  point: 3.0 };
  if (score >= 75) return { letter: "C+", point: 2.5 };
  if (score >= 70) return { letter: "C",  point: 2.0 };
  if (score >= 65) return { letter: "D+", point: 1.5 };
  if (score >= 60) return { letter: "D",  point: 1.0 };
  return             { letter: "F",  point: 0.0 };
};

const gradeColors: Record<string, { text: string; bg: string; border: string }> = {
  "A+": { text: "text-emerald-400", bg: "bg-emerald-500/15", border: "border-emerald-500/30" },
  "A":  { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  "B+": { text: "text-sky-400",     bg: "bg-sky-500/15",     border: "border-sky-500/30" },
  "B":  { text: "text-sky-400",     bg: "bg-sky-500/10",     border: "border-sky-500/20" },
  "C+": { text: "text-amber-400",   bg: "bg-amber-500/15",   border: "border-amber-500/30" },
  "C":  { text: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/20" },
  "D+": { text: "text-orange-400",  bg: "bg-orange-500/15",  border: "border-orange-500/30" },
  "D":  { text: "text-orange-400",  bg: "bg-orange-500/10",  border: "border-orange-500/20" },
  "F":  { text: "text-red-400",     bg: "bg-red-500/15",     border: "border-red-500/30" },
};

const SUBJECT_ICONS: Record<string, React.ReactNode> = {
  "국어":     <Languages  size={18} />,
  "수학":     <Calculator size={18} />,
  "Science":  <Microscope size={18} />,
  "Social":   <Globe      size={18} />,
  "Literature":<BookOpen  size={18} />,
  "Grammar":  <PenLine    size={18} />,
  "Writing":  <PenLine    size={18} />,
  "English":  <Globe      size={18} />,
  "Filipino": <Globe      size={18} />,
  "Chinese":  <Globe      size={18} />,
  "Inter.":   <Calculator size={18} />,
  "미술":     <Palette    size={18} />,
  "음악":     <Music      size={18} />,
  "Music":    <Music      size={18} />,
  "체육":     <Dumbbell   size={18} />,
  "Physical": <Dumbbell   size={18} />,
  "성경":     <BookMarked size={18} />,
  "Bible":    <BookMarked size={18} />,
  "한문":     <BookOpen   size={18} />,
  "역사":     <BookOpen   size={18} />,
  "사회":     <Globe      size={18} />,
  "E.P.":     <Cpu        size={18} />,
  "Rhetoric":     <PenLine    size={18} />,
  "문학":         <Languages  size={18} />,
  "한국사":       <BookOpen   size={18} />,
  "정보":         <Cpu        size={18} />,
  "Inter.Studies":<Globe      size={18} />,
  "E.Lit.":       <BookOpen   size={18} />,
  "선택 수학":    <Calculator size={18} />,
  "P.E.":         <Dumbbell   size={18} />,
};

const getSubjectIcon = (name: string) => {
  for (const key of Object.keys(SUBJECT_ICONS)) {
    if (name.includes(key)) return SUBJECT_ICONS[key];
  }
  return <GraduationCap size={18} />;
};

// ─── Score Conversion Table (shown in info panel) ─────────────────────────────
const GRADE_TABLE = [
  { range: "95 ~ 100", letter: "A+", point: 4.5 },
  { range: "90 ~ 94",  letter: "A",  point: 4.0 },
  { range: "85 ~ 89",  letter: "B+", point: 3.5 },
  { range: "80 ~ 84",  letter: "B",  point: 3.0 },
  { range: "75 ~ 79",  letter: "C+", point: 2.5 },
  { range: "70 ~ 74",  letter: "C",  point: 2.0 },
  { range: "65 ~ 69",  letter: "D+", point: 1.5 },
  { range: "60 ~ 64",  letter: "D",  point: 1.0 },
  { range: "0 ~ 59",   letter: "F",  point: 0.0 },
];

// ─── GPA ring color ────────────────────────────────────────────────────────────
const getRingColor = (gpa: number) => {
  if (gpa >= 4.0) return { text: "text-emerald-500", glow: "bg-emerald-500" };
  if (gpa >= 3.0) return { text: "text-sky-500",     glow: "bg-sky-500" };
  if (gpa >= 2.0) return { text: "text-amber-500",   glow: "bg-amber-500" };
  if (gpa >  0)   return { text: "text-orange-500",  glow: "bg-orange-500" };
  return                  { text: "text-zinc-700",   glow: "bg-zinc-700" };
};

// ─── GPA label ─────────────────────────────────────────────────────────────────
const getGpaLabel = (gpa: number) => {
  if (gpa >= 4.3) return "Excellent";
  if (gpa >= 3.5) return "Great";
  if (gpa >= 2.5) return "Good";
  if (gpa >= 1.5) return "Fair";
  if (gpa >  0)   return "Below Avg";
  return "—";
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function GpaCalculatorPage() {
  const { data: session } = useSession();

  const [selectedGrade, setSelectedGrade] = useState<Grade>("7");
  const [subjects, setSubjects] = useState<SubjectCredit[]>([]);
  const [scores, setScores] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTable, setShowTable] = useState(false);

  // Auto-detect grade from session
  useEffect(() => {
    if (session?.user?.grade) {
      const g = simplifyGradeLabel(session.user.grade);
      if ((GRADES as readonly string[]).includes(g)) {
        setSelectedGrade(g as Grade);
      }
    }
  }, [session]);

  const fetchSubjects = useCallback(async (grade: Grade) => {
    setIsLoading(true);
    setError(null);
    try {
      const year = getAcademicYear();
      const semester = getAcademicSemester();
      const res = await fetch(`/api/collab/gpa?grade=${grade}&year=${year}&semester=${semester}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setSubjects(data.subjects ?? []);
      // Reset scores when grade changes
      const initial: Record<string, string> = {};
      (data.subjects ?? []).forEach((s: SubjectCredit) => { initial[s.id] = ""; });
      setScores(initial);
    } catch {
      setError("과목 정보를 불러오지 못했습니다. 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubjects(selectedGrade);
  }, [selectedGrade, fetchSubjects]);

  const handleScoreChange = (id: string, value: string) => {
    // Only allow 0-100 integers
    if (value === "" || (/^\d{1,3}$/.test(value) && Number(value) <= 100)) {
      setScores((prev) => ({ ...prev, [id]: value }));
    }
  };

  // Weighted GPA calculation
  const { gpa, totalCredits, earnedCredits, subjectsCount } = useMemo(() => {
    let weightedSum = 0;
    let totalCr = 0;
    let earnedCr = 0;
    let count = 0;

    subjects.forEach((s) => {
      const raw = scores[s.id];
      const scoreNum = raw !== "" && raw !== undefined && raw !== null ? Number(raw) : null;
      const result = scoreToGrade(scoreNum);
      totalCr += s.credits;
      if (result !== null) {
        weightedSum += result.point * s.credits;
        earnedCr += s.credits;
        count++;
      }
    });

    return {
      gpa: earnedCr > 0 ? weightedSum / earnedCr : 0,
      totalCredits: totalCr,
      earnedCredits: earnedCr,
      subjectsCount: count,
    };
  }, [subjects, scores]);

  const ring = getRingColor(gpa);

  const handleReset = () => {
    const reset: Record<string, string> = {};
    subjects.forEach((s) => { reset[s.id] = ""; });
    setScores(reset);
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">

      {/* Header */}
      <div className="mb-12">
        <Link
          href="/collab"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold">Back to Hub</span>
        </Link>

        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            <Sparkles size={12} className="text-emerald-400" />
            GPA Calculator
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              학점 계산기
            </span>
          </h1>
          <p className="text-zinc-500 max-w-xl font-medium text-base leading-relaxed">
            학년을 선택하고 각 과목 점수를 입력하면 가중 평균 GPA가 자동 계산됩니다.<br />
            4.5 만점 기준 · 단위수 가중 계산
          </p>
        </motion.div>
      </div>

      {/* Grade Selector + Info Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
        {/* Grade Pills */}
        <div className="flex items-center gap-2 p-1.5 bg-zinc-900/40 border border-white/5 rounded-[1.5rem] flex-wrap">
          {GRADES.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGrade(g)}
              className={`relative px-5 py-2.5 rounded-2xl text-sm font-black transition-all duration-300 ${
                selectedGrade === g
                  ? "text-white"
                  : "text-zinc-600 hover:text-zinc-300"
              }`}
            >
              {selectedGrade === g && (
                <motion.div
                  layoutId="activeGrade"
                  className="absolute inset-0 bg-white/10 rounded-2xl border border-white/15"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                />
              )}
              <span className="relative z-10">{g.startsWith("12") ? `G${g}` : `${g}학년`}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Reset button */}
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-zinc-900/40 border border-white/5 text-zinc-500 hover:text-white hover:border-white/15 transition-all text-sm font-bold"
          >
            <RefreshCw size={14} />
            초기화
          </button>

          {/* Grade table toggle */}
          <button
            onClick={() => setShowTable((v) => !v)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-sm font-bold transition-all ${
              showTable
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-zinc-900/40 border-white/5 text-zinc-500 hover:text-white hover:border-white/15"
            }`}
          >
            환산표
            <ChevronDown size={14} className={`transition-transform ${showTable ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {/* Grade Conversion Table (collapsible) */}
      <AnimatePresence>
        {showTable && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-8"
          >
            <div className="bg-zinc-900/40 border border-white/5 rounded-[2rem] p-6">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-4">점수 → 학점 환산 기준</p>
              <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
                {GRADE_TABLE.map((row) => {
                  const c = gradeColors[row.letter];
                  return (
                    <div key={row.letter} className={`rounded-2xl p-3 text-center border ${c.bg} ${c.border}`}>
                      <p className={`text-lg font-black ${c.text}`}>{row.letter}</p>
                      <p className="text-[10px] text-zinc-500 font-bold mt-0.5">{row.point.toFixed(1)}</p>
                      <p className="text-[9px] text-zinc-600 font-medium mt-1 leading-tight">{row.range}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

        {/* Left: Subject List */}
        <div className="flex-1 w-full">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-32 bg-zinc-900/20 rounded-[3rem] border border-white/5 border-dashed"
              >
                <Loader2 className="w-10 h-10 text-emerald-500/30 animate-spin mb-4" />
                <p className="text-zinc-500 font-medium text-sm animate-pulse">과목 정보 불러오는 중...</p>
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-32 bg-zinc-900/20 rounded-[3rem] border border-red-500/10"
              >
                <AlertCircle className="w-10 h-10 text-red-500/40 mb-4" />
                <p className="text-zinc-500 font-medium text-sm mb-4">{error}</p>
                <button
                  onClick={() => fetchSubjects(selectedGrade)}
                  className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white/10 transition-all"
                >
                  다시 시도
                </button>
              </motion.div>
            ) : subjects.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-32 bg-zinc-900/20 rounded-[3rem] border border-white/5 border-dashed"
              >
                <GraduationCap className="w-10 h-10 text-zinc-700 mb-4" />
                <p className="text-zinc-500 font-medium text-sm">
                  {selectedGrade.startsWith("12") ? `G${selectedGrade}` : `${selectedGrade}학년`} 과목 데이터가 없습니다.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={selectedGrade}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                {subjects.map((subject, idx) => {
                  const raw = scores[subject.id] ?? "";
                  const scoreNum = raw !== "" ? Number(raw) : null;
                  const result = scoreToGrade(scoreNum);
                  const colors = result ? gradeColors[result.letter] : null;

                  return (
                    <motion.div
                      key={subject.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04, duration: 0.3 }}
                      className={`group bg-zinc-900/30 backdrop-blur-xl border rounded-[2rem] p-4 sm:p-5 flex items-center gap-4 transition-all duration-300 ${
                        result && colors
                          ? `${colors.border} ${colors.bg}`
                          : "border-white/5 hover:border-white/10"
                      }`}
                    >
                      {/* Icon */}
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                        result && colors ? `${colors.bg} ${colors.text}` : "bg-zinc-800/60 text-zinc-600"
                      }`}>
                        {getSubjectIcon(subject.subject)}
                      </div>

                      {/* Subject name + credits */}
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-bold text-sm sm:text-base truncate">{subject.subject}</p>
                        <p className="text-zinc-600 text-[11px] font-medium mt-0.5">{subject.credits}학점</p>
                      </div>

                      {/* Grade badge */}
                      <AnimatePresence>
                        {result && colors && (
                          <motion.div
                            key={result.letter}
                            initial={{ scale: 0.7, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.7, opacity: 0 }}
                            className={`shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-2xl border font-black ${colors.bg} ${colors.border} ${colors.text}`}
                          >
                            <span className="text-base leading-none">{result.letter}</span>
                            <span className="text-[10px] text-zinc-500 mt-0.5">{result.point.toFixed(1)}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Score input */}
                      <div className="shrink-0 relative">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={raw}
                          onChange={(e) => handleScoreChange(subject.id, e.target.value)}
                          placeholder="—"
                          className={`w-20 h-11 rounded-2xl border text-center font-black text-sm bg-zinc-950/60 text-white outline-none transition-all placeholder:text-zinc-700 focus:ring-1 focus:ring-emerald-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                            result && colors ? `${colors.border}` : "border-white/10 focus:border-white/20"
                          }`}
                        />
                        {raw !== "" && (
                          <span className="absolute -top-2 -right-1 text-[9px] font-black text-zinc-600">점</span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: GPA Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, type: "spring" }}
          className="w-full lg:w-[360px] shrink-0 sticky top-28"
        >
          <div className="bg-zinc-900/60 backdrop-blur-2xl rounded-[3rem] border border-white/10 p-8 sm:p-10 relative overflow-hidden">
            {/* Glow */}
            <div className={`absolute top-0 right-0 w-56 h-56 blur-[80px] rounded-full opacity-20 transition-colors duration-700 ${ring.glow}`} />

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-14 h-14 rounded-3xl bg-zinc-800/50 border border-white/5 flex items-center justify-center mb-6">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>

              <h2 className="text-zinc-400 font-bold tracking-widest uppercase text-[10px] mb-1">
                {selectedGrade.startsWith("12") ? `G${selectedGrade}` : `${selectedGrade}학년`} 가중 평균
              </h2>
              <p className="text-zinc-600 text-[10px] font-medium mb-6">
                {subjectsCount > 0 ? `${subjectsCount}과목 / ${earnedCredits}학점 입력됨` : "점수를 입력해 주세요"}
              </p>

              {/* Ring */}
              <div className="relative w-44 h-44 flex items-center justify-center mb-6">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="4" className="text-zinc-800" />
                  <motion.circle
                    cx="50" cy="50" r="44"
                    fill="none" stroke="currentColor"
                    strokeWidth="4" strokeLinecap="round"
                    className={`${ring.text} transition-colors duration-700`}
                    initial={{ strokeDasharray: "277", strokeDashoffset: "277" }}
                    animate={{ strokeDashoffset: 277 - (277 * gpa) / 4.5 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                </svg>
                <div className="text-center">
                  <span className="text-5xl font-black text-white tracking-tighter">{gpa.toFixed(2)}</span>
                  <p className="text-zinc-600 text-xs font-bold mt-1">/&nbsp;4.5</p>
                </div>
              </div>

              {/* Label */}
              <div className={`px-5 py-1.5 rounded-full border text-xs font-black uppercase tracking-widest mb-6 transition-colors duration-500 ${
                gpa > 0 ? `${ring.text} border-current/30 bg-current/5` : "text-zinc-700 border-zinc-800"
              }`}>
                {getGpaLabel(gpa)}
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 divide-x divide-white/5 w-full bg-black/20 border border-white/5 rounded-2xl">
                {[
                  { label: "Scale", value: "4.5" },
                  { label: "학점", value: `${earnedCredits}/${totalCredits}` },
                  { label: "과목", value: String(subjectsCount) },
                ].map((stat) => (
                  <div key={stat.label} className="py-3 text-center">
                    <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">{stat.label}</p>
                    <p className="text-white font-bold text-sm mt-0.5">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Grade distribution mini-list */}
          {subjectsCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4 bg-zinc-900/40 border border-white/5 rounded-[2rem] p-5"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-3">학점 분포</p>
              <div className="space-y-2">
                {Object.entries(
                  subjects.reduce<Record<string, number>>((acc, s) => {
                    const raw = scores[s.id] ?? "";
                    const result = scoreToGrade(raw !== "" ? Number(raw) : null);
                    if (!result) return acc;
                    acc[result.letter] = (acc[result.letter] ?? 0) + 1;
                    return acc;
                  }, {})
                )
                  .sort((a, b) => GRADE_TABLE.findIndex(g => g.letter === a[0]) - GRADE_TABLE.findIndex(g => g.letter === b[0]))
                  .map(([letter, count]) => {
                    const c = gradeColors[letter];
                    const pct = Math.round((count / subjectsCount) * 100);
                    return (
                      <div key={letter} className="flex items-center gap-3">
                        <span className={`text-xs font-black w-6 text-right ${c.text}`}>{letter}</span>
                        <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className={`h-full rounded-full ${c.text.replace("text-", "bg-")}`}
                          />
                        </div>
                        <span className="text-zinc-600 text-[10px] font-bold w-6">{count}</span>
                      </div>
                    );
                  })}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
