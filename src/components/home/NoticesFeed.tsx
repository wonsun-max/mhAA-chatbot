"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Bell, Loader2 } from "lucide-react"

interface Notice {
  id: string
  title: string
  category: string
  createdAt: string
}

export function NoticesFeed() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNotices() {
      try {
        const res = await fetch("/api/notices?limit=3")
        if (res.ok) {
          const data = await res.json()
          setNotices(data)
        }
      } catch (err) {
        console.error("Failed to fetch notices:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchNotices()
  }, [])

  return (
    <section className="py-12 md:py-24 border-y border-white/5 space-y-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell size={18} className="text-blue-400/50" />
          <h3 className="text-sm uppercase tracking-[0.3em] font-medium text-white/60">최근 공지사항</h3>
        </div>
        <Link href="/notices" className="text-[9px] uppercase tracking-[0.2em] text-white/30 hover:text-white transition-colors">전체 보기</Link>
      </div>

      <div className="space-y-1">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-white/10" />
          </div>
        ) : notices.length > 0 ? (
          notices.map((notice) => (
            <Link key={notice.id} href={`/notices/${notice.id}`} className="block border-b border-white/5 last:border-0 py-8 group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <span className="text-[9px] uppercase tracking-widest text-blue-400 font-medium">{notice.category}</span>
                  <h4 className="text-lg font-light text-white/70 group-hover:text-white transition-colors tracking-tight">{notice.title}</h4>
                </div>
                <span className="text-[10px] font-mono text-white/20 whitespace-nowrap">
                  {new Date(notice.createdAt).toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-sm text-white/20 py-12 text-center italic">등록된 공지사항이 없습니다.</p>
        )}
      </div>
    </section>
  )
}
