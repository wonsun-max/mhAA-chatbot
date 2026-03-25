import { lunchPrayerSchedule } from "@/lib/lunch-prayer";
import { BookOpen, Calendar, Users, Info } from "lucide-react";

export const metadata = {
  title: "점심기도실 일정 - 학교 콜라보",
};

export default function LunchPrayerPage() {
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400/20 to-fuchsia-400/20 flex items-center justify-center border border-purple-500/30">
            <BookOpen className="w-6 h-6 text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">마한아 점심기도실 운영안내</h1>
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 space-y-6 backdrop-blur-md">
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 flex gap-3 text-purple-200">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-purple-400" />
            <div>
              <p className="font-semibold text-purple-100 mb-1">매일 점심시간 기도실이 운영될 예정입니다. 언제든 오셔서 기도하세요.</p>
              <p className="text-sm">장소: 학교 2층 도서관 방향 기도실</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 rounded-xl p-6 border border-white/5 hover:border-purple-500/30 transition-colors">
              <h3 className="text-lg font-bold text-white mb-3 pb-2 border-b border-white/10">화, 목 기도회</h3>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li className="flex gap-2"><span className="text-purple-400">•</span> 모임시간: 12:25 ~ 12:45</li>
                <li className="flex gap-2"><span className="text-purple-400">•</span> 당번 구역: 지정된 QT조 및 신앙부 2명 의무 참석</li>
                <li className="flex gap-2"><span className="text-purple-400">•</span> 예외: 콘서트 콰이어에 참여하는 학생은 필참이 아닙니다</li>
              </ul>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-white/5 hover:border-purple-500/30 transition-colors">
              <h3 className="text-lg font-bold text-white mb-3 pb-2 border-b border-white/10">월, 수, 금 기도</h3>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li className="flex gap-2"><span className="text-purple-400">•</span> 모임시간: 12:20 ~ 12:45</li>
                <li className="flex gap-2"><span className="text-purple-400">•</span> 참여대상: 교사, 학생 모두 자율적 참여 가능</li>
                <li className="flex gap-2"><span className="text-purple-400">•</span> 특징: 별도의 지정된 큐티조 당번 없음</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <Calendar className="w-7 h-7 text-gray-400/80" />
          화/목 당번 일정표 (1학기)
        </h2>
        
        <div className="overflow-x-auto bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-sm uppercase tracking-wider bg-white/5">
                <th className="py-4 px-6 font-medium">날짜</th>
                <th className="py-4 px-6 font-medium">운영 상태</th>
                <th className="py-4 px-6 font-medium">QT 당번조</th>
                <th className="py-4 px-6 font-medium">신앙부 담당</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {lunchPrayerSchedule.map((item, idx) => {
                const isPast = item.date < todayStr;
                const isToday = item.date === todayStr;
                
                return (
                  <tr 
                    key={idx} 
                    className={`
                      transition-colors hover:bg-white/10
                      ${isPast ? 'opacity-40' : ''}
                      ${isToday ? 'bg-purple-500/10 hover:bg-purple-500/20' : ''}
                    `}
                  >
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <span className={`font-medium ${isToday ? 'text-purple-300' : 'text-gray-300'}`}>
                          {item.date}
                        </span>
                        {isToday && <span className="px-2.5 py-0.5 rounded-md text-xs bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">오늘</span>}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {item.type === 'prayer_meeting' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                          정상 운영
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-500/10 text-gray-400 border border-gray-500/20">
                          {item.label}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-gray-300 font-medium">
                      {item.qtGroup ? `${item.qtGroup}조` : '-'}
                    </td>
                    <td className="py-4 px-6 text-gray-400">
                      {item.faithMembers ? (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-purple-400/60" />
                          <span className="font-medium text-purple-100/80">{item.faithMembers.join(', ')}</span>
                        </div>
                      ) : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
