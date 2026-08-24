"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Instagram, Loader2, ExternalLink } from "lucide-react"
import { InstagramCardGraphic } from "@/components/notices/InstagramCardGraphic"

interface Notice {
  id: string
  title: string
  content: string
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
        const res = await fetch("/api/notices?limit=6")
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

  const extractImage = (content: string) => {
    const match = content.match(/!\[.*?\]\((https?:\/\/[^\s)]+)\)/);
    return match ? match[1] : null;
  };

  const extractLink = (content: string) => {
    const match = content.match(/https?:\/\/(www\.)?instagram\.com\/p\/[a-zA-Z0-9_-]+/);
    return match ? match[0] : "https://www.instagram.com/mha_withus";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 border-y border-white/5">
        <Loader2 size={24} className="animate-spin text-pink-500/50" />
      </div>
    )
  }

  return (
    <section className="py-12 md:py-20 border-y border-white/5 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-1 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
            <div className="p-1 rounded-full bg-black">
              <Instagram size={14} className="text-pink-400" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
              <span>@mha_withus 소식</span>
            </h3>
            <p className="text-[10px] text-zinc-500">인스타그램 공식 피드</p>
          </div>
        </div>

        <Link
          href="/notices"
          className="text-[10px] uppercase tracking-[0.2em] text-pink-400 hover:text-pink-300 font-bold transition-colors"
        >
          전체 보기 →
        </Link>
      </div>

      {/* Grid of latest cards */}
      {notices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {notices.slice(0, 3).map((notice) => {
            const imgUrl = extractImage(notice.content);
            const instaLink = extractLink(notice.content);

            return (
              <div
                key={notice.id}
                className="group rounded-3xl bg-zinc-900/40 border border-white/10 hover:border-pink-500/30 overflow-hidden shadow-lg transition-all flex flex-col justify-between"
              >
                <Link href={`/notices/${notice.id}`} className="block">
                  <InstagramCardGraphic
                    title={notice.title}
                    imageUrl={imgUrl}
                    aspectRatio="square"
                  />

                  <div className="p-5 space-y-1.5">
                    <p className="text-[9px] font-mono text-zinc-500">
                      {new Date(notice.createdAt).toLocaleDateString("ko-KR")}
                    </p>
                    <h4 className="text-sm font-bold text-white group-hover:text-pink-300 transition-colors line-clamp-1">
                      {notice.title}
                    </h4>
                  </div>
                </Link>

                <div className="px-5 pb-4 pt-1 flex items-center justify-between border-t border-white/5">
                  <a
                    href={instaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-pink-400 hover:text-pink-300 font-bold transition-colors"
                  >
                    <span>Instagram</span>
                    <ExternalLink size={10} className="opacity-60" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-xs text-zinc-600 py-8 text-center italic">등록된 인스타그램 소식이 없습니다.</p>
      )}
    </section>
  )
}
