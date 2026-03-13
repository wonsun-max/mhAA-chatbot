"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

// 임시 모의 데이터 (DB 연결 전 테스트용)
const mockTimetable = [
  { id: "1", grade: "12-2", dayOfWeek: "TUE", period: "8", time: "15:40-16:25", subject: "ENGLISH", teacher: "-" },
  { id: "2", grade: "12-2", dayOfWeek: "WED", period: "0-1", time: "08:00-09:15", subject: "Worship Service", teacher: "-" },
  { id: "3", grade: "12-2", dayOfWeek: "WED", period: "2", time: "09:25-10:10", subject: "E.P.", teacher: "Fermin" },
  { id: "4", grade: "12-2", dayOfWeek: "WED", period: "3", time: "10:20-11:05", subject: "선택 수학(직무/미적분II)", teacher: "임종현/김연수" },
  { id: "5", grade: "11-1", dayOfWeek: "MON", period: "1", time: "08:30-09:15", subject: "국어", teacher: "김국어" },
];

export default function TimetablePage() {
  const { data: session } = useSession();
  const [userGrade, setUserGrade] = useState<string | null>(null);

  useEffect(() => {
    // 세션에서 사용자의 grade 정보 가져오기
    if (session?.user && (session.user as any).grade) {
      setUserGrade((session.user as any).grade);
    }
  }, [session]);

  // 사용자의 학년에 맞는 시간표만 필터링 (학년 정보가 없으면 전체 표시 또는 안내 메시지)
  const displayTimetable = userGrade 
    ? mockTimetable.filter(item => item.grade === userGrade)
    : mockTimetable;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          나의 시간표
        </h1>
        <p className="mt-4 text-gray-400 text-lg">
          {userGrade 
            ? `${userGrade} 학급의 주간 시간표입니다.` 
            : "로그인하여 내 학급의 시간표를 확인하세요."}
        </p>
      </div>

      <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="text-xs uppercase bg-white/10 text-gray-200">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Grade</th>
                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Day of week</th>
                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Period</th>
                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Time</th>
                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Subject</th>
                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Teacher</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {displayTimetable.length > 0 ? (
                displayTimetable.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-purple-400 font-medium">
                      {item.grade}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-emerald-400 font-medium tracking-wide">
                      {item.dayOfWeek}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300 font-semibold bg-white/5">
                      {item.period}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-400 font-mono text-xs">
                      {item.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-white font-medium">
                      {item.subject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                      {item.teacher}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    {userGrade ? `등록된 ${userGrade} 학급의 시간표가 없습니다.` : "데이터가 없습니다."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
