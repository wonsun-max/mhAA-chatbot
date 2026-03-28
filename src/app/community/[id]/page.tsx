"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { Loader2, ArrowLeft, MoreVertical, Trash2, Heart, Eye } from "lucide-react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"

// Note: Ensure CommentSection component exists at this path
import { CommentSection } from "@/components/community/CommentSection" 

export default function PostDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false) // You could fetch actual user state if your API returns `hasLiked` boolean
  const [likeCount, setLikeCount] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/community/${id}`)
      if (res.ok) {
        const data = await res.json()
        setPost(data.post)
        setLikeCount(data.post._count.likes)
        setLiked(data.hasLiked)
      } else {
        router.push("/community")
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) fetchPost()
  }, [id])

  const handleLike = async () => {
    if (!session) return alert("로그인이 필요합니다.")
    
    // Optimistic UI
    const prevLiked = liked
    const prevCount = likeCount
    setLiked(!prevLiked)
    setLikeCount(prevLiked ? prevCount - 1 : prevCount + 1)

    try {
      const res = await fetch(`/api/community/${id}/like`, { method: "POST" })
      if (!res.ok) throw new Error()
      
      const data = await res.json()
      setLiked(data.liked)
      setLikeCount(data.count)
    } catch (error) {
      // Rollback
      setLiked(prevLiked)
      setLikeCount(prevCount)
      alert("오류가 발생했습니다.")
    }
  }

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return
    try {
      const res = await fetch(`/api/community/${id}`, { method: "DELETE" })
      if (res.ok) {
        router.push("/community")
      } else {
        alert("삭제 실패")
      }
    } catch (error) {
      console.error(error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white/40 animate-spin" />
      </div>
    )
  }

  if (!post) return null

  const canDelete = session?.user?.id === post.authorId || (session?.user as any)?.role === "ADMIN"

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/30 pt-24 pb-32">
      <div className="max-w-[800px] mx-auto px-6">
        
        <div className="relative z-50 mb-8">
          <Link 
            href="/community" 
            className="group inline-flex items-center text-white/50 hover:text-white transition-all duration-300 gap-2 text-sm font-medium tracking-wider uppercase active:scale-95"
          >
            <div className="p-2 bg-white/5 rounded-full group-hover:bg-white/10 transition-colors">
              <ArrowLeft size={16} />
            </div>
            목록으로 돌아가기
          </Link>
        </div>
        
        {/* Post Container */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-6 md:p-10 backdrop-blur-xl relative"
        >
          {/* Header */}
          <div className="mb-8 pb-8 border-b border-white/[0.05]">
            <div className="flex justify-between items-start gap-4 mb-6">
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white/95 leading-tight">
                {post.title}
              </h1>
              
              {canDelete && (
                <div className="relative isolate">
                  <button 
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="p-2 text-white/40 hover:text-white bg-white/5 rounded-full transition-colors"
                  >
                    <MoreVertical size={18} />
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-32 bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50">
                      <button 
                        onClick={handleDelete}
                        className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-white/5 flex items-center gap-2 transition-colors"
                      >
                        <Trash2 size={14} /> 삭제하기
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/50">
              <span className="font-medium text-white/80">{post.authorNickname}</span>
              <span>{new Date(post.createdAt).toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })}</span>
              <div className="flex items-center gap-4 ml-auto lg:ml-0">
                <span className="flex items-center gap-1"><Eye size={14} /> {post.viewCount}</span>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="prose prose-invert prose-p:leading-relaxed prose-p:text-white/80 prose-headings:text-white/90 prose-a:text-blue-400 prose-img:rounded-2xl max-w-none min-h-[200px] mb-12">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]} 
              rehypePlugins={[rehypeRaw]}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Heart Button */}
          <div className="flex justify-center border-t border-white/[0.05] pt-10">
            <button 
              onClick={handleLike}
              className={`group flex flex-col items-center gap-3 transition-colors ${liked ? 'text-red-500' : 'text-white/40 hover:text-red-400'}`}
            >
              <div className={`p-4 rounded-full border transition-all duration-300 ${liked ? 'bg-red-500/10 border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'bg-white/5 border-white/10 group-hover:bg-white/10'}`}>
                <Heart size={28} className={liked ? 'fill-current text-red-500' : ''} />
              </div>
              <span className="font-medium tracking-widest">{likeCount}</span>
            </button>
          </div>
        </motion.div>

        {/* Comments Section */}
        <CommentSection 
          postId={id as string} 
          postAuthorId={post.authorId}
          comments={post.comments || []} 
          currentUserId={session?.user?.id}
          currentUserRole={(session?.user as any)?.role}
          onCommentAdded={fetchPost} 
        />

      </div>
    </div>
  )
}
