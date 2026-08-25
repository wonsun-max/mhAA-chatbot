import { z } from "zod";
import { tool, zodSchema } from "ai";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { getAcademicSemester, getAcademicYear } from "@/lib/academic-calendar";
import { matchesExamGrade } from "@/lib/exam-grade";
import { searchKnowledge } from "@/lib/ai/knowledge";
import { matchesStudentName } from "@/lib/hangul-search";

/**
 * Normalizes a date string to YYYY-MM-DD format.
 */
function normalizeDate(dateStr?: string): string | undefined {
    if (!dateStr) return undefined;
    return dateStr.split('T')[0];
}

/**
 * Normalizes a subject name for fuzzy matching (lowercase, no special chars).
 */
function normalizeSubject(s?: string): string {
    if (!s) return "";
    return s.toLowerCase().replace(/[^a-zA-Z0-9가-힣]/g, "");
}

/**
 * Maps free-form exam type input (FINAL, finals, 기말, mid-term, ...) to the
 * stored enum values so a slightly-off model argument never breaks the query.
 */
function normalizeExamType(input?: string): "MIDTERM" | "FINALS" | undefined {
    if (!input) return undefined;
    const v = input.toLowerCase();
    if (v.includes("mid") || v.includes("중간")) return "MIDTERM";
    if (v.includes("fin") || v.includes("기말")) return "FINALS";
    return undefined;
}

/**
 * Converts stored exam dates ("7/2" or "2026-07-02") to ISO YYYY-MM-DD
 * so the model can compare them against today's date reliably.
 */
function toIsoDate(year: number, date: string): string | null {
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
    const md = date.match(/^(\d{1,2})\s*[/.]\s*(\d{1,2})$/);
    if (!md) return null;
    return `${year}-${md[1].padStart(2, "0")}-${md[2].padStart(2, "0")}`;
}

/**
 * Retrieval tools for the WITHUS AI Assistant.
 * 100% Database-driven via Prisma / PostgreSQL with Hangul Chosung and substring search.
 */
export const aiTools = {
    getEvents: tool({
        description: "Fetch school events, exams, vacations, and holidays. Use YYYY-MM-DD format for dates.",
        inputSchema: zodSchema(z.object({
            startDate: z.string().optional().describe("Start date in YYYY-MM-DD format"),
            endDate: z.string().optional().describe("End date in YYYY-MM-DD format"),
            type: z.enum(["Exam", "Vacation", "Events", "Holiday"]).optional(),
        })),
        execute: async ({ startDate, endDate, type }) => {
            const start = normalizeDate(startDate);
            const end = normalizeDate(endDate);
            
            const where: Prisma.SchoolCalendarWhereInput = {};
            if (start && end) {
                where.OR = [
                    {
                        AND: [
                            { startDate: { lte: end } },
                            { endDate: { gte: start } }
                        ]
                    }
                ];
            } else if (start) {
                where.endDate = { gte: start };
            } else if (end) {
                where.startDate = { lte: end };
            }

            if (type) where.eventType = type;

            return await prisma.schoolCalendar.findMany({
                where,
                orderBy: { startDate: 'asc' }
            });
        },
    }),
    getMeals: tool({
        description: "Fetch school meal menus (breakfast, lunch, dinner). Use YYYY-MM-DD format for dates.",
        inputSchema: zodSchema(z.object({
            date: z.string().optional().describe("Specific date in YYYY-MM-DD format"),
            startDate: z.string().optional().describe("Start date for range in YYYY-MM-DD format"),
            endDate: z.string().optional().describe("End date for range in YYYY-MM-DD format"),
        })),
        execute: async ({ date, startDate, endDate }) => {
            const d = normalizeDate(date);
            const start = normalizeDate(startDate);
            const end = normalizeDate(endDate);

            const where: Prisma.SchoolMealWhereInput = {};
            if (d) {
                where.date = d;
            } else if (start && end) {
                where.date = { gte: start, lte: end };
            } else if (start) {
                where.date = { gte: start };
            }

            return await prisma.schoolMeal.findMany({
                where,
                orderBy: { date: 'asc' }
            });
        },
    }),
    getSchedules: tool({
        description: "Fetch class schedules. You can filter by grade (e.g., 7, 8, 12-1), day of week, teacher, or subject.",
        inputSchema: zodSchema(z.object({
            grade: z.string().optional().describe("Grade/Class, e.g., '7', '8', '12-1', '12-2'"),
            dayOfWeek: z.string().optional().describe("Day of week in Korean (월요일) or English (Monday/Mon)"),
            teacher: z.string().optional(),
            subject: z.string().optional(),
        })),
        execute: async ({ grade, dayOfWeek, teacher, subject }) => {
            const where: Prisma.TimetableWhereInput = {};
            if (grade) where.grade = grade;

            if (dayOfWeek) {
                const dayMap: Record<string, string> = {
                    "월요일": "MON", "화요일": "TUE", "수요일": "WED", "목요일": "THU", "금요일": "FRI", "토요일": "SAT", "일요일": "SUN",
                    "월": "MON", "화": "TUE", "수": "WED", "목": "THU", "금": "FRI", "토": "SAT", "일": "SUN",
                    "MONDAY": "MON", "TUESDAY": "TUE", "WEDNESDAY": "WED", "THURSDAY": "THU", "FRIDAY": "FRI", "SATURDAY": "SAT", "SUNDAY": "SUN",
                    "MON": "MON", "TUE": "TUE", "WED": "WED", "THU": "THU", "FRI": "FRI", "SAT": "SAT", "SUN": "SUN"
                };
                const upperDay = dayOfWeek.toUpperCase();
                const normalizedDay = dayMap[upperDay] || dayMap[dayOfWeek] || (upperDay.length > 3 ? upperDay.substring(0, 3) : upperDay);
                where.dayOfWeek = normalizedDay;
            }

            if (teacher) where.teacher = { contains: teacher, mode: 'insensitive' };
            
            // Fetch records for base filtering
            let records = await prisma.timetable.findMany({
                where,
                orderBy: [
                    { period: 'asc' }
                ]
            });

            // If subject is provided, perform fuzzy matching
            if (subject) {
                const querySub = normalizeSubject(subject);
                records = records.filter(r => {
                    const dbSub = normalizeSubject(r.subject);
                    // Match if query is inside db name or vice versa (fuzzy)
                    return dbSub.includes(querySub) || querySub.includes(dbSub);
                });
            }

            return records;
        },
    }),
    getExamSchedules: tool({
        description: "Fetch detailed exam schedules (Midterms/Finals). Supports grade, year, semester, and exam type filters, including multi-grade labels like 12-1, 12-2, 11-12, or All.",
        inputSchema: zodSchema(z.object({
            grade: z.string().optional().describe("Grade to filter for, e.g., '12', '12-1', or '12th grade'"),
            year: z.number().optional().describe("Academic year, e.g., 2026"),
            semester: z.string().optional().describe("Semester, '1' or '2'"),
            examType: z.string().optional().describe("Exam type: 'MIDTERM' (중간고사) or 'FINALS' (기말고사)"),
        })),
        execute: async ({ grade, year, semester, examType }) => {
            const type = normalizeExamType(examType);
            const baseWhere: Prisma.ExamScheduleWhereInput = type ? { examType: type } : {};
            const requestedYear = year ?? getAcademicYear();
            const requestedSemester = semester ?? getAcademicSemester();

            let records = await prisma.examSchedule.findMany({
                where: { ...baseWhere, year: requestedYear, semester: requestedSemester },
            });
            if (records.length === 0) {
                records = await prisma.examSchedule.findMany({
                    where: { ...baseWhere, year: requestedYear },
                });
            }
            if (records.length === 0) {
                const latestCycle = await prisma.examSchedule.findFirst({
                    where: baseWhere,
                    select: { year: true, semester: true },
                    orderBy: [{ year: 'desc' }, { semester: 'desc' }],
                });
                if (latestCycle) {
                    records = await prisma.examSchedule.findMany({
                        where: { ...baseWhere, year: latestCycle.year, semester: latestCycle.semester },
                    });
                }
            }

            if (grade) {
                records = records.filter((record) => matchesExamGrade(grade, record.grades));
            }

            return records
                .map((record) => ({ ...record, isoDate: toIsoDate(record.year, record.date) }))
                .sort((a, b) =>
                    (a.isoDate ?? a.date).localeCompare(b.isoDate ?? b.date) || a.period - b.period
                );
        },
    }),
    getChapelSchedules: tool({
        description: "Fetch Wednesday Chapel schedules from database (수요채플 계획표). Returns date, day, speaker, organizer (선교팀, 학년, 학생회, 교목실), and notes (선교예배, 개학식, 종업식 등).",
        inputSchema: zodSchema(z.object({
            query: z.string().optional().describe("Filter by organizer, speaker, or keyword (e.g., '필리핀 1팀', '11학년', '선교예배', '이은세')"),
            type: z.enum(["MISSION", "GRADE", "SPECIAL", "EXAM", "SCHOOL", "ALL"]).optional().describe("Filter by chapel type: MISSION (선교예배), GRADE (학년주관), SPECIAL (특별예배), EXAM (시험기간)"),
        })),
        execute: async ({ query, type }) => {
            const where: Prisma.ChapelScheduleWhereInput = {};
            if (type && type !== "ALL") {
                where.type = type;
            }

            let records = await prisma.chapelSchedule.findMany({
                where,
                orderBy: [{ month: 'asc' }, { day: 'asc' }]
            });

            if (query && query.trim()) {
                const q = query.trim().toLowerCase();
                records = records.filter(r => 
                    r.organizer.toLowerCase().includes(q) ||
                    r.speaker.toLowerCase().includes(q) ||
                    (r.note && r.note.toLowerCase().includes(q)) ||
                    `${r.month}월 ${r.day}일`.includes(q)
                );
            }

            return records;
        },
    }),
    getTeamMemberships: tool({
        description: "Search student community membership in Mission Teams (4대 선교팀: 글로벌, 동아시아, 필리핀 1, 필리핀 2) and QT Groups (8대 QT조: 1조~8조). Supports student full name (이원선), given name without family name (원선), and Chosung initials (ㅇㅇㅅ, ㅎㅅㅁ). Also supports team/group roster lookup.",
        inputSchema: zodSchema(z.object({
            studentName: z.string().optional().describe("Student's name, given name, or Chosung (e.g., '이원선', '원선', 'ㅇㅇㅅ', '하승민', '승민', 'ㅎㅅㅁ')"),
            missionTeamName: z.string().optional().describe("Mission team name (e.g., '글로벌팀', '동아시아팀', '필리핀 1팀', '필리핀 2팀') to get team leader and members"),
            qtGroupName: z.string().optional().describe("QT group name (e.g., '1조', '2조', ..., '8조') to get group leader, sub-leader, and members"),
        })),
        execute: async ({ studentName, missionTeamName, qtGroupName }) => {
            // 1. Search by student name (Full name, Given name, or Chosung)
            if (studentName && studentName.trim()) {
                const query = studentName.trim();
                const [allMissionMembers, allQtMembers] = await Promise.all([
                    prisma.missionTeamMember.findMany({ include: { team: true } }),
                    prisma.qtGroupMember.findMany({ include: { group: true } }),
                ]);

                // Match by full name, given name, or Chosung
                const matchedMission = allMissionMembers.filter(m => matchesStudentName(m.name, query));
                const matchedQt = allQtMembers.filter(q => matchesStudentName(q.name, query));

                const matchedNames = Array.from(new Set([
                    ...matchedMission.map(m => m.name),
                    ...matchedQt.map(q => q.name)
                ]));

                if (matchedNames.length === 0) {
                    return { found: false, message: `"${query}" 학생의 선교팀 및 QT조 편성 정보를 찾지 못했습니다.` };
                }

                const results = matchedNames.map(name => {
                    const mM = allMissionMembers.find(m => m.name === name);
                    const qM = allQtMembers.find(q => q.name === name);
                    return {
                        name,
                        grade: mM?.grade || qM?.grade || 0,
                        missionTeam: mM ? {
                            name: mM.team.name,
                            role: mM.role,
                            chapelDate: mM.team.chapelDate,
                            leader: `${mM.team.leaderName} (${mM.team.leaderGrade}학년)`,
                        } : null,
                        qtGroup: qM ? {
                            name: qM.group.name,
                            role: qM.role,
                            leader: `${qM.group.leaderName} (${qM.group.leaderGrade}학년)`,
                            subLeader: `${qM.group.subLeaderName} (${qM.group.subLeaderGrade}학년)`,
                        } : null,
                    };
                });

                return { found: true, totalMatched: results.length, students: results };
            }

            // 2. Search by Mission Team
            if (missionTeamName && missionTeamName.trim()) {
                const team = await prisma.missionTeam.findFirst({
                    where: { name: { contains: missionTeamName.trim(), mode: 'insensitive' } },
                    include: {
                        members: {
                            orderBy: [{ grade: 'desc' }, { name: 'asc' }],
                        }
                    }
                });

                if (!team) {
                    return { found: false, message: `"${missionTeamName}" 선교팀을 찾지 못했습니다.` };
                }

                return {
                    found: true,
                    teamName: team.name,
                    leader: `${team.leaderName} (${team.leaderGrade}학년)`,
                    chapelDate: team.chapelDate,
                    totalMembers: team.members.length,
                    members: team.members.map(m => ({ name: m.name, grade: m.grade, role: m.role })),
                };
            }

            // 3. Search by QT Group
            if (qtGroupName && qtGroupName.trim()) {
                const group = await prisma.qtGroup.findFirst({
                    where: { name: { contains: qtGroupName.trim(), mode: 'insensitive' } },
                    include: {
                        members: {
                            orderBy: [{ grade: 'desc' }, { name: 'asc' }],
                        }
                    }
                });

                if (!group) {
                    return { found: false, message: `"${qtGroupName}" QT조를 찾지 못했습니다.` };
                }

                return {
                    found: true,
                    groupName: group.name,
                    leader: `${group.leaderName} (${group.leaderGrade}학년)`,
                    subLeader: `${group.subLeaderName} (${group.subLeaderGrade}학년)`,
                    totalMembers: group.members.length,
                    members: group.members.map(m => ({ name: m.name, grade: m.grade, role: m.role })),
                };
            }

            // Default: return summary of all teams
            const [teams, groups] = await Promise.all([
                prisma.missionTeam.findMany({ select: { name: true, leaderName: true, leaderGrade: true, chapelDate: true } }),
                prisma.qtGroup.findMany({ select: { name: true, leaderName: true, subLeaderName: true } }),
            ]);

            return { missionTeams: teams, qtGroups: groups };
        },
    }),
    searchSchoolInfo: tool({
        description:
            "Semantic search over official school notices/announcements (공지사항). " +
            "Use for questions about announcements, rules, policies, deadlines, or school information " +
            "not covered by the calendar, meal, timetable, exam, chapel, or team tools. " +
            "Query in the user's language; returns the most relevant notice excerpts.",
        inputSchema: zodSchema(z.object({
            query: z.string().describe("Natural-language search query, e.g., '기숙사 규정' or 'uniform policy'"),
        })),
        execute: async ({ query }) => {
            try {
                const results = await searchKnowledge(query, 5);
                if (results.length === 0) {
                    return { results: [], note: "No matching notices found. Tell the user you could not find related announcements." };
                }
                return { results };
            } catch (error) {
                console.error("[searchSchoolInfo] Search failed:", error);
                return { results: [], note: "Search is temporarily unavailable." };
            }
        },
    }),
};
