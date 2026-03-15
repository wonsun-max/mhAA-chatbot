"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Bell, Loader2 } from "lucide-react"

interface Notice {
  id: string
  title: string
  category: string
  isPinned: boolean
  createdAt: string
}

export function NoticesFeed() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNotices() {
      try {
        const res = await fetch("/api/notices?limit=10")
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

  const pinnedNotices = notices.filter(n => n.isPinned)
  const normalNotices = notices.filter(n => !n.isPinned).slice(0, 5)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 border-y border-white/5">
        <Loader2 size={24} className="animate-spin text-white/10" />
      </div>
    )
  }

  const hasPinned = pinnedNotices.length > 0

  return (
    <section className="py-12 md:py-24 border-y border-white/5 space-y-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell size={18} className="text-blue-400/50" />
          <h3 className="text-sm uppercase tracking-[0.3em] font-medium text-white/60">최근 공지사항</h3>
        </div>
        <Link href="/notices" className="text-[9px] uppercase tracking-[0.2em] text-white/30 hover:text-white transition-colors">전체 보기</Link>
      </div>

      <div className={`flex flex-col ${hasPinned ? 'md:grid md:grid-cols-[3fr_7fr]' : ''} gap-12 md:gap-16`}>
        {/* Pinned Section (30% ratio) */}
        {hasPinned && (
          <div className="space-y-8">
            <div className="flex items-center gap-2 text-blue-400">
              <span className="text-[10px] font-black uppercase tracking-widest">Important</span>
              <div className="h-px flex-1 bg-blue-500/20" />
            </div>
            <div className="space-y-6">
              {pinnedNotices.map((notice) => (
                <Link key={notice.id} href={`/notices/${notice.id}`} className="block group">
                  <div className="space-y-3">
                    <span className="text-[9px] uppercase tracking-widest text-blue-400 font-medium bg-blue-400/10 px-2 py-0.5 rounded-full inline-block">
                      {notice.category}
                    </span>
                    <h4 className="text-xl font-light text-white group-hover:text-blue-400 transition-colors leading-snug tracking-tight">
                      {notice.title}
                    </h4>
                    <p className="text-[10px] font-mono text-white/20">
                      {new Date(notice.createdAt).toLocaleDateString("ko-KR")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Normal Section (70% ratio or 100%) */}
        <div className="space-y-8">
          {hasPinned && (
            <div className="flex items-center gap-2 text-white/10">
              <span className="text-[10px] font-black uppercase tracking-widest">Recent Updates</span>
              <div className="h-px flex-1 bg-white/5" />
            </div>
          )}
          
          <div className="divide-y divide-white/5">
            {normalNotices.length > 0 ? (
              normalNotices.map((notice) => (
                <Link key={notice.id} href={`/notices/${notice.id}`} className="block py-6 first:pt-0 group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-widest text-white/30 font-medium">{notice.category}</span>
                      <h4 className="text-base font-light text-white/70 group-hover:text-white transition-colors tracking-tight">{notice.title}</h4>
                    </div>
                    <span className="text-[10px] font-mono text-white/20 whitespace-nowrap">
                      {new Date(notice.createdAt).toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              !hasPinned && <p className="text-sm text-white/20 py-12 text-center italic">등록된 공지사항이 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
