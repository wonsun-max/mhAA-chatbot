import React from "react";

// 임시 모의 데이터 (사진에 있는 데이터 기준)
const mockEvents = [
  { id: "1", name: "3.1절", startDate: "2026-03-01", endDate: "2026-03-01", eventType: "Holiday" },
  { id: "2", name: "입학식 및 시업식", startDate: "2026-03-02", endDate: "2026-03-02", eventType: "Events" },
  { id: "3", name: "(H)동아리1 조직 / 신앙수련회", startDate: "2026-03-06", endDate: "2026-03-06", eventType: "Events" },
  { id: "4", name: "(H)C.I. 및 학급운영계획서 제출", startDate: "2026-03-13", endDate: "2026-03-13", eventType: "Events" },
  { id: "5", name: "(H)환경미화심사", startDate: "2026-03-19", endDate: "2026-03-19", eventType: "Events" },
];

export default function CalendarPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          학사 일정
        </h1>
        <p className="mt-4 text-gray-400 text-lg">
          중요한 행사와 시험 등 학교 일정을 확인하세요.
        </p>
      </div>

      <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="text-xs uppercase bg-white/10 text-gray-200">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Name</th>
                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Start_Date</th>
                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">End_Date</th>
                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Event_Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {mockEvents.map((event) => (
                <tr key={event.id} className="hover:bg-white/5 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-white font-medium">
                    {event.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                    {event.startDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                    {event.endDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        event.eventType === 'Holiday' ? 'bg-red-400/10 text-red-400 border border-red-400/20' : 'bg-blue-400/10 text-blue-400 border border-blue-400/20'
                      }`}
                    >
                      {event.eventType}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
