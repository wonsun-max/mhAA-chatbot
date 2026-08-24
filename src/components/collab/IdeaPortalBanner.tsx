"use client"

import { useState } from "react"
import { Lightbulb } from "lucide-react"
import { FeedbackModal } from "@/components/modals/FeedbackModal"

export function IdeaPortalBanner() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <div className="mt-12">
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="w-full text-left group block focus:outline-none"
                >
                    <div className="bg-zinc-900/30 backdrop-blur-sm rounded-[3rem] p-8 md:p-12 border border-white/5 hover:border-amber-500/30 transition-all duration-500 relative overflow-hidden">
                        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-amber-500/5 blur-[100px] rounded-full group-hover:bg-amber-500/10 transition-colors duration-500" />

                        <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                            <div className="w-20 h-20 rounded-3xl bg-zinc-900 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:border-amber-500/30 transition-transform duration-500">
                                <Lightbulb className="w-10 h-10 text-amber-400" />
                            </div>

                            <div className="flex-grow text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-amber-500/10 text-amber-300 border border-amber-500/20">
                                        💡 5초 빠른 접수
                                    </span>
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-3">아이디어 & 건의 포털</h3>
                                <p className="text-zinc-400 text-base font-medium leading-relaxed max-w-2xl">
                                    여러분의 상상을 현실로. 추가되었으면 하는 기능이나 불편한 점을 자유롭게 들려주세요.
                                </p>
                            </div>

                            <div className="flex-shrink-0 w-full md:w-auto mt-6 md:mt-0">
                                <div className="inline-flex items-center justify-center w-full md:w-auto px-10 py-5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-lg transition-all shadow-2xl shadow-amber-500/20 group-hover:from-amber-400 group-hover:to-orange-400 active:scale-95">
                                    의견 보내기
                                </div>
                            </div>
                        </div>
                    </div>
                </button>
            </div>

            <FeedbackModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                initialType="IDEA"
            />
        </>
    )
}
