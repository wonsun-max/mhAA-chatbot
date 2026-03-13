export default function LibraryPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          도서관 검색
        </h1>
        <p className="mt-4 text-gray-400 text-lg">
          학교 도서관의 책을 미리 검색하고 대출 가능 여부를 확인하세요.
        </p>
      </div>

      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 text-center">
        <p className="text-gray-400">도서관 데이터가 아직 등록되지 않았습니다.</p>
      </div>
    </div>
  );
}
