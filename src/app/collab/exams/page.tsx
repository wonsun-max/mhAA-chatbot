"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { 
  Clock, Pencil, BookOpen, Calendar, 
  LayoutGrid, List, Info, 
  GraduationCap, Calculator, Globe, Languages, 
  Microscope, Sparkles, Search, Home, ArrowLeft,
  Loader2
} from "lucide-react";
import Link from "next/link";
import type { Session } from "next-auth";
import { getAcademicSemester, getAcademicYear } from "@/lib/academic-calendar";
import { matchesExamGrade, simplifyGradeLabel } from "@/lib/exam-grade";

/**
 * Interface for a specific exam subject per period.
 */
interface ExamSubject {
  grade: string[];
  name: string;
}

/**
 * Interface for an exam period.
 */
interface ExamPeriod {
  period: number;
  time: string;
  subjects: ExamSubject[];
}

/**
 * Interface for an exam day.
 */
interface ExamDay {
  id: string;
  date: string;
  day: string;
  periods: ExamPeriod[];
}

interface ExamScheduleEntry {
  id: string;
  examType: string;
  semester: string;
  year: number;
  date: string;
  dayOfWeek: string;
  period: number;
  time: string;
  subject: string;
  grades: string[];
}

type SessionUser = Session["user"];

const GRADES = ["7", "8", "9", "10", "11", "12"];

const SUBJECT_ICONS: Record<string, React.ReactNode> = {
  "수학": <Calculator size={18} />,
  "Math": <Calculator size={18} />,
  "영어": <Globe size={18} />,
  "Writing": <Pencil size={18} />,
  "Grammar": <Languages size={18} />,
  "국어": <Languages size={18} />,
  "Literature": <BookOpen size={18} />,
  "과학": <Microscope size={18} />,
  "Science": <Microscope size={18} />,
  "사회": <Globe size={18} />,
  "Social": <Globe size={18} />,
  "역사": <Globe size={18} />,
  "Go home": <Home size={18} />,
  "자습": <BookOpen size={18} />,
};

/**
 * Returns an icon based on the subject name.
 * @param subject Name of the subject
 */
const getSubjectIcon = (subject: string) => {
  for (const key in SUBJECT_ICONS) {
    if (subject.includes(key)) return SUBJECT_ICONS[key];
  }
  return <GraduationCap size={18} />;
};

// Data will be fetched from API

export default function ExamSchedulePage() {
  const { data: session } = useSession();
  const [selectedGrade, setSelectedGrade] = useState<string>("7");
  const [activeExam, setActiveExam] = useState<"midterm" | "finals">("midterm");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [currentTime, setCurrentTime] = useState(new Date());
  const currentAcademicYear = getAcademicYear();
  const currentAcademicSemester = getAcademicSemester();
  
  // Real database states
  const [rawExams, setRawExams] = useState<ExamScheduleEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchExams = useCallback(async () => {
    setIsLoading(true);
    try {
      const type = activeExam === "midterm" ? "MIDTERM" : "FINALS";
      const res = await fetch(`/api/collab/exams?type=${type}`);
      const data = await res.json();
      if (data.exams) setRawExams(data.exams);
    } catch (error) {
      console.error("Failed to fetch exams:", error);
    } finally {
      setIsLoading(false);
    }
  }, [activeExam]);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const sessionUser: SessionUser | undefined = session?.user;
    if (sessionUser?.grade) {
      const simpleGrade = simplifyGradeLabel(sessionUser.grade);
      if (GRADES.includes(simpleGrade)) {
        setSelectedGrade(simpleGrade);
      }
    }
  }, [session]);

  /**
   * Transforms flat API data into nested UI structure and filters for the selected grade.
   * Includes the injection logic for 'Self-Study' (자습).
   */
  const filteredData = useMemo(() => {
    if (rawExams.length === 0) return [];

    // 1. Group by Date to create ExamDay[] structure
    const daysMap = new Map<string, ExamDay>();
    
    rawExams.forEach((entry) => {
      if (!daysMap.has(entry.date)) {
        daysMap.set(entry.date, {
          id: entry.date,
          date: entry.date,
          day: entry.dayOfWeek,
          periods: []
        });
      }
      
      const day = daysMap.get(entry.date)!;
      let p = day.periods.find(p => p.period === entry.period);
      if (!p) {
        p = { period: entry.period, time: entry.time, subjects: [] };
        day.periods.push(p);
      }
      
      p.subjects.push({
        grade: entry.grades,
        name: entry.subject
      });
    });

    // 2. Filter for specific grade and inject Self-Study
    const formattedDays = Array.from(daysMap.values()).sort((a, b) => a.date.localeCompare(b.date));

    return formattedDays.map(day => ({
      ...day,
      periods: day.periods.map(period => {
        // Find subject for this grade or "All"
        const specificSubject = period.subjects.find(s => 
          matchesExamGrade(selectedGrade, s.grade)
        );

        if (specificSubject) {
          return { ...period, subjects: [specificSubject] };
        }

        // If no specific subject but other grades have exams, it's Self-Study
        if (period.subjects.length > 0) {
          return { 
            ...period, 
            subjects: [{ grade: [selectedGrade], name: "자습 (Self-Study)" }] 
          };
        }

        return { ...period, subjects: [] };
      }).filter(period => period.subjects.length > 0)
    }));
  }, [rawExams, selectedGrade]);

  /**
   * Checks if the given time range is the current period today.
   */
  const isCurrentPeriod = (dateStr: string, timeRange: string) => {
    const today = new Date();
    const normalizedDate = dateStr.includes("-")
      ? new Date(dateStr)
      : new Date(today.getFullYear(), Number(dateStr.split("/")[0]) - 1, Number(dateStr.split("/")[1]));

    if (
      today.getFullYear() !== normalizedDate.getFullYear() ||
      today.getMonth() !== normalizedDate.getMonth() ||
      today.getDate() !== normalizedDate.getDate()
    ) {
      return false;
    }

    const [start, end] = timeRange.split(" - ");
    const [sH, sM] = start.split(":").map(Number);
    const [eH, eM] = end.split(":").map(Number);

    const nowH = currentTime.getHours();
    const nowM = currentTime.getMinutes();

    const startVal = sH * 60 + sM;
    const endVal = eH * 60 + eM;
    const nowVal = nowH * 60 + nowM;

    return nowVal >= startVal && nowVal < endVal;
  };

  /**
   * Calculates progress percentage for an ongoing exam.
   */
  const getProgress = (timeRange: string) => {
    const [start, end] = timeRange.split(" - ");
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

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Navigation & Header */}
      <div className="mb-12">
        <Link 
          href="/collab" 
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold">Back to Hub</span>
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              <Sparkles size={12} className="text-rose-400" />
              Exam Logistics Center
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4">
              <span className="text-rose-500">{activeExam === "midterm" ? "중간고사" : "기말고사"}</span> 일정
            </h1>
            <p className="text-zinc-500 max-w-xl font-medium">
              {currentAcademicYear}학년도 {currentAcademicSemester}학기 시험 시간표입니다.<br />
              완벽한 준비로 최고의 결과를 만들어보세요.
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
                {GRADES.map(g => <option key={g} value={g} className="bg-zinc-900">{g}학년</option>)}
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
      </div>

      {/* Exam Type Selector */}
      <div className="flex p-1 bg-zinc-900/40 backdrop-blur-xl rounded-[1.5rem] border border-white/5 mb-12 max-w-sm">
        <button
          onClick={() => setActiveExam("midterm")}
          className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all relative ${
            activeExam === "midterm" ? "text-white" : "text-zinc-600 hover:text-zinc-400"
          }`}
        >
          {activeExam === "midterm" && (
            <motion.div
              layoutId="activeExamTab"
              className="absolute inset-0 bg-white/5 rounded-2xl border border-white/10"
              transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
            />
          )}
          <span className="relative z-10">중간고사</span>
        </button>
        <button
          onClick={() => setActiveExam("finals")}
          className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all relative ${
            activeExam === "finals" ? "text-white" : "text-zinc-600 hover:text-zinc-400"
          }`}
        >
          {activeExam === "finals" && (
            <motion.div
              layoutId="activeExamTab"
              className="absolute inset-0 bg-white/5 rounded-2xl border border-white/10"
              transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
            />
          )}
          <span className="relative z-10">기말고사</span>
        </button>
      </div>

      {/* Content Area */}
      <LayoutGroup>
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-40 bg-zinc-900/10 rounded-[4rem] border border-white/5 border-dashed"
            >
              <div className="relative">
                 <Loader2 className="w-12 h-12 animate-spin text-rose-500/20" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles size={20} className="text-rose-500 animate-pulse" />
                 </div>
              </div>
              <p className="mt-6 text-zinc-500 font-medium animate-pulse">시험 일정을 동기화하는 중...</p>
            </motion.div>
          ) : filteredData.length > 0 ? (
            <motion.div
              key={`${activeExam}-view`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-12"
            >
              {filteredData.map((day, dayIdx) => (
                <div key={day.id} className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-px flex-grow bg-gradient-to-r from-transparent to-white/5" />
                    <h3 className="text-zinc-400 font-black text-xs uppercase tracking-[0.3em] flex items-center gap-3">
                      <Calendar size={14} className="text-rose-500" />
                      {day.date} {day.day}
                    </h3>
                    <div className="h-px flex-grow bg-gradient-to-l from-transparent to-white/5" />
                  </div>

                  <div className={viewMode === "list" ? "grid gap-3" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"}>
                    {day.periods.map((period, periodIdx) => {
                      const active = isCurrentPeriod(day.date, period.time);
                      const subject = period.subjects[0]?.name || "-";
                      
                      return (
                        <motion.div
                          key={`${day.id}-${period.period}`}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: (dayIdx * 4 + periodIdx) * 0.05 }}
                          className={`group relative overflow-hidden bg-zinc-900/30 backdrop-blur-xl border transition-all duration-500 p-6 sm:p-8 rounded-[2.5rem] flex flex-col justify-between gap-6 ${
                            active 
                              ? "border-rose-500/30 bg-rose-500/5 ring-1 ring-rose-500/20 shadow-2xl shadow-rose-500/10" 
                              : "border-white/5 hover:border-white/10"
                          }`}
                        >
                          <div className="flex items-start justify-between relative z-10">
                            <div className="flex items-center gap-6">
                              <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl border font-black transition-all ${
                                active 
                                  ? "bg-rose-500 border-rose-400 text-white shadow-xl shadow-rose-500/20" 
                                  : "bg-zinc-900 border-white/5 text-zinc-600 group-hover:text-zinc-400"
                              }`}>
                                <span className="text-[10px] mb-[-2px] opacity-50 uppercase tracking-tighter">{period.period}교시</span>
                              </div>
                              
                              <div>
                                <h4 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3 mb-1">
                                  {subject}
                                </h4>
                                <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium font-mono">
                                  <Clock size={14} className="opacity-30" />
                                  {period.time}
                                </div>
                              </div>
                            </div>

                            <div className={`p-3 rounded-2xl ${active ? "bg-white/10 text-white" : "bg-zinc-900/50 border border-white/5 text-rose-400 group-hover:scale-110 transition-transform"}`}>
                               {getSubjectIcon(subject)}
                            </div>
                          </div>

                          {active && (
                            <div className="space-y-3 relative z-10">
                              <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                                <span>Exam Progress</span>
                                <span className="text-rose-400">{Math.round(getProgress(period.time))}%</span>
                              </div>
                              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-[2px] border border-white/5">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${getProgress(period.time)}%` }}
                                  className="h-full bg-rose-500 rounded-full shadow-[0_0_15px_rgba(244,63,94,0.5)]"
                                />
                              </div>
                            </div>
                          )}
                          
                          {active && (
                             <div className="absolute top-4 right-4 animate-pulse">
                                <span className="px-3 py-1 rounded-full bg-rose-500 text-[8px] font-black text-white uppercase tracking-[0.2em]">Live</span>
                             </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={`${activeExam}-empty`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-40 bg-zinc-900/20 rounded-[4rem] border border-dashed border-white/10"
            >
              <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] inline-flex items-center justify-center text-zinc-700 mb-8">
                <Calendar size={40} strokeWidth={1} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {activeExam === "midterm" ? "중간고사" : "기말고사"} 일정이 아직 없습니다
              </h3>
              <p className="text-zinc-500 font-medium">현재 일정을 준비 중입니다. 확정되는 대로 업데이트될 예정입니다.</p>
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
              시험 기간 주의사항
           </h4>
           <p className="text-sm text-zinc-500 leading-relaxed font-medium">
              모든 시험 시작 20분 전까지 지정된 고사실에 입실해 주시기 바랍니다. <br className="hidden lg:block" />
              전자 기기(스마트폰, 스마트워치 등)의 소지는 부정행위로 간주될 수 있으니 반드시 감독 선생님께 제출하세요. 
              수정 테이프, 컴퓨터용 사인펜 등 필요한 필기구를 미리 점검하시기 바랍니다.
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
