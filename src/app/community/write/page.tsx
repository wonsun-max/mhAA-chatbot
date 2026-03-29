"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Image as ImageIcon, Send, ArrowLeft, Eye as EyeIcon, Edit3, X, Bold, Italic, List, ListOrdered, Quote } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

// Tiptap imports
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'

export default function WritePostPage() {
  const { status } = useSession()
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(false)
  const [isPreview, setIsPreview] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [isEditorEmpty, setIsEditorEmpty] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/community/write")
    }
  }, [status, router])

  // Initialize Tiptap Editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-2xl max-w-full h-auto my-6 border border-white/10 shadow-2xl mx-auto block',
        },
      }),
      Placeholder.configure({
        placeholder: '당신의 이야기를 들려주세요...',
      }),
    ],
    onUpdate: ({ editor }) => {
      setIsEditorEmpty(editor.isEmpty)
    },
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[400px] text-lg leading-relaxed text-white/80',
      },
    },
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editor) return

    setUploadingImage(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `post-images/${fileName}`

      const { data, error } = await supabase.storage
        .from('community-images')
        .upload(filePath, file)

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('community-images')
        .getPublicUrl(filePath)

      // Insert image directly into editor at cursor position
      editor.chain().focus().setImage({ src: publicUrl }).run()
      
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("이미지 업로드에 실패했습니다.")
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !editor || isEditorEmpty) return

    setLoading(true)
    try {
      const htmlContent = editor.getHTML()

      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content: htmlContent }),
      })

      if (res.ok) {
        router.push("/community")
        router.refresh()
      } else {
        const err = await res.json()
        alert(err.error || "Failed to create post")
      }
    } catch (error) {
      console.error(error)
      alert("오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  // Helper for toolbar actions
  if (!editor || status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-white/20" />
      </div>
    )
  }

  if (status === "unauthenticated") return null

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/30 selection:text-white pt-24 pb-20 font-sans">
      <div className="max-w-[800px] mx-auto px-6">
        
        <div className="mb-8">
          <Link href="/community" className="inline-flex items-center text-white/50 hover:text-white transition-colors gap-2 text-sm font-medium tracking-wider uppercase mb-6">
            <ArrowLeft size={16} />
            목록으로 돌아가기
          </Link>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-light tracking-tight"
          >
            New Story
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/50 border border-white/[0.08] rounded-[32px] overflow-hidden backdrop-blur-3xl shadow-2xl relative"
        >
          {uploadingImage && (
            <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center">
              <Loader2 className="w-10 h-10 text-white animate-spin mb-4" />
              <p className="text-white/80 tracking-widest text-sm uppercase font-medium">Processing Image...</p>
            </div>
          )}

          {/* Premium Sticky Toolbar */}
          <div className="sticky top-0 z-20 bg-zinc-900/80 backdrop-blur-xl border-b border-white/[0.05] p-2 flex items-center gap-1 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded-lg transition-colors ${editor.isActive('bold') ? 'bg-white text-black' : 'text-white/50 hover:bg-white/10'}`}
            >
              <Bold size={18} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded-lg transition-colors ${editor.isActive('italic') ? 'bg-white text-black' : 'text-white/50 hover:bg-white/10'}`}
            >
              <Italic size={18} />
            </button>
            <div className="w-px h-4 bg-white/10 mx-1" />
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded-lg transition-colors ${editor.isActive('bulletList') ? 'bg-white text-black' : 'text-white/50 hover:bg-white/10'}`}
            >
              <List size={18} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded-lg transition-colors ${editor.isActive('orderedList') ? 'bg-white text-black' : 'text-white/50 hover:bg-white/10'}`}
            >
              <ListOrdered size={18} />
            </button>
            <div className="w-px h-4 bg-white/10 mx-1" />
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-2 rounded-lg transition-colors ${editor.isActive('blockquote') ? 'bg-white text-black' : 'text-white/50 hover:bg-white/10'}`}
            >
              <Quote size={18} />
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-lg text-white/50 hover:bg-white/10 transition-colors ml-auto flex items-center gap-2 pr-4"
            >
              <ImageIcon size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">Add Photo</span>
            </button>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden" 
            />
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
            {/* Title Section */}
            <div className="space-y-4">
              <input
                type="text"
                placeholder="제목을 입력하세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                className="w-full bg-transparent border-none text-3xl md:text-4xl text-white placeholder:text-white/10 focus:outline-none focus:ring-0 px-0 font-medium"
              />
              <div className="h-px w-full bg-gradient-to-r from-white/20 via-white/5 to-transparent" />
            </div>

            {/* Tiptap Editor Surface */}
            <div className="min-h-[450px]">
              <EditorContent editor={editor} />
            </div>

            {/* Footer Action */}
            <div className="pt-8 flex items-center justify-between border-t border-white/5">
              <div className="text-[10px] text-white/20 tracking-[0.3em] font-bold uppercase">
                Content is visible as you type
              </div>
              <button
                type="submit"
                disabled={loading || !title.trim() || isEditorEmpty}
                className="group relative flex items-center gap-3 bg-white text-black px-12 py-4 rounded-full font-bold transition-all hover:scale-[1.03] active:scale-[0.98] disabled:opacity-20 disabled:hover:scale-100 overflow-hidden shadow-[0_0_30px_rgba(255,255,255,0.1)] active:shadow-none"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Send size={18} className="group-hover:rotate-12 transition-transform" />
                )}
                <span className="relative z-10 uppercase tracking-tighter text-sm">Post Now</span>
              </button>
            </div>
          </form>
        </motion.div>

        <p className="mt-10 text-center text-white/10 text-[10px] uppercase tracking-[0.4em]">
          Withus Advanced Experience Engine
        </p>

      </div>

      <style jsx global>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: rgba(255, 255, 255, 0.1);
          pointer-events: none;
          height: 0;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .ProseMirror blockquote {
          border-left: 3px solid rgba(255, 255, 255, 0.2);
          padding-left: 1.5rem;
          font-style: italic;
          color: rgba(255, 255, 255, 0.5);
        }
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5rem;
        }
        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
        }
      `}</style>
    </div>
  )
}
