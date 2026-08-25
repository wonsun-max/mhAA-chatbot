const CHOSUNG_LIST = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
];

/**
 * 한글 문자열에서 초성만 추출합니다. (예: "이원선" -> "ㅇㅇㅅ")
 */
export function getHangulChosung(text: string): string {
  return text
    .split('')
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code >= 0xac00 && code <= 0xd7a3) {
        const chosungIndex = Math.floor((code - 0xac00) / 588);
        return CHOSUNG_LIST[chosungIndex];
      }
      return char;
    })
    .join('');
}

/**
 * 문자열이 초성으로만 이루어져 있는지 확인합니다. (예: "ㅇㅇㅅ", "ㅎㅅㅁ")
 */
export function isChosungOnly(text: string): boolean {
  const clean = text.replace(/\s+/g, '');
  if (!clean) return false;
  return clean.split('').every((char) => CHOSUNG_LIST.includes(char));
}

/**
 * 학생 이름 매칭 (1. 전체 이름, 2. 성 제외 이름, 3. 초성 검색, 4. 부분 일치 지원)
 * 예: 
 * - "이원선" 검색: "이원선", "원선", "ㅇㅇㅅ", "ㅇㅅ", "선" 모두 매칭
 * - "하승민" 검색: "하승민", "승민", "ㅎㅅㅁ", "ㅅㅁ", "민" 모두 매칭
 */
export function matchesStudentName(fullName: string, query: string): boolean {
  const q = query.trim().replace(/\s+/g, '');
  const name = fullName.trim().replace(/\s+/g, '');
  if (!q || !name) return false;

  const qLower = q.toLowerCase();
  const nameLower = name.toLowerCase();

  // 1. 전체 이름 또는 부분 검색 (예: "이원선", "원선")
  if (nameLower.includes(qLower)) return true;

  // 2. 성 제외(Given name) 검색 (예: "이원선" -> "원선")
  const givenName = name.length > 1 ? name.slice(1) : name;
  if (givenName.toLowerCase().includes(qLower)) return true;

  // 3. 초성 검색 (예: "ㅇㅇㅅ", "ㅇㅅ", "ㅎㅅㅁ")
  const nameChosung = getHangulChosung(name);
  const givenNameChosung = getHangulChosung(givenName);
  const queryChosung = getHangulChosung(q);

  if (nameChosung.includes(q) || nameChosung.includes(queryChosung)) return true;
  if (givenNameChosung.includes(q) || givenNameChosung.includes(queryChosung)) return true;

  return false;
}
