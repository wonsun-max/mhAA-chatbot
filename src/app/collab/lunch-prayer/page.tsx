import { lunchPrayerSchedule, getLunchPrayerByDate } from "@/lib/lunch-prayer";
import { BookOpen, Calendar, Users, Info, Star } from "lucide-react";

export const metadata = {
  title: "점심기도실 일정 - 학교 콜라보",
};

export default function LunchPrayerPage() {
  const currentDate = new Date();
  const yyyy = currentDate.getFullYear();
  const mm = String(currentDate.getMonth() + 1).padStart(2, '0');
  const dd = String(currentDate.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;

  const todayPrayer = getLunchPrayerByDate(currentDate);

  // Filter out past schedules (keep only today and future)
  const upcomingSchedules = lunchPrayerSchedule.filter(item => item.date >= todayStr);

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

      {/* 오늘의 일정 강조 섹션 */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <Star className="w-7 h-7 text-yellow-400 fill-yellow-400/20" />
          오늘의 점심기도 안내 ({todayStr})
        </h2>
        
        <div className="bg-gradient-to-r from-purple-900/40 to-fuchsia-900/40 border border-purple-500/30 rounded-2xl p-8 backdrop-blur-md shadow-2xl shadow-purple-500/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full mix-blend-screen" />
          
          <div className="relative z-10">
            {todayPrayer ? (
              todayPrayer.type === 'prayer_meeting' && 'qtGroup' in todayPrayer ? (
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div>
                    <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-sm font-bold mb-3">
                      화/목 정규 기도회
                    </span>
                    <h3 className="text-4xl sm:text-5xl font-extrabold text-white mb-2">
                       {todayPrayer.qtGroup}조 담당
                    </h3>
                    <div className="flex items-center gap-2 text-purple-200 mt-4">
                      <Users className="w-5 h-5 text-purple-400" />
                      <span className="text-lg font-medium">신앙부: {todayPrayer.faithMembers?.join(', ')}</span>
                    </div>
                  </div>
                  <div className="text-left md:text-right bg-black/20 p-4 rounded-xl border border-white/5">
                    <p className="text-gray-400 text-sm mb-1">모임 시간</p>
                    <p className="text-2xl font-bold text-white">12:25 - 12:45</p>
                  </div>
                </div>
              ) : todayPrayer.type === 'open_prayer' ? (
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div>
                    <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-sm font-bold mb-3">
                      월/수/금 자유 기도
                    </span>
                    <h3 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                       {todayPrayer.label}
                    </h3>
                    <p className="text-purple-200 mt-2">지정된 큐티조 당번 없이 누구나 자유롭게 참여할 수 있습니다.</p>
                  </div>
                  <div className="text-left md:text-right bg-black/20 p-4 rounded-xl border border-white/5">
                    <p className="text-gray-400 text-sm mb-1">모임 시간</p>
                    <p className="text-2xl font-bold text-white">12:20 - 12:45</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <span className="inline-block px-4 py-2 bg-gray-500/20 text-gray-300 border border-gray-500/30 rounded-full text-sm font-bold mb-4">
                    {('label' in todayPrayer) ? todayPrayer.label : ''}
                  </span>
                  <h3 className="text-2xl font-bold text-white">오늘은 공식 점심기도 모임이 없습니다.</h3>
                </div>
              )
            ) : (
              <div className="text-center py-6">
                 <h3 className="text-2xl font-bold text-gray-300">주말이거나 예정된 공식 일정이 없습니다.</h3>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 향후 일정표 */}
      {upcomingSchedules.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Calendar className="w-7 h-7 text-gray-400/80" />
            다음에 예정된 당번 일정 (화/목)
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
                {upcomingSchedules.map((item, idx) => {
                  const isToday = item.date === todayStr;
                  
                  return (
                    <tr 
                      key={idx} 
                      className={`
                        transition-colors hover:bg-white/10
                        ${isToday ? 'bg-purple-500/10 border-l-4 border-l-purple-500' : 'border-l-4 border-l-transparent'}
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
      )}
    </div>
  );
}
