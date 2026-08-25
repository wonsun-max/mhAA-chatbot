import Link from "next/link";
import { Utensils, CalendarDays, Clock, BookOpen, AlertCircle, ChevronRight, Pencil, Calculator, Clapperboard } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { IdeaPortalBanner } from "@/components/collab/IdeaPortalBanner";

export default async function CollabPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login?callbackUrl=/collab");
  }

  const qtGroup = session?.user?.qtGroup;
  
  return (
    <div className="min-h-screen pt-24 sm:pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12 sm:mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs font-medium mb-6 tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          School Life Hub
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
            학교 생활의 모든 것
          </span>
        </h1>
        <p className="max-w-xl mx-auto text-lg text-zinc-400 font-medium leading-relaxed">
          필요한 정보만 깔끔하게 모았습니다.<br className="hidden sm:block" /> 
          당신의 더 나은 학교 생활을 지원합니다.
        </p>
      </div>

      {/* Warning Notification */}
      {session?.user && !qtGroup && (
        <div className="mb-12 group">
          <div className="bg-zinc-900/40 backdrop-blur-xl border border-red-500/20 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-6 transition-all duration-300 hover:border-red-500/40">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-7 h-7 text-red-400" />
            </div>
            <div className="flex-grow text-center sm:text-left">
              <h3 className="font-bold text-white text-lg">QT 조 설정이 필요합니다</h3>
              <p className="text-sm text-zinc-400 mt-1">본인의 QT 조를 설정하면 점심기도 당번을 정확히 확인할 수 있습니다.</p>
            </div>
            <Link href="/profile" className="px-6 py-3 bg-white text-black hover:bg-zinc-200 rounded-2xl font-bold text-sm transition-all whitespace-nowrap shadow-xl shadow-white/5">
              설정하러 가기
            </Link>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Meal Service Card */}
        <Link href="/collab/meals" className="group">
          <div className="h-full bg-zinc-900/30 backdrop-blur-sm rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-8 border border-white/5 hover:border-amber-500/30 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[50px] rounded-full group-hover:bg-amber-500/10 transition-colors" />
            
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
              <Utensils className="w-7 h-7 text-amber-400" />
            </div>
            
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">오늘의 급식</h3>
                <p className="text-zinc-500 font-medium text-sm leading-relaxed max-w-xs sm:max-w-[240px]">
                  주간 식단표와 오늘의 점심 메뉴를 실시간으로 확인하세요.
                </p>
              </div>
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/20 group-hover:text-amber-400 group-hover:border-amber-500/30 transition-all">
                <ChevronRight size={20} />
              </div>
            </div>
          </div>
        </Link>

        {/* Academic Calendar Card */}
        <Link href="/collab/calendar" className="group">
          <div className="h-full bg-zinc-900/30 backdrop-blur-sm rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-8 border border-white/5 hover:border-blue-500/30 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[50px] rounded-full group-hover:bg-blue-500/10 transition-colors" />
            
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
              <CalendarDays className="w-7 h-7 text-blue-400" />
            </div>
            
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">학사일정</h3>
                <p className="text-zinc-500 font-medium text-sm leading-relaxed max-w-xs sm:max-w-[240px]">
                  월별 주요 학사일정과 학교 행사를 한눈에 파악하세요.
                </p>
              </div>
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/20 group-hover:text-blue-400 group-hover:border-blue-500/30 transition-all">
                <ChevronRight size={20} />
              </div>
            </div>
          </div>
        </Link>

        {/* Timetable Card */}
        <Link href="/collab/timetable" className="group">
          <div className="h-full bg-zinc-900/30 backdrop-blur-sm rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-8 border border-white/5 hover:border-purple-500/30 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-[50px] rounded-full group-hover:bg-purple-500/10 transition-colors" />
            
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
              <Clock className="w-7 h-7 text-purple-400" />
            </div>
            
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">시간표</h3>
                <p className="text-zinc-500 font-medium text-sm leading-relaxed max-w-xs sm:max-w-[240px]">
                  학년별 주간 수업 시간표를 쉽고 빠르게 확인하세요.
                </p>
              </div>
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/20 group-hover:text-purple-400 group-hover:border-purple-500/30 transition-all">
                <ChevronRight size={20} />
              </div>
            </div>
          </div>
        </Link>

        {/* Lunch Prayer Card */}
        <Link href="/collab/lunch-prayer" className="group">
          <div className="h-full bg-zinc-900/30 backdrop-blur-sm rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-8 border border-white/5 hover:border-pink-500/30 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 blur-[50px] rounded-full group-hover:bg-pink-500/10 transition-colors" />
            
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
              <BookOpen className="w-7 h-7 text-pink-400" />
            </div>
            
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">점심 기도실</h3>
                <p className="text-zinc-500 font-medium text-sm leading-relaxed max-w-xs sm:max-w-[240px]">
                  오늘의 점심기도 당번 조를 확인하고 순서를 놓치지 마세요.
                </p>
              </div>
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/20 group-hover:text-pink-400 group-hover:border-pink-500/30 transition-all">
                <ChevronRight size={20} />
              </div>
            </div>
          </div>
        </Link>

        {/* Exam Schedule Card */}
        <Link href="/collab/exams" className="group">
          <div className="h-full bg-zinc-900/30 backdrop-blur-sm rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-8 border border-white/5 hover:border-rose-500/30 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-[50px] rounded-full group-hover:bg-rose-500/10 transition-colors" />
            
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
              <Pencil className="w-7 h-7 text-rose-400" />
            </div>
            
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">시험 일정</h3>
                <p className="text-zinc-500 font-medium text-sm leading-relaxed max-w-xs sm:max-w-[240px]">
                  중간/기말고사 시간표를 확인하고 시험 기간을 완벽하게 대비하세요.
                </p>
              </div>
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/20 group-hover:text-rose-400 group-hover:border-rose-500/30 transition-all">
                <ChevronRight size={20} />
              </div>
            </div>
          </div>
        </Link>

        {/* GPA Calculator Card */}
        <Link href="/collab/gpa" className="group">
          <div className="h-full bg-zinc-900/30 backdrop-blur-sm rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-8 border border-white/5 hover:border-emerald-500/30 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[50px] rounded-full group-hover:bg-emerald-500/10 transition-colors" />
            
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
              <Calculator className="w-7 h-7 text-emerald-400" />
            </div>
            
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">학점 계산기</h3>
                <p className="text-zinc-500 font-medium text-sm leading-relaxed max-w-xs sm:max-w-[240px]">
                  성적을 입력하고 4.5 만점 기준의 나의 평균 학점을 실시간으로 확인하세요.
                </p>
              </div>
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/20 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-all">
                <ChevronRight size={20} />
              </div>
            </div>
          </div>
        </Link>

        {/* Broadcast VOD Card */}
        <Link href="/collab/vod" className="group">
          <div className="h-full bg-zinc-900/30 backdrop-blur-sm rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-8 border border-white/5 hover:border-red-500/30 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-[50px] rounded-full group-hover:bg-red-500/10 transition-colors" />

            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
              <Clapperboard className="w-7 h-7 text-red-400" />
            </div>

            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">VOD</h3>
                <p className="text-zinc-500 font-medium text-sm leading-relaxed max-w-xs sm:max-w-[240px]">
                  학교 공식 채널의 채플·행사 영상 다시보기.
                </p>
              </div>
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/20 group-hover:text-red-400 group-hover:border-red-500/30 transition-all">
                <ChevronRight size={20} />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Idea Portal Banner (Native 5-Second FeedbackModal Integration) */}
      <IdeaPortalBanner />
    </div>
  );
}
