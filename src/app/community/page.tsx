"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, MessageSquare, Plus, Eye, Loader2, FileText } from "lucide-react"

interface Post {
  id: string
  title: string
  authorNickname: string | null
  viewCount: number
  createdAt: string
  _count: {
    comments: number
    likes: number
  }
}

export default function CommunityBoard() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  })

  useEffect(() => {
    fetchPosts(pagination.page)
  }, [pagination.page])

  const fetchPosts = async (page: number) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/community?page=${page}&limit=${pagination.limit}`)
      if (res.ok) {
        const data = await res.json()
        setPosts(data.posts || [])
        setPagination(prev => ({
          ...prev,
          total: data.pagination.total,
          totalPages: data.pagination.totalPages,
        }))
      }
    } catch (error) {
      console.error("Failed to load posts", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return
    setPagination(prev => ({ ...prev, page: newPage }))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Format date helper
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/30 selection:text-white pt-24 pb-20">
      <div className="max-w-[1000px] mx-auto px-6 lg:px-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 space-y-6 md:space-y-0 relative z-10">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-light tracking-tight mb-4"
            >
              Community <span className="text-white/40">커뮤니티</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-white/60 font-medium"
            >
              익명으로 자유롭게 이야기하는 공간입니다
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Link 
              href="/community/write"
              className="group relative flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-black/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <Plus size={18} className="relative z-10" />
              <span className="font-semibold tracking-wide relative z-10">글쓰기</span>
            </Link>
          </motion.div>
        </div>

        {/* Board List */}
        <div className="relative">
          {/* Glass background effect container */}
          <div className="absolute inset-0 bg-white/[0.02] border border-white/[0.05] rounded-3xl blur-sm -z-10" />

          <div className="rounded-3xl border border-white/[0.08] bg-black/40 backdrop-blur-xl overflow-hidden shadow-2xl">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-5 border-b border-white/[0.08] bg-white/[0.02] text-xs font-semibold tracking-wider text-white/50 uppercase">
              <div className="col-span-6 lg:col-span-7">Title</div>
              <div className="col-span-2 text-center">Author</div>
              <div className="col-span-2 text-center">Date</div>
              <div className="col-span-2 lg:col-span-1 text-center">Views</div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <Loader2 className="w-8 h-8 text-white/40 animate-spin" />
                <p className="text-white/30 text-sm tracking-widest uppercase">Loading Posts...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center px-4">
                <div className="w-16 h-16 bg-white/[0.05] border border-white/[0.1] rounded-full flex items-center justify-center mb-6">
                  <FileText className="w-6 h-6 text-white/30" />
                </div>
                <h3 className="text-xl font-medium text-white/80 mb-2">아직 게시물이 없습니다</h3>
                <p className="text-white/40 max-w-sm">첫 번째 글의 주인공이 되어보세요.</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {posts.map((post, i) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={post.id}
                  >
                    <Link href={`/community/${post.id}`} className="block">
                      <div className="group grid grid-cols-1 md:grid-cols-12 gap-4 px-6 md:px-8 py-5 border-b border-white/[0.05] hover:bg-white/[0.04] transition-colors items-center relative overflow-hidden">
                        
                        {/* Title & Mobile Meta */}
                        <div className="col-span-1 md:col-span-6 lg:col-span-7">
                          <h3 className="text-[15px] font-medium text-white/90 group-hover:text-white mb-2 md:mb-0 transition-colors flex items-center gap-3">
                            {post.title}
                            {post._count.comments > 0 && (
                              <span className="text-xs font-semibold text-emerald-400/80 bg-emerald-400/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <MessageSquare size={10} />
                                {post._count.comments}
                              </span>
                            )}
                          </h3>
                          {/* Mobile Only Meta */}
                          <div className="flex items-center gap-4 mt-2 md:hidden text-xs text-white/40">
                            <span className="truncate max-w-[100px]">{post.authorNickname}</span>
                            <span>{formatDate(post.createdAt)}</span>
                            <div className="flex items-center gap-3 ml-auto">
                              <span className="flex items-center gap-1"><Eye size={12}/>{post.viewCount}</span>
                              <span className="flex items-center gap-1"><Heart size={12}/>{post._count.likes}</span>
                            </div>
                          </div>
                        </div>

                        {/* Desktop Meta fields */}
                        <div className="hidden md:block col-span-2 text-center">
                          <span className="text-[13px] text-white/60 group-hover:text-white/80 transition-colors truncate block">
                            {post.authorNickname}
                          </span>
                        </div>
                        <div className="hidden md:block col-span-2 text-center text-[13px] text-white/40">
                          {formatDate(post.createdAt)}
                        </div>
                        <div className="hidden md:block col-span-2 lg:col-span-1 text-center">
                          <div className="flex items-center justify-center gap-4 text-white/40 text-[12px]">
                            <span className="flex flex-col items-center gap-1 group-hover:text-blue-400/60 transition-colors">
                              <Eye size={14} />
                              {post.viewCount}
                            </span>
                            <span className="flex flex-col items-center gap-1 group-hover:text-red-400/60 transition-colors">
                              <Heart size={14} />
                              {post._count.likes}
                            </span>
                          </div>
                        </div>

                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination UI */}
          {!loading && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button 
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white disabled:opacity-30 disabled:hover:text-white/60 transition-colors"
              >
                이전
              </button>
              
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter(p => Math.abs(p - pagination.page) <= 2 || p === 1 || p === pagination.totalPages)
                .map((p, i, arr) => {
                  return (
                    <div key={p} className="flex items-center gap-2">
                      {i > 0 && arr[i-1] !== p - 1 && <span className="text-white/20">...</span>}
                      <button
                        onClick={() => handlePageChange(p)}
                        className={`w-10 h-10 rounded-xl border transition-all ${pagination.page === p ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white'}`}
                      >
                        {p}
                      </button>
                    </div>
                  )
                })
              }

              <button 
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white disabled:opacity-30 disabled:hover:text-white/60 transition-colors"
              >
                다음
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
