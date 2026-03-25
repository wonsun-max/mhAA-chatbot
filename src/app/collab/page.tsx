import Link from "next/link";
import { Utensils, CalendarDays, Clock, Lightbulb, BookOpen, AlertCircle } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getLunchPrayerByDate } from "@/lib/lunch-prayer";

export default async function CollabPage() {
  const session = await getServerSession(authOptions);
  const qtGroup = session?.user?.qtGroup;
  
  // Use current local time for today
  const today = new Date();
  const todayPrayer = getLunchPrayerByDate(today);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl mb-4">
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
            학교 콜라보
          </span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400">
          학교 생활에 필요한 유용한 정보와 서비스들을 모아두었습니다.
        </p>
      </div>

      {session?.user && !qtGroup && (
        <div className="mb-12">
          <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-red-200">
            <AlertCircle className="w-8 h-8 flex-shrink-0 text-red-400" />
            <div className="flex-grow">
              <p className="font-semibold text-red-100 text-lg">QT 조가 설정되지 않았습니다.</p>
              <p className="text-sm text-red-200/80 mt-1">점심기도 당번 일정을 정확히 확인하기 위해 프로필에서 본인의 QT 조를 설정해주세요.</p>
            </div>
            <Link href="/profile" className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium text-sm transition-colors whitespace-nowrap shadow-lg shadow-red-500/20">
              설정 하러가기
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mt-4">
        <Link href="/collab/meals" className="group">
          <div className="h-full bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-emerald-400/50 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-teal-400/20 to-emerald-400/20 flex items-center justify-center mb-6 border border-emerald-400/20 group-hover:scale-110 transition-transform duration-300">
              <Utensils className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">주간 급식표</h3>
            <p className="text-gray-400 leading-relaxed">
              월요일부터 금요일까지, 매일매일 맛있는 학교 급식 메뉴를 확인하세요.
            </p>
          </div>
        </Link>

        <Link href="/collab/calendar" className="group">
          <div className="h-full bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-blue-400/50 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-400/20 to-indigo-400/20 flex items-center justify-center mb-6 border border-blue-400/20 group-hover:scale-110 transition-transform duration-300">
              <CalendarDays className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">학사 일정</h3>
            <p className="text-gray-400 leading-relaxed">
              중요한 시험 기간, 방학, 행사 등 연간 학사 일정을 캘린더 모양으로 한눈에 파악하세요.
            </p>
          </div>
        </Link>


        <Link href="/collab/timetable" className="group">
          <div className="h-full bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-orange-400/50 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-400/20 to-amber-400/20 flex items-center justify-center mb-6 border border-orange-400/20 group-hover:scale-110 transition-transform duration-300">
              <Clock className="w-8 h-8 text-orange-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">나의 시간표</h3>
            <p className="text-gray-400 leading-relaxed">
              나의 반에 맞는 이번 주 수업 시간표, 선생님, 과목 등을 한눈에 확인하세요.
            </p>
          </div>
        </Link>
        
        <Link href="/collab/lunch-prayer" className="group">
          <div className="h-full flex flex-col bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-purple-400/50 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-400/20 to-fuchsia-400/20 flex items-center justify-center mb-6 border border-purple-400/20 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">점심기도실 일정</h3>
              <p className="text-gray-400 leading-relaxed mb-6">
                점심시간 도서관 방향 기도실에서 진행되는 기도회 당번표를 확인하세요.
              </p>
            </div>
            
            <div className="mt-auto relative z-10">
              {todayPrayer ? (
                <div className="bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 border border-purple-500/30 rounded-xl p-4 shadow-lg shadow-purple-500/10">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                    <p className="text-sm font-semibold text-purple-300">오늘의 점심기도 안내</p>
                  </div>
                  {todayPrayer.type === 'prayer_meeting' ? (
                    <div>
                      <p className="text-white font-bold text-lg mb-1">{todayPrayer.qtGroup}조 담당</p>
                      <p className="text-purple-200 text-sm">신앙부: {todayPrayer.faithMembers?.join(', ')}</p>
                    </div>
                  ) : todayPrayer.type === 'open_prayer' ? (
                    <p className="text-white font-bold text-base leading-tight">{todayPrayer.label}</p>
                  ) : (
                    <p className="text-white font-medium">{todayPrayer.label || '일정 없음'}</p>
                  )}
                </div>
              ) : (
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-gray-400 text-sm">오늘은 예정된 공식 점심기도 일정이 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        </Link>
      </div>

      <div className="mt-16">
        <a
          href="https://forms.gle/ijQgKpGLvUexQ2tBA"
          target="_blank"
          rel="noopener noreferrer"
          className="group block"
        >
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 md:p-10 border border-white/10 hover:border-yellow-400/50 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
            {/* Background Glow Effect */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-yellow-400/5 blur-[80px] rounded-full group-hover:bg-yellow-400/10 transition-colors duration-300" />

            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-400/20 to-orange-400/20 flex items-center justify-center border border-yellow-400/20 group-hover:scale-110 transition-transform duration-300 flex-shrink-0 shadow-lg shadow-yellow-400/10">
                <Lightbulb className="w-10 h-10 text-yellow-400" />
              </div>

              <div className="flex-grow text-center md:text-left">
                <h3 className="text-3xl font-bold text-white mb-3">아이디어 포털</h3>
                <p className="text-gray-400 text-lg leading-relaxed max-w-3xl">
                  학교 생활을 더 즐겁고 편리하게 만들 특별한 아이디어가 있으신가요?
                  작은 제안부터 대규모 프로젝트 아이디어까지, 여러분의 소중한 의견을 들려주세요.
                </p>
              </div>

              <div className="flex-shrink-0 w-full md:w-auto mt-4 md:mt-0">
                <div className="inline-flex items-center justify-center w-full md:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-950 font-bold text-lg group-hover:from-yellow-300 group-hover:to-orange-300 transition-all duration-300 shadow-xl shadow-yellow-400/20">
                  의견 제출하기
                </div>
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
