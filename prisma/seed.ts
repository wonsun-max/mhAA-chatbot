import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const YEAR = 2026;

// Subject credits per grade per semester
// credits = periods per week (단위수)
// Practical English is 5 for all grades
const SUBJECT_CREDITS: Array<{
  grade: string;
  subject: string;
  credits: number;
  semester: "1" | "2";
}> = [
  // ─── G7 ───────────────────────────────────────────
  { grade: "7", subject: "국어과", credits: 4, semester: "1" },
  { grade: "7", subject: "수학과", credits: 4, semester: "1" },
  { grade: "7", subject: "Science", credits: 3, semester: "1" },
  { grade: "7", subject: "Social Studies", credits: 3, semester: "1" },
  { grade: "7", subject: "Literature", credits: 3, semester: "1" },
  { grade: "7", subject: "Grammar", credits: 2, semester: "1" },
  { grade: "7", subject: "Practical English (실용영어)", credits: 5, semester: "1" },
  { grade: "7", subject: "Filipino", credits: 2, semester: "1" },
  { grade: "7", subject: "한문", credits: 2, semester: "1" },
  { grade: "7", subject: "사회", credits: 2, semester: "1" },
  { grade: "7", subject: "성경 (Bible)", credits: 2, semester: "1" },
  { grade: "7", subject: "음악 (Music)", credits: 2, semester: "1" },
  { grade: "7", subject: "Physical Education (체육)", credits: 3, semester: "1" },
  { grade: "7", subject: "E.P.", credits: 1, semester: "1" },

  { grade: "7", subject: "국어과", credits: 4, semester: "2" },
  { grade: "7", subject: "수학과", credits: 4, semester: "2" },
  { grade: "7", subject: "Science", credits: 3, semester: "2" },
  { grade: "7", subject: "Social Studies", credits: 3, semester: "2" },
  { grade: "7", subject: "Literature", credits: 3, semester: "2" },
  { grade: "7", subject: "Grammar", credits: 2, semester: "2" },
  { grade: "7", subject: "Practical English (실용영어)", credits: 5, semester: "2" },
  { grade: "7", subject: "Filipino", credits: 2, semester: "2" },
  { grade: "7", subject: "한문", credits: 2, semester: "2" },
  { grade: "7", subject: "사회", credits: 2, semester: "2" },
  { grade: "7", subject: "성경 (Bible)", credits: 2, semester: "2" },
  { grade: "7", subject: "음악 (Music)", credits: 2, semester: "2" },
  { grade: "7", subject: "Physical Education (체육)", credits: 3, semester: "2" },
  { grade: "7", subject: "E.P.", credits: 1, semester: "2" },

  // ─── G8 ───────────────────────────────────────────
  { grade: "8", subject: "국어과", credits: 4, semester: "1" },
  { grade: "8", subject: "수학과", credits: 4, semester: "1" },
  { grade: "8", subject: "Science", credits: 3, semester: "1" },
  { grade: "8", subject: "Social Studies", credits: 3, semester: "1" },
  { grade: "8", subject: "Literature", credits: 3, semester: "1" },
  { grade: "8", subject: "Grammar", credits: 2, semester: "1" },
  { grade: "8", subject: "Practical English (실용영어)", credits: 5, semester: "1" },
  { grade: "8", subject: "Filipino", credits: 2, semester: "1" },
  { grade: "8", subject: "한문", credits: 2, semester: "1" },
  { grade: "8", subject: "역사과", credits: 3, semester: "1" },
  { grade: "8", subject: "성경 (Bible)", credits: 2, semester: "1" },
  { grade: "8", subject: "음악 (Music)", credits: 2, semester: "1" },
  { grade: "8", subject: "Physical Education (체육)", credits: 3, semester: "1" },
  { grade: "8", subject: "E.P.", credits: 1, semester: "1" },

  { grade: "8", subject: "국어과", credits: 4, semester: "2" },
  { grade: "8", subject: "수학과", credits: 4, semester: "2" },
  { grade: "8", subject: "Science", credits: 3, semester: "2" },
  { grade: "8", subject: "Social Studies", credits: 3, semester: "2" },
  { grade: "8", subject: "Literature", credits: 3, semester: "2" },
  { grade: "8", subject: "Grammar", credits: 2, semester: "2" },
  { grade: "8", subject: "Practical English (실용영어)", credits: 5, semester: "2" },
  { grade: "8", subject: "Filipino", credits: 2, semester: "2" },
  { grade: "8", subject: "한문", credits: 2, semester: "2" },
  { grade: "8", subject: "역사과", credits: 3, semester: "2" },
  { grade: "8", subject: "성경 (Bible)", credits: 2, semester: "2" },
  { grade: "8", subject: "음악 (Music)", credits: 2, semester: "2" },
  { grade: "8", subject: "Physical Education (체육)", credits: 3, semester: "2" },
  { grade: "8", subject: "E.P.", credits: 1, semester: "2" },

  // ─── G9 ───────────────────────────────────────────
  { grade: "9", subject: "국어과", credits: 4, semester: "1" },
  { grade: "9", subject: "수학과", credits: 4, semester: "1" },
  { grade: "9", subject: "Science", credits: 3, semester: "1" },
  { grade: "9", subject: "Social Studies", credits: 3, semester: "1" },
  { grade: "9", subject: "Literature", credits: 3, semester: "1" },
  { grade: "9", subject: "Grammar", credits: 2, semester: "1" },
  { grade: "9", subject: "Practical English (실용영어)", credits: 5, semester: "1" },
  { grade: "9", subject: "Chinese", credits: 2, semester: "1" },
  { grade: "9", subject: "역사과", credits: 3, semester: "1" },
  { grade: "9", subject: "미술", credits: 2, semester: "1" },
  { grade: "9", subject: "성경 (Bible)", credits: 2, semester: "1" },
  { grade: "9", subject: "음악 (Music)", credits: 2, semester: "1" },
  { grade: "9", subject: "Physical Education (체육)", credits: 3, semester: "1" },
  { grade: "9", subject: "E.P.", credits: 1, semester: "1" },

  { grade: "9", subject: "국어과", credits: 4, semester: "2" },
  { grade: "9", subject: "수학과", credits: 4, semester: "2" },
  { grade: "9", subject: "Science", credits: 3, semester: "2" },
  { grade: "9", subject: "Social Studies", credits: 3, semester: "2" },
  { grade: "9", subject: "Literature", credits: 3, semester: "2" },
  { grade: "9", subject: "Grammar", credits: 2, semester: "2" },
  { grade: "9", subject: "Practical English (실용영어)", credits: 5, semester: "2" },
  { grade: "9", subject: "Chinese", credits: 2, semester: "2" },
  { grade: "9", subject: "역사과", credits: 3, semester: "2" },
  { grade: "9", subject: "미술", credits: 2, semester: "2" },
  { grade: "9", subject: "성경 (Bible)", credits: 2, semester: "2" },
  { grade: "9", subject: "음악 (Music)", credits: 2, semester: "2" },
  { grade: "9", subject: "Physical Education (체육)", credits: 3, semester: "2" },
  { grade: "9", subject: "E.P.", credits: 1, semester: "2" },

  // ─── G10 ──────────────────────────────────────────
  { grade: "10", subject: "국어과", credits: 4, semester: "1" },
  { grade: "10", subject: "수학과", credits: 4, semester: "1" },
  { grade: "10", subject: "Science", credits: 3, semester: "1" },
  { grade: "10", subject: "Social Studies", credits: 3, semester: "1" },
  { grade: "10", subject: "Literature", credits: 3, semester: "1" },
  { grade: "10", subject: "Grammar", credits: 2, semester: "1" },
  { grade: "10", subject: "Practical English (실용영어)", credits: 5, semester: "1" },
  { grade: "10", subject: "Chinese", credits: 2, semester: "1" },
  { grade: "10", subject: "Inter. Math", credits: 4, semester: "1" },
  { grade: "10", subject: "미술", credits: 2, semester: "1" },
  { grade: "10", subject: "성경 (Bible)", credits: 2, semester: "1" },
  { grade: "10", subject: "음악 (Music)", credits: 2, semester: "1" },
  { grade: "10", subject: "Physical Education (체육)", credits: 3, semester: "1" },
  { grade: "10", subject: "E.P.", credits: 1, semester: "1" },

  { grade: "10", subject: "국어과", credits: 4, semester: "2" },
  { grade: "10", subject: "수학과", credits: 4, semester: "2" },
  { grade: "10", subject: "Science", credits: 3, semester: "2" },
  { grade: "10", subject: "Social Studies", credits: 3, semester: "2" },
  { grade: "10", subject: "Literature", credits: 3, semester: "2" },
  { grade: "10", subject: "Grammar", credits: 2, semester: "2" },
  { grade: "10", subject: "Practical English (실용영어)", credits: 5, semester: "2" },
  { grade: "10", subject: "Chinese", credits: 2, semester: "2" },
  { grade: "10", subject: "Inter. Math", credits: 4, semester: "2" },
  { grade: "10", subject: "미술", credits: 2, semester: "2" },
  { grade: "10", subject: "성경 (Bible)", credits: 2, semester: "2" },
  { grade: "10", subject: "음악 (Music)", credits: 2, semester: "2" },
  { grade: "10", subject: "Physical Education (체육)", credits: 3, semester: "2" },
  { grade: "10", subject: "E.P.", credits: 1, semester: "2" },

  // ─── G11 ──────────────────────────────────────────
  { grade: "11", subject: "국어과", credits: 4, semester: "1" },
  { grade: "11", subject: "수학과", credits: 4, semester: "1" },
  { grade: "11", subject: "Science", credits: 3, semester: "1" },
  { grade: "11", subject: "Social Studies", credits: 3, semester: "1" },
  { grade: "11", subject: "Literature", credits: 3, semester: "1" },
  { grade: "11", subject: "Writing", credits: 2, semester: "1" },
  { grade: "11", subject: "Practical English (실용영어)", credits: 5, semester: "1" },
  { grade: "11", subject: "Inter. Math", credits: 4, semester: "1" },
  { grade: "11", subject: "미술", credits: 2, semester: "1" },
  { grade: "11", subject: "성경 (Bible)", credits: 2, semester: "1" },
  { grade: "11", subject: "음악 (Music)", credits: 2, semester: "1" },
  { grade: "11", subject: "Physical Education (체육)", credits: 3, semester: "1" },
  { grade: "11", subject: "E.P.", credits: 1, semester: "1" },

  { grade: "11", subject: "국어과", credits: 4, semester: "2" },
  { grade: "11", subject: "수학과", credits: 4, semester: "2" },
  { grade: "11", subject: "Science", credits: 3, semester: "2" },
  { grade: "11", subject: "Social Studies", credits: 3, semester: "2" },
  { grade: "11", subject: "Literature", credits: 3, semester: "2" },
  { grade: "11", subject: "Writing", credits: 2, semester: "2" },
  { grade: "11", subject: "Practical English (실용영어)", credits: 5, semester: "2" },
  { grade: "11", subject: "Inter. Math", credits: 4, semester: "2" },
  { grade: "11", subject: "미술", credits: 2, semester: "2" },
  { grade: "11", subject: "성경 (Bible)", credits: 2, semester: "2" },
  { grade: "11", subject: "음악 (Music)", credits: 2, semester: "2" },
  { grade: "11", subject: "Physical Education (체육)", credits: 3, semester: "2" },
  { grade: "11", subject: "E.P.", credits: 1, semester: "2" },

  // ─── G12-1 & G12-2 (same subjects, credits based on Timetable weekly periods) ──
  // Weekly periods → credits: divide by 2 (2 periods = 1 credit)
  // 문학:8→4, 선택수학:8→4, E.P.:6→3, Inter.Studies:6→3, E.Lit.:6→3
  // 한국사:4→2, Rhetoric:4→2, P.E.:4→2, Writing:4→2, 정보:2→1, 성경:2→1
  ...["12-1", "12-2"].flatMap((grade) =>
    (["1", "2"] as const).flatMap((semester) => [
      { grade, subject: "문학",                      credits: 4, semester },
      { grade, subject: "선택 수학(직무/미적분II)",    credits: 4, semester },
      { grade, subject: "E.P.",                      credits: 3, semester },
      { grade, subject: "Inter.Studies",             credits: 3, semester },
      { grade, subject: "E.Lit.",                    credits: 3, semester },
      { grade, subject: "한국사",                    credits: 2, semester },
      { grade, subject: "Rhetoric",                  credits: 2, semester },
      { grade, subject: "P.E.",                      credits: 2, semester },
      { grade, subject: "Writing",                   credits: 2, semester },
      { grade, subject: "정보",                      credits: 1, semester },
      { grade, subject: "성경",                      credits: 1, semester },
    ])
  ),
];

async function main() {
  console.log("Seeding SubjectCredit data...");

  let upserted = 0;
  for (const row of SUBJECT_CREDITS) {
    await prisma.subjectCredit.upsert({
      where: {
        grade_subject_semester_year: {
          grade: row.grade,
          subject: row.subject,
          semester: row.semester,
          year: YEAR,
        },
      },
      update: { credits: row.credits },
      create: {
        grade: row.grade,
        subject: row.subject,
        credits: row.credits,
        semester: row.semester,
        year: YEAR,
      },
    });
    upserted++;
  }

  console.log(`Done. Upserted ${upserted} SubjectCredit rows.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
