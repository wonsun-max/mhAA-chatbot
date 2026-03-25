import Link from "next/link";
import { Utensils, CalendarDays, Clock, Lightbulb, BookOpen, AlertCircle, ChevronRight } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getLunchPrayerByDate } from "@/lib/lunch-prayer";

export default async function CollabPage() {
  const session = await getServerSession(authOptions);
  const qtGroup = session?.user?.qtGroup;
  
  const today = new Date();
  const todayPrayer = getLunchPrayerByDate(today);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-20">
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

      {/* Main Services Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {/* Meals Card */}
        <Link href="/collab/meals" className="group">
          <div className="h-full bg-zinc-900/30 backdrop-blur-sm rounded-[2.5rem] p-8 border border-white/5 hover:border-emerald-500/30 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[50px] rounded-full group-hover:bg-emerald-500/10 transition-colors" />
            
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
              <Utensils className="w-7 h-7 text-emerald-400" />
            </div>
            
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">주간 급식표</h3>
                <p className="text-zinc-500 font-medium text-sm leading-relaxed max-w-[240px]">
                  매일 업데이트되는 맛있는 급식 메뉴를 지금 바로 확인하세요.
                </p>
              </div>
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/20 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-all">
                <ChevronRight size={20} />
              </div>
            </div>
          </div>
        </Link>

        {/* Timetable Card */}
        <Link href="/collab/timetable" className="group">
          <div className="h-full bg-zinc-900/30 backdrop-blur-sm rounded-[2.5rem] p-8 border border-white/5 hover:border-purple-500/30 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-[50px] rounded-full group-hover:bg-purple-500/10 transition-colors" />
            
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
              <Clock className="w-7 h-7 text-purple-400" />
            </div>
            
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">나의 시간표</h3>
                <p className="text-zinc-500 font-medium text-sm leading-relaxed max-w-[240px]">
                  우리 반의 실시간 수업 정보를 확인하고 다음 수업을 준비하세요.
                </p>
              </div>
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/20 group-hover:text-purple-400 group-hover:border-purple-500/30 transition-all">
                <ChevronRight size={20} />
              </div>
            </div>
          </div>
        </Link>

        {/* Calendar Card */}
        <Link href="/collab/calendar" className="group">
          <div className="h-full bg-zinc-900/30 backdrop-blur-sm rounded-[2.5rem] p-8 border border-white/5 hover:border-blue-500/30 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[50px] rounded-full group-hover:bg-blue-500/10 transition-colors" />
            
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
              <CalendarDays className="w-7 h-7 text-blue-400" />
            </div>
            
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">학사 일정</h3>
                <p className="text-zinc-500 font-medium text-sm leading-relaxed max-w-[240px]">
                  시험, 축제, 방학 등 주요 일정을 캘린더로 한눈에 파악하세요.
                </p>
              </div>
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/20 group-hover:text-blue-400 group-hover:border-blue-500/30 transition-all">
                <ChevronRight size={20} />
              </div>
            </div>
          </div>
        </Link>

        {/* Lunch Prayer Widget Card */}
        <Link href="/collab/lunch-prayer" className="group">
          <div className="h-full bg-zinc-900/30 backdrop-blur-sm rounded-[2.5rem] p-8 border border-white/5 hover:border-amber-500/30 transition-all duration-500 relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[50px] rounded-full group-hover:bg-amber-500/10 transition-colors" />
            
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <BookOpen className="w-7 h-7 text-amber-400" />
              </div>
              
              {todayPrayer && (
                <div className="bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-lg">
                  <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Today</span>
                </div>
              )}
            </div>

            <div className="mb-6 flex-grow">
              <h3 className="text-2xl font-bold text-white mb-2">점심기도실 일정</h3>
              <p className="text-zinc-500 font-medium text-sm leading-relaxed">
                매일 낮 12시, 도서관 방향 기도실에서 열리는 따뜻한 기도의 자리.
              </p>
            </div>

            <div className="mt-auto">
              {todayPrayer ? (
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 group-hover:border-amber-500/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">오늘의 당번</span>
                  </div>
                  <div className="mt-2 text-white font-bold">
                    {todayPrayer.type === 'prayer_meeting' ? (
                      <span className="text-lg">{todayPrayer.qtGroup}조 담당</span>
                    ) : (
                      <span className="text-base">{todayPrayer.label}</span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-zinc-600 text-xs font-medium italic">
                  오늘은 예정된 공식 기도 일정이 없습니다.
                </div>
              )}
            </div>
          </div>
        </Link>
      </div>

      {/* Idea Portal Section */}
      <div className="mt-12">
        <a
          href="https://forms.gle/ijQgKpGLvUexQ2tBA"
          target="_blank"
          rel="noopener noreferrer"
          className="group block"
        >
          <div className="bg-zinc-900/30 backdrop-blur-sm rounded-[3rem] p-8 md:p-12 border border-white/5 hover:border-zinc-100/20 transition-all duration-500 relative overflow-hidden">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-zinc-100/5 blur-[100px] rounded-full group-hover:bg-zinc-100/10 transition-colors duration-500" />

            <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
              <div className="w-20 h-20 rounded-3xl bg-zinc-900 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                <Lightbulb className="w-10 h-10 text-zinc-100" />
              </div>

              <div className="flex-grow text-center md:text-left">
                <h3 className="text-3xl font-bold text-white mb-4">아이디어 포털</h3>
                <p className="text-zinc-500 text-lg font-medium leading-relaxed max-w-2xl">
                  여러분의 상상을 현실로. 학교 생활을 더 즐겁게 만들 아이디어를 들려주세요.
                  여러분의 소중한 의견이 학교를 변화시킵니다.
                </p>
              </div>

              <div className="flex-shrink-0 w-full md:w-auto mt-6 md:mt-0">
                <div className="inline-flex items-center justify-center w-full md:w-auto px-10 py-5 rounded-2xl bg-white text-black font-black text-lg transition-all shadow-2xl shadow-white/10 hover:bg-zinc-200 active:scale-95">
                  의견 보내기
                </div>
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
