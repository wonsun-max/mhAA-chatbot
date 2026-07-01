import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const YEAR = 2026;

// ─── Non-academic subjects (Pass/Fail, excluded from GPA) ─────────────────────
// These appear in every grade. credits = weekly periods / 2.
const NON_ACADEMIC_COMMON = [
  { subject: "Chapel",                         credits: 1 }, // Worship Service
  { subject: "Club Activity",                  credits: 1 }, // CA
  { subject: "Self-governing & Volunteer Work", credits: 2 }, // 자율/봉사
];

// ─── Academic subjects per grade ──────────────────────────────────────────────
// credits = weekly periods / 2 (2 periods/wk = 1 credit)
// Subject names match Timetable DB exactly.

type SubjectRow = { subject: string; credits: number };

const ACADEMIC: Record<string, SubjectRow[]> = {
  "7": [
    { subject: "국어",     credits: 4 },
    { subject: "수학",     credits: 4 },
    { subject: "Science",  credits: 4 },
    { subject: "E.P.",     credits: 3 }, // English Practicum
    { subject: "Filipino", credits: 2 },
    { subject: "Lit.",     credits: 3 }, // Literature
    { subject: "한문",     credits: 2 },
    { subject: "Grammar",  credits: 2 },
    { subject: "P.E.",     credits: 2 },
    { subject: "사회",     credits: 2 },
    { subject: "W.History", credits: 2 }, // World History
    { subject: "음악",     credits: 1 },
    { subject: "성경",     credits: 1 },
    { subject: "ENGLISH",  credits: 5 },
  ],
  "8": [
    { subject: "국어",     credits: 4 },
    { subject: "수학",     credits: 4 },
    { subject: "Science",  credits: 4 },
    { subject: "E.P.",     credits: 3 },
    { subject: "Lit.",     credits: 3 },
    { subject: "역사",     credits: 2 },
    { subject: "한문",     credits: 2 },
    { subject: "Filipino", credits: 2 },
    { subject: "P.E.",     credits: 2 },
    { subject: "Grammar",  credits: 2 },
    { subject: "음악",     credits: 1 },
    { subject: "Geo.",     credits: 2 }, // Geography
    { subject: "성경",     credits: 1 },
    { subject: "ENGLISH",  credits: 5 },
  ],
  "9": [
    { subject: "국어",      credits: 4 },
    { subject: "수학",      credits: 4 },
    { subject: "Science",   credits: 4 },
    { subject: "E.P.",      credits: 3 },
    { subject: "Lit.",      credits: 3 },
    { subject: "중국어",    credits: 2 },
    { subject: "Grammar",   credits: 2 },
    { subject: "Sociology", credits: 2 },
    { subject: "역사",      credits: 2 },
    { subject: "P.E.",      credits: 2 },
    { subject: "성경",      credits: 1 },
    { subject: "미술",      credits: 2 },
    { subject: "음악",      credits: 1 },
    { subject: "ENGLISH",   credits: 5 },
  ],
  "10": [
    { subject: "공통 국어",  credits: 4 },
    { subject: "공통 수학",  credits: 4 },
    { subject: "Psychology", credits: 4 },
    { subject: "Biology",    credits: 3 },
    { subject: "W.Lit.",     credits: 3 }, // World Literature
    { subject: "Integ.Math", credits: 2 },
    { subject: "E.P.",       credits: 3 },
    { subject: "Grammar",    credits: 2 },
    { subject: "중국어",     credits: 2 },
    { subject: "성경",       credits: 1 },
    { subject: "ENGLISH",    credits: 5 },
    { subject: "P.E.",       credits: 1 },
    { subject: "음악",       credits: 1 },
    { subject: "미술",       credits: 2 },
  ],
  "11": [
    { subject: "E.P.",        credits: 4 },
    { subject: "대수",        credits: 4 },
    { subject: "Economics",   credits: 3 },
    { subject: "화법과 언어", credits: 4 },
    { subject: "Writing",     credits: 3 },
    { subject: "Chemistry",   credits: 3 },
    { subject: "P.E.",        credits: 2 },
    { subject: "A.Lit.",      credits: 3 }, // Advanced Literature
    { subject: "Integ.Math",  credits: 2 },
    { subject: "미술",        credits: 2 },
    { subject: "성경",        credits: 1 },
    { subject: "음악",        credits: 1 },
    { subject: "ENGLISH",     credits: 5 },
  ],
  // G12-1 and G12-2 share the same academic subjects
  "12-1": [
    { subject: "문학",                    credits: 4 }, // Korean Literature
    { subject: "선택 수학(직무/미적분II)", credits: 4 }, // Calculus / Vocational Math
    { subject: "Physics",                 credits: 4 },
    { subject: "Inter.Studies",           credits: 3 }, // International Studies
    { subject: "E.Lit.",                  credits: 3 }, // English Literature
    { subject: "E.P.",                    credits: 3 }, // English Practicum
    { subject: "ENGLISH",                 credits: 5 },
    { subject: "Rhetoric",                credits: 2 },
    { subject: "Writing",                 credits: 2 },
    { subject: "한국사",                  credits: 2 }, // Korean History
    { subject: "P.E.",                    credits: 2 },
    { subject: "정보",                    credits: 1 }, // Informatics
    { subject: "진로와 직업",              credits: 1 }, // Career Development
    { subject: "성경",                    credits: 1 },
  ],
  "12-2": [
    { subject: "문학",                    credits: 4 },
    { subject: "선택 수학(직무/미적분II)", credits: 4 },
    { subject: "Physics",                 credits: 4 },
    { subject: "Inter.Studies",           credits: 3 },
    { subject: "E.Lit.",                  credits: 3 },
    { subject: "E.P.",                    credits: 3 },
    { subject: "ENGLISH",                 credits: 5 },
    { subject: "Rhetoric",                credits: 2 },
    { subject: "Writing",                 credits: 2 },
    { subject: "한국사",                  credits: 2 },
    { subject: "P.E.",                    credits: 2 },
    { subject: "정보",                    credits: 1 },
    { subject: "진로와 직업",              credits: 1 },
    { subject: "성경",                    credits: 1 },
  ],
};

const ALL_GRADES = ["7", "8", "9", "10", "11", "12-1", "12-2"] as const;
const SEMESTERS = ["1", "2"] as const;

async function main() {
  console.log("Seeding SubjectCredit data...");
  let upserted = 0;

  for (const grade of ALL_GRADES) {
    for (const semester of SEMESTERS) {
      // Academic subjects
      for (const row of ACADEMIC[grade]) {
        await prisma.subjectCredit.upsert({
          where: { grade_subject_semester_year: { grade, subject: row.subject, semester, year: YEAR } },
          update: { credits: row.credits, isAcademic: true },
          create: { grade, subject: row.subject, credits: row.credits, semester, year: YEAR, isAcademic: true },
        });
        upserted++;
      }

      // Non-academic (common)
      for (const row of NON_ACADEMIC_COMMON) {
        await prisma.subjectCredit.upsert({
          where: { grade_subject_semester_year: { grade, subject: row.subject, semester, year: YEAR } },
          update: { credits: row.credits, isAcademic: false },
          create: { grade, subject: row.subject, credits: row.credits, semester, year: YEAR, isAcademic: false },
        });
        upserted++;
      }

    }
  }

  console.log(`Done. Upserted ${upserted} SubjectCredit rows.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
