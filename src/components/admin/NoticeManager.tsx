"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Trash2, Edit3, Loader2, Bell, Search, X } from "lucide-react"

interface Notice {
    id: string
    title: string
    content: string
    category: string
    isPinned: boolean
    createdAt: string
}

export function NoticeManager() {
    const [notices, setNotices] = useState<Notice[]>([])
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [editingNotice, setEditingNotice] = useState<Notice | null>(null)
    const [formData, setFormData] = useState({ title: "", content: "", category: "Notice", isPinned: false })

    const fetchNotices = async () => {
        try {
            const res = await fetch("/api/notices")
            if (res.ok) setNotices(await res.json())
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchNotices() }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const url = editingNotice ? `/api/notices/${editingNotice.id}` : "/api/notices"
            const method = editingNotice ? "PATCH" : "POST"
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            if (res.ok) {
                setShowModal(false)
                setEditingNotice(null)
                setFormData({ title: "", content: "", category: "Notice", isPinned: false })
                fetchNotices()
            }
        } catch (err) {
            console.error(err)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("이 공지사항을 삭제하시겠습니까?")) return
        try {
            const res = await fetch(`/api/notices/${id}`, { method: "DELETE" })
            if (res.ok) fetchNotices()
        } catch (err) {
            console.error(err)
        }
    }

    const openEdit = (notice: Notice) => {
        setEditingNotice(notice)
        setFormData({ title: notice.title, content: notice.content, category: notice.category, isPinned: notice.isPinned })
        setShowModal(true)
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">공지사항 관리</h2>
                    <p className="text-sm text-zinc-500">미션 업데이트 생성 및 관리</p>
                </div>
                <button
                    onClick={() => { setEditingNotice(null); setFormData({ title: "", content: "", category: "Notice", isPinned: false }); setShowModal(true) }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors text-sm font-bold uppercase tracking-wider"
                >
                    <Plus size={18} /> 새 글 작성
                </button>
            </div>

            <div className="grid gap-4">
                {loading ? (
                    <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-zinc-500" /></div>
                ) : notices.map((notice) => (
                    <motion.div
                        key={notice.id}
                        layout
                        className={`p-6 rounded-2xl border transition-all flex items-center justify-between group ${
                            notice.isPinned 
                                ? "bg-blue-500/5 border-blue-500/20 hover:bg-blue-500/10" 
                                : "bg-zinc-900/10 border-white/5 hover:bg-zinc-900/30"
                        }`}
                    >
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                {notice.isPinned && (
                                    <span className="flex items-center gap-1 text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-400/10 px-2 py-0.5 rounded-full">
                                        <Bell size={10} className="fill-blue-400" /> 고정됨
                                    </span>
                                )}
                                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">
                                    {notice.category === "Notice" ? "공지사항" : notice.category === "Mission" ? "미션" : notice.category === "Event" ? "이벤트" : notice.category === "Bible" ? "주제 말씀" : notice.category}
                                </span>
                                <span className="text-[10px] text-zinc-600">{new Date(notice.createdAt).toLocaleDateString()}</span>
                            </div>
                            <h3 className="font-medium text-lg text-white/90">{notice.title}</h3>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEdit(notice)} className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"><Edit3 size={18} /></button>
                            <button onClick={() => handleDelete(notice.id)} className="p-2 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={18} /></button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative w-full max-w-xl bg-zinc-900 border border-white/10 rounded-[40px] p-10 shadow-2xl">
                            <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-zinc-500 hover:text-white"><X size={20} /></button>
                            <h3 className="text-2xl font-light mb-8">{editingNotice ? "공지사항 수정" : "새 공지사항"}</h3>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest px-2">카테고리</label>
                                            <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-white/20">
                                                <option value="Notice">공지사항</option>
                                                <option value="Mission">미션</option>
                                                <option value="Event">이벤트</option>
                                                <option value="Bible">주제 말씀</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest px-2">상단 고정</label>
                                            <div 
                                                onClick={() => setFormData({ ...formData, isPinned: !formData.isPinned })}
                                                className={`w-full bg-white/5 border rounded-2xl py-4 px-6 text-sm cursor-pointer transition-all flex items-center justify-between ${
                                                    formData.isPinned ? "border-blue-500/50 text-blue-400" : "border-white/10 text-zinc-500"
                                                }`}
                                            >
                                                <span>메인 페이지 상단 노출</span>
                                                <div className={`w-4 h-4 rounded-full border-2 transition-all ${
                                                    formData.isPinned ? "bg-blue-500 border-blue-400" : "bg-transparent border-zinc-700"
                                                }`} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest px-2">제목</label>
                                        <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-white/20" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest px-2">내용</label>
                                        <textarea required rows={5} value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-white/20 resize-none" />
                                    </div>
                                </div>
                                <button disabled={isSubmitting} className="w-full py-4 bg-white text-black rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all disabled:opacity-50">
                                    {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : (editingNotice ? "업데이트" : "게시")}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
