"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Send, CornerDownRight, Trash2 } from "lucide-react"

interface CommentType {
  id: string
  content: string
  authorId: string
  authorNickname: string | null
  parentId: string | null
  createdAt: string
  isDeleted: boolean
}

interface Props {
  postId: string
  postAuthorId: string
  comments: CommentType[]
  currentUserId?: string
  currentUserRole?: string
  onCommentAdded: () => void
}

export function CommentSection({ postId, postAuthorId, comments, currentUserId, currentUserRole, onCommentAdded }: Props) {
  const [mainContent, setMainContent] = useState("")
  const [replyContent, setReplyContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [replyTo, setReplyTo] = useState<string | null>(null)
  
  // Basic tree generation: parent comments and their direct children
  const topLevelComments = comments.filter(c => !c.parentId)
  const getReplies = (parentId: string) => comments.filter(c => c.parentId === parentId)

  const handleSubmit = async (e: React.FormEvent, parentId: string | null = null) => {
    e.preventDefault()
    const text = parentId ? replyContent : mainContent
    if (!text.trim()) return

    setLoading(true)
    try {
      const res = await fetch(`/api/community/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text, parentId }),
      })

      if (res.ok) {
        if (parentId) {
          setReplyContent("")
          setReplyTo(null)
        } else {
          setMainContent("")
        }
        onCommentAdded() // Refresh parent
      } else {
        const err = await res.json()
        alert(err.error || "Failed to add comment")
      }
    } catch (error) {
      console.error(error)
      alert("오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (commentId: string) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return

    try {
      const res = await fetch(`/api/community/${postId}/comments/${commentId}`, {
        method: "DELETE"
      })
      if (res.ok) {
        onCommentAdded()
      } else {
        alert("삭제에 실패했습니다.")
      }
    } catch (error) {
      console.error(error)
    }
  }

  const CommentItem = ({ comment, isReply = false }: { comment: CommentType, isReply?: boolean }) => {
    const canDelete = !comment.isDeleted && (currentUserId === comment.authorId || currentUserRole === "ADMIN")
    const isAuthor = !comment.isDeleted && comment.authorId === postAuthorId

    if (comment.isDeleted) {
      const hasVisibleReplies = getReplies(comment.id).some(r => !r.isDeleted)
      if (!hasVisibleReplies && !isReply) return null // Hide deleted parents with no replies
      
      return (
        <div className={`py-4 ${isReply ? 'ml-8 md:ml-12 pl-4 border-l-2 border-white/5 relative' : 'border-b border-white/[0.05]'}`}>
          <p className="text-white/20 text-sm italic">삭제된 댓글입니다.</p>
        </div>
      )
    }

    return (
      <div className={`py-4 group ${isReply ? 'ml-8 md:ml-12 pl-4 border-l-2 border-white/10 relative' : 'border-b border-white/[0.05]'}`}>
        {isReply && <CornerDownRight className="absolute -left-[2px] top-4 w-4 h-4 text-white/20 -translate-x-full" />}
        
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white/90">{comment.authorNickname}</span>
            {isAuthor && (
              <span className="text-[10px] bg-blue-400/10 text-blue-400 px-1.5 py-0.5 rounded uppercase font-bold tracking-tighter">Author</span>
            )}
            {currentUserRole === "ADMIN" && (
              <span className="text-[10px] bg-red-400/10 text-red-400 px-1.5 py-0.5 rounded uppercase font-bold tracking-tighter">Admin</span>
            )}
            <span className="text-[11px] text-white/30">
              {new Date(comment.createdAt).toLocaleDateString()} {new Date(comment.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </span>
          </div>
          {canDelete && (
            <button 
              onClick={() => handleDelete(comment.id)} 
              className="text-white/10 hover:text-red-400 transition-colors p-1"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
        
        <p className="text-white/80 text-[14px] leading-relaxed whitespace-pre-wrap">{comment.content}</p>

        {!isReply && (
          <button 
            onClick={() => {
              setReplyTo(replyTo === comment.id ? null : comment.id)
              setReplyContent("")
            }}
            className="mt-2 text-xs font-semibold text-white/30 hover:text-white transition-colors"
          >
            {replyTo === comment.id ? "취소" : "답글 쓰기"}
          </button>
        )}

        <AnimatePresence>
          {replyTo === comment.id && !isReply && (
            <motion.form 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={(e) => handleSubmit(e, comment.id)} 
              className="mt-4 flex gap-2"
            >
              <input
                type="text"
                autoFocus
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="답글을 입력하세요..."
                className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all"
              />
              <button 
                type="submit" 
                disabled={loading || !replyContent.trim()}
                className="bg-white/10 hover:bg-white text-white hover:text-black px-4 rounded-xl transition-all disabled:opacity-30 flex items-center justify-center min-w-[50px]"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="mt-12 bg-white/[0.02] border border-white/[0.05] rounded-3xl p-6 md:p-8 backdrop-blur-xl">
      <h3 className="text-lg font-medium text-white/90 mb-6 flex items-center gap-2">
        댓글 <span className="text-white/30 text-sm font-normal">{comments.length}</span>
      </h3>

      {/* Main Comment Form */}
      <form onSubmit={(e) => handleSubmit(e)} className="mb-10 group relative">
        <textarea
          value={mainContent}
          onChange={(e) => setMainContent(e.target.value)}
          placeholder="댓글을 남겨보세요..."
          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 min-h-[120px] text-white/90 placeholder:text-white/20 focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all resize-none text-[15px]"
        />
        <div className="absolute right-4 bottom-4">
          <button
            type="submit"
            disabled={loading || !mainContent.trim()}
            className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100 text-[13px] tracking-tight uppercase"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : "등록"}
          </button>
        </div>
      </form>

      {/* List */}
      <div className="divide-y divide-white/[0.02]">
        {topLevelComments.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center opacity-30">
            <p className="text-sm tracking-widest uppercase">No comments yet</p>
          </div>
        ) : (
          topLevelComments.map(comment => (
            <div key={comment.id}>
              <CommentItem comment={comment} />
              {/* Replies */}
              {getReplies(comment.id).map(reply => (
                <CommentItem key={reply.id} comment={reply} isReply />
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
