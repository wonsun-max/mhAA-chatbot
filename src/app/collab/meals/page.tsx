import React from "react";

// 임시 모의 데이터 (나중에 DB에서 불러올 예정)
const mockMeals = [
  { id: "1", date: "2026-03-09", dayOfWeek: "월요일", menu: "현미밥, 부대찌개, 계란말이, 깍두기" },
  { id: "2", date: "2026-03-10", dayOfWeek: "화요일", menu: "어묵국, 닭강정, 판싯, 샐러드, 배추김치" },
  { id: "3", date: "2026-03-11", dayOfWeek: "수요일", menu: "삼계탕, 녹두찹쌀밥, 부추겉절이, 깍두기" },
  { id: "4", date: "2026-03-12", dayOfWeek: "목요일", menu: "육개장, 돼지불백, 가지무침, 백김치" },
  { id: "5", date: "2026-03-13", dayOfWeek: "금요일", menu: "부추계란국, 마파두부, 야채고로케, 김치" },
];

export default function MealsPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          주간 급식표
        </h1>
        <p className="mt-4 text-gray-400 text-lg">
          이번 주 우리 학교 급식 메뉴를 확인하세요.
        </p>
      </div>

      <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="text-xs uppercase bg-white/10 text-gray-200">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Date</th>
                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Day of Week</th>
                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Menu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {mockMeals.map((meal) => (
                <tr key={meal.id} className="hover:bg-white/5 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-emerald-400 font-medium tracking-wide">
                    {meal.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                    {meal.dayOfWeek}
                  </td>
                  <td className="px-6 py-4 text-white leading-relaxed">
                    {meal.menu}
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
