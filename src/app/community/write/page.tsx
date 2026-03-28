"use client"

import { useState, useRef, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Image as ImageIcon, Send, ArrowLeft, Eye as EyeIcon, Edit3, X, Trash2 } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkBreaks from "remark-breaks"
import rehypeRaw from "rehype-raw"
import dynamic from 'next/dynamic'
import "easymde/dist/easymde.min.css"

// Dynamic import for SimpleMDE to avoid SSR issues
const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false })

export default function WritePostPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [isPreview, setIsPreview] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mdeInstanceRef = useRef<any>(null)

  const mdeOptions = useMemo(() => {
    return {
      spellChecker: false,
      placeholder: "자유롭게 이야기를 들려주세요...",
      status: false,
      autosave: {
        enabled: true,
        uniqueId: "community-post-draft",
        delay: 1000,
      },
      toolbar: [
        "bold", "italic", "heading", "|", 
        "quote", "unordered-list", "ordered-list", "|", 
        "link", "image", "|", 
        "preview", "side-by-side", "fullscreen", "|", 
        "guide"
      ] as any[],
      minHeight: "450px",
      maxHeight: "600px",
    }
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      // Create a unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `post-images/${fileName}`

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('community-images')
        .upload(filePath, file)

      if (error) throw error

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('community-images')
        .getPublicUrl(filePath)

      // Add to uploaded images list for preview
      setUploadedImages(prev => [...prev, publicUrl])
      
      // SimpleMDE Image Insertion
      if (mdeInstanceRef.current) {
        const cm = mdeInstanceRef.current.codemirror;
        const stat = mdeInstanceRef.current.getState(cm);
        const options = mdeInstanceRef.current.options;
        const url = publicUrl;
        
        // Use SimpleMDE's internal logic to insert image markdown
        const text = `\n![image](${url})\n`;
        cm.replaceSelection(text);
      }
      
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("이미지 업로드에 실패했습니다.")
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const removeImage = (url: string) => {
    setUploadedImages(prev => prev.filter(img => img !== url))
    // Optionally remove the markdown from content, but that might be tricky if they edited it
    // For now, just removing from the visual preview list
    const markdownLink = `![image](${url})`
    setContent(prev => prev.replace(new RegExp(`\\n?${markdownLink.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\n?`, 'g'), ''))
  }

  const handleEditorChange = (value: string) => {
    setContent(value)
  }

  const getMdeInstance = (instance: any) => {
    mdeInstanceRef.current = instance
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    setLoading(true)
    try {
      // Append all uploaded images to the bottom of the content before submitting
      let finalContent = content;
      if (uploadedImages.length > 0) {
        const imageMarkdown = uploadedImages.map(url => `\n\n![image](${url})`).join('');
        finalContent += imageMarkdown;
      }

      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content: finalContent }),
      })

      if (res.ok) {
        // const data = await res.json()
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

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/30 selection:text-white pt-24 pb-20">
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
            Write Post
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/[0.02] border border-white/[0.08] rounded-3xl p-6 md:p-10 backdrop-blur-xl shadow-2xl relative"
        >
          {uploadingImage && (
            <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center">
              <Loader2 className="w-10 h-10 text-white animate-spin mb-4" />
              <p className="text-white/80 tracking-widest text-sm uppercase">Uploading Image...</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* Title */}
            <div>
              <input
                type="text"
                placeholder="제목을 입력하세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                className="w-full bg-transparent border-none text-2xl md:text-3xl text-white placeholder:text-white/20 focus:outline-none focus:ring-0 px-0 mb-4"
              />
              <div className="h-px w-full bg-gradient-to-r from-white/20 to-transparent" />
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 md:gap-4">
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden" 
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white/80 transition-all text-xs md:text-sm font-medium"
                >
                  <ImageIcon size={16} />
                  사진 첨부
                </button>
                
                <button
                  type="button"
                  onClick={() => setIsPreview(!isPreview)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-xs md:text-sm font-medium ${isPreview ? 'bg-white text-black border-white' : 'bg-white/[0.05] hover:bg-white/[0.1] border-white/10 text-white/80'}`}
                >
                  {isPreview ? <Edit3 size={16} /> : <EyeIcon size={16} />}
                  {isPreview ? "에디터" : "미리보기"}
                </button>
              </div>
              
              <div className="hidden sm:block text-[10px] md:text-xs text-white/30 border-l border-white/10 pl-4 py-1 uppercase tracking-widest">
                Markdown Ready
              </div>
            </div>

            {/* Uploaded Images Gallery - Always visible in editor mode and more premium */}
            <AnimatePresence>
              {uploadedImages.length > 0 && !isPreview && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white/5 rounded-2xl p-4 flex flex-wrap gap-4 border border-white/10"
                >
                  <div className="w-full text-[10px] text-white/30 uppercase tracking-widest mb-1 flex justify-between">
                    <span>Uploaded Gallery (Images will be added to post bottom)</span>
                    <span>{uploadedImages.length} images</span>
                  </div>
                  {uploadedImages.map((url, index) => (
                    <motion.div
                      key={url}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="relative group w-20 h-20 rounded-xl overflow-hidden border border-white/10 shadow-lg"
                    >
                      <img 
                        src={url} 
                        alt={`upload-${index}`} 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(url)}
                        className="absolute top-1 right-1 p-1 bg-black/60 backdrop-blur-md rounded-full text-white/80 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Content Editor */}
            <div className="min-h-[450px] editor-container">
              {!isPreview ? (
                <div className="mt-4">
                  <SimpleMDE 
                    value={content} 
                    onChange={handleEditorChange} 
                    options={mdeOptions}
                    getMdeInstance={getMdeInstance}
                  />
                  <style jsx global>{`
                    .editor-container .EasyMDEContainer .editor-toolbar {
                      background: rgba(255, 255, 255, 0.03);
                      border: 1px solid rgba(255, 255, 255, 0.1);
                      border-top-left-radius: 16px;
                      border-top-right-radius: 16px;
                      opacity: 0.8;
                      transition: opacity 0.3s;
                    }
                    .editor-container .EasyMDEContainer .editor-toolbar:hover {
                      opacity: 1;
                    }
                    .editor-container .EasyMDEContainer .editor-toolbar button {
                      color: rgba(255, 255, 255, 0.6) !important;
                    }
                    .editor-container .EasyMDEContainer .editor-toolbar button.active,
                    .editor-container .EasyMDEContainer .editor-toolbar button:hover {
                      background: rgba(255, 255, 255, 0.1);
                      color: white !important;
                    }
                    .editor-container .CodeMirror {
                      background: transparent !important;
                      color: rgba(255, 255, 255, 0.9) !important;
                      border: 1px solid rgba(255, 255, 255, 0.1);
                      border-top: none;
                      border-bottom-left-radius: 16px;
                      border-bottom-right-radius: 16px;
                      font-family: inherit;
                      font-size: 16px;
                      padding: 10px;
                    }
                    .editor-container .CodeMirror-cursor {
                      border-left: 2px solid white !important;
                    }
                    .editor-container .editor-preview-active-side {
                      background: #000 !important;
                      border: 1px solid rgba(255, 255, 255, 0.1);
                    }
                  `}</style>
                </div>
              ) : (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full min-h-[450px] mt-4 prose prose-invert prose-p:text-white/70 prose-headings:text-white prose-img:rounded-2xl max-w-none py-4"
                >
                  {content.trim() || uploadedImages.length > 0 ? (
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm, remarkBreaks]} 
                      rehypePlugins={[rehypeRaw]}
                    >
                      {content}
                    </ReactMarkdown>
                  ) : (
                    <div className="flex items-center justify-center min-h-[400px] text-white/20 uppercase tracking-widest text-xs">
                      Nothing to preview
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-8 border-t border-white/[0.05]">
              <button
                type="submit"
                disabled={loading || !title.trim() || !content.trim()}
                className="group flex items-center gap-2 bg-white text-black px-10 py-4 rounded-full font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                등록하기
              </button>
            </div>
          </form>
        </motion.div>

      </div>
    </div>
  )
}
