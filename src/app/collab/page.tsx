import Link from "next/link";
import { Utensils, CalendarDays, Clock } from "lucide-react";

export default function CollabPage() {
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

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mt-12">
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
      </div>
    </div>
  );
}
