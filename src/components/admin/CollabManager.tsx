"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Loader2, Plus, Trash2, Calendar, Clock, Utensils, BookOpen } from "lucide-react"

// Types
type CollabTab = "meals" | "calendar" | "timetable" | "exams"

interface MealRecord {
    id: string
    date: string
    dayOfWeek: string
    menu: string
}

interface CalendarEventRecord {
    id: string
    name: string
    startDate: string
    endDate: string
    eventType: string
}

interface TimetableRecord {
    id: string
    grade: string
    dayOfWeek: string
    period: string
    time: string
    subject: string
    teacher: string
}

interface ExamRecord {
    id: string
    examType: string
    semester: string
    year: number
    date: string
    dayOfWeek: string
    period: number
    time: string
    subject: string
    grades: string[]
}

export function CollabManager() {
    const [subTab, setSubTab] = useState<CollabTab>("meals")

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">콜라보 관리</h2>
                    <p className="text-sm text-zinc-500">통합 데이터 관리 센터 — 학생들에게 보여질 학사 정보를 입력하세요.</p>
                </div>
            </div>

            {/* Sub-navigation for Collab categories */}
            <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10 w-fit">
                {(["meals", "calendar", "timetable", "exams"] as CollabTab[]).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setSubTab(tab)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${subTab === tab
                            ? "bg-white text-black shadow-md"
                            : "text-zinc-400 hover:text-white hover:bg-white/5"
                            }`}
                    >
                        {tab === "meals" && <span className="flex items-center gap-2"><Utensils size={16} /> 급식</span>}
                        {tab === "calendar" && <span className="flex items-center gap-2"><Calendar size={16} /> 학사 일정</span>}
                        {tab === "timetable" && <span className="flex items-center gap-2"><Clock size={16} /> 시간표</span>}
                        {tab === "exams" && <span className="flex items-center gap-2"><BookOpen size={16} /> 시험 일정</span>}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <motion.div
                key={subTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-zinc-900/30 border border-white/5 rounded-[24px] overflow-hidden"
            >
                {subTab === "meals" && <MealsAdmin />}
                {subTab === "calendar" && <CalendarAdmin />}
                {subTab === "timetable" && <TimetableAdmin />}
                {subTab === "exams" && <ExamsAdmin />}
            </motion.div>
        </div>
    )
}

// ==========================================
// 1. Meals Admin Component
// ==========================================
function MealsAdmin() {
    const [meals, setMeals] = useState<MealRecord[]>([])
    const [loading, setLoading] = useState(true)
    const [isAdding, setIsAdding] = useState(false)
    const [formData, setFormData] = useState({ date: "", dayOfWeek: "", menu: "" })

    useEffect(() => {
        fetchMeals()
    }, [])

    const fetchMeals = async () => {
        try {
            const res = await fetch("/api/admin/collab/meals")
            const data = await res.json()
            if (data.meals) setMeals(data.meals)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch("/api/admin/collab/meals", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            if (res.ok) {
                setFormData({ date: "", dayOfWeek: "", menu: "" })
                setIsAdding(false)
                fetchMeals()
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("정말 이 급식 데이터를 삭제하시겠습니까?")) return
        try {
            const res = await fetch(`/api/admin/collab/meals?id=${id}`, { method: "DELETE" })
            if (res.ok) fetchMeals()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">급식 데이터 관리</h3>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="px-4 py-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                >
                    <Plus size={16} />
                    {isAdding ? "취소" : "새 급식 추가"}
                </button>
            </div>

            {isAdding && (
                <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    onSubmit={handleAdd}
                    className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 space-y-4"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-500 ml-1 uppercase">Date</label>
                            <input
                                type="text"
                                placeholder="예: 2024-03-15"
                                required
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-500 ml-1 uppercase">Day</label>
                            <select
                                required
                                value={formData.dayOfWeek}
                                onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors text-white"
                            >
                                <option value="">요일 선택</option>
                                <option value="월">월요일</option>
                                <option value="화">화요일</option>
                                <option value="수">수요일</option>
                                <option value="목">목요일</option>
                                <option value="금">금요일</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-500 ml-1 uppercase">Menu</label>
                            <input
                                type="text"
                                placeholder="예: 쌀밥, 미역국, 제육볶음"
                                required
                                value={formData.menu}
                                onChange={(e) => setFormData({ ...formData, menu: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                        <p className="text-[11px] text-zinc-500">💡 팁: 메뉴는 쉼표(,)로 구분하면 모바일 앱에서 예쁘게 정렬됩니다.</p>
                        <button type="submit" className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-bold transition-all">
                            저장하기
                        </button>
                    </div>
                </motion.form>
            )}

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
                </div>
            ) : meals.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 border border-dashed border-white/10 rounded-2xl bg-white/5">
                    등록된 급식 데이터가 없습니다.
                </div>
            ) : (
                <div className="border border-white/5 rounded-2xl overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white/5 text-zinc-400 font-medium">
                            <tr>
                                <th className="px-6 py-4">날짜</th>
                                <th className="px-6 py-4">요일</th>
                                <th className="px-6 py-4 w-1/2">메뉴</th>
                                <th className="px-6 py-4 text-right">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {meals.map((meal) => (
                                <tr key={meal.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-mono">{meal.date}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-medium">
                                            {meal.dayOfWeek}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-zinc-300">{meal.menu}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(meal.id)}
                                            className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                            title="삭제"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

// ==========================================
// 2. Calendar Admin Component
// ==========================================
function CalendarAdmin() {
    const [events, setEvents] = useState<CalendarEventRecord[]>([])
    const [loading, setLoading] = useState(true)
    const [isAdding, setIsAdding] = useState(false)
    const [formData, setFormData] = useState({ name: "", startDate: "", endDate: "", eventType: "Event" })

    useEffect(() => {
        fetchEvents()
    }, [])

    const fetchEvents = async () => {
        try {
            const res = await fetch("/api/admin/collab/calendar")
            const data = await res.json()
            if (data.events) setEvents(data.events)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch("/api/admin/collab/calendar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            if (res.ok) {
                setFormData({ name: "", startDate: "", endDate: "", eventType: "Event" })
                setIsAdding(false)
                fetchEvents()
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("정말 이 일정을 삭제하시겠습니까?")) return
        try {
            const res = await fetch(`/api/admin/collab/calendar?id=${id}`, { method: "DELETE" })
            if (res.ok) fetchEvents()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">학사 일정 관리</h3>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="px-4 py-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                >
                    <Plus size={16} />
                    {isAdding ? "취소" : "새 일정 추가"}
                </button>
            </div>

            {isAdding && (
                <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    onSubmit={handleAdd}
                    className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 space-y-4"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-500 ml-1 uppercase">Event Name</label>
                            <input
                                type="text"
                                placeholder="예: 중간고사, 개교기념일"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-500 ml-1 uppercase">Type</label>
                            <select
                                required
                                value={formData.eventType}
                                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors text-white"
                            >
                                <option value="Event">일반 행사 (Event)</option>
                                <option value="Holiday">휴일/방학 (Holiday)</option>
                                <option value="Exam">시험 (Exam)</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-500 ml-1 uppercase">Start Date</label>
                            <input
                                type="text"
                                placeholder="예: 2024-04-20"
                                required
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-500 ml-1 uppercase">End Date</label>
                            <input
                                type="text"
                                placeholder="예: 2024-04-24"
                                required
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                        <p className="text-[11px] text-zinc-500">💡 팁: 당일 행사는 시작일과 종료일을 같게 적어주세요.</p>
                        <button type="submit" className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-bold transition-all">
                            저장하기
                        </button>
                    </div>
                </motion.form>
            )}

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
                </div>
            ) : events.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 border border-dashed border-white/10 rounded-2xl bg-white/5">
                    등록된 학사 일정이 없습니다.
                </div>
            ) : (
                <div className="border border-white/5 rounded-2xl overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white/5 text-zinc-400 font-medium">
                            <tr>
                                <th className="px-6 py-4">일정명</th>
                                <th className="px-6 py-4">시작 일자</th>
                                <th className="px-6 py-4">종료 일자</th>
                                <th className="px-6 py-4 text-center">유형</th>
                                <th className="px-6 py-4 text-right">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {events.map((evt) => (
                                <tr key={evt.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-medium text-zinc-200">{evt.name}</td>
                                    <td className="px-6 py-4 font-mono text-zinc-400">{evt.startDate}</td>
                                    <td className="px-6 py-4 font-mono text-zinc-400">{evt.endDate}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${evt.eventType === 'Holiday' ? 'bg-red-500/10 text-red-400' :
                                            evt.eventType === 'Exam' ? 'bg-amber-500/10 text-amber-400' :
                                                'bg-blue-500/10 text-blue-400'
                                            }`}>
                                            {evt.eventType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(evt.id)}
                                            className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                            title="삭제"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

// ==========================================
// 3. Timetable Admin Component
// ==========================================
function TimetableAdmin() {
    const [timetables, setTimetables] = useState<TimetableRecord[]>([])
    const [loading, setLoading] = useState(true)
    const [isAdding, setIsAdding] = useState(false)
    const [filterGrade, setFilterGrade] = useState("")
    const [formData, setFormData] = useState({
        grade: "", dayOfWeek: "MON", period: "", time: "", subject: "", teacher: ""
    })

    const fetchTimetables = useCallback(async () => {
        setLoading(true)
        try {
            const url = filterGrade
                ? `/api/admin/collab/timetable?grade=${encodeURIComponent(filterGrade)}`
                : "/api/admin/collab/timetable"

            const res = await fetch(url)
            const data = await res.json()
            if (data.timetables) setTimetables(data.timetables)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }, [filterGrade])

    useEffect(() => {
        fetchTimetables()
    }, [fetchTimetables])

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch("/api/admin/collab/timetable", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            if (res.ok) {
                // Keep grade and dayOfWeek for faster data entry
                setFormData(prev => ({ ...prev, period: "", time: "", subject: "", teacher: "" }))
                setIsAdding(false)
                fetchTimetables()
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("정말 이 시간표 데이터를 삭제하시겠습니까?")) return
        try {
            const res = await fetch(`/api/admin/collab/timetable?id=${id}`, { method: "DELETE" })
            if (res.ok) fetchTimetables()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-lg font-bold">시간표 관리</h3>

                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="학년/반 필터 (예: 12-2)"
                        value={filterGrade}
                        onChange={(e) => setFilterGrade(e.target.value)}
                        className="bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors w-40"
                    />
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className="px-4 py-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded-xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap"
                    >
                        <Plus size={16} />
                        {isAdding ? "취소" : "새 시간표 추가"}
                    </button>
                </div>
            </div>

            {isAdding && (
                <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    onSubmit={handleAdd}
                    className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 space-y-4"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-500 ml-1 uppercase">Grade/Class</label>
                            <input
                                type="text"
                                placeholder="예: 12-2"
                                required
                                value={formData.grade}
                                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-500 ml-1 uppercase">Day</label>
                            <select
                                required
                                value={formData.dayOfWeek}
                                onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors text-white"
                            >
                                <option value="MON">월요일 (MON)</option>
                                <option value="TUE">화요일 (TUE)</option>
                                <option value="WED">수요일 (WED)</option>
                                <option value="THU">목요일 (THU)</option>
                                <option value="FRI">금요일 (FRI)</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-500 ml-1 uppercase">Period</label>
                            <input
                                type="text"
                                placeholder="예: 1 또는 점심"
                                required
                                value={formData.period}
                                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-500 ml-1 uppercase">Time Range</label>
                            <input
                                type="text"
                                placeholder="예: 08:00-09:15"
                                required
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-500 ml-1 uppercase">Subject</label>
                            <input
                                type="text"
                                placeholder="예: 수학, 영어"
                                required
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-500 ml-1 uppercase">Teacher</label>
                            <input
                                type="text"
                                placeholder="담당 선생님 성함"
                                required
                                value={formData.teacher}
                                onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                        <p className="text-[11px] text-zinc-500">💡 팁: &apos;학년/반&apos; 이름이 사용자의 정보와 일치해야 해당 학생에게 보입니다.</p>
                        <button type="submit" className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-bold transition-all">
                            저장하기
                        </button>
                    </div>
                </motion.form>
            )}

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
                </div>
            ) : timetables.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 border border-dashed border-white/10 rounded-2xl bg-white/5">
                    {filterGrade ? `'${filterGrade}' 반에 등록된 시간표가 없습니다.` : "등록된 시간표 데이터가 없습니다."}
                </div>
            ) : (
                <div className="border border-white/5 rounded-2xl overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white/5 text-zinc-400 font-medium">
                            <tr>
                                <th className="px-6 py-4">반</th>
                                <th className="px-6 py-4">요일/교시</th>
                                <th className="px-6 py-4">시간</th>
                                <th className="px-6 py-4">과목</th>
                                <th className="px-6 py-4">선생님</th>
                                <th className="px-6 py-4 text-right">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {timetables.map((tt) => (
                                <tr key={tt.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-bold text-zinc-200">{tt.grade}</td>
                                    <td className="px-6 py-4 font-mono text-zinc-400">
                                        <span className="text-blue-400 font-bold">{tt.dayOfWeek}</span> {tt.period}교시
                                    </td>
                                    <td className="px-6 py-4 font-mono text-zinc-400">{tt.time}</td>
                                    <td className="px-6 py-4 text-zinc-300 font-medium">{tt.subject}</td>
                                    <td className="px-6 py-4 text-zinc-400">{tt.teacher}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(tt.id)}
                                            className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                            title="삭제"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

// ==========================================
// 4. Exams Admin Component
// ==========================================
function ExamsAdmin() {
    const [exams, setExams] = useState<ExamRecord[]>([])
    const [loading, setLoading] = useState(true)
    const [isAdding, setIsAdding] = useState(false)
    const [formData, setFormData] = useState({
        examType: "MIDTERM",
        semester: "1",
        year: "2026",
        date: "",
        dayOfWeek: "",
        period: "",
        time: "",
        subject: "",
        grades: "" // Comma separated: "7, 8, 9"
    })

    useEffect(() => {
        fetchExams()
    }, [])

    const fetchExams = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/admin/collab/exams")
            const data = await res.json()
            if (data.exams) setExams(data.exams)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch("/api/admin/collab/exams", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            if (res.ok) {
                // Keep year/semester/date/day for repetitive entry
                setFormData(prev => ({ ...prev, period: "", time: "", subject: "" }))
                setIsAdding(false)
                fetchExams()
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("정말 이 시험 정보를 삭제하시겠습니까?")) return
        try {
            const res = await fetch(`/api/admin/collab/exams?id=${id}`, { method: "DELETE" })
            if (res.ok) fetchExams()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">시험 일정 관리</h3>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="px-4 py-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                >
                    <Plus size={16} />
                    {isAdding ? "취소" : "새 시험 추가"}
                </button>
            </div>

            {isAdding && (
                <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    onSubmit={handleAdd}
                    className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 space-y-4"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-500 ml-1 uppercase">Exam Type</label>
                            <select
                                required
                                value={formData.examType}
                                onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500 transition-colors text-white"
                            >
                                <option value="MIDTERM">중간고사 (MIDTERM)</option>
                                <option value="FINALS">기말고사 (FINALS)</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-500 ml-1 uppercase">Semester</label>
                            <select
                                required
                                value={formData.semester}
                                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500 transition-colors text-white"
                            >
                                <option value="1">1학기</option>
                                <option value="2">2학기</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-500 ml-1 uppercase">Year</label>
                            <input
                                type="number"
                                required
                                value={formData.year}
                                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500 transition-colors"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-500 ml-1 uppercase">Date</label>
                            <input
                                type="text"
                                placeholder="예: 4/24"
                                required
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500 transition-colors"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-500 ml-1 uppercase">Day</label>
                            <input
                                type="text"
                                placeholder="예: 금요일 (Fri.)"
                                required
                                value={formData.dayOfWeek}
                                onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500 transition-colors"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-500 ml-1 uppercase">Period</label>
                            <input
                                type="number"
                                placeholder="예: 1"
                                required
                                value={formData.period}
                                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500 transition-colors"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-500 ml-1 uppercase">Time Range</label>
                            <input
                                type="text"
                                placeholder="예: 08:30 - 09:15"
                                required
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500 transition-colors"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-500 ml-1 uppercase">Subject</label>
                            <input
                                type="text"
                                placeholder="예: 국어과"
                                required
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500 transition-colors"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-500 ml-1 uppercase">Target Grades (Comma separated)</label>
                            <input
                                type="text"
                                placeholder="예: 7, 8, 9 (전학년일 경우 All)"
                                required
                                value={formData.grades}
                                onChange={(e) => setFormData({ ...formData, grades: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500 transition-colors"
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                        <p className="text-[11px] text-zinc-500">💡 팁: &apos;전학년&apos; 대상일 경우 학년 칸에 &apos;All&apos;을 입력하세요.</p>
                        <button type="submit" className="px-6 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-bold transition-all">
                            저장하기
                        </button>
                    </div>
                </motion.form>
            )}

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
                </div>
            ) : exams.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 border border-dashed border-white/10 rounded-2xl bg-white/5">
                    등록된 시험 일정이 없습니다.
                </div>
            ) : (
                <div className="border border-white/5 rounded-2xl overflow-hidden overflow-x-auto">
                    <table className="w-full text-sm text-left min-w-[800px]">
                        <thead className="bg-white/5 text-zinc-400 font-medium">
                            <tr>
                                <th className="px-4 py-4">유형/학기</th>
                                <th className="px-4 py-4">날짜</th>
                                <th className="px-4 py-4">교시</th>
                                <th className="px-4 py-4">시간</th>
                                <th className="px-4 py-4">과목</th>
                                <th className="px-4 py-4">학년</th>
                                <th className="px-4 py-4 text-right">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {exams.map((exam) => (
                                <tr key={exam.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-4 py-4">
                                        <div className="flex flex-col">
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded w-fit mb-1 ${
                                                exam.examType === 'MIDTERM' ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500'
                                            }`}>
                                                {exam.examType}
                                            </span>
                                            <span className="text-xs text-zinc-500">{exam.year}-{exam.semester}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-zinc-200">{exam.date}</span>
                                            <span className="text-xs text-zinc-500">{exam.dayOfWeek}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 font-mono text-zinc-400">{exam.period}교시</td>
                                    <td className="px-4 py-4 font-mono text-zinc-400">{exam.time}</td>
                                    <td className="px-4 py-4 text-zinc-300 font-medium">{exam.subject}</td>
                                    <td className="px-4 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {exam.grades.map((g: string) => (
                                                <span key={g} className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-zinc-400">
                                                    {g}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(exam.id)}
                                            className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                            title="삭제"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
